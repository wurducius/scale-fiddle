import { sx } from "@eofol/eofol";
import { select, checkbox } from "@eofol/eofol-simple";
import { div, breakpoint, h2, p, h1, h3 } from "../../../extract";
import { setTotalGain, setWaveform } from "../../../synth";
import { FiddleState } from "../../../types";
import { sliderInput } from "../../../ui";
import {
  envelopeCurveOptions,
  envelopeTypeOptions,
  timbrePresets,
} from "../../../data";

const envelopeCurveSelect = (
  value: string,
  namePostfix: string,
  setter: (nextValue: string) => void
) => {
  return div(undefined, [
    h3("Curve"),
    select({
      name: "select-envelope-curve-" + namePostfix,
      options: envelopeCurveOptions,
      onChange: (nextVal) => {
        setter(nextVal);
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
    div(
      sx({ display: "flex", flexDirection: breakpoint.md ? "column" : "row" }),
      [
        div(sx({ flex: 1 }), [
          h2("Attack phase"),
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
            },
            "h3",
            (val) => `${val}%`,
            false,
            undefined,
            "attack-gain"
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
            },
            "h3",
            (val) => `${val} ms`,
            false,
            undefined,
            "attack-time"
          ),
          envelopeCurveSelect(synth.attackCurve, "attack", (nextValue) => {
            // @ts-ignore
            setState({
              ...state,
              synth: { ...synth, attackCurve: nextValue },
            });
          }),
          div(sx({ marginTop: "64px" }), [
            h2("Decay phase"),
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
              },
              "h3",
              (val) => `${val}%`,
              false,
              undefined,
              "decay-gain"
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
              },
              "h3",
              (val) => `${val} ms`,
              false,
              undefined,
              "decay-time"
            ),
            envelopeCurveSelect(synth.decayCurve, "decay", (nextValue) => {
              // @ts-ignore
              setState({
                ...state,
                synth: { ...synth, decayCurve: nextValue },
              });
            }),
          ]),
        ]),
        div(sx({ flex: 1 }), [
          h2("Sustain phase"),
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
            },
            "h3",
            (val) => `${val}%`,
            false,
            undefined,
            "sustain-gain"
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
            },
            "h3",
            (val) => `${val} ms`,
            false,
            undefined,
            "sustain-time"
          ),
          envelopeCurveSelect(synth.sustainCurve, "sustain", (nextValue) => {
            // @ts-ignore
            setState({
              ...state,
              synth: { ...synth, sustainCurve: nextValue },
            });
          }),
          div(sx({ marginTop: "64px" }), [
            h2("Release phase"),
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
              },
              "h3",
              (val) => `${val}%`,
              false,
              undefined,
              "release-gain"
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
              },
              "h3",
              (val) => `${val} ms`,
              false,
              undefined,
              "release-time"
            ),
            envelopeCurveSelect(synth.releaseCurve, "release", (nextValue) => {
              // @ts-ignore
              setState({
                ...state,
                synth: { ...synth, releaseCurve: nextValue },
              });
            }),
          ]),
        ]),
      ]
    ),
  ];
};

const envelopePresetMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [div(sx({ marginTop: "32px" }), [p("UNDER CONSTRUCTION")])];
};

const envelopeCustomMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [div(sx({ marginTop: "32px" }), [p("UNDER CONSTRUCTION")])];
};

const envelopeMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return div(undefined, [
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
    div(undefined, [
      div(
        sx({
          display: "flex",
          flexDirection: breakpoint.md ? "column" : "row",
        }),
        [
          div(sx({ flex: 1 }), [
            sliderInput(
              "Master volume",
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
              "h1",
              (val) => `${val}%`,
              true,
              sx({ margin: "0 32px 0 32px" }),
              "master-gain"
            ),
          ]),
          div(sx({ flex: 1 }), [
            h1("Organ (sustain)"),
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
          ]),
          div(sx({ flex: 1 }), [
            h1("Timbre"),
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
                setWaveform(nextVal);
              },
            }),
          ]),
        ]
      ),
    ]),
    div(sx({ marginTop: "64px" }), h1("Envelope")),
    select({
      name: "select-envelope-type",
      value: synth.envelopeType,
      options: envelopeTypeOptions,
      onChange: (nextVal) => {
        //@ts-ignore
        setState({
          ...state,
          synth: { ...synth, envelopeType: nextVal },
        });
      },
    }),
    envelopeMenu(state, setState),
    div(sx({ height: "32px" })),
  ];
};
