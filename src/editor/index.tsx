import * as React from 'react';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import { Toolbar, NodePanel } from './components';
import CanvasContent from './CanvasContent';
import { useEditorStore } from './hooks/useEditorStore';
import { useKeyPress } from './hooks/useKeyPress';
import './index.scss';

const { useState, useRef, useEffect } = React;

export default function EditorDemo(props) {
  const [screenScale, changeScreenScale] = useState(100);
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
    setCopiedNodes
  } = useEditorStore();

  // ç»å¸å®¹å¨
  const screenRef = useRef(null);

  // ç»å¸ ref
  const canvasRef = useRef({
    getWrappedInstance: () => Object
  } as any);

  const canvasInstance = canvasRef.current;

  /** å é¤ç»ä»¶ */
  const handleDeleteNodes = (ids: string[]) => {
    if (!ids) {
      return;
    }
    // å é¤ä¸ç»ä»¶ç¸è¿çè¿çº¿ï¼ä¸è®ºä¸æ¸¸æä¸æ¸¸

    const newLinks = _.cloneDeep(links);
    ids.forEach(id => {
      // å é¤ä¸èç¹è¿æ¥çä»»æè¾¹
      _.remove(newLinks, link => link.source === id || link.target === id);
    });
    // æ´æ°è¿çº¿
    setLinks(newLinks);

    // åé¤components
    const cloneNodes = _.cloneDeep(nodes);
    const newNodes = _.remove(cloneNodes, item => !ids.includes(item.id));

    setNodes(newNodes);

    // æ¸ç©ºé«äº®ç¶æ
    setSelectedLinks([]);
    setSelectedNodes([]);
  };

  /** å é¤è¿çº¿ */
  const handleDeleteLinks = (activeLinks: string[]) => {
    if (!activeLinks) {
      return;
    }
    const linkList = links.map(link => link.id);
    const diffLinks = _.difference(linkList, activeLinks);
    const newLinks = diffLinks ? diffLinks.map(link => _.find(links, item => item.id === link)) : [];
    setLinks(newLinks);
  };

  /** å¤å¶èç¹ */
  const handleNodesCopy = (ids: string[]) => {
    const newCopiedNodes = ids.map(id => {
      return _.find(nodes, item => item.id === id);
    });

    setCopiedNodes(newCopiedNodes);
  };

  /** ç²è´´èç¹ */
  const handleNodesPaste = () => {
    if (copiedNodes) {
      const currentCopied = copiedNodes.map(node => {
        return {
          ...node,
          id: uuid.v4(),
          /**  @todo åç»­å¯ä¼åå¸å±ç®æ³ */
          x: node.x + node.width + 20,
          ref: React.createRef()
        };
      });
      setCopiedNodes(currentCopied);
      setNodes([...nodes, ...currentCopied]);
    }
  };

  // åªå
  const handleShear = () => {
    if (selectedNodes) {
      handleNodesCopy(selectedNodes);
      handleDeleteNodes(selectedNodes);
    }
  };

  // å¤å¶
  const handleCopy = () => {
    if (selectedNodes) {
      handleNodesCopy(selectedNodes);
    }
  };

  // ç²è´´
  const handlePaste = () => {
    if (copiedNodes) {
      handleNodesPaste();
    }
  };

  // å é¤
  const handleDelete = () => {
    if (selectedNodes) {
      handleDeleteNodes(selectedNodes);
    }
    if (selectedLinks) {
      handleDeleteLinks(selectedLinks);
    }
  };

  useKeyPress(
    'delete',
    () => {
      handleDelete();
    },
    {
      events: ['keydown', 'keyup']
    }
  );

  const isMac = navigator.platform.startsWith('Mac');

  useKeyPress(isMac ? ['meta.x'] : ['ctrl.x'], () => {
    handleShear();
  });

  useKeyPress(isMac ? ['meta.c'] : ['ctrl.c'], () => {
    handleCopy();
  });

  useKeyPress(isMac ? ['meta.v'] : ['ctrl.v'], () => {
    handlePaste();
  });

  

  /** æä½åº */
  const renderOperation = (
    <div>
      <Toolbar
        ref={screenRef}
        screenScale={screenScale}
        changeScreenScale={changeScreenScale}
        handleResizeTo={canvasInstance && canvasInstance.handleResizeTo}
        items={['fullscreen', 'zoom', 'adapt', 'format', 'ratio', 'shear', 'copy', 'paste', 'delete']}
        layout={canvasInstance && canvasInstance.layout}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onDelete={handleDelete}
        onShear={handleShear}
      />
    </div>
  );
  /** æ¸²æèç¹éæ©åº */
  const renderNodePanel = (
    <div className="editor-nodePanel">
      <NodePanel onDrag={setDragNode} />
    </div>
  );

  /** æ¸²æä¸­é´ç»å¸åº */
  const renderCanvas = (
    <div className="editor-canvas">
      <CanvasContent
        dragNode={dragNode}
        ref={canvasRef}
        nodes={nodes}
        links={links}
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
      />
    </div>
  );

  /** æ¸²æéç½®åº */
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
