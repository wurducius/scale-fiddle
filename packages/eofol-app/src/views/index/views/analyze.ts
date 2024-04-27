import { sx, t } from "@eofol/eofol";
import { FiddleState } from "../../../types";
import { p, h1, div } from "../../../extract";

export const analyzeTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    div(sx({ marginTop: "100px" }), [
      h1(t("analyze.name", "Analyze")),
      p(t("shared.underConstruction", "UNDER CONSTRUCTION")),
    ]),
  ];
};
