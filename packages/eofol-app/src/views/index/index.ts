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
// ------------------

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

const defaultScale =
  ".100\n.200\n.300\n.400\n.500\n.600\n.700\n.800\n.900\n.1000\n.1100\n.1200";

function playTone(freq: number) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(mainGainNode);

  const t = audioContext.currentTime;

  osc.type = "sine";
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

const scaleToFreq = (scaleInput: string) => {
  const raw = scaleInput.split("\n");
  const freq = raw.map(
    (tone) =>
      Math.pow(periodFreq, Number(tone.replace(".", "")) / 1200) * baseFreq
  );
  freq.push(baseFreq);
  return freq.sort((a, b) => a - b).map((tone) => tone.toFixed(1));
};

defineBuiltinElement({
  tagName: "fiddle-keyboard",
  initialState: { scaleInput: defaultScale, freq: scaleToFreq(defaultScale) },
  render: (state, setState) => {
    console.log(state);
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
              });
            },
          }
        )
      ),
      createElement(
        "div",
        sx({ display: "flex" }),
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
