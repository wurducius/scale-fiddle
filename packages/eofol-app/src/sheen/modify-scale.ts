import { FiddleState } from "../types";
import { mod, trimWhitespace } from "../util";
import { parseScala } from "./scala";
import { normalizePeriod } from "./sheen";
import { initModify, outputScale, ratioToCent } from "./sheen-util";
import { normPrimeTuning, temper } from "./tempering";

export const modifyTranspose = (state: FiddleState, t: number) => {
  const centsScale = initModify(state);

  const result: number[] = centsScale.map((tone: number) => tone + Number(t));

  return outputScale(state, result);
};

export const modifyMode = (state: FiddleState, index: number) => {
  const centsScale = initModify(state);

  const parsedIndex = mod(Number(index) - 2, centsScale.length);
  const floor = centsScale[parsedIndex];

  const result: number[] = centsScale.map((tone: number) => tone - floor);

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
  // @ts-ignore
  const periodCent = state.periodCent;

  const result = centsScale.map((tone: number) =>
    mod(tone, periodCent) === 0 ? tone : tone * multiplier
  );

  return outputScale(state, result);
};

export const modifyReverse = (state: FiddleState) => {
  const centsScale = initModify(state);
  // @ts-ignore
  const periodCent = state.periodCent;

  const result = [0];
  for (let i = 0; i < centsScale.length; i++) {
    result.push(periodCent - centsScale[centsScale.length - 1 - i]);
  }

  return outputScale(state, result);
};

export const modifySort = (state: FiddleState) => {
  const centsScale = initModify(state);
  return outputScale(state, centsScale);
};

export const modifyStretch = (state: FiddleState, multiplier: number) => {
  const centsScale = initModify(state);

  const result = centsScale.map((tone: number) => tone * multiplier);

  return outputScale(state, result);
};

export const modifyApproxEqual = (state: FiddleState, N: number) => {
  const centsScale = initModify(state);
  // @ts-ignore
  const periodCent = state.periodCent;

  const equal = Array.from({ length: N }).map((n, i) => (i * periodCent) / N);
  const result = centsScale.map((tone: number) => {
    let delta = Number.POSITIVE_INFINITY;
    let deltaIndex = undefined;
    for (let i = 0; i < equal.length; i++) {
      const thisDelta = Math.abs(tone - equal[i]);
      const thisReverseDelta = Math.abs(periodCent - tone + equal[i]);
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

export const modifyTemper = (
  state: FiddleState,
  commas: string,
  epsilon: number
) => {
  const centsScale = initModify(state);
  const result = temper(state, centsScale, commas, epsilon);
  return outputScale(state, result);
};
