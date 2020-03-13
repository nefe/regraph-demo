/**
 * @description 气泡图
 */

import * as React from "react";
import * as _ from "lodash";
import classNames from "classnames";
import { Node, getArrow, formatUnit } from "./utils";
import { Matrix, LinkInfo } from "regraph-next/src/BaseLayout/Bubble";
import { BaseLayout, ReScreen } from "regraph-next";

class BubbleProps {
  width: number;
  height: number;
  margin = 0;
  data: any;
  /** 行数 */
  rowCount = 2;
}

class BubbleState {
  matrix: Matrix[];
  link: LinkInfo[];
  /** 点击后激活状态 */
  selectedNode: Node;
  hoverNode: Node;
}

class Bubble extends React.Component<
  BubbleProps,
  BubbleState
> {
  static defaultProps = new BubbleProps();
  svg: SVGSVGElement;

  state = {
    matrix: [],
    link: [],
    selectedNode: null,
    hoverNode: null
  };

  // 数据格式化
  handleInitData = (data: any) => {
    if (!data) {
      return [];
    }
    const newData = data.map(node => {
      if (node.relatedCategories) {
        return {
          id: String(node.cateId),
          name: node.cateName,
          value: node.storageSize,
          siblings: this.handleInitData(node.relatedCategories)
        };
      } else {
        return {
          id: String(node.cateId),
          name: node.cateName,
          value: node.storageSize
        };
      }
    });
    return newData;
  };

  generateGraph(props: BubbleProps) {
    const { rowCount, margin, data } = props;

    const width = this.props.width - margin * 2;
    const height = this.props.height - margin * 2;

    // 计算最小尺寸与最大尺寸
    const minSize = (
      _.minBy(data, (node: any) => {
        return node.storageSize;
      }) || { storageSize: Math.pow(1024, 1) }
    ).storageSize;

    const maxSize = (
      _.maxBy(data, (node: any) => {
        return node.storageSize;
      }) || { storageSize: Math.pow(1024, 5) }
    ).storageSize;

    // 对数据操作
    const newData = this.handleInitData(data);
    // 生成matrix,link数据
    const { nodes, links } = new BaseLayout.Bubble({
      data: newData,
      width,
      height,
      rowCount,
      minSize,
      maxSize
    }).graph();

    this.setState({
      matrix: nodes,
      link: links
    } as any);
  }

  componentDidMount() {
    this.generateGraph(this.props);
    this.restore();
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (!_.isEqual(nextProps.data, data)) {
      this.generateGraph(nextProps);
      this.restore();
    }
  }

  restore = () => {
    this.setState({
      selectedNode: null
    });
  };

  handleCircleClick = (selectedNode: Node) => {
    this.setState({
      selectedNode
    });
  };

  resetCircleClick = () => {
    this.setState({
      selectedNode: null
    });
  };

  handleNodeMouseEnter = (selectedNode: Node) => {
    this.setState({
      hoverNode: selectedNode
    });
  };

  handelNodeMouseLeave = () => {
    this.setState({
      hoverNode: null
    });
  };

  getNodeReleation(selectedNode: Node) {
    if (selectedNode) {
      const relationNodes: string[] = [selectedNode.id];
      this.state.link.forEach((link: LinkInfo) => {
        if (
          link.u === selectedNode.id ||
          (link.v === selectedNode.id && link.bothway)
        ) {
          if (relationNodes.indexOf(link.u) === -1) {
            relationNodes.push(link.u);
          }
          if (relationNodes.indexOf(link.v) === -1) {
            relationNodes.push(link.v);
          }
        }
      });
      return relationNodes;
    }
    return [];
  }

  renderText(item) {
    const { center, node } = item;
    const fontSize = node.radius * 0.46;
    if (fontSize <= 9) {
      return (
        <g fill="#fff">
          <text
            x={center.x}
            y={center.y + fontSize / 2}
            textAnchor="middle"
            fontSize={fontSize}
          >
            {node.cateName || "-"}
          </text>
        </g>
      );
    }
    return (
      <g fill="#fff">
        <text x={center.x} y={center.y} textAnchor="middle" fontSize={fontSize}>
          {node.name || "-"}
        </text>
        {fontSize >= 9 && (
          <text
            x={center.x}
            y={center.y + fontSize}
            textAnchor="middle"
            fontSize="9"
          >
            {formatUnit(node.value / 100000 || 0, "money").value}
          </text>
        )}
      </g>
    );
  }

  render() {
    const { margin, data, rowCount } = this.props;
    const { matrix, link, selectedNode, hoverNode } = this.state;
    const relationNodes: string[] = this.getNodeReleation(selectedNode);
    const relationHoverNodes: string[] = this.getNodeReleation(hoverNode);
    const lineCount = Math.ceil(data.length / rowCount);

    const className = classNames("scene-center-legend", {
      "scene-center-legend-selected": selectedNode !== null
    });

    return (
      <div className="bubble-container">
        {selectedNode && (
          <span
            className="icon-back"
            onClick={this.resetCircleClick.bind(this)}
          >
            Back
          </span>
        )}
        <div className={className}>
          <div className="data-storage">
            <span>资金量: </span>
            <div className="small" />
            <span>小</span>
            <div className="middle" />
            <span>中</span>
            <div className="big" />
            <span>大</span>
          </div>
          {selectedNode && (
            <div className="data-flow">
              <span>球员交易资金流向：</span>
              <svg className="flow-arrow">
                <path
                  d={`M0,13 100,13 100,8 105,13 100,18 100,13`}
                  fill="#6ca0f51"
                  stroke="#6ca0f51"
                />
              </svg>
            </div>
          )}
        </div>
        <ReScreen
          type={"DOM"}
          height={600}
          width={850}
          needMinimap={false}
          zoomEnabled={true}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="100%"
            height="100%"
            className="bubble"
            ref={ele => {
              this.svg = ele;
            }}
          >
            <g
              className="bubble-links"
              transform={`translate(${margin}, ${margin})`}
            >
              {link
                .filter((item: LinkInfo) => {
                  if (selectedNode === null) {
                    return true;
                  }
                  if (
                    item.u === selectedNode.id ||
                    (item.v === selectedNode.id && item.bothway)
                  ) {
                    return true;
                  }
                  return false;
                })
                .map((item, index) => {
                  const { start, end, control, u, v } = item;
                  const stroke =
                    selectedNode ||
                    (hoverNode &&
                      (item.u === hoverNode.id ||
                        (item.v === hoverNode.id && item.bothway)))
                      ? "#6ca0f5"
                      : "rgba(200,200,200)";

                  const strokeWidth =
                    selectedNode ||
                    (hoverNode &&
                      (item.u === hoverNode.id ||
                        (item.v === hoverNode.id && item.bothway)))
                      ? "1"
                      : "0.5";

                  const arrowPath = getArrow(
                    control,
                    selectedNode && selectedNode.id === u ? end : start
                  );

                  return (
                    <g key={index}>
                      <path
                        d={`M${start.x} ${start.y}  Q${control.x} ${control.y} ${end.x} ${end.y}`}
                        stroke={stroke}
                        strokeWidth={strokeWidth}
                        fill="none"
                      />
                      {selectedNode && <path d={arrowPath} fill={stroke} />}
                    </g>
                  );
                })}
            </g>
            <g
              className="bubble-nodes"
              transform={`translate(${margin}, ${margin})`}
            >
              {matrix
                .filter((item: Matrix) => {
                  return (
                    selectedNode === null ||
                    relationNodes.indexOf(item.node.id) > -1
                  );
                })
                .map((item, index) => {
                  const { center, node, rowIndex, lineIndex } = item;

                  const fill =
                    hoverNode === null ||
                    selectedNode !== null ||
                    relationHoverNodes.indexOf(node.id) > -1
                      ? "#6ca0f5"
                      : "#5084d8";

                  if (
                    selectedNode &&
                    hoverNode &&
                    hoverNode.id === node.id &&
                    selectedNode.id !== node.id
                  ) {
                    let placement;
                    if (lineIndex === 0) {
                      placement = "right";
                    } else if (lineIndex === lineCount - 1) {
                      placement = "left";
                    } else if (rowIndex < rowCount / 2) {
                      placement = "bottom";
                    } else {
                      placement = "top";
                    }
                    return (
                      <g
                        onClick={this.handleCircleClick.bind(this, node)}
                        onMouseEnter={this.handleNodeMouseEnter.bind(
                          this,
                          node
                        )}
                        onMouseLeave={this.handelNodeMouseLeave}
                        key={index}
                      >
                        <circle
                          cx={center.x}
                          cy={center.y}
                          r={node.radius}
                          strokeWidth="1"
                          fill={fill}
                          key={index}
                        />
                        {this.renderText(item)}
                      </g>
                    );
                  }

                  return (
                    <g
                      onClick={this.handleCircleClick.bind(this, node)}
                      onMouseEnter={this.handleNodeMouseEnter.bind(this, node)}
                      onMouseLeave={this.handelNodeMouseLeave}
                      key={index}
                    >
                      <circle
                        cx={center.x}
                        cy={center.y}
                        r={node.radius}
                        strokeWidth="1"
                        fill={fill}
                        key={index}
                      />
                      {this.renderText(item)}
                    </g>
                  );
                })}
            </g>
          </svg>
        </ReScreen>
      </div>
    );
  }
}

export default Bubble;
