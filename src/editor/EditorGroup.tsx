/**
 * @author PerkinJ
 * @description 基于Group的群组
 */
import * as React from "react";
import * as _ from "lodash";
import { Group as GroupContainer } from "./components";
import { Group, Node, GROUP_PADDING } from "./defines";
import "./EditorGroup.scss";

export class EditorGroupProps {
  /** 节点id */
  id: string;

  /** Group容器的ref */
  groupRef: any;

  /** 组的信息 */
  currentGroup: Group;

  /** 组内包含的节点 */
  nodes?: Node[];
}

export const EditorGroup: React.FC<EditorGroupProps> = props => {
  const { currentGroup, groupRef, nodes } = props;
  const { x, y } = currentGroup;
  // 需要动态计算组的宽度
  const maxXNode = _.maxBy(nodes, node => {
    return node?.x + node?.width;
  });

  // const maxXNode = _.find(nodes, node => node.id === maxXId);

  const maxX = maxXNode?.x + maxXNode?.width + 2 * GROUP_PADDING;

  const maxYNode = _.maxBy(nodes, node => {
    return node?.y + node?.height;
  });
  const maxY = maxYNode.y + maxYNode.height + 2 * GROUP_PADDING;

  const width = maxX - x;
  const height = maxY - y;

  return (
    <GroupContainer
      id={currentGroup.id}
      x={x - GROUP_PADDING}
      y={y - GROUP_PADDING}
      width={width}
      height={height}
      ref={groupRef}
    >
      <div className="editor-group-box"></div>
    </GroupContainer>
  );
};

EditorGroup.defaultProps = new EditorGroupProps();
