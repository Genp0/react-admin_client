import React, { Component } from "react";
import { connect } from "react-redux";
import Counter from "../component/Counter";
import { increment, decrement } from "../redux/action";

/*
 容器组件：通过connect包装UI组件产生组件
 connect() ：高阶函数
 connect()：返回的函数是一个高阶组件，接受一个UI组件，生成一个容器组件
 容器组件的责任：向UI组件传入特定属性
*/

function mapStateToProps(state) {
  return {
    count: state,
  };
}
function mapDispatchToprops(dispatch) {
  return {
    increment: (number) => {
      dispatch(increment(number));
    },
    decrement: (number) => {
      dispatch(decrement(number));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToprops)(Counter);
