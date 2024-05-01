import { button, input, notify, select } from "@eofol/eofol-simple";
import { timbrePresets, waveformTypeOptions } from "../../../../data";
import { setWaveformPreset, setWaveformValue } from "../../../../synth";
import { FiddleState, Timbre } from "../../../../types";
import { div, h2, h3, p } from "../../../../extract";
import { normalizePeriod, parseScala, tuningToTimbre } from "../../../../sheen";
import { sx } from "@eofol/eofol";

export const waveformTypeSelect = (state: FiddleState, setState: any) => {
  return select({
    name: "select-waveform-type",
    // @ts-ignore
    value: state.synth.waveformType,
    options: waveformTypeOptions,
    onChange: (nextVal) => {
      // @ts-ignore
      setState({
        ...state,
        synth: {
          // @ts-ignore
          ...state.synth,
          waveformType: nextVal,
        },
      });
    },
  });
};

export const waveformPresetSelect = (state: FiddleState, setState: any) =>
  select({
    name: "select-waveform-preset",
    // @ts-ignore
    value: state.synth.waveformPreset,
    options: timbrePresets,
    onChange: (nextVal) => {
      // @ts-ignore
      setState({
        ...state,
        synth: {
          // @ts-ignore
          ...state.synth,
          waveformPreset: nextVal,
        },
      });
      setWaveformPreset(nextVal);
    },
  });

export const waveformCustomMenu = (state: FiddleState, setState: any) =>
  p("UNDER CONSTRUCTION");

export const waveformFromTuningMenu = (state: FiddleState, setState: any) =>
  div(sx({ display: "flex", flexDirection: "column", alignItems: "center" }), [
    h3("Timbre coefficients length"),
    input({
      // @ts-ignore
      value: state.synth.fromTuningLength,
      name: "waveform-from-tuning-length",
      onChange: (nextVal) => {
        const val = Number(nextVal);
        if (
          !Number.isFinite(val) ||
          Number.isNaN(val) ||
          !Number.isInteger(val) ||
          val < 1
        ) {
          return;
        }
        // @ts-ignore
        setState({
          ...state, // @ts-ignore
          synth: { ...state.synth, fromTuningLength: val },
        });
      },
    }),
    h3("Timbre optimization iterations"),
    input({
      // @ts-ignore
      value: state.synth.fromTuningIterations,
      name: "waveform-from-tuning-iterations",
      onChange: (nextVal) => {
        const val = Number(nextVal);
        if (
          !Number.isFinite(val) ||
          Number.isNaN(val) ||
          !Number.isInteger(val) ||
          val < 1
        ) {
          return;
        }
        // @ts-ignore
        setState({
          ...state, // @ts-ignore
          synth: { ...state.synth, fromTuningIterations: val },
        });
      },
    }),
    button({
      styles: sx({ marginTop: "32px" }),
      children: "Compute timbre from tuning",
      onClick: () => {
        // @ts-ignore
        const parser = parseScala(state);
        // @ts-ignore
        const period = state.tuning.period;
        // @ts-ignore
        const fromTuningLength = state.synth.fromTuningLength;
        // @ts-ignore
        const fromTuningIterations = state.synth.fromTuningIterations;
        // @ts-ignore
        const ratioVals = state.scaleInput
          .split("\n")
          .map(parser)
          .map((tone: number) => normalizePeriod(tone, period))
          .sort((a: number, b: number) => a - b);

        const overlayElement = document.getElementById("overlay-loading");
        if (overlayElement) {
          overlayElement.className = "overlay-loading overlay-loading-active";
        }

        const progressElement = document.getElementById(
          "overlay-loading-progress"
        );
        const progressbarElement = document.getElementById(
          "overlay-loading-progressbar"
        );
        const remainingElement = document.getElementById(
          "overlay-loading-remaining"
        );

        setTimeout(() => {
          new Promise((resolve) => {
            return resolve(true);
          })
            .then(() => {
              return tuningToTimbre(
                ratioVals,
                period,
                fromTuningLength,
                fromTuningIterations,
                progressElement,
                progressbarElement,
                remainingElement
              );
            })
            .then((result) => {
              // @ts-ignore
              const resultDelta = result.errorDelta ?? 0;

              if (overlayElement) {
                overlayElement.className =
                  "overlay-loading overlay-loading-inactive";
              }

              notify({
                title: `Finished computing optimal timbre with reduced error by ${resultDelta.toFixed(
                  1
                )}.${
                  resultDelta < 0
                    ? " Because the error was actually increased, you might want to try to compute an optimal timbre again."
                    : ""
                }`,
              });

              // @ts-ignore
              setWaveformValue(result);
            });
        }, 20);
      },
    }),
  ]);

export const waveformValueMenu = (state: FiddleState, setState: any) => {
  // @ts-ignore
  const waveformType = state.synth.waveformType;
  return [
    ...(waveformType === "preset"
      ? [h2("Preset timbre"), waveformPresetSelect(state, setState)]
      : []),
    ...(waveformType === "custom"
      ? [h2("Custom timbre"), waveformCustomMenu(state, setState)]
      : []),
    ...(waveformType === "from-tuning"
      ? [
          h2("Optimal timbre from tuning"),
          waveformFromTuningMenu(state, setState),
        ]
      : []),
  ];
};
