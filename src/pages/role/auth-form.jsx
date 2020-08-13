import React, { Component } from "react";
import { Form, Tree, Input } from "antd";
import PropTypes from "prop-types";
const Item = Form.Item;
class AuthForm extends Component {
  static propTypes = {
    role: PropTypes.object,
  };
  render() {
    const { role } = this.props;
    // 制定Item布局
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 15 },
    };
    return (
      <Form>
        <Item label="角色名称" {...formItemLayout}>
          <Input value={role.name} />
        </Item>
      </Form>
    );
  }
}
export default AuthForm;
