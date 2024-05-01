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

export const validateIsRequired = (val: number) => {
  if (!val) {
    return "Please specify a value.";
  } else {
    return true;
  }
};
