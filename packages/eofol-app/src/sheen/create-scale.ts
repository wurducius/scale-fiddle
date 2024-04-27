import { FiddleState } from "../types";
import { mod, onlyUnique, trimWhitespace } from "../util";
import { parseScala } from "./scala";
import { normalizePeriod } from "./sheen";
import { outputScale, outputScaleCents } from "./sheen-util";

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

export const createHigherRankTemperament = (
  state: FiddleState,
  setState: any,
  higher: any
) => {
  // @ts-ignore
  const parser = parseScala(state);
  const generators = higher.generators
    .split(",")
    .map(trimWhitespace)
    .map(parser)
    // @ts-ignore
    .map((tone) => 1200 * Math.log2(tone));
  const stepsUp = higher.stepsUp.split(",").map(trimWhitespace).map(Number);
  const stepsDown = higher.stepsDown.split(",").map(trimWhitespace).map(Number);
  const offsets = higher.offset
    .split(",")
    .map(trimWhitespace)
    // @ts-ignore
    .map(parser)
    // @ts-ignore
    .map((tone) => 1200 * Math.log2(tone));

  let result: string[] = [];
  for (let i = 0; i < higher.generatorCount; i++) {
    const generatedUp = outputScaleCents(
      state,
      linearScale(stepsUp[i], generators[i]).map((tone) =>
        mod(tone + offsets[i], 1200)
      )
    );
    const generatedDown = outputScaleCents(
      state,
      linearScale(stepsDown[i], 1200 - generators[i]).map((tone) =>
        mod(tone + offsets[i], 1200)
      )
    );

    result = [...result, ...generatedUp, ...generatedDown];
  }

  const nextScaleInput = result
    .filter(onlyUnique)
    .map((tone) => Number(tone))
    .sort((a, b) => a - b)
    .map((tone) => tone.toFixed(1))
    .join("\n");

  // @ts-ignore
  const nextScales = state.scales;
  // @ts-ignore
  nextScales[state.scaleIndex] = {
    name: "Higher rank scale",
    scaleInput: nextScaleInput,
  };

  // @ts-ignore
  setState({
    ...state,
    recompute: true,
    scaleInput: nextScaleInput,
    scales: nextScales,
    form: {
      // @ts-ignore
      ...state.form, // @ts-ignore
      higher: { ...state.form.higher, open: false },
    },
  });
};
