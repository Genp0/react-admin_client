import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Layout } from "antd";
import memoryUtils from "../../utils/memoryUtils";
const { Header, Footer, Sider, Content } = Layout;
/*
管理路由组件
*/
export default class Admin extends Component {
  render() {
    const { user } = memoryUtils;
    if (!user || !user._id) {
      return <Redirect to="/login" />;
    }
    return <div>Hello,{user.username}</div>;
  }
}
