/**
 * @file åéå¨é»è¾å¤çï¼ä¸è§å¾åç¦»
 * @author perkinJ
 */

import * as React from 'react';

import { handlePathData } from './calc';
import { Shape, ShapeProps } from './types';

const { useCallback, useEffect, useState, useRef } = React;

const initSelectorProps = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  direction: 'left',
} as ShapeProps;

export default function useDragSelect(dragSelectContainerRef: any, shape: Shape) {
  const [shapeProps, setShapeProps] = useState<ShapeProps>(initSelectorProps);

  const [pathData, setPathData] = useState('');

  // è®°å½mousedownäºä»¶çX,Yä½ç½®ï¼
  const mousdownX = useRef(0);
  const mousdownY = useRef(0);

  const handleMouseMove = useCallback(
    event => {
      const newX = event.layerX;
      const newY = event.layerY;
      const newWidth = Math.abs(newX - mousdownX.current);
      const newHeight = Math.abs(newY - mousdownY.current);

      const diffX = newX - mousdownX.current;

      const newShapeProps = {
        x: mousdownX.current,
        y: mousdownY.current,
        width: newWidth,
        height: newHeight,
        direction: diffX < 0 ? 'right' : 'left',
      } as ShapeProps;

      const path = handlePathData(shape, newShapeProps);
      setPathData(path);
      setShapeProps(newShapeProps);
    },
    [setShapeProps, shape],
  );

  const handleMouseUp = useCallback(
    event => {
      event.stopPropagation();

      // æ¸ç©ºè·¯å¾
      setPathData('');

      // æ¸ç©ºåæ¬¡ç¹å»æ°æ®
      mousdownX.current = 0;
      mousdownY.current = 0;
      dragSelectContainerRef.current.removeEventListener('mousemove', handleMouseMove);
    },
    [dragSelectContainerRef, handleMouseMove],
  );

  const handleMouseDown = useCallback(
    event => {
      event.stopPropagation();

      mousdownX.current = event.layerX;
      mousdownY.current = event.layerY;

      dragSelectContainerRef.current.addEventListener('mousemove', handleMouseMove);
      dragSelectContainerRef.current.addEventListener('mouseup', handleMouseUp);
    },
    [dragSelectContainerRef, handleMouseMove, handleMouseUp],
  );

  useEffect(() => {
    const drag = dragSelectContainerRef.current;
    drag.addEventListener('mousedown', handleMouseDown);
    return () => {
      drag.removeEventListener('mousedown', handleMouseDown);
    };
  }, [dragSelectContainerRef, handleMouseDown]);

  // è¿åéæ©å¨åæ ä½ç½®ä»¥åçæçpathæ°æ®
  return { shapeProps, pathData };
}

export { ShapeProps };
