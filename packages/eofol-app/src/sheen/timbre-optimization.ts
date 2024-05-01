import { Timbre } from "../types";
import { onlyUnique } from "../util";
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

export async function tuningToTimbre(
  tuning: number[],
  period: number,
  timbreLength: number,
  iterations: number,
  updateProgress: (
    i: number,
    iterations: number,
    start: Date,
    end: Date
  ) => void
) {
  let waveform = Array.from({ length: timbreLength - 1 }).map(
    () => (Math.random() - 0.5) * 2
  );

  const getCostImpl = getCost(tuning, period);

  const initialCost = getCostImpl(waveform);

  for (let i = 0; i < iterations; i++) {
    const start = new Date();

    await new Promise((resolve) => {
      const cost = getCostImpl(waveform);

      const getDerivative = getFiniteDifference(getCostImpl, waveform, cost);

      const gradient = waveform.map((waveformComponent, index) =>
        getDerivative(index)
      );

      waveform = waveform.map(
        (waveformComponent, i) =>
          waveformComponent - OPTIMIZATION_STEP * gradient[i]
      );

      setTimeout(resolve, 0);
    });

    const end = new Date();

    setTimeout(() => {
      updateProgress(i, iterations, start, end);
    }, 0);
  }

  const waveformMax = waveform.reduce(
    (acc, next) => (Math.abs(next) > acc ? Math.abs(next) : acc),
    Number.MIN_VALUE
  );
  const normedWaveform = waveform.map(
    (waveformComponent) => waveformComponent / waveformMax
  );

  const normedCost = getCostImpl(normedWaveform);

  const timbre: Timbre = {
    id: "from-tuning",
    title: "Optimal timbre",
    real: [0, ...normedWaveform],
    imag: [0, ...normedWaveform.map((waveformComponent) => 0)],
    errorDelta: initialCost - normedCost,
  };

  return timbre;
}

export function timbreToTuning(
  timbre: Timbre,
  period: number,
  precisionCents: number
) {
  let tuning: number[] = [];

  const array = Array.from({ length: timbre.real.length })
    .map((item, i) => i + 1)
    .filter((item, i) => timbre.real[i] != 0 || timbre.imag[i] != 0)
    .map((item) => normalizePeriod(item, period))
    .filter(onlyUnique);

  tuning.push(1);

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      tuning.push(normalizePeriod(array[i] / array[j], period));
      tuning.push(normalizePeriod(array[j] / array[i], period));
    }
  }

  tuning = tuning.filter(onlyUnique).sort((a, b) => a - b);

  return tuning
    .map((item) => (item === 1 ? period : item))
    .map((item) => 1200 * Math.log2(item))
    .sort((a, b) => a - b)
    .map((item) => item.toFixed(precisionCents));
}
