import { select, div, h2, p } from "@eofol/eofol-simple";
import { getBreakpoint, getTheme, setTheme, sx } from "@eofol/eofol";
import {
  ENVELOPE_CUSTOM_TIME_MAX,
  ENVELOPE_CUSTOM_TIME_MIN,
  GAIN_MIN,
  PRECISION_MAX_DIGITS,
  keyLabelOptions,
} from "../../../data";
import { FiddleState } from "../../../types";
import { defaultTheme, initStyles, themes } from "../../../styles";
import {
  decimalPrecisionInput,
  integerInput,
  largeInputField,
} from "../../../ui";

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
              largeInputField(
                integerInput({
                  name: "input-precision-frequency",
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
              largeInputField(
                integerInput({
                  name: "input-precision-cent",
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
              largeInputField(
                integerInput({
                  name: "input-precision-ratio",
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
              largeInputField(
                integerInput({
                  name: "input-precision-frequency-keys",
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
              largeInputField(
                decimalPrecisionInput({
                  name: "input-synth-start-gain",
                  min: 0,
                  max: 1,
                  value: options.startGain,
                  onChange: (nextValue) => {
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
              largeInputField(
                decimalPrecisionInput({
                  name: "input-synth-start-time",
                  min: ENVELOPE_CUSTOM_TIME_MIN,
                  max: ENVELOPE_CUSTOM_TIME_MAX,
                  value: options.startTime,
                  onChange: (nextValue) => {
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
              largeInputField(
                decimalPrecisionInput({
                  name: "input-synth-end-gain",
                  min: GAIN_MIN,
                  max: 1,
                  value: options.endGain,
                  onChange: (nextValue) => {
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
              largeInputField(
                decimalPrecisionInput({
                  name: "input-synth-end-time",
                  min: ENVELOPE_CUSTOM_TIME_MIN,
                  max: ENVELOPE_CUSTOM_TIME_MAX,
                  value: options.endTime,
                  onChange: (nextValue) => {
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
              largeInputField(
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
              h2("Theme"),
              largeInputField(
                select({
                  name: "select-theme",
                  options: themes,
                  // @ts-ignore
                  value: state.options.theme,
                  onChange: (nextVal) => {
                    const nextTheme = (
                      themes.find((theme) => theme.id === nextVal) ??
                      defaultTheme
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
                })
              ),
            ]
          ),
        ]
      ),
    ]),
  ];
};
