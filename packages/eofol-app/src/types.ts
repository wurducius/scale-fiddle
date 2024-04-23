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
      T: number;
      g: number;
    };
    meantone: {
      open: boolean;
      T: number;
      comma: number;
    };
    harm: {
      open: boolean;
      T: number;
    };
    just: {
      open: boolean;
      T: number;
      limit: number;
    };
    ratiochord: {
      open: boolean;
      chord: string;
    };
    limit: {
      open: boolean;
      N: number;
    };
    higher: {
      open: boolean;
      N: number;
    };
    eulerfokker: {
      open: boolean;
      N: number;
    };
    preset: {
      open: boolean;
      id: string;
    };
    transpose: {
      open: boolean;
      N: number;
    };
    mode: {
      open: boolean;
      N: number;
    };
    subset: {
      open: boolean;
      N: number;
    };
    multiply: {
      open: boolean;
      N: number;
    };
    reverse: {
      open: boolean;
      N: number;
    };
    sort: {
      open: boolean;
      N: number;
    };
    stretch: {
      open: boolean;
      N: number;
    };
    approxequal: {
      open: boolean;
      N: number;
    };
    temper: {
      open: boolean;
      N: number;
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
  };
};

export type FiddleState = FiddleStateImpl | undefined | {};
