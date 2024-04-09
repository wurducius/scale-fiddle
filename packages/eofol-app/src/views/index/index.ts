import { mapKeyboardKeys } from "../../keyboard-key-mapping";
import {
  decimalDigitsCent,
  decimalDigitsFreq,
  decimalDigitsFreqOnKeys,
  downKeys,
  upKeys,
} from "../../parameters";
import "../../styles/base.css";
import {
  flashKeyDown,
  flashKeyUp,
  keyActiveHoverStyle,
  playTone,
  releaseNote,
} from "../../synth-lib";
import "./index.css";

import {
  createElement,
  registerServiceWorker,
  defineBuiltinElement,
  sx,
  sy,
} from "@eofol/eofol";

const parseScala = (state: FiddleStateImpl) => (line: string) => {
  if (line.includes(".")) {
    return Math.pow(state.tuning.period, Number(line) / 1200);
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

const defaultScale =
  "100.\n200.\n300.\n400.\n500.\n600.\n700.\n800.\n900.\n1000.\n1100.\n1200.";

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

const scaleToFreq = (state: FiddleStateImpl) => {
  const scaleInput = state.scaleInput;
  const baseFreq = state.tuning.baseFreq;
  const period = state.tuning.period;

  const raw = scaleInput.split("\n").filter(Boolean);
  const intervalMap = raw.map(parseScala(state));

  const freq: number[] = [];
  freq[downKeys] = baseFreq;

  for (let i = 0; i < upKeys; i++) {
    freq[downKeys + i + 1] =
      baseFreq *
      Math.pow(
        period,
        Math.floor(i / raw.length) -
          (mod(raw.length + i - 1, raw.length) === raw.length - 1 ? 1 : 0)
      ) *
      intervalMap[mod(raw.length + i - 1, raw.length)];
  }

  for (let i = 1; i < downKeys + 2; i++) {
    freq[i] =
      baseFreq *
      Math.pow(period, -(1 + Math.floor((i - 1) / raw.length))) *
      intervalMap[mod(raw.length - i, raw.length)];
  }

  return freq
    .sort((a, b) => a - b)
    .map((tone) => tone.toFixed(decimalDigitsFreq))
    .filter(Boolean);
};

const updateScale = (state: FiddleStateImpl) => ({
  scaleInput: state.scaleInput,
  freq: scaleToFreq(state),
  scaleLength: getScaleLength(state.scaleInput),
});

const changeScaleMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
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
    createElement(
      "button",
      [sx({}, "hover")],
      "Modify scale",
      undefined,
      undefined
    ),
  ];
};

const scaleOverview = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const freq = state.freq;

  return createElement("div", sx({ overflow: "auto", height: "100%" }), [
    createElement(
      "div",
      sx({
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "2px solid fuchsia",
        borderLeft: "2px solid fuchsia",
        borderRight: "2px solid fuchsia",
      }),
      [
        createElement("div", undefined, "Index"),
        createElement("div", undefined, `Frequency`),
        createElement("div", undefined, "Cents"),
        createElement("div", undefined, "Ratio"),
      ]
    ),
    ...freq.map((tone: string, index: number) =>
      createElement(
        "div",
        sx({ display: "flex", justifyContent: "space-between" }),
        [
          createElement("div", undefined, index.toString()),
          createElement("div", undefined, `${tone} Hz`),
          createElement("div", undefined, "cent"),
          createElement("div", undefined, "ratio"),
        ]
      )
    ),
  ]);
};

const scaleTuning = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const tuning = state.tuning;

  return createElement("div", undefined, [
    createElement("p", undefined, "Base frequency Hz"),
    createElement(
      "input",
      undefined,
      undefined,
      { value: tuning.baseFreq },
      {
        // @ts-ignore
        onchange: (e) => {
          const val = Number(e.target.value);
          if (Number.isFinite(val)) {
            // @ts-ignore
            setState({
              ...state,
              tuning: { ...tuning, baseFreq: val },
              recompute: true,
            });
          }
        },
      }
    ),
    createElement("p", undefined, "Period interval (Equave)"),
    createElement(
      "input",
      undefined,
      undefined,
      { value: tuning.period },
      {
        // @ts-ignore
        onchange: (e) => {
          const val = Number(e.target.value);
          if (Number.isFinite(val)) {
            // @ts-ignore
            setState({
              ...state,
              tuning: { ...tuning, period: val },
              recompute: true,
            });
          }
        },
      }
    ),
  ]);
};

const inputMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) =>
  createElement("div", sx({ display: "flex", height: "300px" }), [
    createElement("div", sx({ flex: 1 }), [
      createElement(
        "div",
        undefined,
        createElement("div", undefined, changeScaleMenu(state, setState)),
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
    ]),
    createElement("div", sx({ flex: 1 }), scaleLibrary(state, setState)),
    createElement("div", sx({ flex: 1 }), scaleOverview(state, setState)),
    createElement("div", sx({ flex: 1 }), scaleTuning(state, setState)),
  ]);

const scaleLibrary = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return createElement("div", undefined, [
    createElement("p", undefined, "Select scale"),
    createElement("p", undefined, "Scale name"),
    createElement(
      "textarea",
      sx({ height: "200px", resize: "none" }), // @ts-ignore
      state.scaleInput, // @ts-ignore
      {},
      {
        // @ts-ignore
        onchange: (e) => {
          const nextState = {
            ...state,
            scaleInput: e.target.value,
          } as FiddleStateImpl;
          // @ts-ignore
          setState({
            ...nextState,
            ...updateScale(nextState),
          });
        },
      }
    ),
    createElement("p", undefined, "New scale"),
  ]);
};

sy({ border: "2px solid pink", backgroundColor: "darkmagenta" }, "key-active");

const keys = (state: FiddleState) =>
  createElement(
    "div",
    sx({ display: "flex", flexWrap: "wrap-reverse" }),
    // @ts-ignore
    state.freq.map((val, index) =>
      createElement(
        "div",
        [
          sy(
            {
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
            },
            "key-inactive"
          ),
          keyActiveHoverStyle,
        ],
        Number(val).toFixed(decimalDigitsFreqOnKeys),
        { id: `key-${val}` },
        {
          // @ts-ignore
          onmousedown: () => {
            // @ts-ignore
            flashKeyDown(state.freq, index);
            playTone(val);
          },
          // @ts-ignore
          onmouseenter: (event) => {
            event.preventDefault();
            if (mouseDown) {
              // @ts-ignore
              flashKeyDown(state.freq, index);
              playTone(val);
            }
          },
          // @ts-ignore
          onmouseleave: (event) => {
            event.preventDefault();
            // @ts-ignore'
            flashKeyUp(state.freq, index);
            releaseNote(val);
          },
          // @ts-ignore
          onmouseup: () => {
            // @ts-ignore
            flashKeyUp(state.freq, index);
            releaseNote(val);
          },
          // @ts-ignore
          onmouseleave: () => {
            // @ts-ignore
            flashKeyUp(state.freq, index);
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
              const result =
                Array.from({
                  // @ts-ignore
                  length: state.form.edo.N,
                }).reduce((acc, next, i) => {
                  // @ts-ignore
                  const n = Number(state.form.edo.N);
                  const val = ((i + 1) * 1200) / n;
                  const valAsStr = val.toString();
                  const includesDot = valAsStr.includes(".");
                  const displayVal = includesDot
                    ? val.toFixed(decimalDigitsCent)
                    : valAsStr + ".";

                  return (
                    acc +
                    displayVal +
                    // @ts-ignore
                    (i + 1 === n ? "" : "\n")
                  );
                }, "") + "";
              const nextState = {
                ...state,
                scaleInput: result,
              } as FiddleStateImpl;
              // @ts-ignore
              setState({
                ...state,
                ...updateScale(nextState),
              });
            },
          }),
        ]
      ),
    ],
    { id: "modal-edo" }
  );

type FiddleStateImpl = {
  scaleInput: string;
  freq: string[];
  scaleLength: number;
  tab: number;
  tuning: {
    baseFreq: number;
    period: number;
  };
  form: {
    edo: {
      N: number;
    };
  };
  recompute: boolean | undefined;
};

type FiddleState = FiddleStateImpl | undefined | {};

const appbarButton = (
  label: string,
  onclick: () => void,
  isActive: boolean,
  isSecondary?: boolean
) =>
  createElement(
    "button",
    sx({
      fontSize: "16px",
      backgroundColor: isActive ? "fuchsia" : "black",
      color: isSecondary ? "teal" : isActive ? "black" : "fuchsia",
      border: `1px solid ${isSecondary ? "teal" : "fuchsia"}`,
      cursor: "pointer",
    }),
    label,
    undefined,
    {
      // @ts-ignore
      onclick,
    }
  );

