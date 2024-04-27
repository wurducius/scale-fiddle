import { FiddleState } from "../types";
import { mod, onlyUnique } from "../util";
import { normalizePeriod } from "./sheen";

export const linearScale = (state: FiddleState, T: number, g: number) =>
  Array.from({ length: T })
    .map((item, index) => {
      // @ts-ignore
      const centPeriod = 1200 * Math.log2(state.tuning.period);
      const val = mod(index * g, centPeriod);
      return val === 0
        ? // @ts-ignore
          centPeriod.toFixed(state.options.decimalDigitsCent)
        : // @ts-ignore
          val.toFixed(state.options.decimalDigitsCent);
    })
    .sort((a, b) => Number(a) - Number(b))
    .map((tone) => (tone.includes(".") ? tone : tone + "."))
    .filter(onlyUnique)
    .join("\n");

export const createEdo = (
  state: FiddleState,
  N: number // @ts-ignore
) => linearScale(state, N, (1200 * Math.log2(state.tuning.period)) / N);

export const createMOS = (state: FiddleState, N: number, T: number) => {
  const vals = Array.from({ length: T })
    .map((item, i) => {
      // @ts-ignore
      const periodCent = 1200 * Math.log2(state.tuning.period);
      const val = mod(
        (Math.floor(((i + 1) * N) / T) * periodCent) / N,
        periodCent
      );
      return val === 0 ? periodCent : val;
    }) // @ts-ignore
    .map((tone) => tone.toFixed(state.options.decimalDigitsCent))
    .map((tone) => (tone.includes(".") ? tone : tone + "."));
  return vals.join("\n");
};

export const createLinear = (state: FiddleState, T: number, g: number) =>
  linearScale(state, T, g);

export const createMeantone = (state: FiddleState, T: number, comma: number) =>
  linearScale(state, T, 1200 * Math.log2(Math.pow(5, 1 / comma)));

export const createHarmonicSeries = (state: FiddleState, T: number) => {
  const vals = [0];
  for (let i = 1; i < T + 1; i++) {
    // @ts-ignore
    vals.push(1200 * Math.log2(normalizePeriod(i, state.tuning.period)));
    vals.push(
      // @ts-ignore
      1200 * Math.log2(normalizePeriod(1 / i, state.tuning.period))
    );
  }
  return (
    vals
      .sort((a, b) => a - b)
      // @ts-ignore
      .map((val) => val.toFixed(state.options.decimalDigitsCent))
      .filter(onlyUnique)
      .join("\n")
  );
};

export const createJust = (state: FiddleState, T: number, limit: number) => {
  const vals = [0];
  for (let i = 1; i < T + 1; i++) {
    // @ts-ignore
    vals.push(
      1200 *
        Math.log2(
          // @ts-ignore
          normalizePeriod(Math.pow(limit, i), state.tuning.period)
        )
    );
    vals.push(
      1200 *
        Math.log2(
          // @ts-ignore
          normalizePeriod(1 / Math.pow(limit, i), state.tuning.period)
        )
    );
  }

  return (
    vals
      .sort((a, b) => a - b)
      // @ts-ignore
      .map((val) => val.toFixed(state.options.decimalDigitsCent))
      .filter(onlyUnique)
      .join("\n")
  );
};

export const createRatioChord = (state: FiddleState, chord: string) => {
  const points = chord.split(":");
  const result = [];
  const first = Number(points[0]);
  for (let i = 1; i < points.length; i++) {
    result[i - 1] = Number(points[i]) / first;
  }
  result[points.length - 1] = first;
  return result
    .map(
      (tone) =>
        1200 *
        Math.log2(
          // @ts-ignore
          normalizePeriod(tone, state.tuning.period)
        )
    )
    .sort((a, b) => a - b) // @ts-ignore
    .map((tone) => tone.toFixed(state.options.decimalDigitsCent))
    .filter(onlyUnique)
    .join("\n");
};
