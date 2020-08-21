import React, { Component } from "react";
import { Button, Card, Table, Modal, message } from "antd";
import { formateDate } from "../../utils/dateUtils";
import LinkButton from "../../components/link-button";
import { PAGE_SIZE } from "../../utils/constants";
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from "../../api";
import UserForm from "./user-form";
export default class User extends Component {
  state = {
    users: [],
    isShow: false,
    roles: [],
  };
  initColumns = () => {
    this.columns = [
      { title: "用户名", dataIndex: "username" },
      { title: "邮箱", dataIndex: "email" },
      { title: "电话", dataIndex: "phone" },
      { title: "注册时间", dataIndex: "create_time", render: formateDate },
      {
        title: "所属角色",
        dataIndex: "role_id",
        render: (role_id) => this.roleNames[role_id],
      },
      {
        title: "操作",
        render: (user) => (
          <span>
            <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
            <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
          </span>
        ),
      },
    ];
  };
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name;
      return pre;
    }, {});
    this.roleNames = roleNames;
  };
  deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗？`,
      onOk: async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          message.success("删除用户成功！");
          this.getUsers();
        }
      },
    });
  };
  showAdd = () => {
    this.user = null;
    this.setState({ isShow: true });
  };
  /*
  显示修改界面
  */

  showUpdate = (user) => {
    this.user = user; // 保存user
    this.setState({ isShow: true });
  };
  /*
   添加或者更新用户
  */
  addOrUpdateUser = async () => {
    this.setState({ isShow: false });
    // 1.收集数据
    const user = this.form.getFieldsValue();
    // 如果是更新需要给user指定下划线id属性
    if (this.user && this.user._id) {
      user._id = this.user._id;
    }
    this.form.resetFields();
    // 2.提交
    const result = await reqAddOrUpdateUser(user);
    // 3.更新列表显示
    if (result.status === 0) {
      message.success(`${this.user ? "修改" : "添加"}用户成功`);
      this.getUsers();
    }
  };
  getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      const { users, roles } = result.data;
      this.initRoleNames(roles);
      this.setState({
        users,
        roles,
      });
    }
  };
  componentDidMount() {
    this.getUsers();
  }
  componentWillMount() {
    this.initColumns();
  }
  render() {
    const { users, isShow, roles } = this.state;
    const user = this.user || {};

    const titile = (
      <Button type="primary" onClick={this.showAdd}>
        创建用户
      </Button>
    );
    return (
      <Card title={titile}>
        <Table
          rowKey="_id"
          bordered
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
          dataSource={users}
        />

        <Modal
          title={user._id ? "修改用户" : "添加用户"}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={() => {
            this.form.resetFields();
            this.setState({ isShow: false });
          }}
        >
          <UserForm
            roles={roles}
            setForm={(form) => (this.form = form)}
            user={user}
          />
        </Modal>
      </Card>
    );
  }
}
