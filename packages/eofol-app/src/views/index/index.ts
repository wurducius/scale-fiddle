import "../../styles/base.css";
import "./index.css";

import svgPath from "./phi.svg";

import {
  createElement,
  registerServiceWorker,
  defineBuiltinElement,
  sx,
} from "@eofol/eofol";

const svgElement: HTMLImageElement | null = <HTMLImageElement>(
  document.getElementById("eofol-svg")
);

if (svgElement) {
  svgElement.src = svgPath;
}

// ------------------
// @TODO
const totalGain = 1;

const organ = true;

const waveformType = "custom";
const customWaveformSine = [0, 0, 1, 1, 1];

const attackCurve = "exponential";
const decayCurve = "linear";
const sustainCurve = "linear";
const releaseCurve = "linear";

const attackGain = 1;
const decayGain = 0.9;
const sustainGain = 0.7;

const startGain = 0.001;
const startTime = 0.001;
const endGain = 0.001;
const endTime = 0.001;

const attackTime = 0.02;
const decayTime = 0.02;
const sustainTime = 0.02;
const releaseTime = 0.1;
const killTime = 0.01;

const baseFreq = 220;
const periodFreq = 2;

const upKeys = 24;
const downKeys = 12;
// ------------------

const parseScala = (line: string) => {
  if (line.startsWith(".")) {
    return Math.pow(periodFreq, Number(line.replace(".", "")) / 1200);
  } else if (line.includes("/")) {
    const split = line.split("/");
    return Number(Number(split[0]) / Number(split[1]));
  } else if (line.includes(",")) {
    return Number(line.replace(",", "."));
  } else if (line.includes("\\")) {
    const split = line.split("\\");
    return Math.pow(2, Number(split[0]) / Number(split[1]));
  }
  return Number(line);
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

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
mainGainNode.gain.value = totalGain;

const sineTerms = new Float32Array(customWaveformSine);
const cosineTerms = new Float32Array(sineTerms.length);
const customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

const defaultScale =
  ".100\n.200\n.300\n.400\n.500\n.600\n.700\n.800\n.900\n.1000\n.1100\n.1200";

function playTone(freq: number) {
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

  osc.frequency.value = freq;

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
}

function releaseNote(freq: number) {
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
}

var mouseDown = false;
document.body.onmousedown = function () {
  mouseDown = true;
};
document.body.onmouseup = function () {
  mouseDown = false;
};

const getScaleLength = (scaleInput: string) => {
  const raw = scaleInput.split("\n");
  return raw.length;
};

const scaleToFreq = (scaleInput: string) => {
  const raw = scaleInput.split("\n");
  const intervalMap = raw.map(parseScala);

  const freq: number[] = [];
  freq[downKeys] = baseFreq;

  for (let i = 0; i < upKeys; i++) {
    freq[downKeys + i + 1] =
      baseFreq *
      Math.pow(
        periodFreq,
        Math.floor(i / raw.length) -
          (mod(raw.length + i - 1, raw.length) === raw.length - 1 ? 1 : 0)
      ) *
      intervalMap[mod(raw.length + i - 1, raw.length)];
  }

  for (let i = 1; i < downKeys + 2; i++) {
    freq[i] =
      baseFreq *
      Math.pow(
        periodFreq,
        -(
          1 +
          (Math.floor(i / raw.length) +
            (i === downKeys + 1 ? 1 : 0) +
            (i === downKeys + 1 || i === downKeys ? -1 : 0))
        )
      ) *
      intervalMap[mod(raw.length - i, raw.length)];
  }

  return freq.sort((a, b) => a - b).map((tone) => tone.toFixed(1));
};

const keysDown: Record<number, boolean | undefined> = {};

const handleKeyDown = (event: any, freq: any, key: string, index: number) => {
  if (event.key === key && !keysDown[index]) {
    // @ts-ignore
    playTone(freq[index]);
    keysDown[index] = true;
  }
};

const handleKeyUp = (event: any, freq: any, key: string, index: number) => {
  if (event.key === key && keysDown[index]) {
    // @ts-ignore
    releaseNote(freq[index]);
    keysDown[index] = false;
  }
};

defineBuiltinElement({
  tagName: "fiddle-keyboard",
  initialState: {
    scaleInput: defaultScale,
    freq: scaleToFreq(defaultScale),
    scaleLength: getScaleLength(defaultScale),
  },
  render: (state, setState) => {
    document.onkeydown = (event) => {
      // @ts-ignore
      handleKeyDown(event, state.freq, "z", 24);
    };

    document.onkeyup = (event) => {
      // @ts-ignore
      handleKeyUp(event, state.freq, "z", 24);
    };

    return createElement("div", undefined, [
      createElement(
        "div",
        undefined,
        createElement(
          "textarea",
          sx({ height: "200px" }), // @ts-ignore
          state.scaleInput, // @ts-ignore
          {},
          {
            // @ts-ignore
            onchange: (e) => {
              // @ts-ignore
              setState({
                ...state,
                scaleInput: e.target.value,
                freq: scaleToFreq(e.target.value),
                scaleLength: getScaleLength(e.target.value),
              });
            },
          }
        )
      ),
      createElement(
        "div",
        sx({ display: "flex", flexWrap: "wrap-reverse" }),
        // @ts-ignore
        state.freq.map((val) =>
          createElement(
            "div",
            [
              sx({
                height: "100px",
                width: "64px",
                fontSize: "16px",
                border: "2px solid fuchsia",
                backgroundColor: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                touchAction: "none",
                // @ts-ignore
                flex: `1 0 ${100 / (state.scaleLength * 1.1)}%`,
              }),
              sx(
                { border: "2px solid pink", backgroundColor: "darkmagenta" },
                "hover"
              ),
            ],
            val.toString(),
            {},
            {
              // @ts-ignore
              onmousedown: () => {
                playTone(val);
              },
              // @ts-ignore
              onmouseenter: (event) => {
                event.preventDefault();
                if (mouseDown) {
                  playTone(val);
                }
              },
              // @ts-ignore
              onmouseleave: (event) => {
                event.preventDefault();
                releaseNote(val);
              },
              // @ts-ignore
              onmouseup: () => {
                releaseNote(val);
              },
              // @ts-ignore
              onmouseleave: () => {
                releaseNote(val);
              },
              // @ts-ignore
            }
          )
        )
      ),
    ]);
  },
});

registerServiceWorker();
