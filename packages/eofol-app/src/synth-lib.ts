import { createStyle, sx } from "@eofol/eofol";
import { FiddleState } from "./types";
import { timbrePresetsFlat } from "./presets/timbre-presets";
import { theme } from "./theme";
import { keyColorOctaveStyle } from "./keyboard-key-mapping";

export let keyElementsMap: Record<string, Element> = {};
export const clearKeyElementMap = () => {
  keyElementsMap = {};
};
export const setKeyElementMap = (freq: string, element: Element) => {
  keyElementsMap[freq] = element;
};

export const keyActiveHoverStyle = sx(
  {
    border: `2px solid ${theme.primaryLighter}`,
    backgroundColor: theme.backgroundElevation,
  },
  "hover"
);

createStyle(
  `@media (hover: hover) and (pointer: fine) { .${keyActiveHoverStyle}:hover { border: 2px solid ${theme.secondaryLighter}; background-color: ${theme.secondaryLighter}; } }`
);

export const flashKeyDownByValue = (freq: string) => {
  keyElementsMap[freq]?.setAttribute("class", "key-inactive key-active");
};
export const flashKeyUpByValue = (freq: string, isOctave?: boolean) => {
  keyElementsMap[freq]?.setAttribute(
    "class",
    "key-inactive " +
      (isOctave ? keyColorOctaveStyle + " " : "") +
      keyActiveHoverStyle
  );
};

const getCurve = (shape: string | undefined) => {
  if (shape == "exponential") {
    return "exponentialRampToValueAtTime";
  } else {
    return "linearRampToValueAtTime";
  }
};

const TOTAL_GAIN_DEFAULT = 1;
const WAVEFORM_ID_DEFAULT = "distorted-organ";

const audioContext = new AudioContext();
let oscList: Record<
  string,
  { osc: OscillatorNode; gain: GainNode } | undefined
> = {};
const mainGainNode = audioContext.createGain();
mainGainNode.connect(audioContext.destination);
mainGainNode.gain.value = TOTAL_GAIN_DEFAULT;

export const panic = () => {
  Object.keys(oscList).forEach((oscName) => {
    const oscItem = oscList[oscName];

    if (oscItem) {
      if (oscItem.gain) {
        oscItem.gain.gain.cancelScheduledValues(audioContext.currentTime);
        oscItem.gain.gain.linearRampToValueAtTime(
          0,
          audioContext.currentTime + 0.01
        );
      }
      if (oscItem.osc) {
        oscItem.osc.stop(audioContext.currentTime + 0.01);
      }
    }
  });

  setTimeout(() => {
    oscList = {};
  }, 11);
};

let waveform;
let sineTerms;
let cosineTerms;
let customWaveform: PeriodicWave;

export const setWaveform = (waveformId: string) => {
  waveform =
    timbrePresetsFlat.find((item) => item.id === waveformId) ??
    timbrePresetsFlat[0];
  sineTerms = new Float32Array(waveform.real.length);
  sineTerms = waveform.real;
  cosineTerms = new Float32Array(waveform.imag.length);
  cosineTerms = waveform.imag;
  customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);
  panic();
};

setWaveform(WAVEFORM_ID_DEFAULT);

export const setTotalGain = (totalGain: number) => {
  mainGainNode.gain.value = totalGain;
};

export const playTone = (state: FiddleState) => (freq: string) => {
  const {
    organ,
    attackCurve,
    attackGain,
    attackTime,
    decayCurve,
    decayGain,
    decayTime,
    sustainCurve,
    sustainGain,
    sustainTime,
    releaseCurve,
    releaseTime,
    // @ts-ignore
  } = state.synth;

  // @ts-ignore
  const { startGain, startTime, endGain, endTime } = state.options;

  const t = audioContext.currentTime;

  const last = oscList[freq];

  let osc;
  let gain;
  if (last) {
    osc = last.osc;
    gain = last.gain;

    gain.gain.cancelScheduledValues(t);
  } else {
    osc = audioContext.createOscillator();
    gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(mainGainNode);

    osc.setPeriodicWave(customWaveform);

    osc.frequency.value = Number(freq);

    gain.gain.value = 0;

    osc.start(t);

    oscList[freq.toString()] = { osc, gain };
  }

  gain.gain.linearRampToValueAtTime(startGain, t + 0.00000001);

  gain.gain[getCurve(attackCurve)](attackGain, t + attackTime);

  gain.gain[getCurve(decayCurve)](decayGain, t + attackTime + decayTime);

  gain.gain[getCurve(sustainCurve)](
    sustainGain,
    t + attackTime + decayTime + sustainTime
  );

  if (!organ) {
    gain.gain[getCurve(releaseCurve)](
      endGain,
      t + attackTime + decayTime + sustainTime + releaseTime
    );
    gain.gain.linearRampToValueAtTime(
      0,
      t + attackTime + decayTime + sustainTime + releaseTime + endTime
    );
  }
};

export const releaseNote = (state: FiddleState) => (freq: string) => {
  const {
    releaseCurve,
    releaseTime,
    // @ts-ignore
  } = state.synth;

  // @ts-ignore
  const { endGain, endTime } = state.options;

  const last = oscList[freq];

  if (last) {
    const gain = last.gain;
    const t = audioContext.currentTime;

    gain.gain.cancelScheduledValues(t);

    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain[getCurve(releaseCurve)](endGain, t + releaseTime);

    gain.gain.linearRampToValueAtTime(0, t + releaseTime + endTime);
  }
};
