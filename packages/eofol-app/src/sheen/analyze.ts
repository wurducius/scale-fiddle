import { FiddleState } from "../types";
import { parseScala } from "./scala";
import {
  ratioToCent,
  sortNumbers,
  splitScale,
  toFixedCent,
} from "./sheen-util";

const INTERVAL_COMPARE_EPSILON = 0.15;

export const getIntervalVectorData = (state: FiddleState) => {
  // @ts-ignore
  const scaleLength = state.scaleLength;
  // @ts-ignore
  const scaleValues = splitScale(state.scaleInput);
  // @ts-ignore
  const parser = parseScala(state);
  // @ts-ignore
  const scaleVals = splitScale(state.scaleInput).map(parser).map(ratioToCent);
  // @ts-ignore
  const periodCent = state.periodCent;

  const intervalVectorLength = (scaleLength * (scaleLength - 1)) / 2;

  const intervalMatrix = [];
  for (let i = 0; i < scaleLength; i++) {
    for (let j = i + 1; j < scaleLength; j++) {
      const deltaForward = Math.abs(scaleVals[i] - scaleVals[j]);
      const deltaBackward = Math.abs(periodCent - deltaForward);
      const deltaMin = Math.min(deltaForward, deltaBackward);
      intervalMatrix.push({
        i,
        j,
        interval: toFixedCent(state, deltaMin),
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
      interval: toFixedCent(state, tone.interval),
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
          .map(Number) // @ts-ignore
          .sort(sortNumbers) // @ts-ignore
          .map((tone) => toFixedCent(state, tone));
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
