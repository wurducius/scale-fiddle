import { getBreakpoint, getTheme, sx } from "@eofol/eofol";
import { select, checkbox, input } from "@eofol/eofol-simple";
import { div, h2, h1, h3, h4 } from "../../../extract";
import { setTotalGain } from "../../../synth";
import { FiddleState } from "../../../types";
import { decimalInput, integerInput, sliderInput } from "../../../ui";
import {
  ENVELOPE_CUSTOM_MAX_LENGTH,
  ENVELOPE_CUSTOM_TIME_MAX,
  ENVELOPE_CUSTOM_TIME_MIN,
  envelopeCurveOptions,
  envelopeTypeOptions,
} from "../../../data";
import { waveformTypeSelect, waveformValueMenu } from "./synth-view";

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
  const theme = getTheme();
  const breakpoint = getBreakpoint();

  // @ts-ignore
  const synth = state.synth;

  return [
    div(
      sx({
        display: "flex",
        flexDirection: breakpoint.md ? "column" : "row",
        margin: "64px auto 0 auto",
      }),
      [
        div(sx({ flex: 1, margin: "0 64px 0 64px" }), [
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
          div(sx({ marginTop: theme.spacing.space8 }), [
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
        div(sx({ flex: 1, margin: "0 64px 0 64px" }), [
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
          div(sx({ marginTop: theme.spacing.space8 }), [
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
  const theme = getTheme();

  return [
    div(sx({ marginTop: theme.spacing.space4 }), [
      select({
        value: "",
        name: "select-envelope-preset",
        onChange: (nextVal) => {},
        options: [],
      }),
    ]),
  ];
};

const envelopeCustomMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

  return div(sx({ marginTop: theme.spacing.space4 }), [
    h3("Envelope phase length"),
    integerInput({
      min: 1,
      max: ENVELOPE_CUSTOM_MAX_LENGTH,
      // @ts-ignore
      value: state.synth.customEnvelopeLength,
      name: "select-envelope-custom-length",
      onChange: (nextVal) => {
        const val = Number(nextVal);
        const array = Array.from({ length: val });

        // @ts-ignore
        const customEnvelopeGain = state.synth.customEnvelopeGain;
        // @ts-ignore
        const customEnvelopeTime = state.synth.customEnvelopeTime;
        // @ts-ignore
        const customEnvelopeCurve = state.synth.customEnvelopeCurve;

        // @ts-ignore
        setState({
          ...state,
          synth: {
            // @ts-ignore
            ...state.synth,
            customEnvelopeLength: val,
            customEnvelopeGain: array.map((item, i) =>
              i < customEnvelopeGain.length ? customEnvelopeGain[i] : 1
            ),
            customEnvelopeTime: array.map((item, i) =>
              i < customEnvelopeTime.length ? customEnvelopeTime[i] : 50
            ),
            customEnvelopeCurve: array.map((item, i) =>
              i < customEnvelopeCurve.length ? customEnvelopeCurve[i] : "linear"
            ),
          },
        });
      },
    }),
    div(
      undefined, // @ts-ignore
      Array.from({ length: state.synth.customEnvelopeLength })
        .map((item, index) => [
          h3("Envelope phase #" + (index + 1)),
          h4("Gain"),
          decimalInput({
            min: 0,
            max: 1,
            // @ts-ignore
            value: state.synth.customEnvelopeGain[index],
            name: "select-envelope-custom-gain-" + index,
            onChange: (nextVal) => {
              // @ts-ignore
              setState({
                ...state,
                synth: {
                  // @ts-ignore
                  ...state.synth, // @ts-ignore
                  customEnvelopeGain: state.synth.customEnvelopeGain.map(
                    // @ts-ignore
                    (item, i) => (i === index ? nextVal : item)
                  ),
                },
              });
            },
          }),
          h4("Time"),
          decimalInput({
            min: ENVELOPE_CUSTOM_TIME_MIN,
            max: ENVELOPE_CUSTOM_TIME_MAX,
            step: 1,
            // @ts-ignore
            value: state.synth.customEnvelopeTime[index],
            name: "select-envelope-custom-time-" + index,
            onChange: (nextVal) => {
              // @ts-ignore
              setState({
                ...state,
                synth: {
                  // @ts-ignore
                  ...state.synth, // @ts-ignore
                  customEnvelopeTime: state.synth.customEnvelopeTime.map(
                    // @ts-ignore
                    (item, i) => (i === index ? nextVal : item)
                  ),
                },
              });
            },
          }),
          h4("Curve"),
          select({
            name: "select-envelope-custom-curve-" + index, // @ts-ignore
            value: state.synth.customEnvelopeCurve[index],
            onChange: (nextVal) => {
              // @ts-ignore
              setState({
                ...state,
                synth: {
                  // @ts-ignore
                  ...state.synth, // @ts-ignore
                  customEnvelopeCurve: state.synth.customEnvelopeCurve.map(
                    // @ts-ignore
                    (item, i) => (i === index ? nextVal : item)
                  ),
                },
              });
            },
            options: envelopeCurveOptions,
          }),
        ])
        .flat()
    ),
  ]);
};

const envelopeMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const synth = state.synth;

  return div(sx({ display: "flex", justifyContent: "center" }), [
    ...(synth.envelopeType === "adsr" ? envelopeADSRMenu(state, setState) : []),
    ...(synth.envelopeType === "preset"
      ? envelopePresetMenu(state, setState)
      : []),
    ...(synth.envelopeType === "custom"
      ? [envelopeCustomMenu(state, setState)]
      : []),
  ]);
};

export const synthTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();
  const breakpoint = getBreakpoint();
  // @ts-ignore
  const synth = state.synth;

  return [
    div(
      sx({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }),
      [
        div(
          sx({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: "0 auto 0 auto",
            flex: 2,
          }),
          [
            div(
              sx({
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0 64px 0 64px",
              }),
              [
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
                  sx({ margin: `0 ${theme.spacing.space4}` }),
                  "master-gain",
                  true
                ),
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
              ]
            ),
            div(sx({ margin: "0 64px 0 64px" }), [
              h1("Timbre"),
              waveformTypeSelect(state, setState),
              div(
                sx({ marginTop: "48px" }),
                waveformValueMenu(state, setState)
              ),
            ]),
          ]
        ),
      ]
    ),
    div(sx({ marginTop: theme.spacing.space8 }), h1("Envelope")),
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
    div(sx({ height: theme.spacing.space4 })),
  ];
};
