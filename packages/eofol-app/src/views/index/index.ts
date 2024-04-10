import { mapKeyboardKeys } from "../../keyboard-key-mapping";
import {
  decimalDigitsCent,
  decimalDigitsFreq,
  decimalDigitsFreqOnKeys,
  decimalDigitsRatio,
} from "../../parameters";
import "../../styles/base.css";
import {
  flashKeyDown,
  flashKeyUp,
  keyActiveHoverStyle,
  playTone as playToneImpl,
  releaseNote as releaseNoteImpl,
  setTotalGain,
  setWaveform,
} from "../../synth-lib";
import { timbrePresets } from "../../timbre";
import { FiddleState, FiddleStateImpl } from "../../types";
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
  const upKeys = state.tuning.keysUp;
  const downKeys = state.tuning.keysDown;

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

  if (downKeys > 0) {
    for (let i = 1; i < downKeys + 2; i++) {
      freq[i] =
        baseFreq *
        Math.pow(period, -(1 + Math.floor((i - 1) / raw.length))) *
        intervalMap[mod(raw.length - i, raw.length)];
    }
  }

  return freq
    .sort((a, b) => a - b)
    .map((tone) => tone.toFixed(decimalDigitsFreq))
    .filter(Boolean);
};

const scaleToOverview = (state: FiddleStateImpl) => {
  const scaleInput = state.scaleInput;
  const baseFreq = state.tuning.baseFreq;
  const period = state.tuning.period;
  const upKeys = state.tuning.keysUp;
  const downKeys = state.tuning.keysDown;

  const raw = scaleInput.split("\n").filter(Boolean);
  const intervalMap = raw.map(parseScala(state));

  const freq = [];
  freq[downKeys] = { freq: baseFreq, ratio: 1, name: "base", cent: 0 };

  for (let i = 0; i < upKeys; i++) {
    const f =
      baseFreq *
      Math.pow(
        period,
        Math.floor(i / raw.length) -
          (mod(raw.length + i - 1, raw.length) === raw.length - 1 ? 1 : 0)
      ) *
      intervalMap[mod(raw.length + i - 1, raw.length)];
    const ratio = intervalMap[mod(raw.length + i - 1, raw.length)];
    freq[downKeys + i + 1] = {
      freq: f,
      ratio: ratio === period ? 1 : ratio,
      name: raw[mod(raw.length + i - 1, raw.length)],
      cent: Math.log2(f / baseFreq) * 1200,
    };
  }

  if (downKeys > 0) {
    for (let i = 1; i < downKeys + 2; i++) {
      const f =
        baseFreq *
        Math.pow(period, -(1 + Math.floor((i - 1) / raw.length))) *
        intervalMap[mod(raw.length - i, raw.length)];
      const ratio = intervalMap[mod(raw.length - i, raw.length)];
      freq[i] = {
        freq: f,
        ratio: ratio === period ? 1 : ratio,
        name: raw[mod(raw.length - i, raw.length)],
        cent: Math.log2(f / baseFreq) * 1200,
      };
    }
  }

  return freq
    .sort((a, b) => Number(a.freq) - Number(b.freq))
    .map((tone) => ({
      ...tone,
      freq: Number(tone.freq).toFixed(decimalDigitsFreq),
      cent: Number(tone.cent).toFixed(decimalDigitsCent),
      ratio: Number(tone.ratio).toFixed(decimalDigitsRatio),
    }))
    .filter(Boolean);
};

const updateScale = (state: FiddleStateImpl) => ({
  scaleInput: state.scaleInput,
  freq: scaleToFreq(state),
  scaleLength: getScaleLength(state.scaleInput),
  scales: state.scales.map((s, index) =>
    state.scaleIndex === index ? { ...s, scaleInput: state.scaleInput } : s
  ),
  overview: scaleToOverview(state),
});

