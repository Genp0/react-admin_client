/*
包含应用中所有接口请求函数模块
*/

import ajax from "./ajax";

export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");

export const reqAddUser = (user) => ajax("/manager/user/add", user, "POST");
