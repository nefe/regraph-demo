import * as React from "react";
import * as _ from "lodash";
import { Node, Link, Group } from "../defines";
import { ZoomTransform, zoomIdentity } from "d3-zoom";
import { useLocalStorage } from "./useLocalStorage";

const { useState, useEffect } = React;

export function useEditorStore() {
  const [editorData, setEditorData] = useState();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [editorLocalData, setEditorLocalData] = useLocalStorage("editorData", {
    id: "editorData-test"
  });
  const [dragNode, setDragNode] = useState(null);

  const [currTrans, setCurrTrans] = useState<ZoomTransform>(zoomIdentity);

  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);

  useEffect(() => {
    setEditorData(editorLocalData);

    const newNodes = (editorLocalData?.nodes ?? []).map(item => {
      return {
        ...item,
        ref: React.createRef()
      };
    });
    setNodes(newNodes);

    const newGroups = (editorLocalData?.groups ?? []).map(item => {
      return {
        ...item,
        ref: React.createRef()
      };
    });
    setGroups(newGroups);
    setLinks(editorLocalData?.links ?? []);
  }, [editorLocalData]);

  const updateNodes = (node: Node) => {
    const index = nodes.findIndex(item => item.id === node.id);

    const newNodes = [
      ...nodes.slice(0, index),
      node,
      ...nodes.slice(index + 1)
    ];

    setNodes(newNodes);
  };

  const updateLinks = (link: Link) => {
    const index = links.findIndex(item => item.id === link.id);
    const newLinks = [
      ...links.slice(0, index),
      link,
      ...links.slice(index + 1)
    ];

    setLinks(newLinks);
  };

  const updateGroups = (group: Group) => {
    const index = groups.findIndex(item => item.id === group.id);

    const newGroups = [
      ...groups.slice(0, index),
      group,
      ...groups.slice(index + 1)
    ];

    setGroups(newGroups);
  };

  const handleSaveData = async () => {
    const newNodes = nodes ?? [];
    const newGroups = groups ?? [];
    newNodes.forEach(node => delete node.ref);
    newGroups.forEach(group => delete group.ref);

    const result = await setEditorLocalData({
      ...(editorData as any),
      nodes: newNodes,
      groups: newGroups,
      links
    });
    return result;
  };

  return {
    editorData,
    setEditorData,
    nodes,
    setNodes,
    links,
    setLinks,
    updateNodes,
    updateLinks,
    selectedLinks,
    setSelectedLinks,
    selectedNodes,
    setSelectedNodes,
    dragNode,
    setDragNode,
    copiedNodes,
    setCopiedNodes,
    currTrans,
    setCurrTrans,
    editorLocalData,
    setEditorLocalData,
    handleSaveData,
    groups,
    setGroups,
    updateGroups
  };
}
