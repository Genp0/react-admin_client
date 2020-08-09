import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import menuList from "../../config/menuConfig";
import logo from "../../assets/images/logo.png";
import "./index.less";
const { SubMenu, Item } = Menu;
/*
左侧导航组建
*/
class LeftNav extends Component {
  /*
    根据menu数据数组生成标签数组
  */
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname;
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
        const cItem = item.children.find(
          (cItem) => path.indexOf(cItem.key) === 0
        );
        if (cItem) {
          this.openKey = item.key;
        }
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
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList);
  }
  render() {
    // 得到当前请求的路由路径
    let path = this.props.location.pathname;
    if (path.indexOf("/product") === 0) {
      // 说明请求的是商品或其子路由
      path = "/product";
    }
    return (
      <div>
        <div to="/" className="left-nav">
          <Link to="/home" className="left-nav-header">
            <img src={logo} alt="logo" />
            <h1>システム</h1>
          </Link>
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[path]}
            defaultOpenKeys={[this.openKey]}
          >
            {this.menuNodes}
          </Menu>
        </div>
      </div>
    );
  }
}

export default withRouter(LeftNav);
