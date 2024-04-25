import { sx } from "@eofol/eofol";
import { div, t, h1, p } from "../../../extract";
import { FiddleState } from "../../../types";

export const docsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    div(sx({ marginTop: "100px" }), [
      h1(t("docs.fullName", "Documentation")),
      p(t("shared.underConstruction", "UNDER CONSTRUCTION")),
    ]),
  ];
};
