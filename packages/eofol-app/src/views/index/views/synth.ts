import { createElement, sx } from "@eofol/eofol";
import { setTotalGain, setWaveform } from "../../../synth-lib";
import { FiddleState } from "../../../types";
import { timbrePresets } from "../../../timbre-presets";

const sliderInput = (
  label: string,
  value: string,
  setter: (nextValue: string) => void,
  labelTag?: undefined | string
) => {
  return createElement("div", undefined, [
    createElement(labelTag ?? "p", undefined, label),
    createElement(
      "input",
      undefined,
      undefined,
      {
        type: "range",
        min: "0",
        max: "100",
        value,
      },
      {
        // @ts-ignore
        onchange: (e) => {
          setter(e.target.value);
        },
      }
    ),
  ]);
};

const envelopeCurveSelect = (
  value: string,
  setter: (nextValue: string) => void
) => {
  return createElement("div", undefined, [
    createElement("p", undefined, "Curve"),
    createElement(
      "select",
      undefined,
      [
        createElement(
          "option",
          undefined,
          "Linear",
          value === "linear"
            ? { selected: "selected", value: "linear" }
            : { value: "linear" }
        ),
        createElement(
          "option",
          undefined,
          "Exponential",
          value === "exponential"
            ? { selected: "selected", value: "exponential" }
            : { value: "exponential" }
        ),
      ],
      { value },
      {
        // @ts-ignore
        onchange: (e) => {
          setter(e.target.value);
        },
      }
    ),
  ]);
};

const envelopeADSRMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return [
    createElement("p", undefined, "ADSR envelope"),
    createElement("h3", undefined, "Attack"),
    sliderInput(
      "Volume",
      (synth.attackGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            attackGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.attackTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            attackTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.attackCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, attackCurve: nextValue },
      });
    }),
    createElement("h3", undefined, "Decay"),
    sliderInput(
      "Volume",
      (synth.decayGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            decayGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.decayTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            decayTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.decayCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, decayCurve: nextValue },
      });
    }),
    createElement("h3", undefined, "Sustain"),
    sliderInput(
      "Volume",
      (synth.sustainGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            sustainGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.sustainTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            sustainTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.sustainCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, sustainCurve: nextValue },
      });
    }),
    createElement("h3", undefined, "Release"),
    sliderInput(
      "Volume",
      (synth.releaseGain * 100).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            releaseGain: val / 100,
          },
        });
      }
    ),
    sliderInput(
      "Time",
      (synth.releaseTime * 1000).toFixed(0).toString(),
      (nextValue) => {
        const val = Number(Number(nextValue).toFixed(0));
        // @ts-ignore
        setState({
          ...state,
          synth: {
            ...synth,
            releaseTime: val / 1000,
          },
        });
      }
    ),
    envelopeCurveSelect(synth.releaseCurve, (nextValue) => {
      // @ts-ignore
      setState({
        ...state,
        synth: { ...synth, releaseCurve: nextValue },
      });
    }),
  ];
};

const envelopePresetMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("p", undefined, "Preset envelope"),
    createElement("p", undefined, "Under construction - Preset envelopes"),
  ];
};

const envelopeCustomMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("p", undefined, "Custom envelope"),
    createElement(
      "p",
      undefined,
      "Under construction - Envelope custom phases - volume, curve"
    ),
  ];
};

const envelopeMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return createElement("div", undefined, [
    ...(synth.envelopeType === "adsr" ? envelopeADSRMenu(state, setState) : []),
    ...(synth.envelopeType === "preset"
      ? envelopePresetMenu(state, setState)
      : []),
    ...(synth.envelopeType === "custom"
      ? envelopeCustomMenu(state, setState)
      : []),
  ]);
};

export const synthTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return [
    createElement("div", sx({ display: "flex" }), [
      createElement("div", sx({ flex: 1 }), [
        sliderInput(
          "Volume",
          (synth.totalGain * 100).toFixed(0).toString(),
          (nextValue) => {
            const val = Number(Number(nextValue).toFixed(0));
            const newTotalGain = val / 100;
            // @ts-ignore
            setState({
              ...state,
              synth: {
                ...synth,
                totalGain: newTotalGain,
              },
            });
            setTotalGain(newTotalGain);
          },
          "h2"
        ),
        createElement("h2", undefined, "Organ"),
        createElement(
          "input",
          undefined,
          undefined,
          synth.organ
            ? { type: "checkbox", checked: "true" }
            : { type: "checkbox" },
          {
            // @ts-ignore
            onchange: () => {
              // @ts-ignore
              setState({
                ...state,
                synth: { ...synth, organ: !synth.organ },
              });
            },
          }
        ),
        createElement("h2", undefined, "Envelope"),
        createElement(
          "select",
          undefined,
          [
            createElement(
              "option",
              undefined,
              "ADSR",
              synth.envelopeType === "adsr"
                ? {
                    selected: "selected",
                    value: "adsr",
                  }
                : { value: "adsr" }
            ),
            createElement(
              "option",
              undefined,
              "Preset",
              synth.envelopeType === "preset"
                ? {
                    selected: "selected",
                    value: "preset",
                  }
                : { value: "preset" }
            ),
            createElement(
              "option",
              undefined,
              "Custom",
              synth.envelopeType === "custom"
                ? {
                    selected: "selected",
                    value: "custom",
                  }
                : { value: "custom" }
            ),
          ],
          { value: synth.envelopeType },
          {
            // @ts-ignore
            onchange: (e) => {
              //@ts-ignore
              setState({
                ...state,
                synth: { ...synth, envelopeType: e.target.value },
              });
            },
          }
        ),
        envelopeMenu(state, setState),
      ]),
      createElement("div", sx({ flex: 1 }), [
        createElement("h2", undefined, "Timbre"),
        createElement(
          "select",
          sx({ width: "100%" }),
          // @ts-ignore
          timbrePresets.map((timbre, index) =>
            createElement(
              "option",
              undefined,
              timbre.title,
              // @ts-ignore
              timbre.id === state.synth.waveformPreset
                ? { value: timbre.id, selected: "selected" }
                : {
                    value: timbre.id,
                  }
            )
          ),
          // @ts-ignore
          { value: state.synth.waveformPreset },
          {
            // @ts-ignore
            onchange: (e) => {
              // @ts-ignore
              setState({
                ...state,
                synth: {
                  // @ts-ignore
                  ...state.synth,
                  waveformPreset: e.target.value,
                },
              });
              setWaveform(e.target.value);
            },
          }
        ),
      ]),
    ]),
  ];
};
