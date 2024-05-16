import {
  dropdown,
  select,
  button,
  notify,
  div,
  flex,
  p,
} from "@eofol/eofol-simple";
import { getTheme, sx, cx } from "@eofol/eofol";
import { DEFAULT_SCALE_INPUT } from "../../../../data";
import { FiddleState } from "../../../../types";
import { inputCustom, largeInputField } from "../../../../ui";

const menuButtonOpensModal =
  (
    state: FiddleState,
    setState: undefined | ((nextState: FiddleState) => void)
  ) =>
  (title: string, formName: string, notImplemented?: boolean) => {
    const theme = getTheme();

    return button({
      classname: sx({ width: "256px", height: theme.spacing.space5 }),
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
  const theme = getTheme();

  const dropdownItem = menuButtonOpensModal(state, setState);

  const scaleNameInputElement = inputCustom({
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

  return flex({ flexDirection: "column", alignItems: "center" }, [
    div(sx({ display: "flex", width: "100%" }), [
      flex(
        { grow: 1 },
        dropdown({
          id: "dropdown-new-scale-content",
          title: "Create scale",
          children: [
            dropdownItem("Equal temperament (EDO)", "edo"),
            dropdownItem("Moment of symmetry (MOS)", "mos"),
            dropdownItem("Rank-2 temperament (1-generated)", "linear"),
            dropdownItem("Meantone temperament", "meantone"),
            dropdownItem("Harmonic series", "harm"),
            dropdownItem("Just temperament", "just"),
            dropdownItem("Ratio chord", "ratiochord"),
            dropdownItem("Tempered limit", "limit"),
            dropdownItem("Higher rank temperament", "higher"),
            dropdownItem("Preset scale", "preset"),
          ],
          classname: cx(sx({ flex: 1 })),
        })
      ),
      flex(
        { grow: 1 },
        dropdown({
          id: "dropdown-modify-scale-content",
          title: "Modify scale",
          children: [
            dropdownItem("Transpose", "transpose"),
            dropdownItem("Mode", "mode"),
            dropdownItem("Subset", "subset"),
            dropdownItem("Multiply", "multiply"),
            dropdownItem("Reverse", "reverse"),
            dropdownItem("Sort", "sort"),
            dropdownItem("Stretch", "stretch"),
            dropdownItem("Approximate by equal", "approxequal"),
            dropdownItem("Temper", "temper"),
          ],
          classname: sx({ flex: 1 }),
        })
      ),
    ]),
    div(sx({ marginTop: theme.spacing.space2 }), p("Select scale")),
    largeInputField(
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
    div(sx({ marginTop: theme.spacing.space1 }), p("Scale name")),
    largeInputField(scaleNameInputElement),
    div(
      sx({
        display: "flex",
        flexDirection: "column",
        width: "256px",
        margin: `${theme.spacing.space2} auto 0 auto`,
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
                  scaleInput: DEFAULT_SCALE_INPUT,
                },
              ],
              // @ts-ignore
              scaleIndex: state.scales.length,
              scaleInput: DEFAULT_SCALE_INPUT,
              recompute: true,
            });
          },
        }),
        button({
          classname: sx({ marginTop: theme.spacing.space2 }),
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
  ]);
};
