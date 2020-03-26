/**
 * @file 管道画布常量定义
 */

import * as React from "react";
import * as _ from "lodash";
import { Icon } from "antd";

// 组件卡片宽度高度
export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 60;

// 右边菜单栏宽度
export const MENU_WIDTH = 120;
export const MENU_HEIGHT = 196;
// 右边抽屉宽度-通用
export const RIGHTDRAWER_WIDTH = 521;
// 右边抽屉宽度-调度配置
export const SHECHEDULE_RIGHTDRAWER_WIDTH = 750;

// 支持缩放的最大值跟最小值
export const MAX_SCALE = 200;
export const MIN_SCALE = 50;

// 组件之间的间距
export const COMPONENT_DISTANCE = 30;

// 全屏状态的坐标差,顶部导航到画布的距离
export const fullscreenDiffY = 130;

// 顶部导航到画布的固定举例，用于计算Context
export const CONTEXT_HEIGHT_DIFF = 155;

// 连接符
export const CONNECTOR = "_";

// 连线可连线的区域
export const LINK_AREA = 30;

// 连线不同状态的颜色
// 未连接状态
export const UNLINK = "#52619b";
// 选中状态
export const ACTIVE = "#92ade3";
// 连接状态
export const LINK = "#b4bdcf";

// 管道节点code为30，为固定值
export const operatorTypeCode = 30;

// 组件库类型
export enum ComponentType {
  /** 通用 */
  common = "common"
  /** 自定义 */
  // self = 'self'
}

export const ComponentMap: Record<ComponentType, string> = {
  [ComponentType.common]: "通用"
  // [ComponentType.self]: '自定义'
};

export class Node {
  /** 组件类型 */
  type?: string;

  /** 组件key */
  key: string;

  /** 组件名称 */
  name: string;

  /** 组件icon */
  icon?: React.ReactNode;

  /** 组件在画布中的横坐标 */
  x?: number;

  /** 组件在画布中的纵坐标 */
  y?: number;

  width?: number;

  height?: number;

  id?: string;

  groupId?: string;

  /** 对应的 ref */
  ref?: any;

  /** 数据分发方式, true:轮流 false:copy */
  distribute?: boolean;

  /** 其他配置信息 */
  webConfig?: {};

  disabled?: boolean;
}

export class NodePanel {
  type: string;

  key: string;

  name: string;

  icon: React.ReactNode;

  disabled: boolean;
}

export type LINK_POSITION = "left" | "right" | "top" | "bottom";

export interface Link {
  /** 连线的唯一id, source+CONNECTOR+target的形式 */
  id: string;
  /** 来源节点id */
  source: string;
  /** 去向节点id */
  target: string;
  /** 来源节点位置 */
  sourcePos?: string;
  /** 去向节点位置 */
  targetPos?: string;
}

export interface Group {
  /** 组的id */
  id: string;
  /** 组在画布中的横坐标 */
  x: number;

  /** 组在画布中的纵坐标 */
  y: number;

  width: number;

  height: number;

  /** 包含的节点id */
  nodes?: Node[];

  /** 对应的 ref */
  ref?: any;

  /** 父级 */
  parentId?: string;

  /** 其他信息 */
  extraInfo?: any;
}

// group padding
export const GROUP_PADDING = 20;

// 连线中的icon，宽高
export const LINKICON_WIDTH = 18;
export const LINKICON_HEIGHT = 18;

export enum ComponentKey {
  rect = "rect",
  rectRadius = "rectRadius",
  circle = "circle",
  diamond = "diamond",
  polygon = "polygon",
  ellipse = "ellipse",
  star = "star"
}

// 单元类型
// 输入组件
const COMMON_COMPONENT: Node[] = [
  /** 矩形 */
  {
    type: ComponentType.common,
    key: ComponentKey.rect,
    name: "RECT",
    width: 100,
    height: 100,
    icon: (
      <div style={{ width: 36, height: 36, border: "2px solid #52619b" }} />
    ),
    disabled: false
  },
  /** 矩形带圆角 */
  {
    type: ComponentType.common,
    key: ComponentKey.rectRadius,
    name: "RECT-RADIU",
    width: 100,
    height: 100,
    icon: (
      <div
        style={{
          width: 36,
          height: 36,
          border: "2px solid #52619b",
          borderRadius: 10
        }}
      />
    ),
    disabled: false
  },
  /** 圆形 */
  {
    type: ComponentType.common,
    key: ComponentKey.circle,
    name: "CIRCLE",
    width: 100,
    height: 100,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="72px"
        height="40px"
      >
        <circle
          cx="36"
          cy="20"
          r="18"
          stroke="#52619b"
          strokeWidth="2"
          fill="transparent"
        />
      </svg>
    ),
    disabled: false
  }
];

// 组件库类目
export const COMPONENT_CATEGORY: Record<ComponentType, Node[]> = {
  [ComponentType.common]: COMMON_COMPONENT
  // [ComponentType.self]: SELF_COMPONENT
};

export const keyCodeMap = {
  delete: 8,
  copy: 67,
  paste: 86
};

/** 处理弹窗全屏挂载 */
export function getContainer() {
  const pipelineDoms = document.getElementsByClassName("pipeline-canvas");
  return _.find(
    pipelineDoms,
    dom => (dom as HTMLElement).offsetParent
  ) as HTMLElement;
}

/**
 * @file 类型定义文件
 */
class MenuPos {
  id?: string;

  x: number;

  y: number;
}

// 节点宽高
export const VERTEX_WIDTH = 180;
export const VERTEX_HEIGHT = 32;

export { MenuPos };

// 操作类型
export enum OperateType {
  copy = "copy",
  delete = "delete"
}
