import React, { Component } from "react";
import { Card, Form, Input, Cascader, Upload, Button, Icon } from "antd";
import LinkButtom from "../../components/link-button";
import { reqCategorys } from "../../api";
import { number } from "prop-types";
const { Item } = Form;
const { TextArea } = Input;

class ProductAddUpdate extends Component {
  state = { options: [] };
  initOptions = (categorys) => {
    // 根据categorys，生成options数组。
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));
    // 更新options状态
    this.setState({ options });
  };
  /*
  异步获取一级/二级分类列表，并显示
   */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      this.initOptions(categorys);
    }
  };

  /*
  自定义验证价格函数
  */
  validatePrice = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback(); // 验证通过
    } else {
      callback("价格必须大于0");
    }
    // callback()  没穿参数，验证成功
    // callback('价格必须大于0')
  };
  /*
  加载下一一级列表的回掉函数
  */
  loadDate = (selectedOptions) => {
    const targetOption = selectedOptions[0];
    // 显示loading效果
    targetOption.loading = true;
  };
  submit = () => {
    // 整体的进行表单验证，如果通过了才发送请请求
    this.props.form.validateFields((error, value) => {
      if (!error) {
        alert("发送ajax请求");
      }
    });
  };
  componentDidMount() {
    this.getCategorys("0");
  }
  render() {
    const formItemLayout = {
      labelCol: { span: 2 }, // 左侧label宽度
      wrapperCol: { span: 8 }, // 指定右侧包裹的宽度
    };
    const title = (
      <span>
        <LinkButtom>
          <Icon type="arrow-left" style={{ fontSize: 20 }} />
          <span>添加商品</span>
        </LinkButtom>
      </span>
    );
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称:">
            {getFieldDecorator("name", {
              initialValue: "",
              rules: [{ required: true, message: "必须输入商品名称" }],
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述:">
            {getFieldDecorator("desc", {
              initialValue: "",
              rules: [{ required: true, message: "必须输入商品名描述" }],
            })(
              <TextArea
                placeholder="请输入商品描述"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Item>
          <Item label="商品价格:">
            {getFieldDecorator("price", {
              initialValue: "",
              rules: [
                { required: true, message: "必须输入商品价格" },
                {
                  validator: this.validatePrice,
                },
              ],
            })(
              <Input type="number" placeholder="请输入价格" addonAfter="元" />
            )}
          </Item>
          <Item label="商品分类:">
            {getFieldDecorator("categoryIds", {
              initialValue: null,
              rules: [
                {
                  required: true,
                  message: "必须指定商品分类",
                },
              ],
            })(
              <Cascader
                placeholder="请指定商品分类"
                options={this.state.options}
                loadData={this.loadDate}
              />
            )}
          </Item>
          <Item label="商品图片:">
            <div>商品图片</div>
          </Item>
          <Item label="商品详情:">
            <div>商品详情</div>
          </Item>
          <Item>
            <Button type="primary" onClick={this.submit}>
              提交
            </Button>
          </Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(ProductAddUpdate);
