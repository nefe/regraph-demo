import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "antd/dist/antd.css";

import App from "./App";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter basename="regraph-demo">
    <App />
  </BrowserRouter>,
  rootElement
);
