/**
 * @file 布局相关方法
 * @author perkinJ
 */
import { Node, Group } from "../defines";

export class Point {
  x: number;

  y: number;
}

export type Relation = "on" | "in" | "out";

/**
 * @description 射线法判断点是否在多边形内部
 * @param {Object} p 待判断的点，格式：{ x: X坐标, y: Y坐标 }
 * @param {Array} poly 多边形顶点，数组成员的格式同 p
 * @return {Relation} 点p在多边形的关系，分别为on,in,out
 */

export function pointInPoly(p: Point, poly: Point[]): Relation {
  const px = p.x;
  const py = p.y;
  let flag = false;

  for (let i = 0, l = poly.length, j = l - 1; i < l; j = i, i++) {
    const sx = poly[i].x;
    const sy = poly[i].y;
    const tx = poly[j].x;
    const ty = poly[j].y;

    // 点与多边形顶点重合
    if ((sx === px && sy === py) || (tx === px && ty === py)) {
      return "on";
    }

    // 判断线段两端点是否在射线两侧
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      // 线段上与射线 Y 坐标相同的点的 X 坐标
      const x = sx + ((py - sy) * (tx - sx)) / (ty - sy);

      // 点在多边形的边上
      if (x === px) {
        return "on";
      }

      // 射线穿过多边形的边界
      if (x > px) {
        flag = !flag;
      }
    }
  }

  // 射线穿过多边形边界的次数为奇数时点在多边形内
  return flag ? "in" : "out";
}

export type Direction = "in" | "out";
/**
 * @description 判断节点是否离开某个组
 * @param {Node} node 待判断的节点
 * @param {Group} group 组
 * @paran {Direction} 区分是节点拖入还是节点拖出的动作。默认是拖入
 * 拖入情况下，只要有一个节点进入，则算在组内，否则在组外
 * 拖出情况下，只有当节点的点全部在组外，才算在组外。
 * @return Direction
 */

export function checkNodeIsOverGroup(
  node: Node,
  group: Group,
  type = "leave" as "enter" | "leave"
): Direction {
  const { x: groupX, y: groupY, width, height } = group;

  const P1 = { x: node?.x, y: node?.y };
  const P2 = { x: node?.x + node?.width, y: node?.y };
  const P3 = {
    x: node?.x + node?.width,
    y: node?.y + node?.height
  };
  const P4 = { x: node?.x, y: node?.y + node?.height };

  const polyPoint = [
    { x: groupX, y: groupY },
    { x: groupX + width, y: groupY },
    { x: groupX + width, y: groupY + height },
    { x: groupX, y: groupY + height }
  ];

  if (type === "enter") {
    const isEnter =
      pointInPoly(P1, polyPoint) === "in" ||
      pointInPoly(P2, polyPoint) === "in" ||
      pointInPoly(P3, polyPoint) === "in" ||
      pointInPoly(P4, polyPoint) === "in";
    return isEnter ? "in" : "out";
  } else {
    const isLeave =
      pointInPoly(P1, polyPoint) === "out" ||
      pointInPoly(P2, polyPoint) === "out" ||
      pointInPoly(P3, polyPoint) === "out" ||
      pointInPoly(P4, polyPoint) === "out";

    return isLeave ? "out" : "in";
  }
}
