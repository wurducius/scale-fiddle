import { FiddleStateImpl } from "./types";

export const defaultScale =
  "100.\n200.\n300.\n400.\n500.\n600.\n700.\n800.\n900.\n1000.\n1100.\n1200.";

export const initialState = {
  init: true,
  scaleInput: defaultScale,
  scales: [{ name: "Initial scale", scaleInput: defaultScale }],
  scaleIndex: 0,
  tab: 0,
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
    },
    linear: {
      open: false,
      N: 12,
    },
    meantone: {
      open: false,
      N: 12,
    },
    harm: {
      open: false,
      N: 12,
    },
    just: {
      open: false,
      N: 12,
    },
    ratiochord: {
      open: false,
      N: 12,
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
      N: 12,
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
} as FiddleStateImpl;
