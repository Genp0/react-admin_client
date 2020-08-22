import {
  INCREMENT,
  DECREMENT,
  INCREMENTASYNC,
  INCREMENTIFODD,
} from "./action-type";

export const increment = (number) => ({ type: INCREMENT, data: number });
export const decrement = (number) => ({ type: DECREMENT, data: number });
