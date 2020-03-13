import * as React from "react";
import * as _ from "lodash";
import { Node, Link } from "../defines";
import { ZoomTransform, zoomIdentity } from "d3-zoom";
import { useLocalStorage } from "./useLocalStorage";

const { useState, useEffect } = React;

export function useEditorStore() {
  const [editorData, setEditorData] = useState();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
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

  const handleSaveData = async () => {
    const newNodes = nodes ?? [];
    newNodes.forEach(node => delete node.ref);
    const result = await setEditorLocalData({ ...editorData as any, nodes: newNodes, links });
    return result
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
    handleSaveData
  };
}
