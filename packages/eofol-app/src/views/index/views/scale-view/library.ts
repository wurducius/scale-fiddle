import { cx, getTheme, sx } from "@eofol/eofol";
import {
  updateScale,
  parseScalaValidate,
  splitScale,
  softValidate,
} from "../../../../sheen";
import { FiddleState, FiddleStateImpl } from "../../../../types";
import { textarea } from "@eofol/eofol-simple";
import { bubble, div } from "../../../../extract";
import { trimWhitespace } from "../../../../util";

export const scaleLibrary = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  // @ts-ignore
  const parser = parseScalaValidate(state);

  // @ts-ignore
  const scaleInvalid = state.scaleInvalid;
  // @ts-ignore
  const scaleError = state.scaleError;

  const bubbleElement = bubble(scaleError, scaleInvalid);

  console.log(document.styleSheets.item(1)?.cssRules);

  const textareaElement = textarea({
    name: "scale-library",
    // @ts-ignore
    value: state.scaleInput,
    onChange: (nextVal) => {
      const split = splitScale(nextVal).map(trimWhitespace).filter(Boolean);
      const parsedVal = split.map(parser);
      const validationError = parsedVal.reduce(
        (acc: string | false, next) => (typeof next === "string" ? next : acc),
        false
      );

      const softValidation = softValidate(split);

      const hasSoftError = softValidation !== false;
      const hasHardError = validationError !== false;
      const isError = hasSoftError || hasHardError;

      const nextStateScaleInput = {
        ...state,
        scaleInput: split.join("\n"),
      } as FiddleStateImpl;
      const nextState = {
        ...nextStateScaleInput,
        ...updateScale(nextStateScaleInput),
      };

      if (!isError) {
        // @ts-ignore
        setState({
          ...nextState,
          scaleInvalid: false,
        });
      } else {
        if (hasSoftError) {
          // @ts-ignore
          setState({
            ...nextState,
            scaleInvalid: true,
            scaleError: softValidation,
          });
        } else if (hasHardError) {
          // @ts-ignore
          setState({
            ...nextState,
            scaleInvalid: true,
            scaleError: validationError,
          });
        }
      }
    },
    classname: cx(
      scaleInvalid ? "input-invalid" : "input-valid",
      sx({
        height: "284px",
      })
    ),
  });

  return div(sx({ position: "relative" }), [textareaElement, bubbleElement]);
};
