import {
  input,
  dropdown,
  select,
  button,
  dropdownContent,
  notify,
} from "@eofol/eofol-simple";
import { sx } from "@eofol/eofol";
import { div } from "../../../../extract/primitive";
import { defaultScale } from "../../../../initial-state";
import { FiddleState } from "../../../../types";
import { p } from "../../../../extract/font";

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

export const changeScaleMenu = (
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
