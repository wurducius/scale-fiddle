import { FiddleState } from "../../../types";
import { h1, h3 } from "../../../extract/font";
import { a } from "@eofol/eofol-simple";
import { createElement, sx } from "@eofol/eofol";

export const aboutTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "100px" }), [
      h1("Scale Fiddle"),
      h3("Version 0.3"),
      h3([
        "Created by ",
        a({
          link: "https://www.facebook.com/groups/microtonalstructuremusictheory",
          external: true,
          children: "Microtonal Structure Theory team",
        }),
      ]),
      h3([
        a({ link: "mailto:wurducius@gmail.com", children: "Jakub Eliáš" }),
        " (development & design)",
      ]),
      h3("Janne Karimäki (analysis & testing)"),
      h3([
        "Developed using ",
        a({ link: "https://eofol.com", external: true, children: "Eofol" }),
      ]),
      h3("2024"),
      h3(
        a({
          link: "https://eofol.com/license.html",
          external: true,
          children: "MIT license",
        })
      ),
    ]),
  ];
};
