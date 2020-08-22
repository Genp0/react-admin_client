import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import store from "./redux/store";
ReactDOM.render(<App store={store} />, document.getElementById("root"));

store.subscribe(() => {
  /* store内部的状态数据发生改变毁掉 */
  // 重新渲染app
  ReactDOM.render(<App store={store} />, document.getElementById("root"));
});
