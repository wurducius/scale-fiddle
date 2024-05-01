import {
  button,
  input,
  notify,
  numberInput,
  select,
} from "@eofol/eofol-simple";
import {
  TIMBRE_CUSTOM_COEFFICIENTS_LENGTH_MAX,
  TIMBRE_FROM_TUNING_COEFFICIENTS_LENGTH_MAX,
  TIMBRE_FROM_TUNING_ITERATIONS_MAX,
  timbrePresets,
  waveformTypeOptions,
} from "../../../../data";
import { setWaveformPreset, setWaveformValue } from "../../../../synth";
import { FiddleState, Timbre } from "../../../../types";
import { div, h2, h3, h4, p } from "../../../../extract";
import {
  normalizePeriod,
  parseScala,
  timbreToTuning,
  tuningToTimbre,
} from "../../../../sheen";
import { createElement, sx } from "@eofol/eofol";
import {
  validateIsInteger,
  validateIsNumber,
  validateIsOverMin,
  validateIsRequired,
  validateIsUnderMax,
} from "../../../../util/validation";
import { decimalInput, integerInput } from "../../../../ui";

const setCustomWaveform = (customCoefficients: [number, number][]) => {
  // @ts-ignore
  const result: Timbre = {
    id: "custom-timbre",
    title: "Custom timbre",
    real: [
      0,
      ...customCoefficients.map(
        (coefficient: [number, number]) => coefficient[0]
      ),
    ],
    imag: [
      0,
      ...customCoefficients.map(
        (coefficient: [number, number]) => coefficient[1]
      ),
    ],
  };

  // @ts-ignore
  setWaveformValue(result);
};

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

export const waveformCustomMenu = (state: FiddleState, setState: any) => {
  // @ts-ignore
  const customLength = state.synth.customLength;
  // @ts-ignore
  const customCoefficients = state.synth.customCoefficients;

  return div(
    sx({ display: "flex", flexDirection: "column", alignItems: "center" }),
    [
      h3("Timbre coefficients length"),
      integerInput({
        name: "waveform-custom-length",
        value: customLength,
        min: 1,
        max: TIMBRE_CUSTOM_COEFFICIENTS_LENGTH_MAX,
        onChange: (nextVal) => {
          const val = Number(nextVal);
          const nextCustomCoefficients = Array.from({ length: val }).map(
            (item, i) =>
              i < customCoefficients.length
                ? [customCoefficients[i][0], customCoefficients[i][1]]
                : [0, 0]
          ) as [number, number][];

          setCustomWaveform(nextCustomCoefficients);

          // @ts-ignore
          setState({
            ...state,
            synth: {
              // @ts-ignore
              ...state.synth,
              customLength: val,
              customCoefficients: nextCustomCoefficients,
            },
          });
        },
      }),
      ...Array.from({ length: customLength }).map((item, index) => {
        return div(sx({ marginTop: "32px" }), [
          h3("Timbre coefficient #" + (index + 2)),
          div(sx({ display: "flex" }), [
            div(sx({ display: "block", marginRight: "32px" }), [
              h4("Real coefficient"),
              decimalInput({
                min: -1,
                max: 1,
                name: "waveform-custom-coefficient-real-" + index,
                classname: sx({ width: "128px" }),
                value: customCoefficients[index][0],
                onChange: (nextVal) => {
                  const val = Number(nextVal);
                  if (
                    !Number.isFinite(val) ||
                    Number.isNaN(val) ||
                    val < -1 ||
                    val > 1
                  ) {
                    return;
                  }

                  const nextCustomCoefficients = // @ts-ignore
                    state.synth.customCoefficients.map(
                      // @ts-ignore
                      (item, i) => (index === i ? [val, item[1]] : item)
                    );

                  setCustomWaveform(nextCustomCoefficients);

                  // @ts-ignore
                  setState({
                    ...state,
                    synth: {
                      // @ts-ignore
                      ...state.synth, // @ts-ignore
                      customCoefficients: nextCustomCoefficients,
                    },
                  });
                },
              }),
            ]),
            div(sx({ display: "block", marginLeft: "32px" }), [
              h4("Imaginary coefficient"),
              decimalInput({
                min: -1,
                max: 1,
                name: "waveform-custom-coefficient-imag-" + index,
                classname: sx({ width: "128px" }),
                value: customCoefficients[index][1],
                onChange: (nextVal) => {
                  const val = Number(nextVal);
                  if (
                    !Number.isFinite(val) ||
                    Number.isNaN(val) ||
                    val < -1 ||
                    val > 1
                  ) {
                    return;
                  }

                  const nextCustomCoefficients = // @ts-ignore
                    state.synth.customCoefficients.map(
                      // @ts-ignore
                      (item, i) => (index === i ? [item[0], val] : item)
                    );

                  setCustomWaveform(nextCustomCoefficients);

                  // @ts-ignore
                  setState({
                    ...state,
                    synth: {
                      // @ts-ignore
                      ...state.synth, // @ts-ignore
                      customCoefficients: nextCustomCoefficients,
                    },
                  });
                },
              }),
            ]),
          ]),
        ]);
      }),
      button({
        children: "Compute optimal scale from timbre",
        styles: sx({ marginTop: "48px" }),
        onClick: () => {
          const timbre: Timbre = {
            id: "",
            title: "", // @ts-ignore
            real: [0, ...state.synth.customCoefficients.map((item) => item[0])], // @ts-ignore
            imag: [0, ...state.synth.customCoefficients.map((item) => item[1])],
          };

          const timbralScale = timbreToTuning(
            timbre, // @ts-ignore
            state.tuning.period, // @ts-ignore
            state.options.decimalDigitsCent
          );

          notify({ title: "Set timbral scale for given custom timbre." });

          // @ts-ignore
          setState({
            ...state,
            recompute: true,
            scaleLength: timbralScale.length,
            scaleInput: timbralScale.join("\n"),
          });
        },
      }),
    ]
  );
};

