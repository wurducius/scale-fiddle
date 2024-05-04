import { FiddleState } from "../types";
import { mod, onlyUnique, trimWhitespace } from "../util";
import { parseScala } from "./scala";
import { normalizePeriod } from "./sheen";
import { ratioToCent, outputScale } from "./sheen-util";

type IntervalRecord = { interval: number; count: number };

const intervalNorm = (interval: number) => {
  const normalizer = normalizePeriod(2);

  const justIntervals = Array.from({ length: 10 })
    .map((tone, i) => [normalizer(Math.pow(3, i)), normalizer(Math.pow(3, -i))])
    .flat()
    .filter(onlyUnique);

  const norm = justIntervals
    .map((justInterval) =>
      Math.min(
        Math.abs(interval - justInterval),
        1200 - Math.abs(interval - justInterval)
      )
    )
    .reduce((acc, next) => (next > acc ? next : acc), 0);

  return norm;
};

export const normPrimeTuning = (scale: number[]) => {
  const intervals: IntervalRecord[] = [];
  for (let i = 0; i < scale.length; i++) {
    for (let j = i + 1; j < scale.length; j++) {
      const intervalRaw = Math.abs(scale[i] - scale[j]);
      const interval = Math.min(intervalRaw, 1200 - intervalRaw);
      const itemIndex = intervals.findIndex((x) => x.interval === interval);
      if (itemIndex === -1) {
        intervals.push({ interval, count: 1 });
      } else {
        intervals[itemIndex] = {
          interval,
          count: intervals[itemIndex].count + 1,
        };
      }
    }
  }

  const normSum = intervals.reduce(
    (acc, next) => acc + next.count * intervalNorm(next.interval),
    0
  );

  return normSum;
};

export const temper = (
  state: FiddleState,
  centsScale: number[],
  commas: string,
  epsilon: number
) => {
  // @ts-ignore
  const parser = parseScala(state);
  // @ts-ignore
  const normalizer = normalizePeriod(state.tuning.period);

  const parsedCommas = commas
    .split(",")
    .map(trimWhitespace)
    .map(parser) // @ts-ignore
    .map(normalizer)
    .map(ratioToCent);

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

  return centsScale.filter((c: number) => !resolvedPairs.includes(c));
};
