/**
 * @file 画布操作导航
 * @author perkinJ
 */

import * as React from "react";
import { Icon, Tooltip } from "antd";
import classNames from "classnames";
import {
  launchFullscreen,
  exitFullscreen,
  isFull
} from "../utils/FullsreenUtils";
import { MIN_SCALE, MAX_SCALE } from "../defines";
import "./Toolbar.scss";

/** 操作面板，支持全屏、缩放、自适应画布、格式化、显示比例 */

export type ToolbarType =
  | "save"
  | "fullscreen"
  | "zoom"
  | "adapt"
  | "format"
  | "ratio"
  | "shear"
  | "copy"
  | "paste"
  | "delete"
  | "dragSelect"
  | "layout"
  | "adapt";

export class ToolbarProps {
  /** 适应画布 */
  handleShowAll?: () => void;

  /** 缩放 */
  handleResizeTo?: (scale: number) => void;

  /** 改变屏幕缩放大小 */
  changeScreenScale?: (scale: number) => void;

  /** 缩放大小 */
  screenScale?: number;

  onSave?: () => void;

  onShear?: () => void;

  onCopy?: () => void;

  onPaste?: () => void;

  onDelete?: () => void;

  onDragSelect?: () => void;

  onLayout?: () => void;

  onAdapt?: () => void;

  /** 处理全屏 */
  // handleFullScreen?: () => void;
  /** Toolbar选项 */
  items?: ToolbarType[];

  /**  */
}

const Toolbar = React.forwardRef((props: ToolbarProps, ref: any) => {
  const {
    screenScale,
    changeScreenScale,
    handleResizeTo,
    items,
    onShear,
    onCopy,
    onPaste,
    onDelete,
    onDragSelect,
    onSave,
    onLayout,
    onAdapt
  } = props;
  const scale = String(Math.round(screenScale));

  /** 是否保存 */
  const isSave = items.includes("save");

  /** 是否支持全屏 */

  const isFullScreen = items.includes("fullscreen");

  /** 是否支持缩放 */
  const isZoom = items.includes("zoom");

  /** 是否支持适应画布 */
  const isAdapt = items.includes("adapt");

  /** 是否支持格式化 */
  const isFormat = items.includes("format");

  /** 剪切 */
  const isShear = items.includes("shear");
  /** 是否支持复制 */
  const isCopy = items.includes("copy");

  const isPaste = items.includes("paste");

  const isDelete = items.includes("delete");

  const isDragSelect = items.includes("dragSelect");

  const isLayout = items.includes("layout");

  /** 当前是否是全屏状态 */

  const fullscreenStatus = isFull();

  /** 缩放操作 */
  const handleResize = (isLager?: boolean) => {
    let value = screenScale;
    if (isLager) {
      value = screenScale + 10;
      if (value > MAX_SCALE) {
        value = MAX_SCALE;
      }
    } else {
      value = screenScale - 10;
      if (value < MIN_SCALE) {
        value = MIN_SCALE;
      }
    }
    handleResizeTo(value / 100);
    changeScreenScale(value);
  };

  /** 处理全屏事件 */
  const handleFullScreen = () => {
    const isfull = isFull();
    if (isfull) {
      exitFullscreen();
    } else {
      launchFullscreen(ref.current);
    }
  };

  // 渲染按钮
  const renderButtons = () => {
    const fullScreenClassName = classNames({
      fullscreen: !fullscreenStatus,
      "fullscreen-exit": fullscreenStatus
    });

    return (
      <>
        {isZoom && (
          <>
            <div className="toolbar-btn">
              <Tooltip title="缩小">
                <Icon type="zoom-in" onClick={handleResize.bind(null, true)} />
              </Tooltip>
            </div>
            <div className="toolbar-btn">
              <Tooltip title="放大">
                <Icon
                  type="zoom-out"
                  onClick={handleResize.bind(null, false)}
                />
              </Tooltip>
            </div>
          </>
        )}
        {isSave && (
          <div className="toolbar-btn">
            <Tooltip title="保存">
              <Icon type="save" onClick={onSave} />
            </Tooltip>
          </div>
        )}

        {isFullScreen && (
          <div className="toolbar-btn">
            <Tooltip title="全屏">
              <Icon type={fullScreenClassName} onClick={handleFullScreen} />
            </Tooltip>
          </div>
        )}

        {isShear && (
          <div className="toolbar-btn">
            <Tooltip title="剪切">
              <Icon type="scissor" onClick={onShear} />
            </Tooltip>
          </div>
        )}

        {isCopy && (
          <div className="toolbar-btn">
            <Tooltip title="复制">
              <Icon type="copy" onClick={onCopy} />
            </Tooltip>
          </div>
        )}

        {isPaste && (
          <div className="toolbar-btn">
            <Tooltip title="粘贴">
              <Icon type="snippets" onClick={onPaste} />
            </Tooltip>
          </div>
        )}
        {isDelete && (
          <div className="toolbar-btn">
            <Tooltip title="删除">
              <Icon type="delete" onClick={onDelete} />
            </Tooltip>
          </div>
        )}

        {isDragSelect && (
          <div className="toolbar-btn">
            <Tooltip title="圈选">
              <Icon type="gateway" onClick={onDragSelect} />
            </Tooltip>
          </div>
        )}

        {isAdapt && (
          <div className="toolbar-btn">
            <Tooltip title="适应画布">
              <Icon type="border-outer" onClick={onAdapt} />
            </Tooltip>
          </div>
        )}

        {isLayout && (
          <div className="toolbar-btn">
            <Tooltip title="格式化">
              <Icon type="layout" onClick={onLayout} />
            </Tooltip>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="toolbar">
      <div className="toolbar-scale">{scale}%</div>
      <div className="toolbar-button">{renderButtons()}</div>
    </div>
  );
});

export default Toolbar;
