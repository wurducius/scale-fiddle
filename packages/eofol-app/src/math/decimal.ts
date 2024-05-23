import Decimal from "decimal.js-light";
import { MATH_DECIMAL_PRECISION } from "../data";

export const initDecimal = () => {
  Decimal.set({ precision: MATH_DECIMAL_PRECISION });
};
