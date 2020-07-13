import React, { Component } from "react";
import { reqCategory, reqAddCategory, reqUpdateCategory } from "../../api";
import { Card, Table, Button, Icon, Modal, message } from "antd";
import LinkButton from "../../components/link-button";
export default class Category extends Component {
  state = {
    categorys: [], //一级分类列表
    loading: false,
    parentID: "0", // 当前需要显示的分类列表的parentId
    parentName: "", // 分类名称
    subCategorys: [], // 二级分类列表
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
          <LinkButton>修改分类</LinkButton>
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

  getCategory = async () => {
    this.setState({ loading: true });
    const { parentID } = this.state;
    let result = await reqCategory(parentID);
    this.setState({ loading: false });
    if (result.status === 0) {
      const categorys = result.data;
      if (parentID === "0") {
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
    } = this.state;
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
      <Button type="primary">
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
      </div>
    );
  }
}
