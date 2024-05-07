import { FiddleStateImpl } from "../types";
import { mod } from "../util";
import { parseScala } from "./scala";
import {
  ratioToCent,
  splitScale,
  toFixedCent,
  toFixedFreq,
  toFixedRatio,
} from "./sheen-util";

export const normalizePeriod = (period: number) => (value: number) => {
  if (!Number.isFinite(value) || Number.isNaN(value) || value <= 1) {
    return value;
  }
  let val = value;
  while (val >= period) {
    val = val / period;
  }
  while (val < 1) {
    val = val * period;
  }
  return val;
};

export const getScaleLength = (scaleInput: string) => {
  const raw = splitScale(scaleInput);
  return raw.length;
};

export const scaleToOverview = (state: FiddleStateImpl) => {
  const scaleInput = state.scaleInput;
  const baseFreq = state.tuning.baseFreq;
  const period = state.tuning.period;
  const upKeys = state.tuning.keysUp;
  const downKeys = state.tuning.keysDown;

  const raw = splitScale(scaleInput).filter(Boolean);
  const intervalMap = raw.map(parseScala(state));

  const normalizer = normalizePeriod(period);

  const freq = [];
  freq[downKeys] = {
    freq: baseFreq,
    ratio: 1,
    name: "base",
    cent: 0,
    isOctave: true,
  };

  for (let i = 0; i < upKeys; i++) {
    const f =
      baseFreq *
      Math.pow(
        period,
        Math.floor(i / raw.length) -
          (mod(raw.length + i - 1, raw.length) === raw.length - 1 ? 1 : 0)
      ) *
      intervalMap[mod(raw.length + i - 1, raw.length)];
    const ratio = normalizer(intervalMap[mod(raw.length + i - 1, raw.length)]);

    freq[downKeys + i + 1] = {
      freq: f,
      ratio,
      name: raw[mod(raw.length + i - 1, raw.length)],
      cent: ratioToCent(f / baseFreq),
      isOctave: ratio === 1,
    };
  }

  if (downKeys > 0) {
    for (let i = 1; i < downKeys + 2; i++) {
      const f =
        baseFreq *
        Math.pow(period, -(1 + Math.floor((i - 1) / raw.length))) *
        intervalMap[mod(raw.length - i, raw.length)];
      const ratio = normalizer(intervalMap[mod(raw.length - i, raw.length)]);

      freq[i] = {
        freq: f,
        ratio,
        name: raw[mod(raw.length - i, raw.length)],
        cent: ratioToCent(f / baseFreq),
        isOctave: ratio === 1,
      };
    }
  }

  return freq
    .sort((a, b) => Number(a.freq) - Number(b.freq))
    .map((tone) => ({
      ...tone,
      freq: toFixedFreq(state, Number(tone.freq)),
      cent: toFixedCent(state, Number(tone.cent)),
      ratio: toFixedRatio(state, Number(tone.ratio)),
    }))
    .filter(Boolean);
};

export const updateScale = (state: FiddleStateImpl) => ({
  scaleInput: state.scaleInput,
  scaleLength: getScaleLength(state.scaleInput),
  scales: state.scales.map((s, index) =>
    state.scaleIndex === index ? { ...s, scaleInput: state.scaleInput } : s
  ),
  overview: scaleToOverview(state),
  periodCent: ratioToCent(state.tuning.period),
});
