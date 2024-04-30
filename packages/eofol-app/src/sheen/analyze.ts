import { FiddleState } from "../types";
import { parseScala } from "./scala";
import { normalizePeriod } from "./sheen";

const INTERVAL_COMPARE_EPSILON = 0.15;

export const getIntervalVectorData = (state: FiddleState) => {
  // @ts-ignore
  const decimalDigitsCent = state.options.decimalDigitsCent;
  // @ts-ignore
  const scaleLength = state.scaleLength;
  // @ts-ignore
  const scaleValues = state.scaleInput.split("\n");
  // @ts-ignore
  const parser = parseScala(state);
  // @ts-ignore
  const scaleVals = state.scaleInput
    .split("\n")
    .map(parser)
    .map((tone: number) => 1200 * Math.log2(tone));

  const intervalVectorLength = (scaleLength * (scaleLength - 1)) / 2;

  const intervalMatrix = [];
  for (let i = 0; i < scaleLength; i++) {
    for (let j = i + 1; j < scaleLength; j++) {
      const deltaForward = Math.abs(scaleVals[i] - scaleVals[j]);
      const deltaBackward = Math.abs(1200 - deltaForward);
      const deltaMin = Math.min(deltaForward, deltaBackward);
      intervalMatrix.push({
        i,
        j,
        interval: deltaMin.toFixed(decimalDigitsCent),
      });
    }
  }

  const intervalTypes = intervalMatrix
    // @ts-ignore
    .reduce((acc, next) => {
      // @ts-ignore
      const thisIntervalIndex = acc.findIndex(
        // @ts-ignore
        (x) => Math.abs(x.interval - next.interval) < INTERVAL_COMPARE_EPSILON
      );
      if (thisIntervalIndex != -1) {
        const result = acc;
        // @ts-ignore
        acc[thisIntervalIndex] = {
          // @ts-ignore
          ...acc[thisIntervalIndex],
          // @ts-ignore
          count: acc[thisIntervalIndex].count + 1,
        };
        return result;
      } else {
        // @ts-ignore
        return [...acc, { interval: next.interval, count: 1 }];
      }
    }, []) // @ts-ignore
    .map((tone) => ({ ...tone, interval: Number(tone.interval) }))
    .sort((a: any, b: any) => a.interval - b.interval)
    .map((tone: any) => ({
      ...tone,
      interval: tone.interval.toFixed(decimalDigitsCent),
    }));

  let isDeepScale = true;
  const deepScaleCheck: number[] = [];
  for (let i = 0; i < intervalTypes.length; i++) {
    const count = intervalTypes[i].count;
    if (deepScaleCheck.includes(count)) {
      isDeepScale = false;
      break;
    } else {
      deepScaleCheck.push(count);
    }
  }

  const intervalSpectrum = intervalMatrix.reduce((acc, next) => {
    const index = Math.abs(next.i - next.j);
    if (index > scaleLength / 2) {
      return acc;
    }

    const includesApprox = (list: number[], itemToCompare: number) => {
      let isIncluded = false;
      for (let i = 0; i < list.length; i++) {
        const listItem = list[i];
        if (Math.abs(listItem - itemToCompare) < INTERVAL_COMPARE_EPSILON) {
          isIncluded = true;
          break;
        }
      }
      return isIncluded;
    };

    const nextAcc = acc;
    const last = nextAcc[index - 1];
    if (Array.isArray(last)) {
      // @ts-ignore
      if (!includesApprox(last, next.interval)) {
        // @ts-ignore
        last.push(next.interval);

        const sortedLast = last // @ts-ignore
          .map((tone) => Number(tone)) // @ts-ignore
          .sort((a, b) => a - b) // @ts-ignore
          .map((tone) => tone.toFixed(state.options.decimalDigitsCent));
        // @ts-ignore
        nextAcc[index - 1] = sortedLast;
      }
    } else {
      // @ts-ignore
      nextAcc[index - 1] = [next.interval];
    }
    return nextAcc;
  }, []);

  const isMyhillsProperty = intervalSpectrum.reduce(
    // @ts-ignore
    (acc, next) => acc && next.length <= 2,
    true
  );

  let isMaximallyPeriodic = true;
  for (let i = 0; i < intervalSpectrum.length; i++) {
    // @ts-ignore
    if (intervalSpectrum[i].length > 1) {
      isMaximallyPeriodic = false;
      break;
    }
  }

  // @TODO
  const period = scaleLength;

  const isPeriodic = scaleLength > period;

  return {
    scaleLength,
    scaleValues,
    intervalMatrix,
    intervalTypes,
    intervalVectorLength,
    isDeepScale,
    intervalSpectrum,
    isMyhillsProperty,
    isPeriodic,
    isMaximallyPeriodic,
    period,
  };
};
