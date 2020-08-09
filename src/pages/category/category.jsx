import React, { Component } from "react";
import { reqCategorys, reqAddCategory, reqUpdateCategory } from "../../api";
import { Card, Table, Button, Icon, Modal, message } from "antd";
import LinkButton from "../../components/link-button";
import AddForm from "./add-form";
import UpdateForm from "./update-form";
export default class Category extends Component {
  state = {
    categorys: [], //一级分类列表
    loading: false,
    parentID: "0", // 当前需要显示的分类列表的parentId
    parentName: "", // 分类名称
    subCategorys: [], // 二级分类列表
    showStatus: 0,
  };
  /*
  初始化所有列的数组
  */
  initColumn = () => [
    {
      title: "分类名称",
      dataIndex: "name",
    },
    {
      title: "操作",
      width: 300,
      dataIndex: "",
      render: (category) => (
        <span>
          <LinkButton onClick={() => this.showUpdate(category)}>
            修改分类
          </LinkButton>
          {this.state.parentID === "0" ? (
            <LinkButton
              onClick={() => {
                this.showSubCategory(category);
              }}
            >
              查看子分类
            </LinkButton>
          ) : null}
        </span>
      ),
    },
  ];

  getCategory = async (parentId) => {
    this.setState({ loading: true });
    parentId = parentId || this.state.parentID;
    let result = await reqCategorys(parentId);
    this.setState({ loading: false });
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        this.setState({ categorys });
      } else {
        this.setState({
          subCategorys: categorys,
        });
      }
    } else {
      message.error("获取分类列表失败");
    }
  };
  showSubCategory = async (category) => {
    this.setState(
      {
        parentID: category._id,
        parentName: category.name,
      },
      () => {
        this.getCategory();
      }
    );
  };
  showCategorys = () => {
    this.setState({
      parentID: "0",
      parentName: "",
      subCategorys: [],
    });
  };
  handleCancel = () => {
    // 清除数据
    this.form.resetFields();
    this.setState({ showStatus: 0 });
  };
  updateCategory = () => {
    // 先要进行表单验证，只有通过了才处理。
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 1.隐藏确定框
        this.setState({
          showStatus: 0,
        });
        // 准备数据
        const categoryId = this.category._id;
        const { categoryName } = values;
        this.form.resetFields();

        // 2.发请求更新分类

        const result = await reqUpdateCategory({ categoryId, categoryName });
        if (result.status === 0) {
          // 3.重新显示列表
          console.log("成功了");
          this.getCategory();
        }
      }
    });
  };
  showUpdate = (category) => {
    this.category = category;
    this.setState({
      showStatus: 2,
    });
  };
  addCategory = async () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        // 隐藏确认框
        this.setState({ showStatus: 0 });
        // 收集数据并提交分类请求
        const { parentId, categoryName } = this.form.getFieldsValue();
        this.form.resetFields();
        let result = await reqAddCategory(categoryName, parentId);
        if (result.status === 0) {
          // 添加的分类就是当前分类列表
          if (parentId === this.state.parentID) {
            // 重新获取当前分类列表
            this.getCategory();
          } else {
            this.getCategory("0");
          }
        }
        //重新获取分类列表显示
        this.getCategory();
      }
    });
  };
  showAdd = () => {
    this.setState({ showStatus: 1 });
  };
  componentWillMount() {
    this.columns = this.initColumn();
  }
  componentDidMount() {
    /*
    为第一次render（）准备数据
  */
    this.getCategory();
  }
  render() {
    const {
      categorys,
      loading,
      parentID,
      subCategorys,
      parentName,
      showStatus,
    } = this.state;
    const category = this.category || {};
    // Card的左侧
    const title =
      parentID === "0" ? (
        "一级分类列表"
      ) : (
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
          <Icon type="arrow-right" style={{ marginRight: 5 }}></Icon>
          <span>{parentName}</span>
        </span>
      );
    // Card的右侧
    const extra = (
      <Button type="primary" onClick={this.showAdd}>
        <Icon type="plus" />
        添加
      </Button>
    );

    return (
      <div>
        <Card title={title} extra={extra} style={{ width: "100%" }}>
          <Table
            rowKey="_id"
            bordered
            dataSource={parentID === "0" ? categorys : subCategorys}
            columns={this.columns}
            loading={loading}
            pagination={{ defaultPageSize: 5, showQuickJumper: true }}
          />
        </Card>
        <Modal
          title="更新分类"
          visible={showStatus === 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm
            categoryName={category.name}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>
        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            parentId={parentID}
            categorys={categorys}
            setForm={(form) => (this.form = form)}
          />
        </Modal>
      </div>
    );
  }
}
