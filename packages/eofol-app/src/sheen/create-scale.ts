import { FiddleState } from "../types";
import { mod } from "../util";
import { normalizePeriod } from "./sheen";
import { outputScale } from "./sheen-util";

export const linearScale = (T: number, g: number) =>
  Array.from({ length: T }).map((item, index) => index * g);

export const createEdo = (state: FiddleState, N: number) =>
  outputScale(
    state, // @ts-ignore
    linearScale(N, (1200 * Math.log2(state.tuning.period)) / N)
  );

export const createMOS = (state: FiddleState, N: number, T: number) => {
  const vals = Array.from({ length: T }).map((item, i) => {
    // @ts-ignore
    const periodCent = 1200 * Math.log2(state.tuning.period);
    return mod((Math.floor(((i + 1) * N) / T) * periodCent) / N, periodCent);
  });
  return outputScale(state, vals);
};

export const createLinear = (state: FiddleState, T: number, g: number) =>
  outputScale(state, linearScale(T, g));

export const createMeantone = (state: FiddleState, T: number, comma: number) =>
  outputScale(state, linearScale(T, 1200 * Math.log2(Math.pow(5, 1 / comma))));

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
  return outputScale(state, vals);
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

  return outputScale(state, vals);
};

export const createRatioChord = (state: FiddleState, chord: string) => {
  const points = chord.split(":");
  const result = [];
  const first = Number(points[0]);
  for (let i = 1; i < points.length; i++) {
    result[i - 1] = Number(points[i]) / first;
  }
  result[points.length - 1] = first;
  const vals = result.map(
    (tone) =>
      1200 *
      Math.log2(
        // @ts-ignore
        normalizePeriod(tone, state.tuning.period)
      )
  );
  return outputScale(state, vals);
};
