import { input, select } from "@eofol/eofol-simple";
import { getBreakpoint, getTheme, setTheme, sx } from "@eofol/eofol";
import {
  ENVELOPE_CUSTOM_TIME_MAX,
  ENVELOPE_CUSTOM_TIME_MIN,
  GAIN_MIN,
  PRECISION_MAX_DIGITS,
  keyLabelOptions,
} from "../../../data";
import { div, flex, h2, p } from "../../../extract";
import { FiddleState } from "../../../types";
import { defaultTheme, initStyles, themes } from "../../../styles";
import { decimalInput, integerInput } from "../../../ui";

const theme = getTheme();

export const optionsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const options = state.options;
  const breakpoint = getBreakpoint();

  return [
    div(sx({ display: "flex", flexDirection: "column" }), [
      div(
        sx({
          display: "flex",
          flexDirection: !breakpoint.xs ? "row" : "column",
          margin: "0 auto 0 auto",
        }),
        [
          div(sx({ flex: 1, margin: "0 64px 0 64px" }), [
            h2("Precision"),
            p("Frequency"),
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
            }),
            p("Cent"),
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
            }),
            p("Ratio"),
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
            }),
            p("Frequency on keys"),
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
            }),
          ]),
          div(sx({ flex: 1, margin: "0 64px 0 64px" }), [
            h2("Synth configuration"),
            p("Start gain"),
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
            }),
            p("Start time"),
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
            }),
            p("End gain"),
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
            }),
            p("End time"),
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
            }),
          ]),
        ]
      ),
      div(
        sx({
          display: "flex",
          flexDirection: !breakpoint.xs ? "row" : "column",
          margin: `${theme.spacing.space4} auto 0 auto`,
        }),
        [
          div(sx({ flex: 1, margin: "0 64px 0 64px" }), [
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
          ]),
          div(sx({ flex: 1, margin: "0 64px 0 64px" }), [
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
          ]),
        ]
      ),
    ]),
  ];
};
