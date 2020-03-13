import * as React from "react";
import { ReScreen } from "regraph-next";
import Bubble from "./Bubble";
import { data } from "./data";
import "./Bubble.scss";

export default class BubbleDemo extends React.Component<any, any> {
  render() {
    return (
      <div className="bubble-wrapper">
        <Bubble
          width={628}
          height={445}
          margin={60}
          data={data}
          rowCount={Math.ceil(data.length / 4)}
        />
      </div>
    );
  }
}
