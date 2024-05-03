import { EDO_N_MAX, STEPS_UP_DOWN_MAX } from "../data";

export const validateIsNumber = (val: number) => {
  const parsedVal = Number(val);
  if (!Number.isFinite(parsedVal) || Number.isNaN(parsedVal)) {
    return "Please specify a valid number.";
  } else {
    return true;
  }
};

export const validateIsInteger = (val: number) => {
  const parsedVal = Number(val);
  if (!Number.isInteger(parsedVal)) {
    return "Please specify an integer.";
  } else {
    return true;
  }
};

export const validateIsOverMin = (min: number) => (val: number) => {
  const parsedVal = Number(val);
  if (parsedVal < min) {
    return "Please specify a number greater or equal to " + min + ".";
  } else {
    return true;
  }
};

export const validateIsUnderMax = (max: number) => (val: number) => {
  const parsedVal = Number(val);
  if (parsedVal > max) {
    return "Please specify a number lesser or equal to " + max + ".";
  } else {
    return true;
  }
};

export const validateIsPositive = (val: number) => {
  const parsedVal = Number(val);
  if (parsedVal <= 0) {
    return "Please specify a positive number.";
  } else {
    return true;
  }
};

export const validateIsRequired = (val: number) => {
  if (!val) {
    return "Please specify a value.";
  } else {
    return true;
  }
};

export const integerValidation = (min: number, max: number) => [
  validateIsRequired,
  validateIsNumber,
  validateIsInteger,
  validateIsOverMin(min),
  validateIsUnderMax(max),
];

export const scaleNValidation = integerValidation(1, EDO_N_MAX);

export const stepsValidation = integerValidation(0, STEPS_UP_DOWN_MAX);

export const decimalValidation = (min: number, max: number) => [
  validateIsRequired,
  validateIsNumber,
  validateIsOverMin(min),
  validateIsUnderMax(max),
];

export const decimalPositiveValidation = (max: number) => [
  validateIsRequired,
  validateIsNumber,
  validateIsPositive,
  validateIsUnderMax(max),
];

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
