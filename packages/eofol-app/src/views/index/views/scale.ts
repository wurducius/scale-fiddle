import {
  createElement,
  dropdown,
  dropdownContent,
  e,
  input,
  modal,
  select,
  sx,
  sy,
} from "@eofol/eofol";
import { defaultScale } from "../../../initial-state";
import {
  flashKeyDown,
  flashKeyUp,
  keyActiveHoverStyle,
  playTone as playToneImpl,
  releaseNote as releaseNoteImpl,
} from "../../../synth-lib";
import { FiddleState, FiddleStateImpl } from "../../../types";
import { mod, mouseDown } from "../../../util";
import { updateScale } from "../../../sheen";
import { scalePresets } from "../../../scale-presets";

function onlyUnique(value: string, index: number, array: any[]) {
  return array.indexOf(value) === index;
}

function normalizePeriod(value: number, period: number) {
  if (value <= 0) {
    return value;
  }
  let val = value;
  while (val > period) {
    val = val / period;
  }
  while (val < 1) {
    val = val * period;
  }
  return val;
}

const linearScale = (state: FiddleState, T: number, g: number) =>
  Array.from({ length: T })
    .map((item, index) => {
      // @ts-ignore
      const centPeriod = 1200 * Math.log2(state.tuning.period);
      const val = mod(index * g, centPeriod);
      return val === 0
        ? // @ts-ignore
          centPeriod.toFixed(state.options.decimalDigitsCent)
        : // @ts-ignore
          val.toFixed(state.options.decimalDigitsCent);
    })
    .sort((a, b) => Number(a) - Number(b))
    .map((tone) => (tone.includes(".") ? tone : tone + "."))
    .filter(onlyUnique)
    .join("\n");

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
      dropdown("dropdown-new-scale-content", "New scale", sx({ flex: 1 })),
      dropdown(
        "dropdown-modify-scale-content",
        "Modify scale",
        sx({ flex: 1 })
      ),
    ]),
    createElement("p", sx({ marginTop: "8px" }), "Select scale"),
    select({
      // @ts-ignore
      value: state.scaleIndex,
      // @ts-ignore
      options: state.scales.map((scale, index) => ({
        title: scale.name,
        id: index,
      })),
      onChange: (nextVal) => {
        // @ts-ignore
        setState({
          ...state,
          scaleIndex: Number(nextVal),
          // @ts-ignore
          scaleInput: state.scales[Number(nextVal)].scaleInput,
          recompute: true,
        });
      },
      name: "select-scale-library",
    }),
    createElement("p", sx({ marginTop: "8px" }), "Scale name"),
    createElement(
      "div",
      sx({ display: "flex", flex: 1, justifyContent: "center" }),
      input({
        name: "input-scale-name",
        // @ts-ignore
        value: state.scales[state.scaleIndex].name,
        onChange: (nextVal) => {
          // @ts-ignore
          const newScales = state.scales.map((scale, index) =>
            // @ts-ignore
            index === state.scaleIndex ? { ...scale, name: nextVal } : scale
          );
          // @ts-ignore
          setState({ ...state, scales: newScales });
        },
      })
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
    dropdownContent(
      "dropdown-new-scale-content",
      sx({ top: "75px", left: "4px", width: "calc(12.5% - 4px)" }),
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
    dropdownContent(
      "dropdown-modify-scale-content",
      sx({ top: "75px", left: "12.5%", width: "calc(12.5% - 4px)" }),
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
    input({
      name: "input-basefreq",
      value: tuning.baseFreq,
      onChange: (nextVal) => {
        const val = Number(nextVal);
        if (Number.isFinite(val)) {
          // @ts-ignore
          setState({
            ...state,
            tuning: { ...tuning, baseFreq: val },
            recompute: true,
          });
        }
      },
    }),
    createElement("p", undefined, "Period interval (Equave)"),
    input({
      name: "input-period",
      value: tuning.period,
      onChange: (nextVal) => {
        const val = Number(nextVal);
        if (Number.isFinite(val)) {
          // @ts-ignore
          setState({
            ...state,
            tuning: { ...tuning, period: val },
            recompute: true,
          });
        }
      },
    }),
    createElement("p", undefined, "Number of keys up"),
    input({
      name: "input-keys-up",
      value: tuning.keysUp,
      onChange: (nextVal) => {
        const val = Number(nextVal);
        if (Number.isFinite(val) && val >= 0) {
          // @ts-ignore
          setState({
            ...state,
            tuning: { ...tuning, keysUp: val },
            recompute: true,
          });
        }
      },
    }),
    createElement("p", undefined, "Number of keys down"),
    input({
      name: "input-keys-down",
      value: tuning.keysDown,
      onChange: (nextVal) => {
        const val = Number(nextVal);
        if (Number.isFinite(val) && val >= 0) {
          // @ts-ignore
          setState({
            ...state,
            tuning: { ...tuning, keysDown: val },
            recompute: true,
          });
        }
      },
    }),
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

  // @ts-ignore
  const decimalDigitsFreqOnKeys = state.options.decimalDigitsFreqOnKeys;

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
            // @ts-ignore
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

const generalFormModal =
  (
    state: FiddleState,
    setState: undefined | ((nextState: FiddleState) => void)
  ) =>
  (
    id: string,
    title: string,
    formName: string,
    form: {
      title: string;
      type: string;
      innerFormName: string;
      id: string;
    }[],
    result: (params: Record<string, any>) => string
  ) => {
    // @ts-ignore
    const decimalDigitsCent = state.options.decimalDigitsCent;

    return modal(
      id,
      title,
      form
        .map((item) => [
          createElement("div", sx({ fontSize: "24px" }), item.title),
          input({
            name: "input-form-" + id,
            // @ts-ignore
            value: state.form[formName][item.innerFormName],
            onChange: (nextVal) => {
              // @ts-ignore
              setState({
                ...state,
                form: {
                  // @ts-ignore
                  ...state.form,
                  // @ts-ignore
                  [formName]: {
                    // @ts-ignore
                    ...state.form[formName],
                    [item.innerFormName]: nextVal,
                  },
                },
              });
            },
          }),
        ])
        .flat(),
      // @ts-ignore
      state.form[formName].open,
      () => {
        // @ts-ignore
        setState({
          ...state,
          form: {
            // @ts-ignore
            ...state.form,
            // @ts-ignore
            [formName]: { ...state.form[formName], open: false },
          },
        });
      },
      () => {
        const nextState = {
          ...state,
          // @ts-ignore
          scaleInput: result(state.form[formName]),
        } as FiddleStateImpl;
        // @ts-ignore
        setState({
          ...state,
          ...updateScale(nextState),
          form: {
            // @ts-ignore
            ...state.form, // @ts-ignore
            [formName]: { ...state.form[formName], open: false },
          },
        });
      },
      undefined
    );
  };

const formModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const modalImpl = generalFormModal(state, setState);

  return [
    modalImpl(
      "modal-edo",
      "Equal division of octave (EDO)",
      "edo",
      [{ title: "N", type: "number", innerFormName: "N", id: "edo" }],
      ({ N }) =>
        // @ts-ignore
        linearScale(state, N, (1200 * Math.log2(state.tuning.period)) / N)
    ),
    modalImpl(
      "modal-mos",
      "Moment of symmetry (MOS)",
      "mos",
      [
        { title: "N", type: "number", innerFormName: "N", id: "n" },
        { title: "T", type: "number", innerFormName: "T", id: "t" },
      ],
      ({ N, T }) => {
        const vals = Array.from({ length: T })
          .map((item, i) => {
            // @ts-ignore
            const periodCent = 1200 * Math.log2(state.tuning.period);
            const val = mod(
              (Math.floor(((i + 1) * N) / T) * periodCent) / N,
              periodCent
            );
            return val === 0 ? periodCent : val;
          }) // @ts-ignore
          .map((tone) => tone.toFixed(state.options.decimalDigitsCent))
          .map((tone) => (tone.includes(".") ? tone : tone + "."));
        return vals.join("\n");
      }
    ),
    modalImpl(
      "modal-linear",
      "Linear temperament (1-generated)",
      "linear",
      [
        { title: "T", type: "number", innerFormName: "T", id: "t" },
        {
          title: "Generator (cents)",
          type: "number",
          innerFormName: "g",
          id: "g",
        },
      ],
      ({ T, g }) => linearScale(state, T, g)
    ),
    modalImpl(
      "modal-meantone",
      "Equal division of octave (EDO)",
      "meantone",
      [
        { title: "T", type: "number", innerFormName: "T", id: "t" },
        {
          title: "Comma fraction",
          type: "number",
          innerFormName: "comma",
          id: "comma",
        },
      ],
      ({ T, comma }) =>
        linearScale(state, T, 1200 * Math.log2(Math.pow(5, 1 / comma)))
    ),
    modalImpl(
      "modal-harm",
      "Harmonic series",
      "harm",
      [{ title: "T", type: "number", innerFormName: "T", id: "t" }],
      ({ T }) => {
        const vals = [0];
        for (let i = 1; i < T + 1; i++) {
          // @ts-ignore
          vals.push(1200 * Math.log2(normalizePeriod(i, state.tuning.period)));
          vals.push(
            // @ts-ignore
            1200 * Math.log2(normalizePeriod(1 / i, state.tuning.period))
          );
        }
        return (
          vals
            .sort((a, b) => a - b)
            // @ts-ignore
            .map((val) => val.toFixed(state.options.decimalDigitsCent))
            .filter(onlyUnique)
            .join("\n")
        );
      }
    ),
    modalImpl(
      "modal-just",
      "Just tuning",
      "just",
      [
        { title: "T", type: "number", innerFormName: "T", id: "t" },
        { title: "Limit", type: "number", innerFormName: "limit", id: "limit" },
      ],
      ({ T, limit }) => {
        const vals = [0];
        for (let i = 1; i < T + 1; i++) {
          // @ts-ignore
          vals.push(
            1200 *
              Math.log2(
                // @ts-ignore
                normalizePeriod(Math.pow(limit, i), state.tuning.period)
              )
          );
          vals.push(
            1200 *
              Math.log2(
                // @ts-ignore
                normalizePeriod(1 / Math.pow(limit, i), state.tuning.period)
              )
          );
        }

        return (
          vals
            .sort((a, b) => a - b)
            // @ts-ignore
            .map((val) => val.toFixed(state.options.decimalDigitsCent))
            .filter(onlyUnique)
            .join("\n")
        );
      }
    ),
    modalImpl(
      "modal-ratiochord",
      "Ratio chord",
      "ratiochord",
      [
        {
          title: "Chord",
          type: "string",
          innerFormName: "chord",
          id: "chord",
        },
      ],
      () => ""
    ),
    modal(
      "modal-preset",
      "Preset scale",
      e("div", undefined, [
        select({
          options: scalePresets.map((item) => ({
            title: item.title,
            id: item.id,
          })),
          onChange: (nextVal) => {
            // @ts-ignore
            setState({
              ...state,
              form: {
                // @ts-ignore
                ...state.form,
                preset: {
                  // @ts-ignore
                  ...state.form.preset,
                  id: nextVal,
                },
              },
            });
          },
          // @ts-ignore
          value: state.form.preset.id,
          name: "select-preset-scale",
        }),
      ]),
      // @ts-ignore
      state.form.preset.open,
      () => {
        // @ts-ignore
        setState({
          ...state,
          form: {
            // @ts-ignore
            ...state.form,
            // @ts-ignore
            preset: { ...state.form.preset, open: false },
          },
        });
      },
      () => {
        // @ts-ignore
        setState({
          ...state,
          recompute: true,
          // @ts-ignore
          scaleInput: scalePresets.find(
            // @ts-ignore
            (item) => item.id === state.form.preset.id
          )?.value,
          form: {
            // @ts-ignore
            ...state.form,
            // @ts-ignore
            preset: { ...state.form.preset, open: false },
          },
        });
      }
    ),
  ];
};

export const scaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    inputMenu(state, setState),
    keys(state),
    ...formModal(state, setState),
  ];
};
