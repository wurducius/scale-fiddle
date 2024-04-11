import { createElement, sx } from "@eofol/eofol";
import { panic } from "../../../synth-lib";
import { FiddleState } from "../../../types";

const appbarButton = (
  label: string,
  onclick: () => void,
  isActive: boolean,
  isSecondary?: boolean
) =>
  createElement(
    "button",
    sx({
      fontSize: "16px",
      backgroundColor: isActive ? "fuchsia" : "black",
      color: isSecondary ? "teal" : isActive ? "black" : "fuchsia",
      border: `1px solid ${isSecondary ? "teal" : "fuchsia"}`,
      cursor: "pointer",
    }),
    label,
    undefined,
    {
      // @ts-ignore
      onclick,
    }
  );

export const appbar = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const tabIndex = state.tab;

  return createElement(
    "div",
    sx({
      display: "flex",
      height: "50px",
      alignItems: "center",
      border: "2px solid purple",
      padding: "0 16px",
    }),
    createElement(
      "div",
      sx({
        display: "flex",
        justifyContent: "space-between",
        flex: 1,
      }),
      [
        createElement(
          "div",
          sx({ display: "flex", gap: "16px", alignItems: "center" }),
          [
            appbarButton(
              "Scale",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 0 });
              },
              tabIndex === 0
            ),
            appbarButton(
              "Synth",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 1 });
              },
              tabIndex === 1
            ),
            appbarButton(
              "Options",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 2 });
              },
              tabIndex === 2
            ),
            appbarButton(
              "About",
              () => {
                // @ts-ignore
                setState({ ...state, tab: 3 });
              },
              tabIndex === 3
            ),
          ]
        ),
        createElement(
          "div",
          sx({ display: "flex", gap: "16px", alignItems: "center" }),
          [
            appbarButton(
              "Panic",
              () => {
                console.log("panic");
                panic();
                const snackbarElement =
                  document.getElementById("snackbar-panic");
                snackbarElement?.setAttribute("class", "snackbar show");
                setTimeout(() => {
                  snackbarElement?.setAttribute("class", "snackbar");
                }, 3000);
              },
              false,
              true
            ),
            appbarButton(
              "Share scale",
              () => {
                console.log("share scale");
                // @ts-ignore
                navigator.clipboard.writeText(state.scaleInput);
                const snackbarElement = document.getElementById(
                  "snackbar-share-scale"
                );
                snackbarElement?.setAttribute("class", "snackbar show");
                setTimeout(() => {
                  snackbarElement?.setAttribute("class", "snackbar");
                }, 3000);
              },
              false,
              true
            ),
            createElement("div", "snackbar", "Scale copied to clipboard.", {
              id: "snackbar-share-scale",
            }),
            createElement("div", "snackbar", "Panic! Shutting down synth.", {
              id: "snackbar-panic",
            }),
            createElement(
              "a",
              undefined,
              appbarButton(
                "Microtonal Structure Theory",
                () => {},
                false,
                true
              ),
              {
                target: "_blank",
                href: "https://www.facebook.com/groups/microtonalstructuremusictheory",
              }
            ),
            createElement("div", undefined, "Scale Fiddle"),
          ]
        ),
      ]
    )
  );
};
