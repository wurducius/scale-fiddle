import { createElement, sx } from "@eofol/eofol";
import { panic } from "../../../synth-lib";
import { FiddleState } from "../../../types";
import { breakpoint } from "../../../breakpoint";

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

  const topRow = createElement(
    "div",
    sx({
      display: "flex",
      gap: breakpoint.md ? "16px" : "8px",
      alignItems: "center",
    }),
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
        "Docs",
        () => {
          // @ts-ignore
          setState({ ...state, tab: 3 });
        },
        tabIndex === 3
      ),
      appbarButton(
        "About",
        () => {
          // @ts-ignore
          setState({ ...state, tab: 4 });
        },
        tabIndex === 4
      ),
    ]
  );

  const bottomRowFirst = [
    appbarButton(
      "Panic",
      () => {
        panic();
        const snackbarElement = document.getElementById("snackbar-panic");
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
        // @ts-ignore
        navigator.clipboard.writeText(state.scaleInput);
        const snackbarElement = document.getElementById("snackbar-share-scale");
        snackbarElement?.setAttribute("class", "snackbar show");
        setTimeout(() => {
          snackbarElement?.setAttribute("class", "snackbar");
        }, 3000);
      },
      false,
      true
    ),
  ];

  const bottomRowSecond = [
    createElement("div", "snackbar", "Scale copied to clipboard.", {
      id: "snackbar-share-scale",
    }),
    createElement("div", "snackbar", "Panic! Shutting down synth.", {
      id: "snackbar-panic",
    }),
    createElement(
      "a",
      undefined,
      appbarButton("Microtonal Structure Theory", () => {}, false, true),
      {
        target: "_blank",
        href: "https://www.facebook.com/groups/microtonalstructuremusictheory",
      }
    ),
    createElement("div", undefined, "Scale Fiddle"),
  ];

  const bottomRow = createElement(
    "div",
    sx({
      display: "flex",
      gap: breakpoint.md ? "16px" : "8px",
      alignItems: "center",
      flexWrap: "wrap",
    }),
    [...bottomRowFirst, ...bottomRowSecond]
  );

  const getAppbarHeight = (xs: boolean, md: boolean) => {
    if (!md) {
      return "50px";
    }
    if (md && !xs) {
      return "60px";
    }
    return "90px";
  };

  return createElement(
    "div",
    sx({
      display: "flex",
      height: getAppbarHeight(breakpoint.xs, breakpoint.md),
      alignItems: !breakpoint.md ? "normal" : "center",
      justifyContent: !breakpoint.md ? "center" : "inherit",
      border: "2px solid purple",
      padding: "0 16px",
      flexDirection: breakpoint.sm ? "column" : "row",
    }),
    createElement(
      "div",
      sx({
        display: "flex",
        justifyContent: breakpoint.sm ? "inherit" : "space-between",
        flex: 1,
        flexWrap: breakpoint.md ? "wrap" : "inherit",
      }),
      [topRow, bottomRow]
    )
  );
};
