import { onlyUnique } from "../util";
import { normalizePeriod } from "./sheen";

type IntervalRecord = { interval: number; count: number };

const intervalNorm = (interval: number) => {
  const justIntervals = Array.from({ length: 10 })
    .map((tone, i) => [
      normalizePeriod(Math.pow(3, i), 2),
      normalizePeriod(Math.pow(3, -i), 2),
    ])
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
