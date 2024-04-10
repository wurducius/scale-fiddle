import { sx } from "@eofol/eofol/dist";
import {
  customWaveformSine,
  waveformType,
  startGain,
  startTime,
  endGain,
  endTime,
  killTime,
} from "./parameters";
import { FiddleState } from "./types";

export const keyActiveHoverStyle = sx(
  { border: "2px solid pink", backgroundColor: "#914a91" },
  "hover"
);

export const flashKeyDown = (freq: string[], index: number) => {
  document
    .getElementById(`key-${freq[index]}`)
    ?.setAttribute("class", "key-inactive key-active");
};

export const flashKeyUp = (freq: string[], index: number) => {
  document
    .getElementById(`key-${freq[index]}`)
    ?.setAttribute("class", "key-inactive " + keyActiveHoverStyle);
};

const getCurve = (shape: string | undefined) => {
  if (shape == "exponential") {
    return "exponentialRampToValueAtTime";
  } else {
    return "linearRampToValueAtTime";
  }
};

const audioContext = new AudioContext();
const oscList: Record<
  string,
  { osc: OscillatorNode; gain: GainNode } | undefined
> = {};
const mainGainNode = audioContext.createGain();
mainGainNode.connect(audioContext.destination);
mainGainNode.gain.value = 1;

const sineTerms = new Float32Array(customWaveformSine);
const cosineTerms = new Float32Array(sineTerms.length);
const customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

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

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(mainGainNode);

  const t = audioContext.currentTime;

  if (waveformType === "custom") {
    osc.setPeriodicWave(customWaveform);
  } else {
    osc.type = waveformType;
  }

  osc.frequency.value = Number(freq);

  gain.gain.value = 0;

  gain.gain.linearRampToValueAtTime(startGain, t + startTime);

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

  osc.start(t);

  console.log("play");
  oscList[freq.toString()] = { osc, gain };
};

export const releaseNote = (state: FiddleState) => (freq: string) => {
  const {
    releaseCurve,
    releaseTime,
    // @ts-ignore
  } = state.synth;

  const item = oscList[freq.toString()];
  if (item) {
    const osc = item.osc;
    const gain = item.gain;
    const t = audioContext.currentTime;
    console.log("release");

    gain.gain.cancelScheduledValues(t);

    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain[getCurve(releaseCurve)](endGain, t + releaseTime);

    gain.gain.linearRampToValueAtTime(0, t + releaseTime + endTime);

    osc.stop(t + releaseTime + endTime + killTime);
    // oscList[freq.toString()] = undefined;
  }
};
