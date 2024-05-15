import {
  modal,
  input,
  textarea,
  bubble,
  div,
  flex,
  decimalPositiveValidation,
  decimalValidation,
  integerValidation,
} from "@eofol/eofol-simple";
import {
  sx,
  e,
  createStore,
  setStore,
  getTheme,
  mergeDeep,
  sy,
} from "@eofol/eofol";
import {
  EDO_N_MAX,
  HIGHER_RANK_GENERATORS_MAX,
  MULTIPLIER_MAX,
  OFFSET_CENT_MAX,
  OFFSET_MODE_MAX,
  PRIME_LIMIT_MAX,
  STEPS_UP_DOWN_MAX,
  scalePresets,
  scalePresetsFlat,
} from "../../../../data";
import {
  updateScale,
  createEdo,
  createMOS,
  createLinear,
  createMeantone,
  createHarmonicSeries,
  createJust,
  createRatioChord,
  modifyTranspose,
  modifyMode,
  modifySubscale,
  modifyMultiply,
  modifyReverse,
  modifySort,
  modifyStretch,
  modifyApproxEqual,
  modifyTemper,
  createHigherRankTemperament,
  splitScale,
  ratioToCent,
  temper,
  outputScale,
  parseScala,
} from "../../../../sheen";
import { FiddleState, FiddleStateImpl } from "../../../../types";
import {
  decimalInput,
  defineSelectSearchScalePreset,
  largeInputField,
} from "../../../../ui";
import {
  scaleNValidation,
  stepsValidation,
  csvValidation,
  splitValidation,
} from "../../../../util/validation";

createStore("select-search-preset", {
  onChange: undefined,
});

defineSelectSearchScalePreset({ options: scalePresets });

// @TODO
const scalaValidation: (val: string) => true | string = (val: string) => true;

const fieldMarginStyle = sy({ margin: "0 16px 0 16px" }, "input-field-margin");

/*
  modalImpl(
      "modal-stretch",
      "Stretch",
      "stretch",
      [
        {
          title: "Multiplier",
          type: "number",
          validation: decimalPositiveValidation(MULTIPLIER_MAX),
          innerFormName: "multiplier",
          id: "multiplier",
        },
      ],
      ({ multiplier }) => modifyStretch(state, multiplier)
    ),
    */

const stretchModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  // @ts-ignore
  const multiplier = state.form.stretch.multiplier;
  // @ts-ignore
  const period = state.tuning.period;

  const periodResult = Number(
    (period * multiplier).toFixed(
      // @ts-ignore
      state.options.decimalDigitsRatio
    )
  );
  const isInvalid = periodResult <= 1;
  const nextState = {
    ...state, // @ts-ignore
    tuning: { ...state.tuning, period: periodResult },
  };
  const stretchResult = modifyStretch(nextState, multiplier);

  return modal(
    "modal-stretch",
    "Stretch",
    div(sx({ marginTop: "24px" }), [
      flex({ justifyContent: "center" }, [
        largeInputField(
          [
            div(
              sx({
                height: "32px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Multiplier"
            ),
            decimalInput({
              name: "modal-stretch-multiplier", // @ts-ignore
              min: 0,
              minNotIncluded: true,
              max: MULTIPLIER_MAX,
              value: multiplier,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    stretch: { ...state.form.stretch, multiplier: Number(val) },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
      ]),
      largeInputField(
        [
          textarea({
            name: "modal-stretch-preview",
            value: isInvalid ? "" : stretchResult,
            onChange: (val) => {},
            classname: sx({ height: "256px" }),
            readonly: true,
          }),
          bubble(
            "Invalid result. Stretched period lesser or equal to 1/1.",
            isInvalid
          ),
          div(
            sx({
              marginTop: "16px",
              marginBottom: "16px",
              fontSize: theme.typography.heading.fontSize,
            }),
            isInvalid ? "" : `Stretched period: ${periodResult}`
          ),
        ],
        sx({
          margin: "16px auto 0 auto",
          position: "relative",
        })
      ),
    ]), // @ts-ignore
    state.form.stretch.open,
    () => {
      // @ts-ignore
      setState(
        mergeDeep(state, {
          form: {
            stretch: { open: false },
          },
        })
      );
    },
    () => {
      if (!isInvalid) {
        // @ts-ignore
        setState({
          ...state,
          tuning: {
            // @ts-ignore
            ...state.tuning,
            period: periodResult,
          },
          scaleInput: stretchResult,
          recompute: true,
          form: {
            // @ts-ignore
            ...state.form,
            stretch: {
              // @ts-ignore
              ...state.form.stretch,
              open: false,
            },
          },
        });
      }
    },
    undefined,
    sx({
      backgroundColor: theme.color.backgroundModal,
      border: `2px solid ${theme.color.primary}`,
    })
  );
};

const temperModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  // @ts-ignore
  const commas = state.form.temper.commas;
  // @ts-ignore
  const epsilon = state.form.temper.epsilon;

  const temperResult = modifyTemper(state, commas, epsilon);
  // @ts-ignore
  const temperedOutResult = state.scaleLength - splitScale(temperResult).length;

  return modal(
    "modal-temper",
    "Temper",
    div(sx({ marginTop: "24px" }), [
      flex({ justifyContent: "center" }, [
        largeInputField(
          [
            div(
              sx({
                height: "96px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Commas to temper out, Scala format separated by comma"
            ),
            input({
              name: "modal-temper-commas", // @ts-ignore
              value: commas,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    temper: { ...state.form.temper, commas: val },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
        largeInputField(
          [
            div(
              sx({
                height: "96px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Epsilon comparison tolerance"
            ),
            input({
              name: "modal-temper-epsilon", // @ts-ignore
              value: epsilon,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    temper: { ...state.form.temper, epsilon: val },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
      ]),
      largeInputField(
        [
          textarea({
            name: "modal-temper-preview",
            value: temperResult,
            onChange: (val) => {},
            classname: sx({ height: "256px" }),
            readonly: true,
          }),
          div(
            sx({
              marginTop: "16px",
              marginBottom: "16px",
              fontSize: theme.typography.heading.fontSize,
            }),
            `Tones tempered out: ${temperedOutResult}`
          ),
        ],
        sx({ margin: "16px auto 0 auto " })
      ),
    ]), // @ts-ignore
    state.form.temper.open,
    () => {
      // @ts-ignore
      setState(
        mergeDeep(state, {
          form: {
            temper: { open: false },
          },
        })
      );
    },
    () => {
      // @ts-ignore
      setState({
        ...state,
        scaleInput: temperResult,
        recompute: true,
      });
    },
    undefined,
    sx({
      backgroundColor: theme.color.backgroundModal,
      border: `2px solid ${theme.color.primary}`,
    })
  );
};

const higherModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  const higherResult = // @ts-ignore
    createHigherRankTemperament(state, setState, state.form.higher);

  return modal(
    "modal-higher-rank-temperament",
    "Higher rank temperament",
    div(
      sx({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "24px",
      }),
      [
        div(sx({ display: "flex" }), [
          div(sx({ margin: "0 16px 0 16px" }), [
            div(
              sx({
                height: "96px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Generators in Scala format separated by commas"
            ),
            input({
              // @ts-ignore
              value: state.form.higher.generators,
              name: "input-form-higher-generators",
              onChange: (nextVal) => {
                // @ts-ignore
                setState(
                  mergeDeep(state, {
                    form: {
                      higher: {
                        generators: nextVal,
                      },
                    },
                  })
                );
              },
            }),
          ]),
          div(sx({ margin: "0 16px 0 16px" }), [
            div(
              sx({
                height: "96px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Steps up, separated by commas"
            ),
            input({
              // @ts-ignore
              value: state.form.higher.stepsUp,
              name: "input-form-higher-steps-up",
              onChange: (nextVal) => {
                // @ts-ignore
                setState(
                  mergeDeep(state, {
                    form: {
                      higher: {
                        stepsUp: nextVal,
                      },
                    },
                  })
                );
              },
            }),
          ]),
          div(sx({ margin: "0 16px 0 16px" }), [
            div(
              sx({
                height: "96px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Steps down, separated by commas"
            ),
            input({
              // @ts-ignore
              value: state.form.higher.stepsDown,
              name: "input-form-higher-steps-down",
              onChange: (nextVal) => {
                // @ts-ignore
                setState(
                  mergeDeep(state, {
                    form: {
                      higher: {
                        stepsDown: nextVal,
                      },
                    },
                  })
                );
              },
            }),
          ]),
          div(sx({ margin: "0 16px 0 16px" }), [
            div(
              sx({
                height: "96px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Offsets in Scala format, separated by commas"
            ),
            input({
              // @ts-ignore
              value: state.form.higher.offset,
              name: "input-form-higher-offset",
              onChange: (nextVal) => {
                // @ts-ignore
                setState(
                  mergeDeep(state, {
                    form: {
                      higher: {
                        offset: nextVal,
                      },
                    },
                  })
                );
              },
            }),
          ]),
        ]),
        largeInputField(
          textarea({
            name: "modal-higher-preview",
            onChange: () => {},
            value: higherResult,
            classname: sx({ height: "256px" }),
            readonly: true,
          }),
          sx({ marginTop: "16px", marginBottom: "16px" })
        ),
      ]
    ),
    // @ts-ignore
    state.form.higher.open,
    () => {
      // @ts-ignore
      setState(
        mergeDeep(state, {
          form: {
            higher: { open: false },
          },
        })
      );
    },
    () => {
      // @ts-ignore
      const nextScales = state.scales;
      // @ts-ignore
      nextScales[state.scaleIndex] = {
        name: "Higher rank scale",
        scaleInput: higherResult,
      };

      // @ts-ignore
      setState({
        ...state,
        recompute: true,
        scaleInput: higherResult,
        scales: nextScales,
        form: {
          // @ts-ignore
          ...state.form, // @ts-ignore
          higher: { ...state.form.higher, open: false },
        },
      });
    },
    undefined,
    sx({
      backgroundColor: theme.color.backgroundModal,
      border: `2px solid ${theme.color.primary}`,
    })
  );
};

const presetModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  return modal(
    "modal-preset",
    "Preset scale",
    largeInputField(
      [
        e("select-search"),
        div(
          sx({ marginTop: "16px", width: "256px" }),
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
            }),
            readonly: true,
          })
        ),
      ],
      sx({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "16px auto 16px auto",
      })
    ),
    // @ts-ignore
    state.form.preset.open,
    () => {
      // @ts-ignore
      setState(
        mergeDeep(state, {
          form: {
            preset: { open: false },
          },
        })
      );
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
      backgroundColor: theme.color.backgroundModal,
      border: `2px solid ${theme.color.primary}`,
    })
  );
};

const temperedLimitModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  // @ts-ignore
  const commas = state.form.limit.commas;
  // @ts-ignore
  const epsilon = state.form.limit.epsilon;
  // @ts-ignore
  const limit = state.form.limit.limit;
  // @ts-ignore
  const up = state.form.limit.up;
  // @ts-ignore
  const down = state.form.limit.down;

  // @ts-ignore
  const scale = createJust(state, limit, up, down);

  // @ts-ignore
  const parser = parseScala(state);

  const parsedScale = splitScale(scale).map(parser);
  // @ts-ignore
  const centsScale = parsedScale.map(ratioToCent);

  const temperResult = outputScale(
    state,
    temper(state, centsScale, commas, epsilon)
  );
  // @ts-ignore
  const temperedOutResult = centsScale.length - splitScale(temperResult).length;

  return modal(
    "modal-limit",
    "Tempered limit",
    div(sx({ marginTop: "24px" }), [
      flex({ justifyContent: "center" }, [
        largeInputField(
          [
            div(
              sx({
                height: "160px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Limit primes, separated by comma"
            ),
            input({
              name: "modal-limit-limit", // @ts-ignore
              value: limit,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    limit: { ...state.form.limit, limit: val },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
        largeInputField(
          [
            div(
              sx({
                height: "160px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Commas to temper out, Scala format separated by comma"
            ),
            input({
              name: "modal-limit-commas", // @ts-ignore
              value: commas,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    limit: { ...state.form.limit, commas: val },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
        largeInputField(
          [
            div(
              sx({
                height: "160px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Epsilon comparison tolerance"
            ),
            input({
              name: "modal-limit-epsilon", // @ts-ignore
              value: epsilon,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    limit: { ...state.form.limit, epsilon: val },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
        largeInputField(
          [
            div(
              sx({
                height: "160px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Steps up, separated by comma"
            ),
            input({
              name: "modal-limit-up", // @ts-ignore
              value: up,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    limit: { ...state.form.limit, up: val },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
        largeInputField(
          [
            div(
              sx({
                height: "160px",
                fontSize: theme.typography.heading.fontSize,
              }),
              "Steps down, separated by comma"
            ),
            input({
              name: "modal-limit-down", // @ts-ignore
              value: down,
              onChange: (val) => {
                // @ts-ignore
                setState({
                  ...state,
                  form: {
                    // @ts-ignore
                    ...state.form, // @ts-ignore
                    limit: { ...state.form.limit, down: val },
                  },
                });
              },
            }),
          ],
          fieldMarginStyle
        ),
      ]),
      largeInputField(
        [
          textarea({
            name: "modal-limit-preview",
            value: temperResult,
            onChange: (val) => {},
            classname: sx({ height: "256px" }),
            readonly: true,
          }),
          div(
            sx({
              marginTop: "16px",
              marginBottom: "16px",
              fontSize: theme.typography.heading.fontSize,
            }),
            `Tones tempered out: ${temperedOutResult}`
          ),
        ],
        sx({ margin: "16px auto 0 auto" })
      ),
    ]), // @ts-ignore
    state.form.limit.open,
    () => {
      // @ts-ignore
      setState(
        mergeDeep(state, {
          form: {
            limit: { open: false },
          },
        })
      );
    },
    () => {
      const nextState = {
        ...state,
        // @ts-ignore
        scaleInput: temperResult,
      } as FiddleStateImpl;

      // @ts-ignore
      setState({
        ...state,
        ...updateScale(nextState),
        recompute: true, // @ts-ignore
        form: { ...state.form, limit: { ...state.form.limit, open: false } },
      });
    },
    undefined,
    sx({
      backgroundColor: theme.color.backgroundModal,
      border: `2px solid ${theme.color.primary}`,
    })
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
      validation: ((val: any) => true | string)[];
      innerFormName: string;
      id: string;
    }[],
    result: (params: Record<string, any>) => string,
    long?: boolean
  ) => {
    // @ts-ignore
    const resultScale = result(state.form[formName]);

    const theme = getTheme();

    return modal(
      id,
      title,
      div(sx({ marginTop: "16px" }), [
        div(
          sx({
            display: "flex",
            justifyContent: "center",
          }),
          form
            .map((item) =>
              largeInputField(
                [
                  div(
                    sx({
                      fontSize: theme.typography.heading.fontSize,
                      height: long ? "64px" : "32px",
                    }),
                    item.title
                  ),
                  input({
                    name: `input-form-${id}-${item.id}`,
                    // @ts-ignore
                    value: state.form[formName][item.innerFormName],
                    validation: item.validation,
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
                ],
                sx({
                  margin: "0 16px 0 16px",
                })
              )
            )
            .flat()
        ),
        largeInputField(
          textarea({
            name: `result-scale-${id}`,
            value: resultScale,
            onChange: () => {},
            classname: sx({ height: "300px" }),
            readonly: true,
          }),
          sx({
            margin: "0 auto 0 auto",
            marginTop: theme.spacing.space2,
            marginBottom: "16px",
          })
        ),
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
        backgroundColor: theme.color.backgroundModal,
        border: `2px solid ${theme.color.primary}`,
      })
    );
  };

export const formModal = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const modalImpl = generalFormModal(state, setState);

  setStore("select-search-preset", {
    // @ts-ignore
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
  });

  const theme = getTheme();

  return [
    modalImpl(
      "modal-edo",
      "Equal division of octave (EDO)",
      "edo",
      [
        {
          title: "N",
          type: "number",
          validation: scaleNValidation,
          innerFormName: "N",
          id: "edo",
        },
      ],
      ({ N }) => createEdo(state, N)
    ),
    modalImpl(
      "modal-mos",
      "Moment of symmetry (MOS)",
      "mos",
      [
        {
          title: "N",
          type: "number",
          validation: scaleNValidation,
          innerFormName: "N",
          id: "n",
        },
        {
          title: "T",
          type: "number",
          validation: scaleNValidation,
          innerFormName: "T",
          id: "t",
        },
      ],
      ({ N, T }) => createMOS(state, N, T)
    ),
    modalImpl(
      "modal-linear",
      "Linear temperament (1-generated)",
      "linear",
      [
        {
          title: "Generator in Scala format",
          type: "string",
          validation: [scalaValidation],
          innerFormName: "g",
          id: "g",
        },
        {
          title: "Steps up",
          type: "number",
          validation: stepsValidation,
          innerFormName: "up",
          id: "up",
        },
        {
          title: "Steps down",
          type: "number",
          validation: stepsValidation,
          innerFormName: "down",
          id: "down",
        },
      ],
      ({ g, up, down }) => createLinear(state, g, up, down),
      true
    ),
    modalImpl(
      "modal-meantone",
      "Equal division of octave (EDO)",
      "meantone",
      [
        {
          title: "Comma fraction",
          type: "number",
          validation: decimalPositiveValidation(12),
          innerFormName: "comma",
          id: "comma",
        },
        {
          title: "Steps up",
          type: "number",
          validation: stepsValidation,
          innerFormName: "up",
          id: "up",
        },
        {
          title: "Steps down",
          type: "number",
          validation: stepsValidation,
          innerFormName: "down",
          id: "down",
        },
      ],
      ({ up, down, comma }) => createMeantone(state, comma, up, down)
    ),
    modalImpl(
      "modal-harm",
      "Harmonic series",
      "harm",
      [
        {
          title: "Steps up",
          type: "number",
          validation: stepsValidation,
          innerFormName: "up",
          id: "up",
        },
        {
          title: "Steps down",
          type: "number",
          validation: stepsValidation,
          innerFormName: "down",
          id: "down",
        },
      ],
      ({ up, down }) => createHarmonicSeries(state, up, down)
    ),
    modalImpl(
      "modal-just",
      "Just tuning",
      "just",
      [
        {
          title: "Limits in Scala format, comma separated",
          type: "string",
          validation: [csvValidation(integerValidation(2, PRIME_LIMIT_MAX))],
          innerFormName: "limit",
          id: "limit",
        },
        {
          title: "Steps up, comma separated",
          type: "string",
          validation: [csvValidation(integerValidation(0, STEPS_UP_DOWN_MAX))],
          innerFormName: "up",
          id: "up",
        },
        {
          title: "Steps down, comma separated",
          type: "string",
          validation: [csvValidation(integerValidation(0, STEPS_UP_DOWN_MAX))],
          innerFormName: "down",
          id: "down",
        },
      ],
      ({ limit, up, down }) => createJust(state, limit, up, down),
      true
    ),
    modalImpl(
      "modal-ratiochord",
      "Ratio chord",
      "ratiochord",
      [
        {
          title: "Chord ratios separated by :",
          type: "string",
          validation: [
            splitValidation(":")(decimalValidation(1, PRIME_LIMIT_MAX)),
          ],
          innerFormName: "chord",
          id: "chord",
        },
      ],
      ({ chord }) => createRatioChord(state, chord),
      true
    ),
    modalImpl(
      "modal-transpose",
      "Transpose",
      "transpose",
      [
        {
          title: "Offset cents",
          type: "number",
          validation: decimalValidation(-OFFSET_CENT_MAX, OFFSET_CENT_MAX),
          innerFormName: "t",
          id: "t",
        },
      ],
      ({ t }) => modifyTranspose(state, t)
    ),
    modalImpl(
      "modal-mode",
      "Mode",
      "mode",
      [
        {
          title: "Mode",
          type: "number",
          validation: integerValidation(1, OFFSET_MODE_MAX),
          innerFormName: "index",
          id: "mode-index",
        },
      ],
      ({ index }) => modifyMode(state, index)
    ),
    modalImpl(
      "modal-subset",
      "Subset",
      "subset",
      [
        {
          title: "Subset offset values separated by comma",
          type: "string",
          validation: [csvValidation(integerValidation(1, EDO_N_MAX))],
          innerFormName: "subscale",
          id: "subscale",
        },
      ],
      ({ subscale }) => modifySubscale(state, subscale),
      true
    ),
    modalImpl(
      "modal-multiply",
      "Multiply",
      "multiply",
      [
        {
          title: "Multiplier",
          type: "number",
          validation: decimalPositiveValidation(MULTIPLIER_MAX),
          innerFormName: "multiplier",
          id: "multiplier",
        },
      ],
      ({ multiplier }) => modifyMultiply(state, multiplier)
    ),
    modalImpl("modal-reverse", "Reverse", "reverse", [], () =>
      modifyReverse(state)
    ),
    modalImpl("modal-sort", "Sort", "sort", [], () => modifySort(state)),
    modalImpl(
      "modal-approxequal",
      "Approximate by equal",
      "approxequal",
      [
        {
          title: "N",
          type: "number",
          validation: scaleNValidation,
          innerFormName: "N",
          id: "N",
        },
      ],
      ({ N }) => modifyApproxEqual(state, N)
    ),
    stretchModal(state, setState),
    temperModal(state, setState),
    temperedLimitModal(state, setState),
    higherModal(state, setState),
    presetModal(state, setState),
  ];
};
