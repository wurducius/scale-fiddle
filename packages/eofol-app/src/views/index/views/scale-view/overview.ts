import { getBreakpoint, getTheme, sx } from "@eofol/eofol";
import { FiddleState } from "../../../../types";
import { trimWhitespace } from "../../../../util";
import { div, bubble, p } from "@eofol/eofol-simple";
import { EMPTY_LABEL } from "../../../../data";

const getRows = (
  overview: { freq: string; name: string; cent: string; ratio: string }[]
) => {
  const theme = getTheme();

  const isEmpty = overview.length === 0;

  return div(
    sx({ overflow: "auto", height: "278px" }),
    isEmpty
      ? div(
          sx({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }),
          EMPTY_LABEL
        )
      : [
          ...overview.map((tone: any, index: number) => {
            const displayIndex = (index + 1).toString();
            const displayFreq = `${tone.freq} Hz`;
            const displayCent = `${tone.cent}c`;

            return div(
              sx({
                display: "flex",
                justifyContent: "space-between",
                color: tone.isOctave
                  ? theme.color.secondary
                  : theme.color.primary,
              }),
              [
                div(
                  sx({ display: "flex", justifyContent: "center", flex: 1 }),
                  p(displayIndex)
                ),
                div(
                  sx({
                    display: "flex",
                    justifyContent: "center",
                    flex: 3,
                  }),
                  p(displayFreq)
                ),
                div(
                  sx({
                    display: "flex",
                    justifyContent: "center",
                    flex: 3,
                  }),
                  p(displayCent)
                ),
                div(
                  sx({
                    display: "flex",
                    justifyContent: "center",
                    flex: 2,
                  }),
                  p(tone.ratio)
                ),
                div(
                  sx({
                    display: "flex",
                    justifyContent: "center",
                    flex: 2,
                  }),
                  p(trimWhitespace(tone.name ?? ""))
                ),
              ]
            );
          }),
        ]
  );
};

export const scaleOverview = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const overview = state.overview;
  // @ts-ignore
  const scaleInvalid = state.scaleInvalid;

  const theme = getTheme();
  const breakpoint = getBreakpoint();

  const outputElement = scaleInvalid
    ? div(
        sx({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100% - 1px)",
          position: "relative",
          width: "128px",
          margin: "0 auto 0 auto",
        }),
        bubble("Cannot render overview table because scale is invalid.", true)
      )
    : getRows(overview);

  return div(
    sx({
      height: "299px",
      padding: `0 0 0 18px`,
      fontSize:
        breakpoint.md && !breakpoint.sm
          ? theme.typography.tableSmall.fontSize
          : theme.typography.text.fontSize,
      border: `1px solid ${theme.color.secondary}`,
    }),
    [
      div(
        sx({
          display: "flex",
          justifyContent: "space-between",
          borderBottom: `2px solid ${theme.color.primary}`,
          marginRight: "18px",
        }),
        [
          div(sx({ color: theme.color.secondary, flex: 1 }), "Index"),
          div(sx({ color: theme.color.secondary, flex: 3 }), `Frequency`),
          div(sx({ color: theme.color.secondary, flex: 3 }), "Cents"),
          div(sx({ color: theme.color.secondary, flex: 2 }), "Ratio"),
          div(sx({ color: theme.color.secondary, flex: 2 }), "Name"),
        ]
      ),
      outputElement,
    ]
  );
};
