import React, { Component } from "react";
import { Card, Icon, List } from "antd";
import LinkButtom from "../../components/link-button";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../../api/index";
import "./product.less";
const Item = List.Item;
class ProductDetail extends Component {
  state = {
    cName1: "", // 一级分类名称
    cName2: "", // 二级分类名称
  };
  // 得到当前商品的分类ID
  async componentDidMount() {
    const { pCategoryId, categoryId } = this.props.location.state.product;
    if (pCategoryId === "0") {
      // 一级分类下的商品
      const result = await reqCategory(categoryId);
      const cName1 = result.data.name;
      this.setState({ cName1 });
    } else {
      // 二级分类下分类商品名称
      // const result1 = await reqCategory(pCategoryId);
      // const result2 = await reqCategory(categoryId);
      // const cName1 = result1.data.name;
      // const cName2 = result2.data.name;
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({ cName1, cName2 });
    }
  }
  render() {
    const {
      name,
      desc,
      price,
      imgs,
      detail,
    } = this.props.location.state.product;
    const { cName1, cName2 } = this.state;
    const title = (
      <span>
        <LinkButtom>
          <Icon
            type="arrow-left"
            style={{ marginRight: 10, fontSize: 20 }}
            onClick={() => this.props.history.goBack()}
          />
        </LinkButtom>
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title} className="product-detail">
        <List>
          <Item>
            <span className="left">商品名称：</span>
            <span className="right">{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述: </span>
            <span className="right">{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格: </span>
            <span className="right">{price}元</span>
          </Item>
          <Item>
            <span className="left">所属分类: </span>
            <span className="right">
              {cName1} {cName2 ? "-->" + cName2 : ""}
            </span>
          </Item>
          <Item>
            <span className="left">商品图片: </span>
            <span className="right">
              {imgs.map((img) => (
                <img
                  className="product-img"
                  src={BASE_IMG_URL + img}
                  alt="img"
                  key={img}
                ></img>
              ))}
            </span>
          </Item>
          <Item>
            <span className="left">商品详情: </span>
            <span
              dangerouslySetInnerHTML={{
                __html: detail,
              }}
            ></span>
          </Item>
        </List>
      </Card>
    );
  }
}

export default ProductDetail;
