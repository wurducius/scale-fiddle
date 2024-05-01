import { modal, input, textarea } from "@eofol/eofol-simple";
import {
  sx,
  e,
  createStore,
  setStore,
  getTheme,
  mergeDeep,
} from "@eofol/eofol";
import {
  HIGHER_RANK_GENERATORS_MAX,
  STEPS_UP_DOWN_MAX,
  scalePresets,
  scalePresetsFlat,
} from "../../../../data";
import { div, p } from "../../../../extract";
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
} from "../../../../sheen";
import { FiddleState, FiddleStateImpl } from "../../../../types";
import { defineSelectSearch, integerInput } from "../../../../ui";

createStore("select-search-preset", {
  onChange: undefined,
});

defineSelectSearch({ options: scalePresets });

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

    const theme = getTheme();

    return modal(
      id,
      title,
      div(sx({ marginTop: "16px" }), [
        div(
          undefined,
          form
            .map((item) =>
              div(undefined, [
                div(
                  sx({ fontSize: theme.typography.heading.fontSize }),
                  item.title
                ),
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
            )
            .flat()
        ),
        textarea({
          name: "result-scale",
          value: resultScale,
          classname: sx({
            height: "300px",
            marginTop: theme.spacing.space2,
            marginBottom: "16px",
          }),
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
      [{ title: "N", type: "number", innerFormName: "N", id: "edo" }],
      ({ N }) => createEdo(state, N)
    ),
    modalImpl(
      "modal-mos",
      "Moment of symmetry (MOS)",
      "mos",
      [
        { title: "N", type: "number", innerFormName: "N", id: "n" },
        { title: "T", type: "number", innerFormName: "T", id: "t" },
      ],
      ({ N, T }) => createMOS(state, N, T)
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
      ({ T, g }) => createLinear(state, T, g)
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
      ({ T, comma }) => createMeantone(state, T, comma)
    ),
    modalImpl(
      "modal-harm",
      "Harmonic series",
      "harm",
      [{ title: "T", type: "number", innerFormName: "T", id: "t" }],
      ({ T }) => createHarmonicSeries(state, T)
    ),
    modalImpl(
      "modal-just",
      "Just tuning",
      "just",
      [
        { title: "T", type: "number", innerFormName: "T", id: "t" },
        { title: "Limit", type: "number", innerFormName: "limit", id: "limit" },
      ],
      ({ T, limit }) => createJust(state, T, limit)
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
      ({ chord }) => createRatioChord(state, chord)
    ),
    modalImpl(
      "modal-transpose",
      "Transpose",
      "transpose",
      [
        {
          title: "Offset cents",
          type: "number",
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
          title: "Subset",
          type: "string",
          innerFormName: "subscale",
          id: "subscale",
        },
      ],
      ({ subscale }) => modifySubscale(state, subscale)
    ),
    modalImpl(
      "modal-multiply",
      "Multiply",
      "multiply",
      [
        {
          title: "Multiplier",
          type: "number",
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
      "modal-stretch",
      "Stretch",
      "stretch",
      [
        {
          title: "Multiplier",
          type: "number",
          innerFormName: "multiplier",
          id: "multiplier",
        },
      ],
      ({ multiplier }) => modifyStretch(state, multiplier)
    ),
    modalImpl(
      "modal-approxequal",
      "Approximate by equal",
      "approxequal",
      [
        {
          title: "N",
          type: "number",
          innerFormName: "N",
          id: "N",
        },
      ],
      ({ N }) => modifyApproxEqual(state, N)
    ),
    modalImpl(
      "modal-temper",
      "Temper",
      "temper",
      [
        {
          title: "Commas to temper out",
          type: "string",
          innerFormName: "commas",
          id: "commas",
        },
        {
          title: "Epsilon comparison tolerance",
          type: "number",
          innerFormName: "epsilon",
          id: "epsilon",
        },
      ],
      ({ commas, epsilon }) => modifyTemper(state, commas, epsilon)
    ),
    modal(
      "modal-higher-rank-temperament",
      "Higher rank temperament",
      div(
        sx({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }),
        div(sx({}), [
          ...[
            div(
              sx({ fontSize: theme.typography.heading.fontSize }),
              "Generator count"
            ),
            integerInput({
              min: 1,
              max: HIGHER_RANK_GENERATORS_MAX,
              name: "input-form-higher-generator-count",
              // @ts-ignore
              value: state.form.higher.generatorCount,
              onChange: (nextVal) => {
                const val = Number(nextVal);
                // @ts-ignore
                setState(
                  mergeDeep(state, {
                    form: {
                      higher: {
                        generatorCount: val,
                      },
                    },
                  })
                );
              },
            }),
          ],
          // @ts-ignore
          ...(state.form.higher.generatorCount > 0 &&
          // @ts-ignore
          state.form.higher.generatorCount <= HIGHER_RANK_GENERATORS_MAX &&
          // @ts-ignore
          Number.isFinite(state.form.higher.generatorCount) &&
          // @ts-ignore
          Number.isInteger(state.form.higher.generatorCount)
            ? [
                p("Generators"),
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
                p("Steps up"),
                integerInput({
                  min: 0,
                  max: STEPS_UP_DOWN_MAX,
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
                p("Steps down"),
                integerInput({
                  min: 0,
                  max: STEPS_UP_DOWN_MAX,
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
                p("Offsets"),
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
              ]
            : [
                p(
                  `Generator count has illegal value. Allowed values are finite integer positive numbers lesser or equal to ${HIGHER_RANK_GENERATORS_MAX}`
                ),
              ]),
        ])
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
        createHigherRankTemperament(state, setState, state.form.higher);
      },
      undefined,
      sx({
        backgroundColor: theme.color.backgroundModal,
        border: `2px solid ${theme.color.primary}`,
      })
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
          e("select-search"),
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
              marginTop: theme.spacing.space2,
              marginBottom: theme.spacing.space1,
            }),
          }),
        ]
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
    ),
  ];
};
