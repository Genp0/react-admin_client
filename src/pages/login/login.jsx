import React, { Component } from "react";
import { Form, Input, Button, Icon, message } from "antd";
import "./login.less";
import logo from "./images/logo.png";
import { reqLogin } from "../../api/index";
import memoryUtils from "../../utils/memoryUtils";

/*
登陆路由组件
*/
class Login extends Component {
  handleSubmit = (event) => {
    event.preventDefault();
    const { validateFields } = this.props.form;
    validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values;
        const result = await reqLogin(username, password);
        if (result.status === 0) {
          message.success("登录成功");
          memoryUtils.user = result.data;
          this.props.history.replace("/");
        } else {
          message.error(result.msg);
        }
      } else {
        console.log("校验失败");
      }
    });
  };
  /*
    对密码进行自定义验证
  */
  validatePwd = (rule, value, callback) => {
    if (!value) {
      callback("必须输入密码");
    } else if (value.length < 4) {
      callback("密码长度不能小于4位");
    } else if (value.length > 12) {
      callback("密码的长度不能大于12位");
    } else if (!/^[a-zA-Z0-9_ ]+$/.test(value)) {
      callback("必以数字或者字母、下划线组成");
    } else {
      callback();
    }
  };
  render() {
    const { Item } = Form;
    const { getFieldDecorator } = this.props.form;
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
            <Item name="username">
              {getFieldDecorator("username", {
                initialValue: "admin",
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "请输入用户名!",
                  },
                  { min: 4, message: "用户名至少4位" },
                  { max: 12, message: "用户名至多12位" },
                  {
                    pattern: /^[a-zA-Z0-9_ ]+$/,
                    message: "用户名必须是英文，数字或者下划线组成",
                  },
                ],
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25" }} />
                  }
                  placeholder="Username"
                />
              )}
            </Item>
            <Item name="password">
              {getFieldDecorator("password", {
                rules: [
                  {
                    validator: this.validatePwd,
                  },
                ],
              })(
                <Input
                  type="password"
                  placeholder="Password"
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25" }} />
                  }
                />
              )}
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                登录
              </Button>
            </Item>
          </Form>
        </section>
      </div>
    );
  }
}

const WrapLogin = Form.create()(Login);

export default WrapLogin;
