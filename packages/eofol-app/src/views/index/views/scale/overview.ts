import { tooltip } from "@eofol/eofol-simple";
import { sx } from "@eofol/eofol";
import { breakpoint } from "../../../../extract/breakpoint";
import { div } from "../../../../extract/primitive";
import { theme } from "../../../../theme";
import { FiddleState } from "../../../../types";
import { trimWhitespace } from "../../../../util";
import { p } from "../../../../extract/font";

export const scaleOverview = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const overview = state.overview;

  return div(
    sx({
      height: "300px",
      padding: "0 8px",
      fontSize: breakpoint.md && !breakpoint.sm ? "12px" : "16px",
    }),
    [
      div(
        sx({
          display: "flex",
          justifyContent: "space-between",
          borderBottom: `2px solid ${theme.primary}`,
        }),
        [
          div(sx({ color: theme.secondary, flex: 1 }), "Index"),
          div(sx({ color: theme.secondary, flex: 3 }), `Frequency`),
          div(sx({ color: theme.secondary, flex: 3 }), "Cents"),
          div(sx({ color: theme.secondary, flex: 2 }), "Ratio"),
          div(sx({ color: theme.secondary, flex: 2 }), "Name"),
        ]
      ),
      div(sx({ overflow: "auto", height: "280px" }), [
        ...overview.map((tone: any, index: number) => {
          const displayIndex = index.toString();
          const displayFreq = `${tone.freq} Hz`;
          const displayCent = `${tone.cent}c`;

          return div(
            sx({
              display: "flex",
              justifyContent: "space-between",
              color: tone.isOctave ? theme.secondary : theme.primary,
            }),
            [
              div(
                sx({ display: "flex", justifyContent: "center", flex: 1 }),
                tooltip(displayIndex, p(displayIndex))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 3,
                }),
                tooltip(displayFreq, p(displayFreq))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 3,
                }),
                tooltip(displayCent, p(displayCent))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 2,
                }),
                tooltip(tone.ratio, p(tone.ratio))
              ),
              div(
                sx({
                  display: "flex",
                  justifyContent: "center",
                  flex: 2,
                }),
                tooltip(tone.name, p(trimWhitespace(tone.name)))
              ),
            ]
          );
        }),
      ]),
    ]
  );
};
