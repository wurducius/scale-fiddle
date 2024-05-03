export type FiddleStateImpl = {
  init: boolean;
  scaleInput: string;
  scaleLength: number;
  scales: { name: string; scaleInput: string }[];
  scaleIndex: number;
  overview: { freq: string; name: string; cent: string; ratio: string }[];
  tab: number;
  smallTab: number;
  tuning: {
    baseFreq: number;
    period: number;
    keysUp: number;
    keysDown: number;
  };
  form: {
    edo: {
      open: boolean;
      N: number;
    };
    mos: {
      open: boolean;
      N: number;
      T: number;
    };
    linear: {
      open: boolean;
      up: number;
      down: number;
      g: string;
    };
    meantone: {
      open: boolean;
      up: number;
      down: number;
      comma: number;
    };
    harm: {
      open: boolean;
      up: number;
      down: number;
    };
    just: {
      open: boolean;
      up: string;
      down: string;
      limit: string;
    };
    ratiochord: {
      open: boolean;
      chord: string;
    };
    limit: {
      open: boolean;
      limit: string;
      up: string;
      down: string;
      commas: string;
      epsilon: number;
    };
    higher: {
      open: boolean;
      generatorCount: number;
      generators: string;
      stepsUp: string;
      stepsDown: string;
      offset: string;
    };
    preset: {
      open: boolean;
      id: string;
    };
    transpose: {
      open: boolean;
      t: number;
    };
    mode: {
      open: boolean;
      index: number;
    };
    subset: {
      open: boolean;
      subscale: string;
    };
    multiply: {
      open: boolean;
      multiplier: number;
    };
    reverse: {
      open: boolean;
    };
    sort: {
      open: boolean;
    };
    stretch: {
      open: boolean;
      multiplier: number;
    };
    approxequal: {
      open: boolean;
      N: number;
    };
    temper: {
      open: boolean;
      commas: string;
      epsilon: number;
    };
  };
  recompute: boolean | undefined;
  synth: {
    totalGain: number;
    organ: boolean;
    envelopeType: string;
    attackGain: number;
    attackTime: number;
    attackCurve: string;
    decayGain: number;
    decayTime: number;
    decayCurve: string;
    sustainGain: number;
    sustainTime: number;
    sustainCurve: string;
    releaseGain: number;
    releaseTime: number;
    releaseCurve: string;
    waveformType: string;
    waveformPreset: string;
    fromTuningLength: number;
    fromTuningIterations: number;
    customLength: number;
    customCoefficients: [number, number][];
    customEnvelopeLength: number;
    customEnvelopeGain: number[];
    customEnvelopeTime: number[];
    customEnvelopeCurve: string[];
  };
  options: {
    decimalDigitsFreq: number;
    decimalDigitsFreqOnKeys: number;
    decimalDigitsCent: number;
    decimalDigitsRatio: number;
    startGain: number;
    startTime: number;
    endGain: number;
    endTime: number;
    keyLabel: KeyLabel;
    theme: string;
  };
};

export type FiddleState = FiddleStateImpl | undefined | {};

export type Timbre = {
  id: string;
  title: string;
  real: number[];
  imag: number[];
  errorDelta?: number;
};

export type KeyLabel = "freq" | "cent" | "ratio" | "name" | "index";
