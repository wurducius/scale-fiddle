import { parseScala } from "./scala";
import { FiddleStateImpl } from "./types";
import { mod } from "./util";

export const getScaleLength = (scaleInput: string) => {
  const raw = scaleInput.split("\n");
  return raw.length;
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
    const ratio = intervalMap[mod(raw.length + i - 1, raw.length)];
    const ratioImpl = ratio === period ? 1 : ratio;

    freq[downKeys + i + 1] = {
      freq: f,
      ratio: ratioImpl,
      name: raw[mod(raw.length + i - 1, raw.length)],
      cent: Math.log2(f / baseFreq) * 1200,
      isOctave: ratioImpl === 1,
    };
  }

  if (downKeys > 0) {
    for (let i = 1; i < downKeys + 2; i++) {
      const f =
        baseFreq *
        Math.pow(period, -(1 + Math.floor((i - 1) / raw.length))) *
        intervalMap[mod(raw.length - i, raw.length)];
      const ratio = intervalMap[mod(raw.length - i, raw.length)];
      const ratioImpl = ratio === period ? 1 : ratio;

      freq[i] = {
        freq: f,
        ratio: ratioImpl,
        name: raw[mod(raw.length - i, raw.length)],
        cent: Math.log2(f / baseFreq) * 1200,
        isOctave: ratioImpl === 1,
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
  scaleLength: getScaleLength(state.scaleInput),
  scales: state.scales.map((s, index) =>
    state.scaleIndex === index ? { ...s, scaleInput: state.scaleInput } : s
  ),
  overview: scaleToOverview(state),
});
