import { createElement, sx, sy } from "@eofol/eofol";
import { defaultScale } from "../../../initial-state";
import {
  clearKeyElementMap,
  keyActiveHoverStyle,
  playTone as playToneImpl,
  releaseNote as releaseNoteImpl,
  setKeyElementMap,
} from "../../../synth-lib";
import { FiddleState, FiddleStateImpl } from "../../../types";
import { mod, trimWhitespace } from "../../../util";
import { updateScale } from "../../../sheen";
import { scalePresets, scalePresetsFlat } from "../../../presets/scale-presets";
import {
  dropdown,
  select,
  input,
  dropdownContent,
  modal,
  notify,
  tooltip,
  button,
} from "@eofol/eofol-simple";
import { breakpoint } from "../../../extract/breakpoint";
import { theme } from "../../../theme";
import { textarea } from "../../../extract/textarea";
import { p } from "../../../extract/font";
import {
  keyColorNonoctaveStyle,
  keyColorOctaveStyle,
} from "../../../keyboard-key-mapping";
import { mouseHandlers, touchHandlers } from "../../../key-handlers";
import { div } from "../../../extract/primitive";

const MODAL_BG_COLOR = "#2d3748";
const MODAL_BORDER_COLOR = theme.primary;

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
  (title: string, formName: string, notImplemented?: boolean) => {
    return button({
      styles: sx({ width: "256px", height: "40px" }),
      children: title,
      onClick: () => {
        if (!notImplemented) {
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
        } else {
          notify({ title: "Not implemented yet." });
        }
      },
    });
  };

const changeScaleMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const dropdownItem = menuButtonOpensModal(state, setState);

  const scaleNameInputElement = input({
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
  });
  scaleNameInputElement.setAttribute("spellcheck", "false");

  return [
    div(sx({ display: "flex" }), [
      dropdown("dropdown-new-scale-content", "Create scale", sx({ flex: 1 })),
      dropdown(
        "dropdown-modify-scale-content",
        "Modify scale",
        sx({ flex: 1 })
      ),
    ]),
    div(sx({ marginTop: "16px" }), p("Select scale")),
    div(
      sx({ width: "256px", margin: "0 auto 0 auto", display: "flex" }),
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
      })
    ),
    div(sx({ marginTop: "8px" }), p("Scale name")),
    div(
      sx({ width: "256px", margin: "0 auto 0 auto", display: "flex" }),
      scaleNameInputElement
    ),
    div(
      sx({
        display: "flex",
        flexDirection: "column",
        width: "256px",
        margin: "16px auto 0 auto",
      }),
      [
        button({
          children: "Add new scale",
          onClick: () => {
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
        }),
        button({
          styles: sx({ marginTop: "16px" }),
          children: "Delete scale",
          // @ts-ignore
          disabled: state.scales.length <= 1,
          onClick: () => {
            // @ts-ignore
            const newScales = state.scales.filter(
              // @ts-ignore
              (item, i) => state.scaleIndex !== i
            );
            // @ts-ignore
            const newScaleIndex =
              // @ts-ignore
              state.scaleIndex === 0
                ? 0
                : // @ts-ignore
                  state.scaleIndex - 1;
            // @ts-ignore
            setState({
              ...state,
              // @ts-ignore
              scales: newScales,
              // @ts-ignore
              scaleInput: newScales[newScaleIndex].scaleInput,
              scaleIndex: newScaleIndex,
              recompute: true,
            });
          },
        }),
      ]
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
        dropdownItem("Ratio chord", "ratiochord", true),
        dropdownItem("Tempered limit", "limit", true),
        dropdownItem("Higher rank temperament", "higher", true),
        dropdownItem("Euler-Fokker genus form", "eulerfokker", true),
        dropdownItem("Preset scale", "preset"),
      ]
    ),
    dropdownContent(
      "dropdown-modify-scale-content",
      sx({ top: "75px", left: "12.5%", width: "calc(12.5% - 4px)" }),
      [
        dropdownItem("Transpose", "transpose", true),
        dropdownItem("Mode", "mode", true),
        dropdownItem("Subset", "subset", true),
        dropdownItem("Multiply", "multiply", true),
        dropdownItem("Reverse", "reverse", true),
        dropdownItem("Sort", "sort", true),
        dropdownItem("Stretch", "stretch", true),
        dropdownItem("Approximate by equal", "approxequal", true),
        dropdownItem("Temper", "temper", true),
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

  return div(
    sx({
      height: "300px",
      padding: "0 8px",
      fontSize: breakpoint.md && !breakpoint.sm ? "12px" : "16px",
    }),
    [
      div(
        sx({
          display: "flex",
          justifyContent: "space-between",
          borderBottom: `2px solid ${theme.primary}`,
        }),
        [
          div(sx({ color: theme.secondary, flex: 1 }), "Index"),
          div(sx({ color: theme.secondary, flex: 3 }), `Frequency`),
          div(sx({ color: theme.secondary, flex: 3 }), "Cents"),
          div(sx({ color: theme.secondary, flex: 2 }), "Ratio"),
          div(sx({ color: theme.secondary, flex: 2 }), "Name"),
        ]
      ),
      div(sx({ overflow: "auto", height: "280px" }), [
        ...overview.map((tone: any, index: number) => {
          const displayIndex = index.toString();
          const displayFreq = `${tone.freq} Hz`;
          const displayCent = `${tone.cent}c`;

          return div(
            sx({
              display: "flex",
              justifyContent: "space-between",
              color: tone.isOctave ? theme.secondary : theme.primary,
            }),
            [
              div(
                sx({ display: "flex", justifyContent: "center", flex: 1 }),
                tooltip(displayIndex, p(displayIndex))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 3,
                }),
                tooltip(displayFreq, p(displayFreq))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 3,
                }),
                tooltip(displayCent, p(displayCent))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 2,
                }),
                tooltip(tone.ratio, p(tone.ratio))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 2,
                }),
                tooltip(tone.name, p(trimWhitespace(tone.name)))
              ),
            ]
          );
        }),
      ]),
    ]
  );
};

