import { Timbre } from "../types";
import { normalizePeriod } from "./sheen";

const OPTIMIZATION_STEP = 0.0001;

const DERIVATIVE_STEP = OPTIMIZATION_STEP;

const WEIGHT_DISSONANCE = 0.01;

const WEIGHT_CARDINALITY = WEIGHT_DISSONANCE / 1000;

const normalizeRatioDistance = (first: number, second: number) => {
  const thisErrorRaw = first / second;
  return thisErrorRaw < 1 ? 1 / thisErrorRaw : thisErrorRaw;
};

const partial =
  (scale: number[], weights: number[], period: number) =>
  (i: number, k: number) =>
    normalizePeriod(i * scale[k] * weights[i - 2], period);

const approxByScale = (tuning: number[], point: number) => {
  let error = Number.MAX_VALUE;
  let index = 0;
  for (let k = 0; k < tuning.length; k++) {
    const thisError = normalizeRatioDistance(tuning[k], point);
    if (error > thisError) {
      error = thisError;
      index = k;
    }
  }
  return tuning[index];
};

const getCost = (tuning: number[], period: number) => (waveform: number[]) => {
  const numberOfPoints = tuning.length;
  const p = partial(tuning, waveform, period);

  let dissonance = 0;
  for (let i = 2; i <= waveform.length + 1; i++) {
    for (let j = 2; j <= waveform.length + 1; j++) {
      for (let k = 0; k < tuning.length; k++) {
        for (let l = 0; l < tuning.length; l++) {
          const partialRatio = normalizePeriod(p(i, k) / p(j, l), period);
          dissonance += Math.abs(
            approxByScale(tuning, partialRatio) / partialRatio
          );
        }
      }
    }
  }

  const cost =
    WEIGHT_DISSONANCE * dissonance + WEIGHT_CARDINALITY * numberOfPoints;

  return cost;
};

const getFiniteDifference =
  (
    getCostImpl: (waveform: number[]) => number,
    waveform: number[],
    baseCost: number
  ) =>
  (index: number) => {
    const offsetWaveform = waveform.map(
      (waveformComponent, i) =>
        waveformComponent + (index === i ? DERIVATIVE_STEP : 0)
    );
    return (getCostImpl(offsetWaveform) - baseCost) / DERIVATIVE_STEP;
  };

export const tuningToTimbre = (
  tuning: number[],
  period: number,
  timbreLength: number,
  iterations: number
) => {
  let waveform = Array.from({ length: timbreLength - 1 }).map(
    () => (Math.random() - 0.5) * 2
  );

  const getCostImpl = getCost(tuning, period);

  const initialCost = getCostImpl(waveform);

  for (let i = 0; i < iterations; i++) {
    const cost = getCostImpl(waveform);

    const getDerivative = getFiniteDifference(getCostImpl, waveform, cost);

    const gradient = waveform.map((waveformComponent, index) =>
      getDerivative(index)
    );

    waveform = waveform.map(
      (waveformComponent, i) =>
        waveformComponent - OPTIMIZATION_STEP * gradient[i]
    );
  }

  const waveformMax = waveform.reduce(
    (acc, next) => (Math.abs(next) > acc ? Math.abs(next) : acc),
    Number.MIN_VALUE
  );
  const normedWaveform = waveform.map(
    (waveformComponent) => waveformComponent / waveformMax
  );

  const normedCost = getCostImpl(normedWaveform);

  console.log("Reduced cost by " + (initialCost - normedCost));

  const timbre: Timbre = {
    id: "from-tuning",
    title: "Optimal timbre",
    real: [0, ...normedWaveform],
    imag: [0, ...normedWaveform.map((waveformComponent) => 0)],
  };

  return timbre;
};
