/**
 * @file å¬å±ç±»åå®ä¹æä»¶
 * @author perkinJ
 */

// è¿æ¥ç¬¦
export const CONNECTOR = '_';

// ç¹åæ 
export class Point {
  x: number;

  y: number;
}

// èç¹æ¯æçå½¢ç¶
export type Shape = 'rect' | 'circle' | 'ellipse' | 'poly';

// æ¹å
export type Direction = 'left' | 'right';

// åéå¨èç¹å±æ§
export class ShapeProps {
  x: number;

  y: number;

  width: number;

  height: number;

  direction: Direction;
}

// éç¨svgåç´ æ ·å¼
export class StyleProps {
  /** å¡«åè² */
  fill?: string;

  /** è¾¹æ¡å®½åº¦ */
  strokeWidth?: number;

  /** é¢è² */
  stroke?: string;

  /** èçº¿é´é */
  strokeDasharray?: string;
}
