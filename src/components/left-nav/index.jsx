import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setHeadTitle } from "../../redux/action";
import menuList from "../../config/menuConfig";
import logo from "../../assets/images/logo.png";
import "./index.less";
const { SubMenu, Item } = Menu;
/*
左侧导航组建
*/
class LeftNav extends Component {
  // 判断当前登录用户对item是否有权限;
  hasAuth = (item) => {
    const { key, isPublic } = item;

    const menus = this.props.user.role.menus;
    const username = this.props.user.username;
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      return !!item.children.find((child) => menus.indexOf(child.key !== -1));
      /* 如果当前用户有此item的某个子item的权限 */
    } else {
      return false;
    }

    /* 
    1.如果当前用户是admin，
    2.如果当前item是公开的直接返回true
    3.当前用户有此item的权限，就是看key有么有在menu中
    */
  };
  /*
    根据menu数据数组生成标签数组
  */
  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname;
    return menuList.reduce((pre, item) => {
      // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        // 向pre添加<Menu.Item>
        if (!item.children) {
          // 判断item是否是当前item
          if (item.key === path || path.indexOf(item.key) === 0) {
            this.props.setHeadTitle(item.title);
          }
          pre.push(
            <Menu.Item key={item.key}>
              <Link
                to={item.key}
                onClick={() => {
                  this.props.setHeadTitle(item.title);
                }}
              >
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          // 查找一个与当前请求路径匹配的子Item
          const cItem = item.children.find(
            (cItem) => path.indexOf(cItem.key) === 0
          );
          // 如果存在, 说明当前item的子列表需要打开
          if (cItem) {
            this.openKey = item.key;
          }

          // 向pre添加<SubMenu>
          pre.push(
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
      }

      return pre;
    }, []);
    /* 
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
    */
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

export default connect((state) => ({ user: state.user }), { setHeadTitle })(
  withRouter(LeftNav)
);
