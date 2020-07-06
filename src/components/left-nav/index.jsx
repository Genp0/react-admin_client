import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./index.less";
const { SubMenu, Item } = Menu;
/*
左侧导航组建
*/
export default class LeftNav extends Component {
  render() {
    return (
      <div>
        <div to="/" className="left-nav">
          <Link to="/home" className="left-nav-header">
            <img src={logo} alt="logo" />
            <h1>システム</h1>
          </Link>
          <Menu mode="inline" theme="dark">
            <Item key="/home">
              <Link to="/home">
                <Icon type="pie-chart" />
                <span>首页 </span>
              </Link>
            </Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <Icon type="mail" />
                  <span>商品</span>
                </span>
              }
            >
              <Item key="/category">
                <Link to="/category">
                  <Icon type="mail" />
                  <span>品类管理</span>
                </Link>
              </Item>
              <Item key="/product">
                <Link to="/product">
                  <Icon type="mail" />
                  <span>商品管理</span>
                </Link>
              </Item>
            </SubMenu>
            <Item key="/user">
              <Link to="/user">
                <Icon type="user" />
                <span>用户管理</span>
              </Link>
            </Item>
            <Item key="/role">
              <Link to="/role">
                <Icon type="pie-chart" />
                <span>角色管理</span>
              </Link>
            </Item>
          </Menu>
        </div>

        <Menu></Menu>
      </div>
    );
  }
}
