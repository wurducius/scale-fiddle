import { FiddleState } from "../types";
import { mod, trimWhitespace } from "../util";
import { initModify, outputScale } from "./sheen-util";

export const modifyTranspose = (state: FiddleState, t: number) => {
  const centsScale = initModify(state);

  const result: number[] = centsScale.map((tone: number) => tone + t);

  return outputScale(state, result);
};

export const modifyMode = (state: FiddleState, index: number) => {
  const centsScale = initModify(state);

  const result: number[] = centsScale.map(
    (tone: number) => tone - centsScale[0]
  );

  return outputScale(state, result);
};

export const modifySubscale = (state: FiddleState, subscale: string) => {
  const centsScale = initModify(state);

  const parsedSubscale = subscale.split(",").map(trimWhitespace);

  const result = [0];
  let accumulator = 0;
  for (let i = 0; i < parsedSubscale.length - 1; i++) {
    const offset = accumulator + Number(parsedSubscale[i]);
    result.push(centsScale[offset - 1]);
    accumulator = offset;
  }

  return outputScale(state, result);
};

export const modifyMultiply = (state: FiddleState, multiplier: number) => {
  const centsScale = initModify(state);

  const result = centsScale.map((tone: number) =>
    mod(tone, 1200) === 0 ? tone : tone * multiplier
  );

  return outputScale(state, result);
};

export const modifyReverse = (state: FiddleState) => {
  const centsScale = initModify(state);

  const result = [0];
  for (let i = 0; i < centsScale.length; i++) {
    result.push(1200 - centsScale[centsScale.length - 1 - i]);
  }

  return outputScale(state, result);
};

export const modifySort = (state: FiddleState) => {
  const centsScale = initModify(state);
  return outputScale(state, centsScale);
};

export const modifyStretch = (state: FiddleState, multiplier: number) => {
  const centsScale = initModify(state);

  const result = centsScale.map((tone: number) =>
    mod(tone, 1200) === 0 ? tone : tone * multiplier
  );

  return outputScale(state, result);
};

export const modifyApproxEqual = (state: FiddleState, N: number) => {
  const centsScale = initModify(state);

  const equal = Array.from({ length: N }).map((n, i) => (i * 1200) / N);
  const result = centsScale.map((tone: number) => {
    let delta = Number.POSITIVE_INFINITY;
    let deltaIndex = undefined;
    for (let i = 0; i < equal.length; i++) {
      const thisDelta = Math.abs(tone - equal[i]);
      const thisReverseDelta = Math.abs(1200 - tone + equal[i]);
      if (thisDelta < delta) {
        delta = thisDelta;
        deltaIndex = i;
      }
      if (thisReverseDelta < delta) {
        delta = thisReverseDelta;
        deltaIndex = i;
      }
    }
    return deltaIndex != undefined ? equal[deltaIndex] : 0;
  });

  return outputScale(state, result);
};
