import React, { Component } from "react";
import { reqCategory, reqAddCategory, reqUpdateCategory } from "../../api";
import { Card, Table, Button, Icon, Modal, message } from "antd";
import LinkButton from "../../components/link-button";
export default class Category extends Component {
  state = {
    categorys: [], //一级分类列表
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
      render: () => (
        <span>
          <LinkButton>修改分类</LinkButton>
          <LinkButton>查看子分类</LinkButton>
        </span>
      ),
    },
  ];

  getCategory = async () => {
    let result = await reqCategory("0");
    if (result.status === 0) {
      const categorys = result.data;
      this.setState({ categorys });
    } else {
      message.error("获取分类列表失败");
    }
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
    const { categorys } = this.state;
    // Card的左侧
    const title = "一级分类列表";
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
            dataSource={categorys}
            columns={this.columns}
          />
          ;
        </Card>
      </div>
    );
  }
}