const menuButtonOpensModal =
  (
    state: FiddleState,
    setState: undefined | ((nextState: FiddleState) => void)
  ) =>
  (title: string, formName: string) => {
    return createElement("button", undefined, title, undefined, {
      // @ts-ignore
      onclick: () => {
        // @ts-ignore
        setState({
          ...state,
          form: {
            // @ts-ignore
            ...state.form,
            // @ts-ignore
            [formName]: { ...state.form[formName], open: true },
          },
        });
      },
    });
  };

const changeScaleMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const dropdownItem = menuButtonOpensModal(state, setState);

  return [
    createElement("div", sx({ display: "flex" }), [
      createElement("button", sx({ flex: 1 }), "New scale", undefined, {
        // @ts-ignore
        onmouseover: () => {
          const contentNew = document.getElementById(
            "dropdown-new-scale-content"
          );
          if (contentNew) {
            contentNew.setAttribute("style", "display: block;");
          }
          const contentModify = document.getElementById(
            "dropdown-modify-scale-content"
          );
          if (contentModify) {
            contentModify.setAttribute("style", "display: none;");
          }
        },
      }),
      createElement("button", sx({ flex: 1 }), "Modify scale", undefined, {
        // @ts-ignore
        onmouseover: () => {
          const contentModify = document.getElementById(
            "dropdown-modify-scale-content"
          );
          if (contentModify) {
            contentModify.setAttribute("style", "display: block;");
          }
          const contentNew = document.getElementById(
            "dropdown-new-scale-content"
          );
          if (contentNew) {
            contentNew.setAttribute("style", "display: none;");
          }
        },
      }),
    ]),
    createElement("p", sx({ marginTop: "8px" }), "Select scale"),
    createElement(
      "select",
      sx({ width: "100%" }),
      // @ts-ignore
      state.scales.map((scale, index) =>
        createElement(
          "option",
          undefined,
          scale.name,
          // @ts-ignore
          index === Number(state.scaleIndex)
            ? { value: index, selected: "selected" }
            : {
                value: index,
              }
        )
      ),
      // @ts-ignore
      { value: state.scaleIndex },
      {
        // @ts-ignore
        onchange: (e) => {
          // @ts-ignore
          setState({
            ...state,
            scaleIndex: Number(e.target.value),
            // @ts-ignore
            scaleInput: state.scales[Number(e.target.value)].scaleInput,
            recompute: true,
          });
        },
      }
    ),
    createElement("p", sx({ marginTop: "8px" }), "Scale name"),
    createElement(
      "div",
      sx({ display: "flex", flex: 1 }),
      createElement(
        "input",
        sx({ width: "100%" }),
        undefined,
        {
          // @ts-ignore
          value: state.scales[state.scaleIndex].name,
        },
        {
          // @ts-ignore
          onchange: (e) => {
            // @ts-ignore
            const newScales = state.scales.map((scale, index) =>
              // @ts-ignore
              index === state.scaleIndex
                ? { ...scale, name: e.target.value }
                : scale
            );
            // @ts-ignore
            setState({ ...state, scales: newScales });
          },
        }
      )
    ),
    createElement(
      "button",
      sx({ marginTop: "8px" }),
      "Add new scale",
      {},
      {
        // @ts-ignore
        onclick: () => {
          // @ts-ignore
          setState({
            ...state,
            scales: [
              // @ts-ignore
              ...state.scales,
              {
                // @ts-ignore
                name: "Scale #" + state.scales.length,
                scaleInput: defaultScale,
              },
            ],
            // @ts-ignore
            scaleIndex: state.scales.length,
            scaleInput: defaultScale,
            recompute: true,
          });
        },
      }
    ),
    createElement(
      "div",
      sx({
        display: "none",
        position: "absolute",
        top: "75px",
        left: "4px",
        width: "calc(12.5% - 4px)",
      }),
      createElement(
        "div",
        sx({
          display: "flex",
          flexDirection: "column",
          fontSize: "16px",
        }),
        [
          dropdownItem("Equal temperament (EDO)", "edo"),
          dropdownItem("Moment of symmetry (MOS)", "mos"),
          dropdownItem("Rank-2 temperament (1-generated)", "linear"),
          dropdownItem("Meantone temperament", "meantone"),
          dropdownItem("Harmonic series", "harm"),
          dropdownItem("Just temperament", "just"),
          dropdownItem("Ratio chord", "ratiochord"),
          dropdownItem("Tempered limit", "limit"),
          dropdownItem("Higher rank temperament", "higher"),
          dropdownItem("Euler-Fokker genus form", "eulerfokker"),
          dropdownItem("Preset scale", "preset"),
        ]
      ),
      {
        id: "dropdown-new-scale-content",
      },
      {
        // @ts-ignore
        onmouseleave: () => {
          const contentNew = document.getElementById(
            "dropdown-new-scale-content"
          );
          if (contentNew) {
            contentNew.setAttribute("style", "display: none;");
          }
          const contentModify = document.getElementById(
            "dropdown-modify-scale-content"
          );
          if (contentModify) {
            contentModify.setAttribute("style", "display: none;");
          }
        },
      }
    ),
    createElement(
      "div",
      sx({
        display: "none",
        position: "absolute",
        top: "75px",
        left: "12.5%",
        width: "calc(12.5% - 4px)",
      }),
      createElement(
        "div",
        sx({
          display: "flex",
          flexDirection: "column",
          fontSize: "16px",
        }),
        [
          dropdownItem("Transpose", "transpose"),
          dropdownItem("Mode", "mode"),
          dropdownItem("Subset", "subset"),
          dropdownItem("Multiply", "multiply"),
          dropdownItem("Reverse", "reverse"),
          dropdownItem("Sort", "sort"),
          dropdownItem("Stretch", "stretch"),
          dropdownItem("Approximate by equal", "approxequal"),
          dropdownItem("Temper", "temper"),
        ]
      ),
      {
        id: "dropdown-modify-scale-content",
      },
      {
        // @ts-ignore
        onmouseleave: () => {
          const contentNew = document.getElementById(
            "dropdown-new-scale-content"
          );
          if (contentNew) {
            contentNew.setAttribute("style", "display: none;");
          }
          const contentModify = document.getElementById(
            "dropdown-modify-scale-content"
          );
          if (contentModify) {
            contentModify.setAttribute("style", "display: none;");
          }
        },
      }
    ),
  ];
};