const appbar = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const tabIndex = state.tab;

  return createElement(
    "div",
    sx({
      display: "flex",
      height: "50px",
      alignItems: "center",
      border: "2px solid purple",
      padding: "0 16px",
    }),
    createElement(
      "div",
      sx({
        display: "flex",
        justifyContent: "space-between",
        flex: 1,
      }),
      [
        createElement(
          "div",
          sx({ display: "flex", gap: "16px", alignItems: "center" }),
          [
            appbarButton(
              "Scale",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 0 });
              },
              tabIndex === 0
            ),
            appbarButton(
              "Synth",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 1 });
              },
              tabIndex === 1
            ),
            appbarButton(
              "Options",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 2 });
              },
              tabIndex === 2
            ),
            appbarButton(
              "About",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 3 });
              },
              tabIndex === 3
            ),
          ]
        ),
        createElement(
          "div",
          sx({ display: "flex", gap: "16px", alignItems: "center" }),
          [
            appbarButton(
              "Share scale",
              () => {
                console.log("share scale");
              },
              false,
              true
            ),
            createElement(
              "a",
              undefined,
              appbarButton(
                "Microtonal Structure Theory",
                () => {},
                false,
                true
              ),
              {
                target: "_blank",
                href: "https://www.facebook.com/groups/microtonalstructuremusictheory",
              }
            ),
            createElement("div", undefined, "Scale Fiddle"),
          ]
        ),
      ]
    )
  );
};

const scaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [inputMenu(state, setState), keys(state), formModal(state, setState)];
};

const synthTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", undefined, [
      createElement("h1", undefined, "Synth"),
      createElement("p", undefined, "Volume"),
      createElement("p", undefined, "Panic button"),
      createElement("p", undefined, "Organ"),
      createElement("p", undefined, "Waveform type - preset or custom"),
      createElement("p", undefined, "Custom waveform coefficients"),
      createElement("p", undefined, "Preset custom waveforms"),
      createElement("p", undefined, "Envelope type - ADSR or custom"),
      createElement("p", undefined, "Envelope A attack - volume, curve"),
      createElement("p", undefined, "Envelope D decay - volume, curve"),
      createElement("p", undefined, "Envelope S sustain - volume, curve"),
      createElement("p", undefined, "Envelope R release - volume, curve"),
      createElement("p", undefined, "Envelope custom phases - volume, curve"),
      createElement("p", undefined, "Preset envelopes"),
    ]),
  ];
};

const optionsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", undefined, [
      createElement("h1", undefined, "Options"),
      createElement("p", undefined, "Precision - decimal digits"),
      createElement("p", undefined, "? Kill time"),
    ]),
  ];
};

const aboutTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "100px" }), [
      createElement("h1", undefined, "Scale Fiddle"),
      createElement("h2", undefined, "Version 0.3"),
      createElement(
        "h2",
        undefined,
        "Created by Microtonal Structure Theory team"
      ),
      createElement("h2", undefined, "Jakub Eliáš"),
      createElement("h2", undefined, "Janne Karimäki"),
      createElement("h2", undefined, "Imanuel Habekotte"),
      createElement("h2", undefined, "Developed using Eofol"),
    ]),
  ];
};

const initialState = {
  scaleInput: defaultScale,
  tab: 0,
  tuning: {
    baseFreq: 220,
    period: 2,
  },
  form: {
    edo: {
      N: 12,
    },
  },
  recompute: false,
} as FiddleStateImpl;

defineBuiltinElement<FiddleState>({
  tagName: "fiddle-keyboard",
  initialState: {
    ...initialState,
    ...updateScale(initialState),
  },
  effect: (state, setState) => {
    // @ts-ignore
    const stateImpl = state as FiddleStateImpl;

    if (stateImpl.recompute) {
      // @ts-ignore
      setState({
        ...state,
        recompute: false,
        ...updateScale(stateImpl),
      });
    }
  },
  render: (state, setState) => {
    console.log("(R) App");
    // @ts-ignore
    const freq = state.freq;
    // @ts-ignore
    const tab = state.tab;

    mapKeyboardKeys(freq);

    return createElement("div", undefined, [
      appbar(state, setState),
      ...(tab === 0 ? scaleTab(state, setState) : []),
      ...(tab === 1 ? synthTab(state, setState) : []),
      ...(tab === 2 ? optionsTab(state, setState) : []),
      ...(tab === 3 ? aboutTab(state, setState) : []),
    ]);
  },
});

registerServiceWorker();
