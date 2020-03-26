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
  const { currentGroup, groupRef } = props;

  return (
    <GroupContainer
      id={currentGroup?.id}
      x={currentGroup?.x}
      y={currentGroup?.y}
      width={currentGroup?.width}
      height={currentGroup?.height}
      ref={groupRef}
    >
      <div className="editor-group-box"></div>
    </GroupContainer>
  );
};

EditorGroup.defaultProps = new EditorGroupProps();