const timbreFromTuningLengthInput = (state: FiddleState, setState: any) => {
  return [
    h3("Timbre coefficients length"),
    integerInput({
      min: 1,
      max: TIMBRE_FROM_TUNING_COEFFICIENTS_LENGTH_MAX,
      // @ts-ignore
      value: state.synth.fromTuningLength,
      name: "waveform-from-tuning-length",
      onChange: (nextVal) => {
        const val = Number(nextVal);
        // @ts-ignore
        setState({
          ...state, // @ts-ignore
          synth: { ...state.synth, fromTuningLength: val },
        });
      },
    }),
  ];
};

const timbreFromTuningIterationsInput = (state: FiddleState, setState: any) => {
  return [
    h3("Timbre optimization iterations"),
    integerInput({
      min: 1,
      max: TIMBRE_FROM_TUNING_ITERATIONS_MAX,
      // @ts-ignore
      value: state.synth.fromTuningIterations,
      name: "waveform-from-tuning-iterations",
      onChange: (nextVal) => {
        const val = Number(nextVal);
        // @ts-ignore
        setState({
          ...state, // @ts-ignore
          synth: { ...state.synth, fromTuningIterations: val },
        });
      },
    }),
  ];
};

const timbreFromTuningButton = (state: FiddleState, setState: any) => {
  return button({
    styles: sx({ marginTop: "48px" }),
    children: "Compute optimal timbre from tuning",
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
      const progressElement = document.getElementById(
        "overlay-loading-progress"
      );
      const progressbarElement = document.getElementById(
        "overlay-loading-progressbar"
      );
      const remainingElement = document.getElementById(
        "overlay-loading-remaining"
      );

      const updateProgress = (
        i: number,
        iterations: number,
        start: Date,
        end: Date
      ) => {
        const progressValue = (((i + 1) / iterations) * 100).toFixed(0);
        const timeGuessSeconds = // @ts-ignore
          (((iterations - i - 1) * (end - start)) / 1000).toFixed(0);

        if (progressElement) {
          progressElement.textContent = `${progressValue}%`;
        }
        if (progressbarElement) {
          progressbarElement.setAttribute("value", progressValue);
          progressbarElement.textContent = `${progressValue}%`;
        }
        if (remainingElement) {
          remainingElement.textContent = `Estimated time remaining: ${timeGuessSeconds}s`;
        }
      };

      if (overlayElement) {
        overlayElement.className = "overlay-loading overlay-loading-active";
      }
      if (progressElement) {
        progressElement.textContent = `0%`;
      }
      if (progressbarElement) {
        progressbarElement.setAttribute("value", "0");
        progressbarElement.textContent = `0%`;
      }
      if (remainingElement) {
        remainingElement.textContent = `Estimated time remaining:`;
      }

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
              updateProgress
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
  });
};

export const waveformFromTuningMenu = (state: FiddleState, setState: any) => {
  return div(
    sx({ display: "flex", flexDirection: "column", alignItems: "center" }),
    [
      ...timbreFromTuningLengthInput(state, setState),
      ...timbreFromTuningIterationsInput(state, setState),
      timbreFromTuningButton(state, setState),
    ]
  );
};

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
