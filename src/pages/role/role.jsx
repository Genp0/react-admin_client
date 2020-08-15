import React, { Component } from "react";
import { Card, Button, Table, Modal, message, Tree } from "antd";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import { PAGE_SIZE } from "../../utils/constants";
import { formateDate } from "../../utils/dateUtils";

export default class Role extends Component {
  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // //是否显示授权界面
  };
  constructor(props) {
    super(props);
    this.auth = React.createRef();
  }
  onRow = (role) => {
    return {
      onClick: (event) => {
        // 点击行
        this.setState({
          role,
        });
      },
    };
  };
  initColumns = () => {
    this.columns = [
      { title: "角色名称", dataIndex: "name" },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: formateDate,
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: formateDate,
      },
      { title: "授权人", dataIndex: "auth_name" },
    ];
  };
  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      this.setState({
        roles,
      });
    }
  };
  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if (!error) {
        const { roleName } = values;
        this.form.resetFields();
        const result = await reqAddRole(roleName);
        if (result.status === 0) {
          message.success("添加角色成功");
          const role = result.data;
          this.setState((state) => ({
            roles: [...this.state.roles, role],
            isShowAdd: false,
          }));
        } else {
          message.error("添加角色失败");
        }
      }
    });
  };
  updateRole = async () => {
    const role = this.state.role;
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_name = memoryUtils.user.username;
    role.auth_time = Date.now();
    console.log("setState之前的state");
    console.log(this.state.roles);
    // 请求更新
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      message.success("设置权限成功");
      this.setState({ roles: [...this.state.roles], isShowAuth: false });
    } else {
      message.error("设置权限失败");
    }
  };

  componentWillMount() {
    this.initColumns();
  }
  componentDidMount() {
    this.getRoles();
  }
  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state;
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>{" "}
        &nbsp;&nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() => this.setState({ isShowAuth: true })}
        >
          设置角色权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          rowSelection={{ type: "radio", selectedRowKeys: [role._id] }}
          bordered
          rowKey="_id"
          dataSource={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          onRow={this.onRow}
        ></Table>
        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => this.setState({ isShowAdd: false })}
        >
          <AddForm setForm={(form) => (this.form = form)} />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => this.setState({ isShowAuth: false })}
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    );
  }
}
