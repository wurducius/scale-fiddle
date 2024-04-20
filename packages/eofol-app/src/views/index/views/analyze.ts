import { createElement, sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";

export const analyzeTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "100px" }), [
      createElement("h1", undefined, "Analyze"),
      createElement("p", undefined, "UNDER CONSTRUCTION"),
    ]),
  ];
};