const scaleOverview = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const overview = state.overview;

  return createElement(
    "div",
    sx({ overflow: "auto", height: "100%", padding: "0 8px" }),
    [
      createElement(
        "div",
        sx({
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "2px solid fuchsia",
        }),
        [
          createElement("div", undefined, "Index"),
          createElement("div", undefined, `Frequency`),
          createElement("div", undefined, "Cents"),
          createElement("div", undefined, "Ratio"),
          createElement("div", undefined, "Name"),
        ]
      ),
      ...overview.map((tone: any, index: number) =>
        createElement(
          "div",
          sx({ display: "flex", justifyContent: "space-between" }),
          [
            createElement("div", undefined, index.toString()),
            createElement("div", undefined, `${tone.freq} Hz`),
            createElement("div", undefined, `${tone.cent}c`),
            createElement("div", undefined, tone.ratio),
            createElement("div", undefined, tone.name),
          ]
        )
      ),
    ]
  );
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
    createElement("p", undefined, "Number of keys up"),
    createElement(
      "input",
      undefined,
      undefined,
      { value: tuning.keysUp },
      {
        // @ts-ignore
        onchange: (e) => {
          const val = Number(e.target.value);
          if (Number.isFinite(val) && val >= 0) {
            // @ts-ignore
            setState({
              ...state,
              tuning: { ...tuning, keysUp: val },
              recompute: true,
            });
          }
        },
      }
    ),
    createElement("p", undefined, "Number of keys down"),
    createElement(
      "input",
      undefined,
      undefined,
      { value: tuning.keysDown },
      {
        // @ts-ignore
        onchange: (e) => {
          const val = Number(e.target.value);
          if (Number.isFinite(val) && val >= 0) {
            // @ts-ignore
            setState({
              ...state,
              tuning: { ...tuning, keysDown: val },
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
    createElement("div", sx({ flex: 1, padding: "0 4px" }), [
      createElement("div", undefined, changeScaleMenu(state, setState)),
    ]),
    createElement(
      "div",
      sx({ flex: 1, padding: "0 4px" }),
      scaleLibrary(state, setState)
    ),
    createElement(
      "div",
      sx({ flex: 1, padding: "0 4px" }),
      scaleOverview(state, setState)
    ),
    createElement(
      "div",
      sx({ flex: 1, padding: "0 4px" }),
      scaleTuning(state, setState)
    ),
  ]);

const scaleLibrary = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return createElement(
    "textarea",
    sx({ height: "100%", width: "100%", resize: "none" }), // @ts-ignore
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
  );
};

sy({ border: "2px solid pink", backgroundColor: "darkmagenta" }, "key-active");

const keys = (state: FiddleState) => {
  const playTone = playToneImpl(state);
  const releaseNote = releaseNoteImpl(state);

  return createElement(
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
};

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
          padding: "16px 16px 64px 16px",
          width: "80%",
          margin: "auto",
          border: "2px solid grey",
          backgroundColor: "#dddddd",
        }),
        [
          createElement(
            "div",
            sx({ display: "flex", justifyContent: "flex-end" }),
            createElement(
              "button",
              undefined,
              "X",
              {},
              {
                // @ts-ignore
                onclick: () => {
                  // @ts-ignore
                  setState({
                    ...state,
                    form: {
                      // @ts-ignore
                      ...state.form,
                      // @ts-ignore
                      edo: { ...state.form.edo, open: false },
                    },
                  });
                },
              }
            )
          ),
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
                oninput: (event) => {
                  // @ts-ignore
                  setState({
                    ...state,
                    form: {
                      // @ts-ignore
                      ...state.form,
                      // @ts-ignore
                      edo: { ...state.form.edo, N: event.target.value },
                    },
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
                form: {
                  // @ts-ignore
                  ...state.form, // @ts-ignore
                  edo: { ...state.form.edo, open: false },
                },
              });
            },
          }),
        ],
        {},
        {
          // @ts-ignore
          onclick: (e) => {
            e.stopPropagation();
          },
        }
      ),
    ],
    { id: "modal-edo" },
    {
      // @ts-ignore
      onclick: () => {
        // @ts-ignore
        setState({
          ...state,
          form: {
            // @ts-ignore
            ...state.form,
            // @ts-ignore
            edo: { ...state.form.edo, open: false },
          },
        });
      },
    }
  );

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
              "Panic",
              () => {
                console.log("panic");
              },
              false,
              true
            ),
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

