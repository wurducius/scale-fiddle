import { createElement, sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";

export const aboutTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "100px" }), [
      createElement("h1", undefined, "Scale Fiddle"),
      createElement("h3", undefined, "Version 0.3"),
      createElement("h3", undefined, [
        "Created by ",
        createElement("a", undefined, "Microtonal Structure Theory team", {
          target: "_blank",
          href: "https://www.facebook.com/groups/microtonalstructuremusictheory",
        }),
      ]),
      createElement("h3", undefined, [
        createElement("a", undefined, "Jakub Eliáš", {
          href: "mailto:wurducius@gmail.com",
        }),
        " (development & design)",
      ]),
      createElement("h3", undefined, "Janne Karimäki (analysis & testing)"),
      createElement("h3", undefined, [
        "Developed using ",
        createElement("a", undefined, "Eofol", {
          target: "_blank",
          href: "https://eofol.com",
        }),
      ]),
      createElement("h3", undefined, "2024"),
      createElement(
        "h3",
        undefined,
        createElement("a", undefined, "MIT license", {
          target: "_blank",
          href: "https://eofol.com/license.html",
        })
      ),
    ]),
  ];
};
