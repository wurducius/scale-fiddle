import { modal, input, select } from "@eofol/eofol-simple";
import { sx, e } from "@eofol/eofol";
import { scalePresets, scalePresetsFlat } from "../../../../data";
import { div, textarea } from "../../../../extract";
import { updateScale, linearScale, normalizePeriod } from "../../../../sheen";
import { theme } from "../../../../styles";
import { FiddleState, FiddleStateImpl } from "../../../../types";
import { defineSelectSearch } from "../../../../ui";
import { mod, onlyUnique } from "../../../../util";

const MODAL_BG_COLOR = "#2d3748";
const MODAL_BORDER_COLOR = theme.primary;

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

export const formModal = (
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
          e("select-search"),
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
