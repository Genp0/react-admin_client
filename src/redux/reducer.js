import { combineReducers } from "redux";
import storageUtils from "../utils/storageUtils";
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER,
} from "./action-types";
/* 用来管理头部标题的reducer */
const initHeadTitle = "首页";
export function headTitle(state = initHeadTitle, action) {
  switch (action.type) {
    case SET_HEAD_TITLE:
      return action.data;
    default:
      return state;
  }
}
/* 管理当前登录用户 */
const initUser = storageUtils.getUser();
export function user(state = initUser, action) {
  switch (action.type) {
    case RESET_USER:
      return {};
    case RECEIVE_USER:
      return action.user;
    case SHOW_ERROR_MSG:
      const errorMsg = action.errorMsg;
      return { ...state, errorMsg }; /* 不要直接修改原本的状态数据 */
    default:
      return state;
  }
}
/* 
向外暴露的是合并产生的总的reducer函数
管理的总的state是结构
 */

export default combineReducers({ user, headTitle });
