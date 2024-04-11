import { parseScala } from "./scala";
import { FiddleStateImpl } from "./types";
import { mod } from "./util";

export const getScaleLength = (scaleInput: string) => {
  const raw = scaleInput.split("\n");
  return raw.length;
};

export const scaleToFreq = (state: FiddleStateImpl) => {
  const scaleInput = state.scaleInput;
  const baseFreq = state.tuning.baseFreq;
  const period = state.tuning.period;
  const upKeys = state.tuning.keysUp;
  const downKeys = state.tuning.keysDown;
  const decimalDigitsFreq = state.options.decimalDigitsFreq;

  const raw = scaleInput.split("\n").filter(Boolean);
  const intervalMap = raw.map(parseScala(state));

  const freq: number[] = [];
  freq[downKeys] = baseFreq;

  for (let i = 0; i < upKeys; i++) {
    freq[downKeys + i + 1] =
      baseFreq *
      Math.pow(
        period,
        Math.floor(i / raw.length) -
          (mod(raw.length + i - 1, raw.length) === raw.length - 1 ? 1 : 0)
      ) *
      intervalMap[mod(raw.length + i - 1, raw.length)];
  }

  if (downKeys > 0) {
    for (let i = 1; i < downKeys + 2; i++) {
      freq[i] =
        baseFreq *
        Math.pow(period, -(1 + Math.floor((i - 1) / raw.length))) *
        intervalMap[mod(raw.length - i, raw.length)];
    }
  }

  return freq
    .sort((a, b) => a - b)
    .map((tone) => tone.toFixed(decimalDigitsFreq))
    .filter(Boolean);
};

export const scaleToOverview = (state: FiddleStateImpl) => {
  const scaleInput = state.scaleInput;
  const baseFreq = state.tuning.baseFreq;
  const period = state.tuning.period;
  const upKeys = state.tuning.keysUp;
  const downKeys = state.tuning.keysDown;
  const { decimalDigitsCent, decimalDigitsFreq, decimalDigitsRatio } =
    state.options;

  const raw = scaleInput.split("\n").filter(Boolean);
  const intervalMap = raw.map(parseScala(state));

  const freq = [];
  freq[downKeys] = { freq: baseFreq, ratio: 1, name: "base", cent: 0 };

  for (let i = 0; i < upKeys; i++) {
    const f =
      baseFreq *
      Math.pow(
        period,
        Math.floor(i / raw.length) -
          (mod(raw.length + i - 1, raw.length) === raw.length - 1 ? 1 : 0)
      ) *
      intervalMap[mod(raw.length + i - 1, raw.length)];
    const ratio = intervalMap[mod(raw.length + i - 1, raw.length)];
    freq[downKeys + i + 1] = {
      freq: f,
      ratio: ratio === period ? 1 : ratio,
      name: raw[mod(raw.length + i - 1, raw.length)],
      cent: Math.log2(f / baseFreq) * 1200,
    };
  }

  if (downKeys > 0) {
    for (let i = 1; i < downKeys + 2; i++) {
      const f =
        baseFreq *
        Math.pow(period, -(1 + Math.floor((i - 1) / raw.length))) *
        intervalMap[mod(raw.length - i, raw.length)];
      const ratio = intervalMap[mod(raw.length - i, raw.length)];
      freq[i] = {
        freq: f,
        ratio: ratio === period ? 1 : ratio,
        name: raw[mod(raw.length - i, raw.length)],
        cent: Math.log2(f / baseFreq) * 1200,
      };
    }
  }

  return freq
    .sort((a, b) => Number(a.freq) - Number(b.freq))
    .map((tone) => ({
      ...tone,
      freq: Number(tone.freq).toFixed(decimalDigitsFreq),
      cent: Number(tone.cent).toFixed(decimalDigitsCent),
      ratio: Number(tone.ratio).toFixed(decimalDigitsRatio),
    }))
    .filter(Boolean);
};

export const updateScale = (state: FiddleStateImpl) => ({
  scaleInput: state.scaleInput,
  freq: scaleToFreq(state),
  scaleLength: getScaleLength(state.scaleInput),
  scales: state.scales.map((s, index) =>
    state.scaleIndex === index ? { ...s, scaleInput: state.scaleInput } : s
  ),
  overview: scaleToOverview(state),
});
