import { createElement, sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";
import { p, h1 } from "../../../extract/font";
import { t } from "../../../extract/translation";

export const analyzeTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "100px" }), [
      h1(t("analyze.name", "Analyze")),
      p(t("shared.underConstruction", "UNDER CONSTRUCTION")),
    ]),
  ];
};
