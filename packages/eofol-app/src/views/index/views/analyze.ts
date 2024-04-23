import { createElement, sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";
import { p, h1 } from "../../../extract/font";

export const analyzeTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "100px" }), [
      h1("Analyze"),
      p("UNDER CONSTRUCTION"),
    ]),
  ];
};
