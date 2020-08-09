import React, { Component } from "react";
import { Card, Select, Button, Input, Icon, Table, message } from "antd";
import LinkButton from "../../components/link-button";
import { PAGE_SIZE } from "../../utils/constants";
import {
  reqProducets,
  reqSearchProduct,
  reqUpdateStatus,
} from "../../api/index";
const Option = Select.Option;
class Producthome extends Component {
  state = {
    total: 0,
    products: [],
    loading: false,
    searchName: "",
    searchType: "productName", // 根据哪个字段搜索
  };
  // 初始化table的列的数组
  initCoulumnns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => {
          return `¥${price}`;
        },
      },
      {
        width: 100,
        title: "状态",
        // dataIndex: "status",
        render: (product) => {
          const { status, _id } = product;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, status === 1 ? 2 : 1)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        width: 100,
        title: "操作",
        render: (product) => {
          return (
            <span>
              {/* 将product对象使用state传递给目标 */}
              <LinkButton
                onClick={() =>
                  this.props.history.push("/product/detail", { product })
                }
              >
                详情
              </LinkButton>
              <LinkButton>修改</LinkButton>
            </span>
          );
        },
      },
    ];
  };
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum让其他方法能看见
    this.setState({ loading: true });
    let result;
    const { searchName, searchType } = this.state;
    // 如果搜索关键字有值， 说明我们要做搜索分页
    if (searchName) {
      result = await reqSearchProduct({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      result = await reqProducets(pageNum, PAGE_SIZE);
    }
    this.setState({ loading: false });
    if (result.status === 0) {
      // 取出分页数据，更新分页状态，显示分页列表
      const { list, total } = result.data;
      this.setState({
        total,
        products: list,
      });
    }
  };
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    if (result.status === 0) {
      console.log("aa");
      message.success("更新商品成功");
      this.getProducts(this.pageNum);
    }
  };
  componentWillMount() {
    this.initCoulumnns();
  }
  componentDidMount() {
    this.getProducts(1);
  }

  render() {
    const { products, total, loading, searchType, searchName } = this.state;
    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={(value) => {
            this.setState({ searchType: value });
          }}
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc"> 按描述搜索</Option>
        </Select>
        <Input
          placeholder="输入一个关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={(e) => {
            this.setState({ searchName: e.target.value });
          }}
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <Button
        type="primary"
        onClick={() => this.props.history.push("/product/addupdate")}
      >
        <Icon type="plus" />
        添加商品
      </Button>
    );
    return (
      <div>
        <Card title={title} extra={extra}>
          <Table
            loading={loading}
            bordered
            rowKey="_id"
            columns={this.columns}
            dataSource={products}
            pagination={{
              total,
              defaultPageSize: PAGE_SIZE,
              showQuickJumper: true,
              onChange: this.getProducts,
            }}
          ></Table>
        </Card>
      </div>
    );
  }
}

export default Producthome;