const scaleTuning = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const tuning = state.tuning;

  return div(sx({ marginTop: "16px" }), [
    p("Base frequency Hz"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
      input({
        name: "input-basefreq",
        value: tuning.baseFreq,
        classname: sx({ width: "100%" }),
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
      })
    ),
    p("Period interval (Equave) ratio"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
      input({
        name: "input-period",
        value: tuning.period,
        classname: sx({ width: "100%" }),
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
      })
    ),
    p("Number of keys up"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
      input({
        name: "input-keys-up",
        value: tuning.keysUp,
        classname: sx({ width: "100%" }),
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
      })
    ),
    p("Number of keys down"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
      input({
        name: "input-keys-down",
        value: tuning.keysDown,
        classname: sx({ width: "100%" }),
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
      })
    ),
  ]);
};

const getMenuHeight = () => {
  if (breakpoint.xs) {
    return "1200px";
  }
  if (breakpoint.sm) {
    return "600px";
  }
  return "300px";
};

const inputMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const changeScaleMenuElement = div(
    sx({ flex: 1, padding: "0 0 0 0", height: "300px" }),
    [div(undefined, changeScaleMenu(state, setState))]
  );
  const scaleLibraryElement = div(
    sx({ flex: 1, padding: "0 8px" }),
    scaleLibrary(state, setState)
  );
  const scaleOverviewElement = div(
    sx({ flex: 1, padding: "0 0" }),
    scaleOverview(state, setState)
  );
  const scaleTuningElement = div(
    sx({ flex: 1, padding: "0 0 0 0" }),
    scaleTuning(state, setState)
  );

  return div(
    sx({
      display: "flex",
      height: getMenuHeight(),
      flexDirection: breakpoint.sm ? "column" : "row",
    }),
    !breakpoint.xs
      ? [
          div(sx({ display: "flex", flex: 1, height: "300px" }), [
            changeScaleMenuElement,
            scaleLibraryElement,
          ]),
          div(sx({ display: "flex", flex: 1, height: "300px" }), [
            scaleOverviewElement,
            scaleTuningElement,
          ]),
        ]
      : [
          changeScaleMenuElement,
          scaleLibraryElement,
          scaleOverviewElement,
          scaleTuningElement,
        ]
  );
};

const scaleLibrary = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const textareaElement = textarea({
    name: "scale-library",
    // @ts-ignore
    value: state.scaleInput,
    onChange: (nextVal) => {
      const nextState = {
        ...state,
        scaleInput: nextVal,
      } as FiddleStateImpl;
      // @ts-ignore
      setState({
        ...nextState,
        ...updateScale(nextState),
      });
    },
    classname: sx({ height: "284px", width: "100%" }),
  });
  return textareaElement;
};

sy(
  {
    border: `2px solid ${theme.primaryLighter}`,
    backgroundColor: theme.secondaryDark,
  },
  "key-active"
);

const getKeyLabel = (state: FiddleState, i: number) => {
  // @ts-ignore
  const keyLabel = state.options.keyLabel;
  // @ts-ignore
  const tone = state.overview[i];

  if (keyLabel === "freq") {
    return (
      // @ts-ignore
      Number(tone.freq).toFixed(state.options.decimalDigitsFreqOnKeys) + " Hz"
    );
  }
  if (keyLabel === "cent") {
    // @ts-ignore
    return Number(tone.cent).toFixed(state.options.decimalDigitsCent) + "c";
  }
  if (keyLabel === "ratio") {
    // @ts-ignore
    return Number(tone.ratio).toFixed(state.options.decimalDigitsRatio);
  }
  if (keyLabel === "name") {
    return trimWhitespace(tone.name);
  }
  return i.toString();
};

