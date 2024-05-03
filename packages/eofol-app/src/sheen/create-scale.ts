import { FiddleState } from "../types";
import { mod, onlyUnique, trimWhitespace } from "../util";
import { parseScala } from "./scala";
import { normalizePeriod } from "./sheen";
import {
  joinScale,
  outputScale,
  outputScaleCents,
  ratioToCent,
  sortNumbers,
  toFixedCent,
} from "./sheen-util";

export const linearScale =
  (state: FiddleState) => (g: string, up: number, down: number) => {
    // @ts-ignore
    const parsedG = parseScala(state)(g);
    const centGenerator = ratioToCent(parsedG);
    return linearScaleCents(centGenerator, up, down);
  };

const linearScaleCents = (g: number, up: number, down: number) => {
  const result = [0];
  for (let i = 0; i < up; i++) {
    result.push((i + 1) * g);
  }
  for (let i = 0; i < down; i++) {
    result.push(-(i + 1) * g);
  }
  return result;
};

export const createEdo = (state: FiddleState, N: number) =>
  outputScale(
    state, // @ts-ignore
    linearScaleCents(ratioToCent(state.tuning.period) / N, N - 1, 0)
  );

export const createMOS = (state: FiddleState, N: number, T: number) => {
  const vals = Array.from({ length: T }).map((item, i) => {
    // @ts-ignore
    const periodCent = ratioToCent(state.tuning.period);
    return mod((Math.floor(((i + 1) * N) / T) * periodCent) / N, periodCent);
  });
  return outputScale(state, vals);
};

export const createLinear = (
  state: FiddleState,
  g: string,
  up: number,
  down: number
) => outputScale(state, linearScale(state)(g, up, down));

export const createMeantone = (
  state: FiddleState,
  comma: number,
  up: number,
  down: number
) =>
  outputScale(
    state,
    linearScaleCents(ratioToCent(Math.pow(5, 1 / comma)), up, down)
  );

export const createHarmonicSeries = (
  state: FiddleState,
  up: number,
  down: number
) => {
  const vals = [0];
  for (let i = 1; i < Number(up) + 1; i++) {
    // @ts-ignore
    vals.push(ratioToCent(normalizePeriod(state.tuning.period)(i)));
  }
  for (let i = 1; i < Number(down) + 1; i++) {
    vals.push(
      // @ts-ignore
      ratioToCent(normalizePeriod(state.tuning.period)(1 / i))
    );
  }
  return outputScale(state, vals);
};

const addJustScale =
  (vals: number[], state: FiddleState) =>
  (limit: number, up: number, down: number) => {
    for (let i = 1; i < up + 1; i++) {
      // @ts-ignore
      vals.push(
        ratioToCent(
          // @ts-ignore
          normalizePeriod(state.tuning.period)(Math.pow(limit, i))
        )
      );
    }
    for (let i = 1; i < down + 1; i++) {
      vals.push(
        ratioToCent(
          // @ts-ignore
          normalizePeriod(state.tuning.period)(1 / Math.pow(limit, i))
        )
      );
    }
    return vals;
  };

export const createJust = (
  state: FiddleState,
  limit: string,
  up: string,
  down: string
) => {
  const parsedUp = up.split(",");
  const parsedDown = down.split(",");
  const parsedLimit = limit.split(",");

  const vals = [0];
  const justScaleAdder = addJustScale(vals, state);
  for (let i = 0; i < parsedLimit.length; i++) {
    justScaleAdder(
      Number(parsedLimit[i]),
      Number(parsedUp[i]),
      Number(parsedDown[i])
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
  const vals = result.map((tone) =>
    ratioToCent(
      // @ts-ignore
      normalizePeriod(state.tuning.period)(tone)
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
    .map(ratioToCent);
  const stepsUp = higher.stepsUp.split(",").map(trimWhitespace).map(Number);
  const stepsDown = higher.stepsDown.split(",").map(trimWhitespace).map(Number);
  const offsets = higher.offset
    .split(",")
    .map(trimWhitespace)
    // @ts-ignore
    .map(parser)
    // @ts-ignore
    .map(ratioToCent);

  let result: string[] = [];
  for (let i = 0; i < higher.generatorCount; i++) {
    const generatedUp = outputScaleCents(
      state,
      linearScaleCents(generators[i], stepsUp[i], 0).map((tone) =>
        mod(tone + offsets[i], 1200)
      )
    );
    const generatedDown = outputScaleCents(
      state,
      linearScaleCents(1200 - generators[i], stepsDown[i], 0).map((tone) =>
        mod(tone + offsets[i], 1200)
      )
    );

    result = [...result, ...generatedUp, ...generatedDown];
  }

  const nextScaleInput = joinScale(
    result
      .filter(onlyUnique)
      .map(Number)
      .sort(sortNumbers)
      .map((tone) => toFixedCent(state, tone))
  );

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
