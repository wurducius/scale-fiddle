import { cx, getTheme, sx } from "@eofol/eofol";
import { updateScale, parseScalaValidate, splitScale } from "../../../../sheen";
import { FiddleState, FiddleStateImpl } from "../../../../types";
import { textarea } from "@eofol/eofol-simple";
import { bubble, div } from "../../../../extract";

export const scaleLibrary = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  // @ts-ignore
  const parser = parseScalaValidate(state);

  // @ts-ignore
  const scaleInvalid = state.scaleInvalid;

  const bubbleElement = bubble(
    "Scale data is invalid. Please specify a valid scale according to Scala format.",
    scaleInvalid
  );

  const textareaElement = textarea({
    name: "scale-library",
    // @ts-ignore
    value: state.scaleInput,
    onChange: (nextVal) => {
      const parsedVal = splitScale(nextVal).map(parser);

      const nextState = {
        ...state,
        scaleInput: nextVal,
      } as FiddleStateImpl;

      if (!parsedVal.includes(false)) {
        // @ts-ignore
        setState({
          ...nextState,
          ...updateScale(nextState),
          scaleInvalid: false,
        });
      } else {
        // @ts-ignore
        setState({
          ...nextState,
          ...updateScale(nextState),
          scaleInvalid: true,
        });
      }
    },
    classname: cx(
      sx({
        height: "284px",
        width: "100%",
        border: `1px solid inherit`,
        outline: scaleInvalid ? `2px solid ${theme.color.error}` : "inherit",
      }),
      sx(
        {
          outline: scaleInvalid ? `2px solid ${theme.color.error}` : "inherit",
        },
        "focus"
      )
    ),
  });

  return div(sx({ position: "relative" }), [textareaElement, bubbleElement]);
};
