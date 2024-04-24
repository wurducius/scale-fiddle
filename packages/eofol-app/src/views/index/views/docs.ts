import { createElement, sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";
import { h1, p } from "../../../extract/font";
import { t } from "../../../extract/translation";

export const docsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "100px" }), [
      h1(t("docs.fullName", "Documentation")),
      p(t("shared.underConstruction", "UNDER CONSTRUCTION")),
    ]),
  ];
};
