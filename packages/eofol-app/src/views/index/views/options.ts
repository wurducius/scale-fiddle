import { select, div } from "@eofol/eofol-simple";
import { getBreakpoint, getTheme, setTheme, sx } from "@eofol/eofol";
import {
  ENVELOPE_CUSTOM_TIME_MAX,
  ENVELOPE_CUSTOM_TIME_MIN,
  GAIN_MIN,
  PRECISION_MAX_DIGITS,
  keyLabelOptions,
} from "../../../data";
import { h2, p } from "../../../extract";
import { FiddleState } from "../../../types";
import { defaultTheme, initStyles, themes } from "../../../styles";
import { decimalInput, integerInput } from "../../../ui";

export const optionsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const breakpoint = getBreakpoint();
  const theme = getTheme();

  // @ts-ignore
  const options = state.options;

  return [
    div(sx({ display: "flex", flexDirection: "column" }), [
      div(
        sx({
          display: "flex",
          flexDirection: !breakpoint.xs ? "row" : "column",
          margin: "0 auto",
        }),
        [
          div(
            sx({
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              margin: "0 32px 0 32px",
            }),
            [
              div(sx({ height: "64px" }), h2("Precision")),
              p("Frequency"),
              div(
                sx({ width: "256px" }),
                integerInput({
                  min: 0,
                  max: PRECISION_MAX_DIGITS,
                  value: options.decimalDigitsFreq,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      recompute: true,
                      options: {
                        ...options,
                        decimalDigitsFreq: nextValue,
                      },
                    });
                  },
                })
              ),
              p("Cent"),
              div(
                sx({ width: "256px" }),
                integerInput({
                  min: 0,
                  max: PRECISION_MAX_DIGITS,
                  value: options.decimalDigitsCent,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      recompute: true,
                      options: {
                        ...options,
                        decimalDigitsCent: nextValue,
                      },
                    });
                  },
                })
              ),
              p("Ratio"),
              div(
                sx({ width: "256px" }),
                integerInput({
                  min: 0,
                  max: PRECISION_MAX_DIGITS,
                  value: options.decimalDigitsRatio,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      recompute: true,
                      options: {
                        ...options,
                        decimalDigitsRatio: nextValue,
                      },
                    });
                  },
                })
              ),
              p("Frequency on keys"),
              div(
                sx({ width: "256px" }),
                integerInput({
                  min: 0,
                  max: PRECISION_MAX_DIGITS,
                  value: options.decimalDigitsFreqOnKeys,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      recompute: true,
                      options: {
                        ...options,
                        decimalDigitsFreqOnKeys: nextValue,
                      },
                    });
                  },
                })
              ),
            ]
          ),
          div(
            sx({
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              margin: "0 32px 0 32px",
            }),
            [
              div(sx({ height: "64px" }), h2("Synth configuration")),
              p("Start gain"),
              div(
                sx({ width: "256px" }),
                decimalInput({
                  min: 0,
                  max: 1,
                  value: options.startGain,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0 || Number(nextValue) > 1) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      options: {
                        ...options,
                        startGain: nextValue,
                      },
                    });
                  },
                })
              ),
              p("Start time"),
              div(
                sx({ width: "256px" }),
                decimalInput({
                  min: ENVELOPE_CUSTOM_TIME_MIN,
                  max: ENVELOPE_CUSTOM_TIME_MAX,
                  value: options.startTime,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      options: {
                        ...options,
                        startTime: nextValue,
                      },
                    });
                  },
                })
              ),
              p("End gain"),
              div(
                sx({ width: "256px" }),
                decimalInput({
                  min: GAIN_MIN,
                  max: 1,
                  value: options.endGain,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0 || Number(nextValue) > 1) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      options: {
                        ...options,
                        endGain: nextValue,
                      },
                    });
                  },
                })
              ),
              p("End time"),
              div(
                sx({ width: "256px" }),
                decimalInput({
                  min: ENVELOPE_CUSTOM_TIME_MIN,
                  max: ENVELOPE_CUSTOM_TIME_MAX,
                  value: options.endTime,
                  onChange: (nextValue) => {
                    if (Number(nextValue) < 0) return;
                    // @ts-ignore
                    setState({
                      ...state,
                      options: {
                        ...options,
                        endTime: nextValue,
                      },
                    });
                  },
                })
              ),
            ]
          ),
        ]
      ),
      div(
        sx({
          display: "flex",
          flexDirection: !breakpoint.xs ? "row" : "column",
          margin: `${theme.spacing.space4} auto 0 auto`,
        }),
        [
          div(
            sx({
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              margin: "0 32px 0 32px",
            }),
            [
              h2("Key labels"),
              select({
                name: "select-key-labels",
                options: keyLabelOptions,
                // @ts-ignore
                value: state.options.keyLabel,
                onChange: (nextVal) => {
                  // @ts-ignore
                  setState({
                    ...state,
                    // @ts-ignore
                    options: { ...state.options, keyLabel: nextVal },
                  });
                },
              }),
            ]
          ),
          div(
            sx({
              display: "flex",
              flexDirection: "column",
              flex: 1,
              alignItems: "center",
              margin: "0 32px 0 32px",
            }),
            [
              h2("Theme"),
              select({
                name: "select-theme",
                options: themes,
                // @ts-ignore
                value: state.options.theme,
                onChange: (nextVal) => {
                  const nextTheme = (
                    themes.find((theme) => theme.id === nextVal) ?? defaultTheme
                  ).theme;

                  setTheme(nextTheme);
                  const themeImpl = getTheme();
                  initStyles(themeImpl);

                  // @ts-ignore
                  setState({
                    ...state,
                    // @ts-ignore
                    options: { ...state.options, theme: nextVal },
                  });
                },
              }),
            ]
          ),
        ]
      ),
    ]),
  ];
};
