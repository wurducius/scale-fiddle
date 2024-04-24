import { createElement, createStyle, cx, sx } from "@eofol/eofol";
import { setTotalGain, setWaveform } from "../../../synth-lib";
import { FiddleState } from "../../../types";
import { timbrePresets } from "../../../presets/timbre-presets";
import { input, select, checkbox } from "@eofol/eofol-simple";
import { h1, h2, h3, p } from "../../../extract/font";
import { theme } from "../../../theme";
import { breakpoint } from "../../../extract/breakpoint";

createStyle('input[type="range"].lg { max-width: 500px; width: 100%; }');

const sliderInput = (
  label: string,
  value: string,
  setter: (nextValue: string) => void,
  labelTag?: undefined | string,
  adornmentMap?: (val: string) => string,
  large?: boolean,
  classname?: string,
  id?: string
) => {
  const getDisplayValue = (val: string) =>
    adornmentMap ? adornmentMap(val) : val;
  const displayId = "input-slider-value-display-" + id;

  return createElement(
    "div",
    [sx({ color: theme.secondary }), cx(classname)],
    [
      createElement(labelTag ?? "p", undefined, label),
      createElement(
        "div",
        sx({
          display: "flex",
          alignItems: "center",
          gap: "16px",
          justifyContent: "center",
        }),
        [
          input({
            name: "input-slider-" + label,
            value,
            onChange: (nextVal) => {
              setter(nextVal);
            },
            onInput: (nextVal) => {
              const displayElement = document.getElementById(displayId);
              if (displayElement) {
                displayElement.innerHTML = getDisplayValue(nextVal);
              }
            },
            type: "range",
            min: 0,
            max: 100,
            step: 1,
            classname: cx(large && "lg"),
          }),
          createElement("h3", undefined, getDisplayValue(value), {
            id: displayId,
          }),
        ]
      ),
    ]
  );
};

const envelopeCurveSelect = (
  value: string,
  namePostfix: string,
  setter: (nextValue: string) => void
) => {
  return createElement("div", undefined, [
    h3("Curve"),
    select({
      name: "select-envelope-curve-" + namePostfix,
      options: [
        { title: "Linear", id: "linear" },
        { title: "Exponential", id: "exponential" },
      ],
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
    createElement(
      "div",
      sx({ display: "flex", flexDirection: breakpoint.md ? "column" : "row" }),
      [
        createElement("div", sx({ flex: 1 }), [
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
          createElement("div", sx({ marginTop: "64px" }), [
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
        createElement("div", sx({ flex: 1 }), [
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
          createElement("div", sx({ marginTop: "64px" }), [
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
  return [
    createElement("div", sx({ marginTop: "32px" }), [p("UNDER CONSTRUCTION")]),
  ];
};

const envelopeCustomMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    createElement("div", sx({ marginTop: "32px" }), [p("UNDER CONSTRUCTION")]),
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
    createElement("div", undefined, [
      createElement(
        "div",
        sx({
          display: "flex",
          flexDirection: breakpoint.md ? "column" : "row",
        }),
        [
          createElement("div", sx({ flex: 1 }), [
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
          createElement("div", sx({ flex: 1 }), [
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
          createElement("div", sx({ flex: 1 }), [
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
    createElement("div", sx({ marginTop: "64px" }), h1("Envelope")),
    select({
      name: "select-envelope-type",
      value: synth.envelopeType,
      options: [
        { title: "ADSR envelope", id: "adsr" },
        { title: "Preset envelope", id: "preset" },
        { title: "Custom envelope", id: "custom" },
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
    createElement("div", sx({ height: "32px" })),
  ];
};
