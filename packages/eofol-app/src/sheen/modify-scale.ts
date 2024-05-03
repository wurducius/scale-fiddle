import { FiddleState } from "../types";
import { mod, trimWhitespace } from "../util";
import { parseScala } from "./scala";
import { normalizePeriod } from "./sheen";
import { initModify, outputScale } from "./sheen-util";
import { normPrimeTuning } from "./tempering";

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

export const modifyTemper = (
  state: FiddleState,
  commas: string,
  epsilon: number
) => {
  const centsScale = initModify(state);

  const parsedCommas = commas
    .split(",")
    .map(trimWhitespace)
    // @ts-ignore
    .map(parseScala(state)) // @ts-ignore
    .map((tone) => normalizePeriod(tone, state.tuning.period))
    .map((c) => 1200 * Math.log2(c));

  const result: number[] = [];
  const closePairs: number[][] = [];
  for (let i = 0; i < centsScale.length; i++) {
    const first = centsScale[i];
    const second = centsScale[mod(i + 1, centsScale.length)];
    const deltaForward = Math.abs(second - first);
    const deltaBackward = 1200 - deltaForward;

    let isTemperedOut = undefined;
    for (let j = 0; j < parsedCommas.length; j++) {
      if (
        Math.abs(deltaForward - parsedCommas[j]) < epsilon ||
        Math.abs(deltaBackward - parsedCommas[j]) < epsilon
      ) {
        isTemperedOut = parsedCommas[j];
        break;
      }
    }

    if (isTemperedOut) {
      closePairs.push([first, second]);
      result.push(mod(first, 1200) === 0 ? first : second);
    } else {
      result.push(second);
    }
  }

  const resolvedPairs = closePairs.reduce((acc, next) => {
    if (acc.includes(next[0])) {
      return [...acc, next[1]];
    }
    if (acc.includes(next[1])) {
      return [...acc, next[0]];
    }

    if (mod(next[0], 1200) === 0) {
      return [...acc, next[1]];
    }
    if (mod(next[1], 1200) === 0) {
      return [...acc, next[0]];
    }

    const firstNextScale = centsScale.filter((x: number) => x != next[0]);
    const secondNextScale = centsScale.filter((x: number) => x != next[1]);

    const firstNorm = normPrimeTuning(firstNextScale);
    const secondNorm = normPrimeTuning(secondNextScale);

    const isFirstNormLesser = firstNorm < secondNorm;

    return [...acc, next[isFirstNormLesser ? 0 : 1]];
  }, []);

  const resultx = centsScale.filter((c: number) => !resolvedPairs.includes(c));

  return outputScale(state, resultx);
};
