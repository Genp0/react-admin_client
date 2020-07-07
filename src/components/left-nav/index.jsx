import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import menuList from "../../config/menuConfig";
import logo from "../../assets/images/logo.png";
import "./index.less";
const { SubMenu, Item } = Menu;
/*
左侧导航组建
*/
export default class LeftNav extends Component {
  /*
    根据menu数据数组生成标签数组
  */
  getMenuNodes = (menuList) => {
    return menuList.map((item) => {
      if (!item.children) {
        return (
          <Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title} </span>
            </Link>
          </Item>
        );
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.getMenuNodes(item.children)}
          </SubMenu>
        );
      }
    });
  };
  render() {
    return (
      <div>
        <div to="/" className="left-nav">
          <Link to="/home" className="left-nav-header">
            <img src={logo} alt="logo" />
            <h1>システム</h1>
          </Link>
          <Menu mode="inline" theme="dark">
            {this.getMenuNodes(menuList)}
            {/* <Item key="/home">
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
            </Item> */}
          </Menu>
        </div>
      </div>
    );
  }
}
