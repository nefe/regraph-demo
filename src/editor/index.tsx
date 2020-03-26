import * as React from "react";
import * as _ from "lodash";
import * as uuid from "uuid";
import { message } from "antd";
import { Toolbar, NodePanel, DragSelector } from "./components";
import CanvasContent from "./CanvasContent";
import { useEditorStore, useKeyPress, useEventListener } from "./hooks";
import { ShapeProps } from "./utils/useDragSelect";
import { pointInPoly } from "./utils/layout";
import { GROUP_PADDING, Node, Group } from "./defines";

import "./index.scss";

const { useState, useRef, useEffect } = React;

export default function EditorDemo(props) {
  const [screenScale, changeScreenScale] = useState(100);
  const [dragSelectable, setDragSelectable] = useState(false);
  const [keyPressing, setKeyPressing] = useState(false);
  const {
    nodes,
    links,
    setNodes,
    setLinks,
    selectedLinks,
    setSelectedLinks,
    dragNode,
    setDragNode,
    selectedNodes,
    setSelectedNodes,
    updateNodes,
    updateLinks,
    copiedNodes,
    setCopiedNodes,
    currTrans,
    setCurrTrans,
    handleSaveData,
    groups,
    setGroups,
    updateGroups
  } = useEditorStore();

  // 画布容器
  const screenRef = useRef(null);

  // 画布 ref
  const canvasRef = useRef({
    getWrappedInstance: () => Object
  } as any);

  const canvasInstance = canvasRef.current;

  /** 删除组件 */
  const handleDeleteNodes = (ids: string[]) => {
    if (!ids) {
      return;
    }
    // 删除与组件相连的连线，不论上游或下游

    const newLinks = _.cloneDeep(links);
    ids.forEach(id => {
      // 删除与节点连接的任意边
      _.remove(newLinks, link => link.source === id || link.target === id);
    });
    // 更新连线
    setLinks(newLinks);

    // 剔除components
    const cloneNodes = _.cloneDeep(nodes);
    const newNodes = _.remove(cloneNodes, item => !ids.includes(item.id));

    setNodes(newNodes);

    // 清空高亮状态
    setSelectedLinks([]);
    setSelectedNodes([]);
  };

  /** 删除连线 */
  const handleDeleteLinks = (activeLinks: string[]) => {
    if (!activeLinks) {
      return;
    }
    const linkList = links.map(link => link.id);
    const diffLinks = _.difference(linkList, activeLinks);
    const newLinks = diffLinks
      ? diffLinks.map(link => _.find(links, item => item.id === link))
      : [];
    setLinks(newLinks);
  };

  /** 复制节点 */
  const handleNodesCopy = (ids: string[]) => {
    const newCopiedNodes = ids.map(id => {
      return _.find(nodes, item => item.id === id);
    });

    setCopiedNodes(newCopiedNodes);
  };

  /** 粘贴节点 */
  const handleNodesPaste = () => {
    if (copiedNodes) {
      const currentCopied = copiedNodes.map(node => {
        return {
          ...node,
          id: uuid.v4(),
          /**  @todo 后续可优化布局算法 */
          x: node.x + node.width + 20,
          ref: React.createRef()
        };
      });
      setCopiedNodes(currentCopied);
      setNodes([...nodes, ...currentCopied]);
    }
  };

  // 剪切
  const handleShear = () => {
    if (selectedNodes) {
      handleNodesCopy(selectedNodes);
      handleDeleteNodes(selectedNodes);
    }
  };

  // 复制
  const handleCopy = () => {
    if (selectedNodes) {
      handleNodesCopy(_.compact(selectedNodes));
    }
  };

  // 粘贴
  const handlePaste = () => {
    if (copiedNodes) {
      handleNodesPaste();
    }
  };

  // 删除
  const handleDelete = () => {
    if (selectedNodes) {
      handleDeleteNodes(selectedNodes);
      // 判断删除的节点是否在组内，删除组内的节点
      const newGroups = groups.map(group => {
        selectedNodes.forEach(id => {
          const index = _.findIndex(group?.nodes, node => node.id === id);
          if (index > -1) {
            group.nodes = [
              ...group.nodes.slice(0, index),
              ...group.nodes.slice(index + 1)
            ];
            group = handleGroupInfo(group.nodes);
          }
        });
        return group;
      });
      setGroups(_.compact(newGroups));
    }
    if (selectedLinks) {
      handleDeleteLinks(selectedLinks);
    }
  };

  // 圈选
  const handleDragSelect = () => {
    setDragSelectable(!dragSelectable);
  };

  /** 处理DragSelector 关闭事件 */
  const onDragSelectorClose = (selectorProps: ShapeProps) => {
    // 计算区域内的位置有多少节点需要高亮,其实计算的是一个点是否在矩形内

    // 1. 计算每个节点的中心
    // 多边形的位置信息要与画布同步
    const { k, x, y } = currTrans;

    const points = nodes.map(node => {
      return {
        x: k * node.x + x + (node.width / 2) * k,
        y: k * node.y + y + (node.height / 2) * k,
        id: node.id
      };
    });

    // 2. 多边形各个点转化为数组，暂时为矩形，后面考虑其他形状
    let poly = [];
    if (selectorProps.direction === "left") {
      poly = [
        { x: selectorProps.x, y: selectorProps.y },
        { x: selectorProps.x + selectorProps.width, y: selectorProps.y },
        {
          x: selectorProps.x + selectorProps.width,
          y: selectorProps.y + selectorProps.height
        },
        { x: selectorProps.x, y: selectorProps.y + selectorProps.height }
      ];
    } else {
      poly = [
        { x: selectorProps.x, y: selectorProps.y },
        { x: selectorProps.x - selectorProps.width, y: selectorProps.y },
        {
          x: selectorProps.x - selectorProps.width,
          y: selectorProps.y - selectorProps.height
        },
        { x: selectorProps.x, y: selectorProps.y - selectorProps.height }
      ];
    }

    // 3. 射线法判断点是否在多边形的内部
    const ids = points.map(point => {
      if (pointInPoly(point, poly) === "in") {
        return point.id;
      }
    });
    setSelectedNodes(_.compact(ids));
    setDragSelectable(false);
  };

  /** 保存 */
  const handleSave = async () => {
    const data = await handleSaveData();
    if (data) {
      message.success("保存成功");
    } else {
      message.error("保存失败");
    }
  };

  /** 计算选中节点的位置，形成大的group */
  const handleGroupInfo = (nodes: Node[]): Group => {
    if (!nodes) {
      return;
    }

    const minXNode = _.minBy(nodes, node => node.x);
    const minYNode = _.minBy(nodes, node => node.y);

    const maxXNode = _.maxBy(nodes, node => node.x + node.width);
    const maxYNode = _.maxBy(nodes, node => node.y + node.height);

    const x = minXNode?.x - GROUP_PADDING;
    const y = minYNode?.y - GROUP_PADDING;

    const minXId = minXNode?.id;
    const maxYId = maxYNode?.id;

    const width = maxXNode?.x + maxXNode?.width - x + GROUP_PADDING;
    const height = maxYNode?.y + maxYNode?.height - y + GROUP_PADDING;

    if (minXId && maxYId) {
      return {
        id: `group_${minXId}_${maxYId}`,
        x,
        y,
        width,
        height,
        nodes
      };
    }
  };

  /** 更新组的样式 */
  const updateGroupsInfo = (currentNodes: Node[], deleteGroupId?: string) => {
    const newGroup = handleGroupInfo(currentNodes);
    if (newGroup) {
      // 更新节点
      const groupId = newGroup.id;
      const groupNodes = newGroup.nodes.map(node => {
        return { ...node, groupId };
      });

      const newNodes = nodes.map(node => {
        const groupNode = _.find(groupNodes, item => item.id === node.id);
        if (groupNode) {
          return groupNode;
        } else {
          return node;
        }
      });

      setNodes(newNodes);

      let newGroups = _.uniqBy(_.compact([...groups, newGroup]), "id");
      if (deleteGroupId) {
        newGroups = newGroups.filter(group => group.id !== deleteGroupId);
      }
      console.log('newGroups',newGroups)

      setGroups(newGroups);
    } else {
      if (deleteGroupId) {
        const newGroups = groups.filter(group => group.id !== deleteGroupId);
        setGroups(newGroups);
      }
    }
  };

  /** 成组 */
  const handleGroup = () => {
    const currentNodes = _.compact(
      nodes.map(node => {
        if (selectedNodes.includes(node.id)) {
          return node;
        }
      })
    );

    // 更新组
    updateGroupsInfo(currentNodes);
    setSelectedNodes([]);
  };

  useKeyPress(
    "delete",
    () => {
      handleDelete();
    },
    {
      events: ["keydown", "keyup"]
    }
  );

  const isMac = navigator.platform.startsWith("Mac");

  useKeyPress(isMac ? ["meta.x"] : ["ctrl.x"], () => {
    handleShear();
  });

  useKeyPress(isMac ? ["meta.c"] : ["ctrl.c"], () => {
    handleCopy();
  });

  useKeyPress(isMac ? ["meta.v"] : ["ctrl.v"], () => {
    handlePaste();
  });

  useEventListener(
    "keydown",
    (event: KeyboardEvent) => {
      const SUPER_KEY_CODE = navigator.platform.startsWith("Mac")
        ? event.metaKey
        : event.ctrlKey;
      if (SUPER_KEY_CODE) {
        setKeyPressing(true);
      }
    },
    canvasInstance
  );

  useEventListener(
    "keyup",
    (event: KeyboardEvent) => {
      setKeyPressing(false);
    },
    canvasInstance
  );

  /** 操作区 */
  const renderOperation = (
    <div>
      <Toolbar
        ref={screenRef}
        screenScale={screenScale}
        changeScreenScale={changeScreenScale}
        handleResizeTo={canvasInstance && canvasInstance.handleResizeTo}
        items={[
          "save",
          "fullscreen",
          "zoom",
          "adapt",
          "format",
          "ratio",
          "shear",
          "copy",
          "paste",
          "delete",
          "dragSelect",
          "layout",
          "adapt",
          "group"
        ]}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onDelete={handleDelete}
        onShear={handleShear}
        onDragSelect={handleDragSelect}
        onSave={handleSave}
        onLayout={canvasInstance && canvasInstance.layout}
        onAdapt={canvasInstance && canvasInstance.handleShowAll}
        onGroup={handleGroup}
      />
    </div>
  );
  /** 渲染节点选择区 */
  const renderNodePanel = (
    <div className="editor-nodePanel">
      <NodePanel onDrag={setDragNode} />
    </div>
  );

  /** 渲染中间画布区 */
  const renderCanvas = (
    <div className="editor-canvas">
      <DragSelector
        visible={dragSelectable}
        getPopupContainer={() => document.querySelector(".editor-canvas")}
        overlayColor={"rgba(0,0,0,0.1)"}
        selectorStyle={{
          fill: "transparent",
          strokeWidth: 1,
          stroke: "#6ca0f5",
          strokeDasharray: "5 5"
        }}
        onClose={onDragSelectorClose}
      />
      <CanvasContent
        dragNode={dragNode}
        ref={canvasRef}
        nodes={nodes}
        links={links}
        groups={groups}
        setNodes={setNodes}
        setLinks={setLinks}
        selectedLinks={selectedLinks}
        setSelectedLinks={setSelectedLinks}
        selectedNodes={selectedNodes}
        setSelectedNodes={setSelectedNodes}
        updateNodes={updateNodes}
        updateLinks={updateLinks}
        deleteNodes={handleDeleteNodes}
        deleteLinks={handleDeleteLinks}
        copiedNodes={copiedNodes}
        setCopiedNodes={setCopiedNodes}
        currTrans={currTrans}
        setCurrTrans={setCurrTrans}
        isKeyPressing={keyPressing}
        updateGroups={updateGroupsInfo}
      />
    </div>
  );

  /** 渲染配置区 */
  const renderProperty = <div className="editor-property"></div>;

  return (
    <div className="editor-demo" ref={screenRef}>
      <div className="editor-operation">{renderOperation}</div>
      <div className="editor-container">
        {renderNodePanel}
        {renderCanvas}
        {renderProperty}
      </div>
    </div>
  );
}
