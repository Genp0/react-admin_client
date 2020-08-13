import React, { Component } from "react";
import { Card, Button, Table, Modal, message, Tree } from "antd";
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import { reqRoles, reqAddRole } from "../../api";
import { PAGE_SIZE } from "../../utils/constants";

export default class Role extends Component {
  state = {
    roles: [], // 所有角色的列表
    role: {}, // 选中的role
    isShowAdd: false, // 是否显示添加界面
    isShowAuth: false, // //是否显示授权界面
  };
  onRow = (role) => {
    return {
      onClick: (event) => {
        // 点击行
        if (this.state.role._id) {
          this.setState({ role: {} });
        } else {
          this.setState({
            role,
          });
        }
      },
    };
  };
  initColumns = () => {
    this.columns = [
      { title: "角色名称", dataIndex: "name" },
      { title: "创建时间", dataIndex: "create_time" },
      { title: "授权时间", dataIndex: "auth_time" },
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
  updateRole = () => {};

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
          <AuthForm role={role} />
        </Modal>
      </Card>
    );
  }
}
