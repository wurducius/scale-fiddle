import { FiddleState } from "../../../types";
import { h1, h3, div, t } from "../../../extract";
import { a } from "@eofol/eofol-simple";
import { sx } from "@eofol/eofol";

export const aboutTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    div(sx({ marginTop: "100px" }), [
      h1(t("app.name", "Scale Fiddle")),
      h3(t("app.version", "Version 0.3")),
      h3([
        t("about.createdBy", "Created by "),
        a({
          link: "https://www.facebook.com/groups/microtonalstructuremusictheory",
          external: true,
          children: t(
            "about.microtonalStructureTheoryTeam",
            "Microtonal Structure Theory team"
          ),
        }),
      ]),
      h3([
        a({ link: "mailto:wurducius@gmail.com", children: "Jakub Eliáš" }),
        t("about.developmentAndDesign", " (development & design)"),
      ]),
      h3(
        "Janne Karimäki" +
          t("about.analysisAndTesting", " (analysis & testing)")
      ),
      h3([
        t("about.developedUsing", "Developed using "),
        a({ link: "https://eofol.com", external: true, children: "Eofol" }),
      ]),
      h3("2024"),
      h3(
        a({
          link: "https://eofol.com/license.html",
          external: true,
          children: t("about.mitLicense", "MIT license"),
        })
      ),
    ]),
  ];
};
