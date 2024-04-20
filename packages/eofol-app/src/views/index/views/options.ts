import { createElement, sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";
import { input } from "@eofol/eofol-simple";

export const optionsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const options = state.options;

  return [
    createElement("div", sx({ display: "flex" }), [
      createElement("div", sx({ flex: 1 }), [
        createElement("h2", undefined, "Precision"),
        createElement("p", undefined, "Frequency"),
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
        createElement("p", undefined, "Cent"),
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
        createElement("p", undefined, "Ratio"),
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
        createElement("p", undefined, "Frequency on keys"),
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
        createElement("h2", undefined, "Synth configuration"),
        createElement("p", undefined, "Start gain"),
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
        createElement("p", undefined, "Start time"),
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
        createElement("p", undefined, "End gain"),
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
        createElement("p", undefined, "End time"),
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
  ];
};
