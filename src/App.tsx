import * as React from "react";
import { Layout, Menu } from "antd";
import { Switch, Route, Link, useLocation, useHistory } from "react-router-dom";
import Editor from "./Editor";
import Bubble from "./Bubble";

import "./styles.scss";
const { useState, useEffect } = React;
const { Header, Content } = Layout;

export default function App() {
  const [menuKey, setMenuKey] = useState("/");
  const location = useLocation();
  useEffect(() => {
    const pathname = location.pathname;
    setMenuKey(pathname);
  }, [location]);

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[menuKey]}
          style={{ lineHeight: "64px" }}
        >
          <Menu.Item key="/">
            <Link to="/">图编排</Link>
          </Menu.Item>
          <Menu.Item key="/bubble">
            <Link to="/bubble">气泡图</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <div className="site-layout-content">
          <Switch>
            <Route exact path="/" component={Editor} />
            <Route exact path="/bubble" component={Bubble} />
          </Switch>
        </div>
      </Content>
    </Layout>
  );
}
