import { createElement, sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";
import { input } from "@eofol/eofol-simple";
import { h2, p } from "../../../extract/font";
import { breakpoint } from "../../../breakpoint";

export const optionsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const options = state.options;

  return [
    createElement(
      "div",
      sx({ display: "flex", flexDirection: !breakpoint.xs ? "row" : "column" }),
      [
        createElement("div", sx({ flex: 1 }), [
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
        createElement("div", sx({ flex: 1 }), [
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
      ]
    ),
  ];
};
