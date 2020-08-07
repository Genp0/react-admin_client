import React, { Component } from "react";
import { Button, Card, Icon, List } from "antd";
import "./product.less";
const Item = List.Item;
class ProductDetail extends Component {
  render() {
    const title = (
      <span>
        <Icon type="arrow-left" />
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="left">商品名称：</span>
            <span className="right">联想Thinkpad 翼480</span>
          </Item>
          <Item>
            <span className="left">商品描述: </span>
            <span className="right">年度重量级新品，联想Thinkpad 翼480</span>
          </Item>
          <Item>
            <span className="left">商品价格: </span>
            <span className="right">66000元</span>
          </Item>
          <Item>
            <span className="left">所属分类: </span>
            <span className="right">电脑--笔记本</span>
          </Item>
          <Item>
            <span className="left">商品图片: </span>
            <span className="right">
              <img
                className="product-img"
                src="http://localhost:5000/upload/image-1596607779276.jpg"
                alt="pic"
              />
              <img
                className="product-img"
                src="http://localhost:5000/upload/image-1596607779276.jpg"
                alt="pic"
              />
            </span>
          </Item>
          <Item>
            <span className="left">商品详情: </span>
            <span
              dangerouslySetInnerHTML={{
                __html: '<h1 style="color: red">商品详情的内容标题</h1>',
              }}
            ></span>
          </Item>
        </List>
      </Card>
    );
  }
}

export default ProductDetail;
