import { createElement } from "@eofol/eofol";
import { FiddleState } from "../../../types";

export const optionsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", undefined, [
      createElement("h1", undefined, "Options"),
      createElement("p", undefined, "UNDER CONSTRUCTION"),
      createElement(
        "p",
        undefined,
        "TODO: Precision - decimal digits - freq, cent, ratio + freq on keys"
      ),
      createElement("p", undefined, "TODO: Start gain"),
      createElement("p", undefined, "TODO: Start time"),
      createElement("p", undefined, "TODO: End gain"),
      createElement("p", undefined, "TODO: End time"),
    ]),
  ];
};
