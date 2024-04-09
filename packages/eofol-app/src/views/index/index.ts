import { StateSetter } from "../../../../../../eofol/packages/eofol-types";
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
  if (line.includes(".")) {
    return Math.pow(periodFreq, Number(line) / 1200);
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
  "100.\n200.\n300.\n400.\n500.\n600.\n700.\n800.\n900.\n1000.\n1100.\n1200.";

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
  const raw = scaleInput.split("\n").filter(Boolean);
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

  /*
200.
400.
600.
800.
1000.
1200.
*/

  for (let i = 1; i < downKeys + 2; i++) {
    freq[i] =
      baseFreq *
      Math.pow(periodFreq, -(1 + Math.floor((i - 1) / raw.length))) *
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

const inputMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) =>
  createElement(
    "div",
    undefined,
    createElement("div", sx({ display: "flex", justifyContent: "center" }), [
      createElement(
        "div",
        undefined,
        [
          createElement(
            "button",
            [sx({}, "hover")],
            "New scale",
            undefined,
            undefined
          ),
          createElement(
            "div",
            sx({ display: "none" }),
            createElement(
              "div",
              sx({
                display: "flex",
                flexDirection: "column",
                fontSize: "16px",
              }),
              [
                createElement(
                  "button",
                  undefined,
                  "Equal temperament (EDO)",
                  undefined,
                  {
                    // @ts-ignore
                    onclick: () => {
                      const content = document.getElementById("modal-edo");
                      if (content) {
                        content.setAttribute("style", "display: block;");
                      }
                    },
                  }
                ),
                createElement("button", undefined, "Moment of symmetry (MOS)"),
              ]
            ),
            {
              id: "dropdown-new-scale-content",
            }
          ),
        ],
        undefined,
        {
          // @ts-ignore
          onmouseover: () => {
            const content = document.getElementById(
              "dropdown-new-scale-content"
            );
            if (content) {
              content.setAttribute("style", "display: block;");
            }
          },
          // @ts-ignore
          onmouseleave: () => {
            const content = document.getElementById(
              "dropdown-new-scale-content"
            );
            if (content) {
              content.setAttribute("style", "display: none;");
            }
          },
        }
      ),
      scaleInput(state, setState),
    ])
  );

const scaleInput = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) =>
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
  );

const keys = (state: FiddleState) =>
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
            flex: `1 0 ${
              // @ts-ignore
              (100 / state.scaleLength) * 0.9
            }%`,
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
  );

const formModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) =>
  createElement(
    "div",
    sx({
      display: "none",
      position: "fixed",
      zIndex: "1",
      paddingTop: "100px",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%",
      overflow: "auto",
      backgroundColor: "rgba(0,0,0,0.4)",
    }),
    [
      createElement(
        "div",
        sx({
          position: "relative",
          padding: "64px",
          width: "80%",
          margin: "auto",
          border: "2px solid grey",
          backgroundColor: "#dddddd",
        }),
        [
          createElement(
            "div",
            sx({ fontSize: "32px" }),
            "Equal division of octave (EDO)"
          ),
          createElement("div", undefined, [
            createElement("div", sx({ fontSize: "24px" }), "N"),
            createElement(
              "input",
              undefined,
              undefined,
              {
                // @ts-ignore
                value: state.form.edo.N,
              },
              {
                // @ts-ignore
                onchange: (event) => {
                  // @ts-ignore
                  setState({
                    ...state,
                    // @ts-ignore
                    form: { ...state.form, edo: { N: event.target.value } },
                  });
                },
              }
            ),
          ]),
          createElement("button", undefined, "Let's go", undefined, {
            // @ts-ignore
            onclick: () => {
              const result = Array.from({
                // @ts-ignore
                length: state.form.edo.N,
              }).reduce(
                (acc, next, i) =>
                  acc +
                  "" +
                  // @ts-ignore
                  ((i + 1) * 1200) / state.form.edo.N +
                  "." +
                  // @ts-ignore
                  (i + 1 === Number(state.form.edo.N) ? "" : "\n"),
                ""
              ) as string;
              // @ts-ignore
              setState({
                ...state,
                scaleInput: result,
                freq: scaleToFreq(result),
                scaleLength: getScaleLength(result),
              });
            },
          }),
        ]
      ),
    ],
    { id: "modal-edo" }
  );

