/**
 *
 * @description 公共定义
 */
export class Node {
  id: string;
  radius: number;
  size: string;
  cateName: string;
  fontSize: number;
}

export class Point {
  x: number;
  y: number;
}


const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const atan2 = Math.atan2;

export const getArrow = (controlPoint: Point, endPoint: Point): string => {
  const endTangent = [endPoint.x - controlPoint.x, endPoint.y - controlPoint.y];
  const x1 = endPoint.x - endTangent[0];
  const y1 = endPoint.y - endTangent[1];
  const x2 = endPoint.x;
  const y2 = endPoint.y;

  const arrowLength = 10;
  const arrowAngle = PI / 3;
  const lineWidth = 1;

  // Calculate angle
  let angle = atan2(y2 - y1, x2 - x1);
  // Adjust angle correctly
  angle -= PI;
  // Calculate offset to place arrow at edge of path
  const offsetX = lineWidth * cos(angle);
  const offsetY = lineWidth * sin(angle);

  // Calculate coordinates for left half of arrow
  const leftX = x2 + arrowLength * cos(angle + arrowAngle / 2);
  const leftY = y2 + arrowLength * sin(angle + arrowAngle / 2);
  // Calculate coordinates for right half of arrow
  const rightX = x2 + arrowLength * cos(angle - arrowAngle / 2);
  const rightY = y2 + arrowLength * sin(angle - arrowAngle / 2);

  return `
  M${leftX - offsetX},${leftY - offsetY}
  ${x2 - offsetX},${y2 - offsetY}
  ${rightX - offsetX},${rightY - offsetY}`;
};

const d3Format = require('d3-format');

const storageUnits = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

export function formatUnit(num: number, type: 'compute' | 'storage' | 'money' | 'compute-core' | 'memory' | 'number' | 'gpu') {
  if (typeof num !== 'number') {
    num = 0;
  }
  const tag = num < 0 ? '-' : '';

  num = Math.abs(num);
  let { unit, numberValue }: any = type === 'compute-core' ? _formatUnit(num * 100, 'compute') : _formatUnit(num, type);

  numberValue = (tag as any) + d3Format.format(',')(Number(numberValue.toFixed(2).toString()));

  return {
    unit,
    numberValue,
    value: numberValue + unit
  };
}

function _formatUnit(num: number, type: 'compute' | 'storage' | 'money' | 'memory' | 'number' | 'gpu') {
  switch (type) {
    case 'memory': {
      return {
        numberValue: num / 60 / 60 / 24 / 1024,
        unit: 'GBU'
      };
    }
    case 'compute': {
      const cm = num / 6000;
      if (cm / 1440 < 1) {
        return {
          numberValue: cm,
          unit: 'CM' //
        };
      } else if (cm / 1440000 < 1) {
        return {
          numberValue: cm / 1440,
          unit: 'CU'
        };
      } else if (cm / 1440000 / 1000 < 1) {
        return {
          numberValue: cm / 1440000,
          unit: 'KCU'
        };
      }

      return {
        numberValue: cm / 1440000 / 1000,
        unit: 'MCU'
      };
    }
    case 'gpu': {
      const cm = num / 6000;
      if (cm / 1440 < 1) {
        return {
          numberValue: cm,
          unit: 'GM' //
        };
      } else if (cm / 1440000 < 1) {
        return {
          numberValue: cm / 1440,
          unit: 'GU'
        };
      } else if (cm / 1440000 / 1000 < 1) {
        return {
          numberValue: cm / 1440000,
          unit: 'KGU'
        };
      }

      return {
        numberValue: cm / 1440000 / 1000,
        unit: 'MGU'
      };
    }
    case 'storage': {
      const index = Math.floor(Math.log2(num) / 10);
      const numberValue = num / Math.pow(2, index * 10);

      if (index < 0) {
        return {
          unit: storageUnits[0],
          numberValue: 0
        };
      }

      return {
        unit: storageUnits[index],
        numberValue
      };
    }
    case 'money': {
      if (num > 100000000) {
        return {
          unit: '亿元',
          numberValue: num / 100000000
        };
      }

      if (num > 10000) {
        return {
          unit: '万元',
          numberValue: num / 10000
        };
      }

      return {
        unit: '元',
        numberValue: num
      };
    }
    case 'number': {
      return {
        unit: '元',
        numberValue: num
      };
    }
  }
}