/**
 * @file å¸å±ç¸å³æ¹æ³
 * @author perkinJ
 */

export class Point {
  x: number;

  y: number;
}

export type Relation = 'on' | 'in' | 'out';

/**
 * @description å°çº¿æ³å¤æ­ç¹æ¯å¦å¨å¤è¾¹å½¢åé¨
 * @param {Object} p å¾å¤æ­çç¹ï¼æ ¼å¼ï¼{ x: Xåæ , y: Yåæ  }
 * @param {Array} poly å¤è¾¹å½¢é¡¶ç¹ï¼æ°ç»æåçæ ¼å¼å p
 * @return {Relation} ç¹på¨å¤è¾¹å½¢çå³ç³»ï¼åå«ä¸ºon,in,out
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

    // ç¹ä¸å¤è¾¹å½¢é¡¶ç¹éå
    if ((sx === px && sy === py) || (tx === px && ty === py)) {
      return 'on';
    }

    // å¤æ­çº¿æ®µä¸¤ç«¯ç¹æ¯å¦å¨å°çº¿ä¸¤ä¾§
    if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
      // çº¿æ®µä¸ä¸å°çº¿ Y åæ ç¸åçç¹ç X åæ 
      const x = sx + ((py - sy) * (tx - sx)) / (ty - sy);

      // ç¹å¨å¤è¾¹å½¢çè¾¹ä¸
      if (x === px) {
        return 'on';
      }

      // å°çº¿ç©¿è¿å¤è¾¹å½¢çè¾¹ç
      if (x > px) {
        flag = !flag;
      }
    }
  }

  // å°çº¿ç©¿è¿å¤è¾¹å½¢è¾¹ççæ¬¡æ°ä¸ºå¥æ°æ¶ç¹å¨å¤è¾¹å½¢å
  return flag ? 'in' : 'out';
}
