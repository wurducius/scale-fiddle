export type FiddleStateImpl = {
  scaleInput: string;
  freq: string[];
  scaleLength: number;
  scales: { name: string; scaleInput: string }[];
  scaleIndex: number;
  overview: { freq: string; name: string; cent: string; ratio: string }[];
  tab: number;
  tuning: {
    baseFreq: number;
    period: number;
    keysUp: number;
    keysDown: number;
  };
  form: {
    edo: {
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
};

export type FiddleState = FiddleStateImpl | undefined | {};