type FiddleState =
  | {
      scaleInput: string;
      freq: string[];
      scaleLength: number;
    }
  | undefined
  | {};

defineBuiltinElement<FiddleState>({
  tagName: "fiddle-keyboard",
  initialState: {
    scaleInput: defaultScale,
    freq: scaleToFreq(defaultScale),
    scaleLength: getScaleLength(defaultScale),
    form: {
      edo: {
        N: 12,
      },
    },
  },
  render: (state, setState) => {
    // @ts-ignore
    const freq = state.freq;

    document.onkeydown = (event) => {
      handleKeyDown(event, freq, "z", 0);
      handleKeyDown(event, freq, "x", 1);
      handleKeyDown(event, freq, "c", 2);
      handleKeyDown(event, freq, "v", 3);
      handleKeyDown(event, freq, "b", 4);
      handleKeyDown(event, freq, "n", 5);
      handleKeyDown(event, freq, "m", 6);
      handleKeyDown(event, freq, "a", 7);
      handleKeyDown(event, freq, "s", 8);
      handleKeyDown(event, freq, "d", 9);
      handleKeyDown(event, freq, "f", 10);
      handleKeyDown(event, freq, "g", 11);
      handleKeyDown(event, freq, "h", 12);
      handleKeyDown(event, freq, "j", 13);
      handleKeyDown(event, freq, "k", 14);
      handleKeyDown(event, freq, "l", 15);
      handleKeyDown(event, freq, "q", 16);
      handleKeyDown(event, freq, "w", 17);
      handleKeyDown(event, freq, "e", 18);
      handleKeyDown(event, freq, "r", 19);
      handleKeyDown(event, freq, "t", 20);
      handleKeyDown(event, freq, "y", 21);
      handleKeyDown(event, freq, "u", 22);
      handleKeyDown(event, freq, "i", 23);
      handleKeyDown(event, freq, "o", 24);
      handleKeyDown(event, freq, "p", 25);
    };

    document.onkeyup = (event) => {
      handleKeyUp(event, freq, "z", 0);
      handleKeyUp(event, freq, "x", 1);
      handleKeyUp(event, freq, "c", 2);
      handleKeyUp(event, freq, "v", 3);
      handleKeyUp(event, freq, "b", 4);
      handleKeyUp(event, freq, "n", 5);
      handleKeyUp(event, freq, "m", 6);
      handleKeyUp(event, freq, "a", 7);
      handleKeyUp(event, freq, "s", 8);
      handleKeyUp(event, freq, "d", 9);
      handleKeyUp(event, freq, "f", 10);
      handleKeyUp(event, freq, "g", 11);
      handleKeyUp(event, freq, "h", 12);
      handleKeyUp(event, freq, "j", 13);
      handleKeyUp(event, freq, "k", 14);
      handleKeyUp(event, freq, "l", 15);
      handleKeyUp(event, freq, "q", 16);
      handleKeyUp(event, freq, "w", 17);
      handleKeyUp(event, freq, "e", 18);
      handleKeyUp(event, freq, "r", 19);
      handleKeyUp(event, freq, "t", 20);
      handleKeyUp(event, freq, "y", 21);
      handleKeyUp(event, freq, "u", 22);
      handleKeyUp(event, freq, "i", 23);
      handleKeyUp(event, freq, "o", 24);
      handleKeyUp(event, freq, "p", 25);
    };

    return createElement("div", undefined, [
      inputMenu(state, setState),
      keys(state),
      formModal(state, setState),
    ]);
  },
});

registerServiceWorker();