const renderKey = (
  state: FiddleState,
  i: number,
  playTone: any,
  releaseNote: any
) => {
  // @ts-ignore
  const val = state.overview[i].freq;
  // @ts-ignore
  const isOctave = state.overview[i].isOctave;
  const keyLabel = getKeyLabel(state, i);

  // @ts-ignore
  const keyElement = div(
    [
      sy(
        {
          height: "92px",
          fontSize: "16px",
          border: `2px solid ${theme.primary}`,
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          touchAction: "none",
          direction: "ltr",
        },
        "key-inactive"
      ),
      keyActiveHoverStyle,
      isOctave ? keyColorOctaveStyle : keyColorNonoctaveStyle,
    ],
    keyLabel,
    { id: `key-${val}` },
    // @ts-ignore
    mouseHandlers(val, isOctave, playTone, releaseNote)
  );
  setKeyElementMap(val, keyElement);
  return keyElement;
};

const keys = (state: FiddleState) => {
  const playTone = playToneImpl(state);
  const releaseNote = releaseNoteImpl(state);

  // @ts-ignore
  const freq = state.overview.map((item) => item.freq);

  setTimeout(() => {
    touchHandlers(playTone, releaseNote);
  }, 50);

  clearKeyElementMap();

  return div(
    sx({ maxHeight: "100%" }),
    div(
      sx({
        display: "grid",
        gridTemplateColumns: breakpoint.md
          ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
          : "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
        columnGap: 0,
        rowGap: 0,
        gridAutoFlow: "dense",
        direction: "rtl",
      }),
      freq.map((val: string, i: number) =>
        renderKey(state, freq.length - 1 - i, playTone, releaseNote)
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
    const resultScale = result(state.form[formName]);

    return modal(
      id,
      title,
      div(undefined, [
        div(
          undefined,
          form
            .map((item) => [
              div(sx({ fontSize: "24px" }), item.title),
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
            .flat()
        ),
        textarea({
          name: "result-scale",
          value: resultScale,
          classname: sx({ height: "300px", marginTop: "16px" }),
          onChange: () => {},
        }),
      ]),
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
          scaleInput: resultScale,
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
      undefined,
      sx({
        backgroundColor: MODAL_BG_COLOR,
        border: `2px solid ${MODAL_BORDER_COLOR}`,
      })
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
      div(
        sx({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }),
        [
          select({
            styles: sx({ width: "450px" }),
            options: scalePresets,
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
          textarea({
            name: "result-preset-scale",
            value:
              scalePresetsFlat.find(
                // @ts-ignore
                (item) => item.id === state.form.preset.id
              )?.value ?? "",
            onChange: () => {},
            classname: sx({
              height: "300px",
              marginTop: "16px",
              marginBottom: "8px",
            }),
          }),
        ]
      ),
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
        const presetScale = scalePresetsFlat.find(
          // @ts-ignore
          (item) => item.id === state.form.preset.id
        );
        if (presetScale) {
          // @ts-ignore
          setState({
            ...state,
            recompute: true,
            // @ts-ignore
            scales: state.scales.map((scale, index) =>
              // @ts-ignore
              index === state.scaleIndex
                ? { ...scale, name: presetScale.title }
                : scale
            ),
            // @ts-ignore
            scaleInput: presetScale.value,
            form: {
              // @ts-ignore
              ...state.form,
              // @ts-ignore
              preset: { ...state.form.preset, open: false },
            },
          });
        }
      },
      undefined,
      sx({
        backgroundColor: MODAL_BG_COLOR,
        border: `2px solid ${MODAL_BORDER_COLOR}`,
      })
    ),
  ];
};

const desktopScaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    inputMenu(state, setState),
    keys(state),
    ...formModal(state, setState),
  ];
};

const mobileScaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const isScaleTab = state.smallTab === 0;
  // @ts-ignore
  const isKeyboardTab = state.smallTab === 1;

  return [
    div(sx({ display: "flex", height: "50px" }), [
      button({
        onClick: () => {
          // @ts-ignore
          setState({ ...state, smallTab: 0 });
        },
        children: "Scale",
      }),
      button({
        onClick: () => {
          // @ts-ignore
          setState({ ...state, smallTab: 1 });
        },
        children: "Keyboard",
      }),
    ]),
    ...(isScaleTab ? [inputMenu(state, setState)] : []),
    ...(isScaleTab ? formModal(state, setState) : []),
    ...(isKeyboardTab ? [keys(state)] : []),
  ];
};

export const scaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return !breakpoint.sm
    ? desktopScaleTab(state, setState)
    : mobileScaleTab(state, setState);
};
