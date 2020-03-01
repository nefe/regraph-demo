/**
 * @file èç¹ï¼è¾¹æç´¢æ¹æ³
 * @author perkinJ
 */

import * as _ from 'lodash';
import { Node, Link } from '../defines';
import { distance } from './calc';
import { Point } from './types';
/**
 * æ¥æ¾åä¸ªä¸æ¸¸ç»ä»¶
 */
export const findUpstreamNode = (id: string, nodes: Node[], links: Link[]) => {
  const selectedLinks = _.find(links, item => item.target === id);
  if (selectedLinks) {
    const upstreamComponent = _.find(nodes, item => item.id === selectedLinks.source, null);
    return upstreamComponent;
  }
};

/**
 * æ¥æ¾åä¸ªä¸æ¸¸ç»ä»¶
 */
export const findDownstreamNode = (id: string, nodes: Node[], links: Link[]) => {
  const selectedLinks = _.find(links, item => item.source === id);
  if (selectedLinks) {
    const downstreamComponent = _.find(nodes, item => item.id === selectedLinks.target, null);
    return downstreamComponent;
  }
};

/** æç´¢å½åç»ä»¶çææçä¸æ¸¸ç»ä»¶ */
export const findAllDownstreamNodes = (id: string, nodes: Node[], links: Link[]) => {
  const selectedLinks = _.filter(links, item => item.source === id);
  if (Array.isArray(selectedLinks) && selectedLinks.length > 0) {
    const downstreamComponent = selectedLinks.map(link => _.find(nodes, item => item.id === link.target));
    return downstreamComponent;
  }
  return [];
};

/** æç´¢ææçä¸æ¸¸ç»ä»¶ */
export const findAllUpstreamNodes = (id: string, nodes: Node[], links: Link[]) => {
  const selectedLinks = _.filter(links, item => item.target === id);
  if (selectedLinks) {
    const upstreamComponent = _.filter(nodes, item => item.id === selectedLinks[0].source);
    return upstreamComponent;
  }
  return [];
};

/** æç´¢å½åç»ä»¶çææä¸æ¸¸è¿çº¿ */
export const findAllUptreamLinks = (id: string, links: Link[]) => {
  const newLinks = _.filter(links, item => item.target === id);
  return newLinks;
};

/** æç´¢å½åç»ä»¶çææä¸æ¸¸è¿çº¿ */
export const findAllDownstreamLinks = (id: string, links: Link[]) => {
  const newLinks = _.filter(links, item => item.source === id);
  return newLinks;
};

/**
 * @desc æ¥æ¾é è¿æä¸ªç¹æè¿çèç¹ï¼ç¨äºè¿çº¿
 * @param point ç¹çåæ 
 * @param nodes èç¹
 * @param range æå¤§èå´
 */
export const findNearbyNode = (point: Point, nodes: Node[], range: number) => {
  let targetNode: Node = null;
  let minDis = Infinity;
  let targetPos = '';

  nodes.forEach(v => {
    // 1. æ¯è¾4ä¸ªç¹ç¦»åå§ç¹æè¿çç¹
    let minDistance = Infinity;
    ['left', 'right', 'top', 'bottom'].forEach(item => {
      let targetX;
      let targetY;
      if (item === 'left') {
        targetX = v.x;
        targetY = v.y + v.height / 2;
      } else if (item === 'right') {
        targetX = v.x + v.width;
        targetY = v.y + v.height / 2;
      } else if (item === 'top') {
        targetX = v.x + v.width / 2;
        targetY = v.y;
      } else if (item === 'bottom') {
        targetX = v.x + v.width / 2;
        targetY = v.y + v.height;
      }

      minDistance = distance(
        {
          x: point.x,
          y: point.y
        },
        {
          x: targetX,
          y: targetY
        }
      );

      if (minDis > minDistance) {
        minDis = minDistance;
        targetNode = v;
        targetPos = item;
      }
    });
  });

  if (minDis <= range) {
    return { targetNode, targetPos };
  }
  return null;
};
