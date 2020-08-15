import React, { Component } from "react";
import { Form, Tree, Input } from "antd";
import PropTypes from "prop-types";
import menuList from "../../config/menuConfig";
const Item = Form.Item;
const TreeNode = Tree.TreeNode;
class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus,
    };
  }
  /* 为父组建提交获取最新的menus */
  getMenus = () => this.state.checkedKeys;
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    }, []);
  };
  onCheck = (checkedKeys) => {
    console.log("checkedKeys", checkedKeys);
    this.setState({ checkedKeys });
  };
  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList);
  }
  // 根据新传入的role来更新checkedkeys状态
  /*
  当组件接收到新的属性时自动调用，而且是在render之前
  */
  componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys: menus,
    });
  }
  render() {
    const { role } = this.props;

    const { checkedKeys } = this.state;
    // 制定Item布局
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };
    return (
      <div>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} disabled />
        </Item>
        <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
export default AuthForm;
