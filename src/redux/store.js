/* 
redux最核心的管理对象“store 
*/
import { createStore } from "redux";
import reducer from "./reducer";
export default createStore(reducer);
