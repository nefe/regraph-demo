/**
 * @file ç»å¸åºå±ä½ç½®è®¡ç®ç¸å³æ¹æ³
 * @author perkinJ
 */

import * as _ from 'lodash';
import { Point, Shape, ShapeProps } from './types';
/**
 * ä¸¤ç¹é´ç´çº¿è·ç¦»
 * @param sourcePoint
 * @param targetPoint
 */
export function distance(sourcePoint: Point, targetPoint: Point) {
  const x = sourcePoint.x - targetPoint.x;
  const y = sourcePoint.y - targetPoint.y;
  return Math.sqrt(x * x + y * y);
}

/**
 * ä¸¤ç¹é´æ²çº¿
 * @param sourcePoint
 * @param targetPoint
 */
export const quadratic = (sourcePoint: Point, targetPoint: Point): string => {
  const centerX = (sourcePoint.x + targetPoint.x) / 2;
  const centerY = (sourcePoint.y + targetPoint.y) / 2;
  let tolerance = 30;

  const sub = targetPoint.y - sourcePoint.y;

  if (sub > -100 && sub < 100) {
    tolerance = Math.max(Math.abs(targetPoint.y - sourcePoint.y) / 2, 20);
  }

  return [
    'M',
    sourcePoint.x,
    sourcePoint.y,
    'Q',
    /** æ¨ªåä¸ç«åæåºå« */
    sourcePoint.x + tolerance,
    sourcePoint.y,
    centerX,
    centerY,
    'T',
    targetPoint.x - 6,
    targetPoint.y - 2
  ].join(' ');
};

/**
 * è®¡ç®è¿çº¿çä½ç½®
 * @param node ä¸çº¿ç¸è¿çèç¹
 */
export function calcLinkPosition(node, position) {
  let x = node.x + node.width;
  let y = node.y + node.height / 2;
  if (position === 'left') {
    x = node.x;
    y = node.y + node.height / 2;
  } else if (position === 'right') {
    x = node.x + node.width;
    y = node.y + node.height / 2;
  } else if (position === 'top') {
    x = node.x + node.width / 2;
    y = node.y;
  } else if (position === 'bottom') {
    x = node.x + node.width / 2;
    y = node.y + node.height;
  }

  return {
    x,
    y
  };
}

/**
 * è·ååç´ ç¸å¯¹äºé¡µé¢çç»å¯¹ä½ç½®
 */
export function getOffset(domNode: any) {
  let offsetTop = 0;
  let offsetLeft = 0;
  let targetDomNode = domNode;
  while (targetDomNode !== window.document.body && targetDomNode != null) {
    offsetLeft += targetDomNode.offsetLeft;
    offsetTop += targetDomNode.offsetTop;
    targetDomNode = targetDomNode.offsetParent;
  }
  return {
    offsetTop,
    offsetLeft
  };
}

/** è·ååç´ å¨é¡µé¢ä¸å æ®çé«åº¦ */
export function getHeight(dom: HTMLElement) {
  if (!dom) {
    return 0;
  }
  const style = window.getComputedStyle(dom);
  return (
    dom.getBoundingClientRect().height +
    Number(style.marginTop.match(/\d+/g)) +
    Number(style.marginBottom.match(/\d+/g))
  );
}

// è·ååç´ å¨é¡µé¢ä¸å æ®çå®½åº¦
export function getWidth(dom: HTMLElement) {
  if (!dom) {
    return 0;
  }
  const style = window.getComputedStyle(dom);
  return (
    dom.getBoundingClientRect().width + Number(style.marginLeft.match(/\d+/g)) + Number(style.marginRight.match(/\d+/g))
  );
}

// å¤çä¸åå¾å½¢çpathæ°æ®
export function handlePathData(shape: Shape, shapeProps: ShapeProps): string {
  const { x, y, width, height, direction } = shapeProps;
  let pathData = '';
  if (shape === 'rect') {
    pathData = `M${x} ${y} h ${width} v ${height} h -${width} Z`;
    if (direction === 'right') {
      pathData = `M${x} ${y} h -${width} v -${height} h ${width} Z`;
    }
  }
  return pathData;
}
