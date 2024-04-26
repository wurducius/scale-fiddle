import { input } from "@eofol/eofol-simple";
import { sx } from "@eofol/eofol";
import { FiddleState } from "../../../../types";
import { p, div, flex, h3, theme } from "../../../../extract";
import { waveformSelect } from "../synth-view";

export const scaleTuning = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const tuning = state.tuning;

  return div(
    sx({ margin: `${theme.spacing.space2} ${theme.spacing.space4}` }),
    [
      h3("Tuning", true),
      div(sx({ marginTop: theme.spacing.space1 })),
      flex({ alignItems: "center", justifyContent: "center" }, [
        p("Base frequency Hz"),
        div(
          sx({ width: "64px", margin: "0 0 0 auto", display: "flex" }),
          input({
            name: "input-basefreq",
            value: tuning.baseFreq,
            classname: sx({ width: "100%" }),
            onChange: (nextVal) => {
              const val = Number(nextVal);
              if (Number.isFinite(val)) {
                // @ts-ignore
                setState({
                  ...state,
                  tuning: { ...tuning, baseFreq: val },
                  recompute: true,
                });
              }
            },
          })
        ),
      ]),
      flex({ alignItems: "center", justifyContent: "center" }, [
        p("Period interval ratio"),
        div(
          sx({ width: "64px", margin: "0 0 0 auto", display: "flex" }),
          input({
            name: "input-period",
            value: tuning.period,
            classname: sx({ width: "100%" }),
            onChange: (nextVal) => {
              const val = Number(nextVal);
              if (Number.isFinite(val)) {
                // @ts-ignore
                setState({
                  ...state,
                  tuning: { ...tuning, period: val },
                  recompute: true,
                });
              }
            },
          })
        ),
      ]),
      flex({ alignItems: "center", justifyContent: "center" }, [
        p("Number of keys up"),
        div(
          sx({ width: "64px", margin: "0 0 0 auto", display: "flex" }),
          input({
            name: "input-keys-up",
            value: tuning.keysUp,
            classname: sx({ width: "100%" }),
            onChange: (nextVal) => {
              const val = Number(nextVal);
              if (Number.isFinite(val) && val >= 0) {
                // @ts-ignore
                setState({
                  ...state,
                  tuning: { ...tuning, keysUp: val },
                  recompute: true,
                });
              }
            },
          })
        ),
      ]),
      flex({ alignItems: "center", justifyContent: "center" }, [
        p("Number of keys down"),
        div(
          sx({ width: "64px", margin: "0 0 0 auto", display: "flex" }),
          input({
            name: "input-keys-down",
            value: tuning.keysDown,
            classname: sx({ width: "100%" }),
            onChange: (nextVal) => {
              const val = Number(nextVal);
              if (Number.isFinite(val) && val >= 0) {
                // @ts-ignore
                setState({
                  ...state,
                  tuning: { ...tuning, keysDown: val },
                  recompute: true,
                });
              }
            },
          })
        ),
      ]),
      div(sx({ marginTop: theme.spacing.space1 }), [
        h3("Timbre", true),
        waveformSelect(state, setState),
      ]),
    ]
  );
};
