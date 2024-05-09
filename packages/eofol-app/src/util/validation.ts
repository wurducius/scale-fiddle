import { integerValidation } from "@eofol/eofol-simple";
import { EDO_N_MAX, STEPS_UP_DOWN_MAX } from "../data";

export const scaleNValidation = integerValidation(1, EDO_N_MAX);

export const stepsValidation = integerValidation(0, STEPS_UP_DOWN_MAX);

export const splitValidation =
  (splitter: string) =>
  (validationRules: ((val: any) => true | string)[]) =>
  (val: string) => {
    const parsedVal = val.split(splitter);
    let result: true | string = true;
    for (let i = 0; i < parsedVal.length; i++) {
      const thisVal = parsedVal[i];
      for (let j = 0; j < validationRules.length; j++) {
        const thisResult = validationRules[j](thisVal);
        if (thisResult !== true) {
          result = thisResult;
          break;
        }
      }
      if (result !== true) {
        break;
      }
    }
    return result;
  };

export const csvValidation = splitValidation(",");