const sliderInput = (
  label: string,
  value: string,
  setter: (nextValue: string) => void
) => {
  return createElement("div", undefined, [
    createElement("p", undefined, label),
    createElement(
      "input",
      undefined,
      undefined,
      {
        type: "range",
        min: "0",
        max: "100",
        value,
      },
      {
        // @ts-ignore
        onchange: (e) => {
          setter(e.target.value);
        },
      }
    ),
  ]);
};

const envelopeCurveSelect = (
  value: string,
  setter: (nextValue: string) => void
) => {
  return createElement("div", undefined, [
    createElement("p", undefined, "Curve"),
    createElement(
      "select",
      undefined,
      [
        createElement(
          "option",
          undefined,
          "Linear",
          value === "linear"
            ? { selected: "selected", value: "linear" }
            : { value: "linear" }
        ),
        createElement(
          "option",
          undefined,
          "Exponential",
          value === "exponential"
            ? { selected: "selected", value: "exponential" }
            : { value: "exponential" }
        ),
      ],
      { value },
      {
        // @ts-ignore
        onchange: (e) => {
          setter(e.target.value);
        },
      }
    ),
  ]);
};

const envelopeADSRMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return [
    createElement("p", undefined, "ADSR envelope"),
    createElement("h2", undefined, "Attack"),
    sliderInput(
      "Volume",
      (synth.attackGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            attackGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.attackTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            attackTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.attackCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, attackCurve: nextValue },
      });
    }),
    createElement("h2", undefined, "Decay"),
    sliderInput(
      "Volume",
      (synth.decayGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            decayGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.decayTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            decayTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.decayCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, decayCurve: nextValue },
      });
    }),
    createElement("h2", undefined, "Sustain"),
    sliderInput(
      "Volume",
      (synth.sustainGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            sustainGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.sustainTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            sustainTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.sustainCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, sustainCurve: nextValue },
      });
    }),
    createElement("h2", undefined, "Release"),
    sliderInput(
      "Volume",
      (synth.releaseGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            releaseGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.releaseTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            releaseTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.releaseCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, releaseCurve: nextValue },
      });
    }),
  ];
};

const envelopePresetMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("p", undefined, "Preset envelope"),
    createElement("p", undefined, "Under construction - Preset envelopes"),
  ];
};

const envelopeCustomMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("p", undefined, "Custom envelope"),
    createElement(
      "p",
      undefined,
      "Under construction - Envelope custom phases - volume, curve"
    ),
  ];
};

const envelopeMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return createElement("div", undefined, [
    ...(synth.envelopeType === "adsr" ? envelopeADSRMenu(state, setState) : []),
    ...(synth.envelopeType === "preset"
      ? envelopePresetMenu(state, setState)
      : []),
    ...(synth.envelopeType === "custom"
      ? envelopeCustomMenu(state, setState)
      : []),
  ]);
};

const synthTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return [
    createElement("div", sx({ display: "flex" }), [
      createElement("div", sx({ flex: 1 }), [
        sliderInput(
          "Volume",
          (synth.totalGain * 100).toFixed(0).toString(),
          (nextValue) => {
            const val = Number(Number(nextValue).toFixed(0));
            const newTotalGain = val / 100;
            // @ts-ignore
            setState({
              ...state,
              synth: {
                ...synth,
                totalGain: newTotalGain,
              },
            });
            setTotalGain(newTotalGain);
          }
        ),
        createElement("p", undefined, "Organ"),
        createElement(
          "input",
          undefined,
          undefined,
          synth.organ
            ? { type: "checkbox", checked: "true" }
            : { type: "checkbox" },
          {
            // @ts-ignore
            onchange: () => {
              // @ts-ignore
              setState({
                ...state,
                synth: { ...synth, organ: !synth.organ },
              });
            },
          }
        ),
        createElement("p", undefined, "Envelope type - ADSR or custom"),
        createElement(
          "select",
          undefined,
          [
            createElement(
              "option",
              undefined,
              "ADSR",
              synth.envelopeType === "adsr"
                ? {
                    selected: "selected",
                    value: "adsr",
                  }
                : { value: "adsr" }
            ),
            createElement(
              "option",
              undefined,
              "Preset",
              synth.envelopeType === "preset"
                ? {
                    selected: "selected",
                    value: "preset",
                  }
                : { value: "preset" }
            ),
            createElement(
              "option",
              undefined,
              "Custom",
              synth.envelopeType === "custom"
                ? {
                    selected: "selected",
                    value: "custom",
                  }
                : { value: "custom" }
            ),
          ],
          { value: synth.envelopeType },
          {
            // @ts-ignore
            onchange: (e) => {
              //@ts-ignore
              setState({
                ...state,
                synth: { ...synth, envelopeType: e.target.value },
              });
            },
          }
        ),
        envelopeMenu(state, setState),
      ]),
      createElement("div", sx({ flex: 1 }), [
        createElement("p", undefined, "Timbre"),
        createElement(
          "select",
          sx({ width: "100%" }),
          // @ts-ignore
          timbrePresets.map((timbre, index) =>
            createElement(
              "option",
              undefined,
              timbre.title,
              // @ts-ignore
              timbre.id === state.synth.waveformPreset
                ? { value: timbre.id, selected: "selected" }
                : {
                    value: timbre.id,
                  }
            )
          ),
          // @ts-ignore
          { value: state.synth.waveformPreset },
          {
            // @ts-ignore
            onchange: (e) => {
              // @ts-ignore
              setState({
                ...state,
                synth: {
                  // @ts-ignore
                  ...state.synth,
                  waveformPreset: e.target.value,
                },
              });
              setWaveform(e.target.value);
            },
          }
        ),
      ]),
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
      createElement("p", undefined, "UNDER CONSTRUCTION"),
      createElement(
        "p",
        undefined,
        "TODO: Precision - decimal digits - freq, cent, ratio + freq on keys"
      ),
      createElement("p", undefined, "TODO: Start gain"),
      createElement("p", undefined, "TODO: Start time"),
      createElement("p", undefined, "TODO: End gain"),
      createElement("p", undefined, "TODO: End time"),
      createElement("p", undefined, "TODO: Kill time"),
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
      createElement("h2", undefined, "Jakub Eliáš (development & design)"),
      createElement("h2", undefined, "Janne Karimäki (analysis & testing)"),
      createElement("h2", undefined, "Developed using Eofol"),
      createElement("h2", undefined, "2024"),
      createElement("h2", undefined, "MIT license"),
    ]),
  ];
};

