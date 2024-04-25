import { input, select } from "@eofol/eofol-simple";
import { sx } from "@eofol/eofol";
import { keyLabelOptions } from "../../../data";
import { div, flex, breakpoint, h2, p } from "../../../extract";
import { FiddleState } from "../../../types";
import { theme } from "../../../extract";

export const optionsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const options = state.options;

  return [
    div(undefined, [
      flex({ flexDirection: !breakpoint.xs ? "row" : "column" }, [
        div(sx({ flex: 1 }), [
          h2("Precision"),
          p("Frequency"),
          input({
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
          input({
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
          input({
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
          input({
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
        div(sx({ flex: 1 }), [
          h2("Synth configuration"),
          p("Start gain"),
          input({
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
          input({
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
          input({
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
          input({
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
      ]),
      div(
        sx({
          display: "flex",
          flexDirection: !breakpoint.xs ? "row" : "column",
          marginTop: theme.spacing.space4,
        }),
        [
          div(sx({ flex: 1 }), [
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
        ]
      ),
    ]),
  ];
};
