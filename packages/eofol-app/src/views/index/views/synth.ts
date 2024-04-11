import { checkbox, createElement, input, select, sx } from "@eofol/eofol";
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
    input({
      name: "input-slider-" + label,
      value,
      onChange: (nextVal) => {
        setter(nextVal);
      },
      type: "range",
      min: 0,
      max: 100,
    }),
  ]);
};

const envelopeCurveSelect = (
  value: string,
  namePostfix: string,
  setter: (nextValue: string) => void
) => {
  return createElement("div", undefined, [
    createElement("p", undefined, "Curve"),
    select({
      name: "select-envelope-curve-" + namePostfix,
      options: [
        { title: "Linear", id: "linear" },
        { title: "Exponential", id: "exponential" },
      ],
      onChange: (nextVal) => {
        // @ts-ignore
        onchange: (e) => {
          setter(e.target.value);
        };
      },
      value,
    }),
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
    envelopeCurveSelect(synth.attackCurve, "attack", (nextValue) => {
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
    envelopeCurveSelect(synth.decayCurve, "decay", (nextValue) => {
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
    envelopeCurveSelect(synth.sustainCurve, "sustain", (nextValue) => {
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
    envelopeCurveSelect(synth.releaseCurve, "release", (nextValue) => {
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
        checkbox({
          name: "checkbox-organ",
          value: synth.organ,
          onChange: () => {
            // @ts-ignore
            setState({
              ...state,
              synth: { ...synth, organ: !synth.organ },
            });
          },
        }),
        createElement("h2", undefined, "Envelope"),
        select({
          name: "select-envelope-type",
          value: synth.envelopeType,
          options: [
            { title: "ADSR", id: "adsr" },
            { title: "Preset", id: "preset" },
            { title: "Custom", id: "custom" },
          ],
          onChange: (nextVal) => {
            //@ts-ignore
            setState({
              ...state,
              synth: { ...synth, envelopeType: nextVal },
            });
          },
        }),
        envelopeMenu(state, setState),
      ]),
      createElement("div", sx({ flex: 1 }), [
        createElement("h2", undefined, "Timbre"),
        select({
          name: "select-waveform-preset",
          // @ts-ignore
          value: state.synth.waveformPreset,
          options: timbrePresets.map((timbre) => ({
            title: timbre.title,
            id: timbre.id,
          })),
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
            setWaveform(nextVal);
          },
        }),
      ]),
    ]),
  ];
};