const initialState = {
  scaleInput: defaultScale,
  scales: [{ name: "Initial scale", scaleInput: defaultScale }],
  scaleIndex: 0,
  tab: 0,
  tuning: {
    baseFreq: 220,
    period: 2,
    keysUp: 24,
    keysDown: 12,
  },
  form: {
    edo: {
      open: false,
      N: 12,
    },
    mos: {
      open: false,
      N: 12,
    },
    linear: {
      open: false,
      N: 12,
    },
    meantone: {
      open: false,
      N: 12,
    },
    harm: {
      open: false,
      N: 12,
    },
    just: {
      open: false,
      N: 12,
    },
    ratiochord: {
      open: false,
      N: 12,
    },
    limit: {
      open: false,
      N: 12,
    },
    higher: {
      open: false,
      N: 12,
    },
    eulerfokker: {
      open: false,
      N: 12,
    },
    preset: {
      open: false,
      N: 12,
    },
    transpose: {
      open: false,
      N: 12,
    },
    mode: {
      open: false,
      N: 12,
    },
    subset: {
      open: false,
      N: 12,
    },
    multiply: {
      open: false,
      N: 12,
    },
    reverse: {
      open: false,
      N: 12,
    },
    sort: {
      open: false,
      N: 12,
    },
    stretch: {
      open: false,
      N: 12,
    },
    approxequal: {
      open: false,
      N: 12,
    },
    temper: {
      open: false,
      N: 12,
    },
  },
  recompute: false,
  synth: {
    totalGain: 1,
    organ: true,
    envelopeType: "adsr",
    attackGain: 1,
    attackTime: 0.02,
    attackCurve: "exponential",
    decayGain: 0.9,
    decayTime: 0.02,
    decayCurve: "linear",
    sustainGain: 0.7,
    sustainTime: 0.02,
    sustainCurve: "linear",
    releaseGain: 0.7,
    releaseTime: 0.1,
    releaseCurve: "linear",
    waveformType: "preset",
    waveformPreset: "distorted-organ",
  },
} as FiddleStateImpl;

defineBuiltinElement<FiddleStateImpl>({
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

    if (stateImpl.form.edo.open) {
      const content = document.getElementById("modal-edo");
      if (content) {
        content.setAttribute("style", "display: block;");
      }
    }
  },
  render: (state, setState) => {
    console.log("(R) App");
    // @ts-ignore
    const freq = state.freq;
    // @ts-ignore
    const tab = state.tab;

    mapKeyboardKeys(state)(freq);

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
