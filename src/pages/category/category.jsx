import React, { Component } from "react";
import { Card, Table, Button, Icon, Modal } from "antd";
import LinkButton from "../../components/link-button";
export default class Category extends Component {
  render() {
    // Card的左侧
    const title = "一级分类列表";
    // Card的右侧
    const extra = (
      <Button type="primary">
        <Icon type="plus" />
        添加
      </Button>
    );
    const dataSource = [
      {
        parentId: "0",
        _id: "5f06cb3c73ddea05c29c23c5",
        name: "电脑",
        __v: 0,
      },
      {
        parentId: "0",
        _id: "5f06d14c73ddea05c29c23c6",
        name: "家用电器",
        __v: 0,
      },
    ];

    const columns = [
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
    return (
      <div>
        <Card title={title} extra={extra} style={{ width: "100%" }}>
          <Table
            rowKey="_id"
            bordered
            dataSource={dataSource}
            columns={columns}
          />
          ;
        </Card>
      </div>
    );
  }
}
