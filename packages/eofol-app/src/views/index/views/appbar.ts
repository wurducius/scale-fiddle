import { cx, forceRerender, sx } from "@eofol/eofol";
import { button, notify, a, select } from "@eofol/eofol-simple";
import {
  mediaQueryMaxWidth,
  div,
  breakpoint,
  t,
  languages,
  setLanguage,
  language,
} from "../../../extract";
import { theme } from "../../../styles";
import { panic } from "../../../synth";
import { FiddleState } from "../../../types";

export const appbarButton = (
  label: string,
  onclick: () => void,
  isActive: boolean,
  isSecondary?: boolean
) =>
  button({
    styles: cx(
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
      )
    ),
    children: label,
    onClick: onclick,
  });

const getAppbarHeight = (large: boolean, middle: boolean) => {
  if (large) {
    return "50px";
  }
  if (middle) {
    return "100px";
  }
  return "150px";
};

export const appbar = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const tabIndex = state.tab;

  const large = !mediaQueryMaxWidth(1280)();
  const middle = !mediaQueryMaxWidth(820)();

  const topRow = div(
    sx({
      display: "flex",
      gap: breakpoint.md ? "16px" : "16px",
      alignItems: "center",
    }),
    [
      appbarButton(
        t("scale.name", "Scale"),
        () => {
          // @ts-ignore
          setState({ ...state, tab: 0 });
        },
        tabIndex === 0
      ),
      appbarButton(
        t("synth.name", "Synth"),
        () => {
          // @ts-ignore
          setState({ ...state, tab: 1 });
        },
        tabIndex === 1
      ),
      appbarButton(
        t("analyze.name", "Analyze"),
        () => {
          // @ts-ignore
          setState({ ...state, tab: 5 });
        },
        tabIndex === 5
      ),
      appbarButton(
        t("options.name", "Options"),
        () => {
          // @ts-ignore
          setState({ ...state, tab: 2 });
        },
        tabIndex === 2
      ),
      appbarButton(
        t("docs.name", "Docs"),
        () => {
          // @ts-ignore
          setState({ ...state, tab: 3 });
        },
        tabIndex === 3
      ),
      appbarButton(
        t("about.name", "About"),
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
      t("action.panic", "Panic"),
      () => {
        panic();
        notify({
          title: t("action.panicNotify", "Panic! Shutting down synth."),
        });
      },
      false,
      true
    ),
    appbarButton(
      t("action.shareScale", "Share scale"),
      () => {
        // @ts-ignore
        navigator.clipboard.writeText(state.scaleInput);
        notify({
          title: t("action.shareScaleNotify", "Scale copied to clipboard."),
        });
      },
      false,
      true
    ),
    a({
      external: true,
      link: "https://www.facebook.com/groups/microtonalstructuremusictheory",
      children: appbarButton(
        t("action.microtonalStructureTheory", "Microtonal Structure Theory"),
        () => {},
        false,
        true
      ),
    }),
    select({
      options: languages,
      onChange: (nextVal) => {
        setLanguage(nextVal).then(() => {
          forceRerender();
        });
      },
      value: language,
      name: "select-language",
      styles: sx({
        height: "36px",
        width: "200px",
        fontSize: "16px",
        margin: "0 0 0 0",
        padding: "2px 4px 2px 4px",
      }),
    }),
  ];

  const bottomRowSecond = [
    div(
      sx({
        marginLeft: middle ? "32px" : "0",
        fontWeight: 700,
        fontSize: "20px",
      }),
      t("app.nameWithVersion", "Scale Fiddle v0.3")
    ),
  ];

  const bottomRow = div(
    sx({
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "space-between",
    }),
    [
      div(
        sx({
          display: "flex",
          gap: breakpoint.md ? "16px" : "16px",
          alignItems: "center",
        }),
        bottomRowFirst
      ),
      div(undefined, [...bottomRowSecond]),
    ]
  );

  return div(
    sx({
      display: "flex",
      height: getAppbarHeight(large, middle),
      alignItems: !breakpoint.md ? "normal" : "center",
      justifyContent: !breakpoint.md ? "center" : "inherit",
      border: `1px solid ${theme.primary}`,
      padding: "0 16px",
      flexDirection: !large ? "column" : "row",
    }),
    div(
      sx({
        display: "flex",
        justifyContent: breakpoint.sm ? "inherit" : "space-between",
        flex: 1,
        flexWrap: "wrap",
      }),
      [topRow, bottomRow]
    )
  );
};
