export type ScalaUnit = "cent" | "freq" | "ratio";

export type EnvelopeCurve = "linear" | "exponential";

export type EnvelopeType = "adsr" | "custom" | "preset";

export type WaveformType = "preset" | "custom" | "from-tuning";

export type KeyLabel = "cent" | "freq" | "ratio" | "index" | "name";

export type SynthLayout = "linear" | "iso" | "piano";

export type Overview = {
  freq: string;
  cent: string;
  ratio: string;
  name: string;
  isOctave: boolean;
};

export type KeyMap = {
  freq: string;
  name: string;
  isOctave: boolean;
  color?: string;
};

export type Timbre = {
  id: string;
  title: string;
  real: number[];
  imag: number[];
  errorDelta?: number;
  initialCost?: number;
  resultCost?: number;
};

export type FiddleStateImpl = {
  init: boolean;
  scaleInput: string;
  scaleLength: number;
  scales: { name: string; scaleInput: string }[];
  scaleIndex: number;
  periodCent: number;
  keyMap: KeyMap[];
  scaleInvalid: boolean;
  scaleError: string;
  overview: Overview[];
  tab: number;
  smallTab: number;
  docsTab: number;
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
  recompute?: boolean;
  synth: {
    totalGain: number;
    organ: boolean;
    envelopeType: EnvelopeType;
    attackGain: number;
    attackTime: number;
    attackCurve: EnvelopeCurve;
    decayGain: number;
    decayTime: number;
    decayCurve: EnvelopeCurve;
    sustainGain: number;
    sustainTime: number;
    sustainCurve: EnvelopeCurve;
    releaseGain: number;
    releaseTime: number;
    releaseCurve: EnvelopeCurve;
    waveformType: WaveformType;
    waveformPreset: string;
    fromTuningLength: number;
    fromTuningIterations: number;
    customLength: number;
    customCoefficients: [number, number][];
    customEnvelopeLength: number;
    customEnvelopeGain: number[];
    customEnvelopeTime: number[];
    customEnvelopeCurve: EnvelopeCurve[];
    layout: SynthLayout;
    layoutIsoUp: number;
    layoutIsoRight: number;
    layoutPianoColor: string;
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
  analyze: {
    intervalMatrixUnits: ScalaUnit;
  };
};

export type FiddleState = FiddleStateImpl | undefined | {};
