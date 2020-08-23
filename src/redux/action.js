/* 
包含n个action creator函数的模块 
同步action：对象{type:'xxx',data:数据值}
异步action：函数 disptach=>{}
*/
import { reqLogin } from "../api";
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER,
} from "./action-types";
import storageUtils from "../utils/storageUtils";
export const setHeadTitle = (headTitle) => ({
  type: SET_HEAD_TITLE,
  data: headTitle,
});
/* 接收用户信息的同步action */
export const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user,
});
/*  显示错误信息的同步action */
export const showErrorMsg = (errorMsg) => ({
  type: SHOW_ERROR_MSG,
  errorMsg,
});
/* 实现登录的异步action */
export const login = (username, password) => {
  return async (dispatch) => {
    // 1. 执行异步ajax请求
    const result = await reqLogin(username, password); // {status:0,data:user}{status:1,msg:'xxx}
    if (result.status === 0) {
      // 2.1 如果成功了，分发成功的action
      const user = result.data;
      // 保存到local
      storageUtils.saveUser(user);
      /* 分发接收用户的同步action */
      dispatch(receiveUser(user));
    } else {
      const msg = result.msg;
      // 2.12如果成功了，分发失败的action
      dispatch(showErrorMsg(msg));
    }
  };
};

/* 退出登录的同步action */
export const logout = () => {
  // 删除local中的user
  storageUtils.removeUser();
  // 返回action
  return { type: RESET_USER };
};
