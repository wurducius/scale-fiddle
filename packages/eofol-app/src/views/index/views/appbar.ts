import { createElement, sx } from "@eofol/eofol";
import { panic } from "../../../synth-lib";
import { FiddleState } from "../../../types";
import { breakpoint } from "../../../breakpoint";
import { theme } from "../../../theme";
import { notify } from "@eofol/eofol-simple";

const appbarButton = (
  label: string,
  onclick: () => void,
  isActive: boolean,
  isSecondary?: boolean
) =>
  createElement(
    "button",
    [
      sx({
        fontSize: "16px",
        backgroundColor: isActive ? theme.primary : "black",
        color: isSecondary
          ? theme.secondary
          : isActive
          ? "black"
          : theme.primary,
        border: `1px solid ${isSecondary ? theme.secondary : theme.primary}`,
        cursor: "pointer",
      }),
      sx(
        {
          backgroundColor: isSecondary
            ? theme.secondaryDark
            : theme.primaryDarker,
          color: isSecondary ? theme.secondaryLighter : theme.primaryLighter,
          border: `1px solid ${
            isSecondary ? theme.secondaryLighter : theme.primaryLighter
          }`,
        },
        "hover"
      ),
    ],
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
      gap: breakpoint.md ? "16px" : "16px",
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
        "Analyze",
        () => {
          // @ts-ignore
          setState({ ...state, tab: 5 });
        },
        tabIndex === 5
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
        notify({ title: "Panic! Shutting down synth." });
      },
      false,
      true
    ),
    appbarButton(
      "Share scale",
      () => {
        // @ts-ignore
        navigator.clipboard.writeText(state.scaleInput);
        notify({ title: "Scale copied to clipboard." });
      },
      false,
      true
    ),
    createElement(
      "a",
      undefined,
      appbarButton("Microtonal Structure Theory", () => {}, false, true),
      {
        target: "_blank",
        href: "https://www.facebook.com/groups/microtonalstructuremusictheory",
      }
    ),
  ];

  const bottomRowSecond = [
    createElement(
      "div",
      sx({ marginLeft: !breakpoint.md ? "32px" : "0", fontWeight: 700 }),
      "Scale Fiddle v0.3"
    ),
  ];

  const bottomRow = createElement(
    "div",
    sx({
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }),
    [
      createElement(
        "div",
        sx({ display: "flex", gap: breakpoint.md ? "16px" : "16px" }),
        bottomRowFirst
      ),
      createElement("div", undefined, [...bottomRowSecond]),
    ]
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
      border: `1px solid ${theme.primary}`,
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
