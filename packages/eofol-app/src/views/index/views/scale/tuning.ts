import { input } from "@eofol/eofol-simple";
import { sx } from "@eofol/eofol";
import { div } from "../../../../extract/primitive";
import { FiddleState } from "../../../../types";
import { p } from "../../../../extract/font";

export const scaleTuning = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const tuning = state.tuning;

  return div(sx({ marginTop: "16px" }), [
    p("Base frequency Hz"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
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
    p("Period interval (Equave) ratio"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
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
    p("Number of keys up"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
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
    p("Number of keys down"),
    div(
      sx({ width: "236px", margin: "0 auto 0 auto" }),
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
  ]);
};
