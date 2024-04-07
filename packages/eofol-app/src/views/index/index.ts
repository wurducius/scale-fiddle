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

const audioContext = new AudioContext();
const oscList: Record<string, OscillatorNode | undefined> = {};
const mainGainNode = audioContext.createGain();
mainGainNode.connect(audioContext.destination);
mainGainNode.gain.value = 1;

const defaultScale =
  ".0\n.100\n.200\n.300\n.400\n.500\n.600\n.700\n.800\n.900\n.1000\n.1100\n.1200";

function playTone(freq: number) {
  const osc = audioContext.createOscillator();
  osc.connect(mainGainNode);
  osc.type = "sine";
  osc.frequency.value = freq;
  osc.start();
  oscList[freq.toString()] = osc;
}

function releaseNote(freq: number) {
  const osc = oscList[freq.toString()];
  if (osc) {
    osc.stop();
    oscList[freq.toString()] = undefined;
  }
}

var mouseDown = false;
document.body.onmousedown = function () {
  mouseDown = true;
};
document.body.onmouseup = function () {
  mouseDown = false;
};

const scaleToFreq = (scaleInput: string) =>
  scaleInput
    .split("\n")
    .map((tone) =>
      (Math.pow(2, Number(tone.replace(".", "")) / 1200) * 220).toFixed(1)
    );

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
            }
          )
        )
      ),
    ]);
  },
});

registerServiceWorker();
