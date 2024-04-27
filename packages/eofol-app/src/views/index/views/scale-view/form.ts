import { modal, input } from "@eofol/eofol-simple";
import { sx, e, createStore, setStore, getTheme } from "@eofol/eofol";
import { scalePresets, scalePresetsFlat } from "../../../../data";
import { div, textarea } from "../../../../extract";
import {
  updateScale,
  createEdo,
  createMOS,
  createLinear,
  createMeantone,
  createHarmonicSeries,
  createJust,
} from "../../../../sheen";
import { FiddleState, FiddleStateImpl } from "../../../../types";
import { defineSelectSearch } from "../../../../ui";

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
      div(undefined, [
        div(
          undefined,
          form
            .map((item) => [
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
            .flat()
        ),
        textarea({
          name: "result-scale",
          value: resultScale,
          classname: sx({ height: "300px", marginTop: theme.spacing.space2 }),
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
        backgroundColor: theme.color.backgroundModal,
        border: `2px solid ${theme.color.primary}`,
      })
    ),
  ];
};
