/**
 * @author perkinJ
 * @description 群组组件
 */
import * as React from "react";
import "./Group.scss";

const { useRef } = React;

export class GroupProps {
  /** 节点id */
  id: string;

  /** 节点横坐标 */
  x: number;

  /** 节点纵坐标 */
  y: number;

  width: number;

  height: number;

  children?: React.ReactNode;
}

const Group = React.forwardRef((props: GroupProps, ref: any) => {
  const { x, y, width, height, children } = props;
  const containerRef = useRef(null);

  return (
    <div
      className="editor-group"
      style={{
        left: x,
        top: y,
        width,
        height
      }}
      ref={ref}
    >
      {React.cloneElement(children as React.ReactElement<any>, {
        ref: containerRef
      })}
    </div>
  );
});

Group.defaultProps = new GroupProps();

export default Group;
