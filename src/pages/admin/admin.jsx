import React, { Component } from "react";
import memoryUtils from "../../utils/memoryUtils";
import { Redirect } from "react-router-dom";
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
