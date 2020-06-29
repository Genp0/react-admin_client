import React, { Component } from "react";
import { Form, Input, Button, Icon } from "antd";
import "./login.less";
import logo from "./images/logo.png";

/*
登陆路由组件
*/
export default class Login extends Component {
  handleSubmit = (event) => {};
  render() {
    return (
      <div className="login">
        <header className="login-header">
          <img src={logo} alt="" />
          <h1>React项目：后台系统管理</h1>
        </header>
        <section className="login-content">
          <h2>用户登录</h2>
          <Form
            onSubmit={this.handleSubmit}
            name="normal_login"
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25" }} />
                }
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                type="password"
                placeholder="Password"
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25" }} />
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}
