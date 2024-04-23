import { FiddleStateImpl } from "./types";

export const defaultScale =
  "100.\n200.\n300.\n400.\n500.\n600.\n700.\n800.\n900.\n1000.\n1100.\n1200.";

export const initialState = {
  init: true,
  scaleInput: defaultScale,
  scales: [{ name: "Initial scale", scaleInput: defaultScale }],
  scaleIndex: 0,
  tab: 0,
  smallTab: 0,
  tuning: {
    baseFreq: 220,
    period: 2,
    keysUp: 24,
    keysDown: 12,
  },
  form: {
    edo: {
      open: false,
      N: 12,
    },
    mos: {
      open: false,
      N: 12,
      T: 7,
    },
    linear: {
      open: false,
      T: 12,
      g: 700,
    },
    meantone: {
      open: false,
      T: 12,
      comma: 4,
    },
    harm: {
      open: false,
      T: 12,
    },
    just: {
      open: false,
      T: 12,
      limit: 3,
    },
    ratiochord: {
      open: false,
      chord: "2:3:4:5",
    },
    limit: {
      open: false,
      N: 12,
    },
    higher: {
      open: false,
      N: 12,
    },
    eulerfokker: {
      open: false,
      N: 12,
    },
    preset: {
      open: false,
      id: "major-scale",
    },
    transpose: {
      open: false,
      N: 12,
    },
    mode: {
      open: false,
      N: 12,
    },
    subset: {
      open: false,
      N: 12,
    },
    multiply: {
      open: false,
      N: 12,
    },
    reverse: {
      open: false,
      N: 12,
    },
    sort: {
      open: false,
      N: 12,
    },
    stretch: {
      open: false,
      N: 12,
    },
    approxequal: {
      open: false,
      N: 12,
    },
    temper: {
      open: false,
      N: 12,
    },
  },
  recompute: false,
  synth: {
    totalGain: 1,
    organ: true,
    envelopeType: "adsr",
    attackGain: 1,
    attackTime: 0.002,
    attackCurve: "exponential",
    decayGain: 0.9,
    decayTime: 0.02,
    decayCurve: "linear",
    sustainGain: 0.7,
    sustainTime: 0.02,
    sustainCurve: "linear",
    releaseGain: 0.7,
    releaseTime: 0.1,
    releaseCurve: "linear",
    waveformType: "preset",
    waveformPreset: "distorted-organ",
  },
  options: {
    decimalDigitsFreq: 3,
    decimalDigitsFreqOnKeys: 1,
    decimalDigitsCent: 1,
    decimalDigitsRatio: 3,
    startGain: 0.001,
    startTime: 0.001,
    endGain: 0.001,
    endTime: 0.001,
  },
} as FiddleStateImpl;
