import {
  getBreakpoint,
  getTheme,
  mediaQueryMaxWidth,
  sx,
  t,
  setLanguage,
  getLanguage,
  getLanguages,
} from "@eofol/eofol";
import { button, notify, select, div, linkButton } from "@eofol/eofol-simple";
import { panic } from "../../../synth";
import { FiddleState } from "../../../types";

export const appbarButton = (
  label: string,
  onclick: () => void,
  isActive: boolean,
  isSecondary?: boolean
) =>
  button({
    children: label,
    onClick: onclick,
    scheme: isSecondary ? "secondary" : "primary",
    active: isActive,
  });

const getAppbarHeight = (large: boolean, middle: boolean, small: boolean) => {
  if (large) {
    return "50px";
  }
  if (middle) {
    return "100px";
  }
  if (small) {
    return "150px";
  }
  return "250px";
};

export const appbar = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();
  const breakpoint = getBreakpoint();

  const language = getLanguage();
  const languages = getLanguages();

  // @ts-ignore
  const tabIndex = state.tab;

  const largex = !mediaQueryMaxWidth(1450 + 16)();
  const large = !mediaQueryMaxWidth(1450 + 0)();

  const middle = !mediaQueryMaxWidth(886)();
  const middlexxx = !mediaQueryMaxWidth(886)();

  const small = !mediaQueryMaxWidth(705)();

  const topRow = div(
    sx({
      display: "flex",
      gap: theme.spacing.space2,
      alignItems: "center",
      flexWrap: "wrap",
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
      linkButton({ link: "/docs", children: t("docs.name", "Docs") }),
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
    linkButton({
      scheme: "secondary",
      external: true,
      link: "https://www.facebook.com/groups/microtonalstructuremusictheory",
      children: t(
        "action.microtonalStructureTheory",
        "Microtonal Structure Theory"
      ),
    }),
    select({
      options: languages,
      onChange: (nextVal) => {
        setLanguage(nextVal);
      },
      value: language,
      name: "select-language",
      classname: sx({
        height: "36px",
        width: "200px",
        fontSize: theme.typography.text.fontSize,
        margin: "0 0 0 0",
        padding: "2px 4px 2px 4px",
      }),
    }),
  ];

  const bottomRowSecond = [
    div(
      sx({
        marginLeft: middle ? theme.spacing.space4 : "0",
        fontWeight: 700,
        fontSize: theme.typography.title.fontSize,
        marginRight: !middlexxx ? "32px" : 0,
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
          gap: theme.spacing.space2,
          alignItems: "center",
          marginLeft: large ? "12px" : 0,
          flexWrap: "wrap",
        }),
        bottomRowFirst
      ),
      div(undefined, [...bottomRowSecond]),
    ]
  );

  return div(
    sx({
      display: "flex",
      height: getAppbarHeight(largex, middle, small),
      alignItems: !breakpoint.md ? "normal" : "center",
      justifyContent: !breakpoint.md ? "center" : "inherit",
      border: `1px solid ${theme.color.primary.base}`,
      padding: `0 ${theme.spacing.space2}`,
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
