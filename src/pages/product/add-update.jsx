import React, { Component } from "react";
import { Card, Form, Input, Cascader, Upload, Button, Icon } from "antd";
import LinkButtom from "../../components/link-button";
import PicturesWall from "./pictures-wall";
import { reqCategorys } from "../../api";
const { Item } = Form;
const { TextArea } = Input;

class ProductAddUpdate extends Component {
  state = { options: [] };
  initOptions = async (categorys) => {
    // 根据categorys，生成options数组。
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false,
    }));

    // 如果是一个二级分类的商品更新
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );
      // 关联到对应的一级option上去
      targetOption.children = childOptions;
    }
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
      // 如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys);
      } else {
        // 二级列表
        console.log(categorys);
        return categorys; // 返回二级列表，当前async函数promise成功，value为categorys
      }
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
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    // 显示loading效果
    targetOption.loading = true;

    // 根据选中的分类，请求获取下二级分类列表
    // async 函数的返回值是一个新的Promise对象,Promise的结果和值，由async的结果决定
    const subCategorys = await this.getCategorys(targetOption.value);
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const chiildOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 关联到当前options上
      targetOption.children = chiildOptions;
    } else {
      // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }
    this.setState({
      options: [...this.state.options],
    });
  };

  submit = () => {
    // 整体的进行表单验证，如果通过了才发送请请求
    this.props.form.validateFields((error, value) => {
      if (!error) {
        console.log(value);
        alert("发送ajax请求");
      }
    });
  };
  componentDidMount() {
    this.getCategorys("0");
  }
  componentWillMount() {
    // 取出携带的state
    const product = this.props.location.state; // 如果是添加没有值，否则是有值
    this.isUpdate = !!product;
    // 保存商品（如果没有，保存的是一个{}}
    this.product = product || {};
  }
  render() {
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId } = product;
    // 用来接收级联分类ID的数组
    const categoryIds = [];
    if (isUpdate) {
      // 商品是1级分类的商品
      // 商品是2级分类的商品
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
      } else {
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }
    const formItemLayout = {
      labelCol: { span: 2 }, // 左侧label宽度
      wrapperCol: { span: 8 }, // 指定右侧包裹的宽度
    };
    const title = (
      <span>
        <LinkButtom onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{ fontSize: 20 }} />
          <span>{isUpdate ? "修改商品" : "添加商品"}</span>
        </LinkButtom>
      </span>
    );
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title={title}>
        <Form {...formItemLayout}>
          <Item label="商品名称:">
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [{ required: true, message: "必须输入商品名称" }],
            })(<Input placeholder="请输入商品名称" />)}
          </Item>
          <Item label="商品描述:">
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [{ required: true, message: "必须输入商品名描述" }],
            })(
              <TextArea
                placeholder="请输入商品描述"
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Item>
          <Item label="商品价格:">
            {getFieldDecorator("price", {
              initialValue: product.price,
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
              initialValue: categoryIds,
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
                loadData={this.loadData}
              />
            )}
          </Item>
          <Item label="商品图片:">
            <PicturesWall />
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
