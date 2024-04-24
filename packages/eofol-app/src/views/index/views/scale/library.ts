import { sx } from "@eofol/eofol";
import { textarea } from "../../../../extract/textarea";
import { updateScale } from "../../../../sheen/sheen";
import { FiddleState, FiddleStateImpl } from "../../../../types";

export const scaleLibrary = (
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
