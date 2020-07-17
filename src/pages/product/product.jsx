import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import ProductAddUpdate from "./add-update";
import ProductDetail from "./detail";
import ProductHome from "./home";

/*
Product 的默认子路有组件
*/
export default class Product extends Component {
  render() {
    return <div>ProductHome</div>;
  }
}
