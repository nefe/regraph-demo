/**
 * @file å¨å±å·¥å·ç±»
 * @author perkinJ
 */

/**
 * å¨å±æä¸ä¸ªåç´ 
 * @param element
 */
function launchFullscreen(element: any) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}
/**
 * éåºå¨å±
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  }
}

/**
 * å¤æ­æ¯å¦å¤äºå¨å±ç¶æ
 */
function isFull() {
  const doc = document as any;
  return doc.fullscreenElement || doc.webkitFullscreenElement;
}
export { launchFullscreen, exitFullscreen, isFull };
