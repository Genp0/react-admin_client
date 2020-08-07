/*
包含应用中所有接口请求函数模块
*/

import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
const BASE = "";
export const reqLogin = (username, password) =>
  ajax(BASE + "/login", { username, password }, "POST");

export const reqAddUser = (user) =>
  ajax(BASE + "/manager/user/add", user, "POST");

export const reqCategory = (parentId) =>
  ajax(BASE + "/manage/category/list", { parentId });

export const reqAddCategory = (categoryName, parentId) =>
  ajax(BASE + "/manage/category/add", { categoryName, parentId }, "POST");

export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax(BASE + "/manage/category/update", { categoryId, categoryName }, "POST");

// 获取商品分页列表
export const reqProducets = (pageNum, pageSize) =>
  ajax(BASE + "/manage/product/list", { pageNum, pageSize });
/*
 搜索商品分页列表
 searchType:搜索的类型，productName，ProductDesc
 */
export const reqSearchProduct = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax(BASE + "/manage/product/search", {
    pageNum,
    pageSize,
    searchType,
    [searchType]: searchName,
  });

export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    // 发送jsonp请求
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === "success") {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0];
        resolve({ dayPictureUrl, weather });
      } else {
        message.error("获取天气失败");
      }
    });
  });
};
