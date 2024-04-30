import { button, input, notify, select } from "@eofol/eofol-simple";
import { timbrePresets, waveformTypeOptions } from "../../../../data";
import { setWaveformPreset, setWaveformValue } from "../../../../synth";
import { FiddleState } from "../../../../types";
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

        notify({
          title:
            "Computing optimal timbre for given tuning. This might take a while according to selected length and number of iterations.",
        });

        const result = tuningToTimbre(
          ratioVals,
          period,
          fromTuningLength,
          fromTuningIterations
        );

        setWaveformValue(result);

        notify({ title: "Finished computing optimal timbre." });
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
