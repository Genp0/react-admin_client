/*
进行local数据存储管理的工具模块
*/
export default {
  /*
    保存User
   */
  saveUser(user) {
    localStorage.setItem("user_key", JSON.stringify(user));
  },
  /*
    读取User
   */
  getUser() {
    return localStorage.getItem("user_key" || "{}");
  },
  /*
    删除User
   */
};
