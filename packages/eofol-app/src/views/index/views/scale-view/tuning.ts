import { getTheme, sx } from "@eofol/eofol";
import { FiddleState } from "../../../../types";
import { p, h3 } from "../../../../extract";
import { decimalInput, integerInput } from "../../../../ui";
import {
  BASE_FREQUENCY_MAX,
  BASE_FREQUENCY_MIN,
  KEYS_UP_DOWN_MAX,
  PERIOD_MAX,
} from "../../../../data";
import { div, flex } from "@eofol/eofol-simple";

export const scaleTuning = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const theme = getTheme();

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
          sx({ width: "96px", margin: "0 0 0 auto", display: "flex" }),
          decimalInput({
            min: BASE_FREQUENCY_MIN,
            max: BASE_FREQUENCY_MAX,
            name: "input-basefreq",
            value: tuning.baseFreq,
            onChange: (nextVal) => {
              const val = Number(nextVal);
              // @ts-ignore
              setState({
                ...state,
                tuning: { ...tuning, baseFreq: val },
                recompute: true,
              });
            },
          })
        ),
      ]),
      flex({ alignItems: "center", justifyContent: "center" }, [
        p("Period interval ratio"),
        div(
          sx({ width: "96px", margin: "0 0 0 auto", display: "flex" }),
          decimalInput({
            min: 1,
            minNotIncluded: true,
            max: PERIOD_MAX,
            name: "input-period",
            value: tuning.period,
            onChange: (nextVal) => {
              const val = Number(nextVal);
              // @ts-ignore
              setState({
                ...state,
                tuning: { ...tuning, period: val },
                recompute: true,
              });
            },
          })
        ),
      ]),
      flex({ alignItems: "center", justifyContent: "center" }, [
        p("Number of keys up"),
        div(
          sx({ width: "96px", margin: "0 0 0 auto", display: "flex" }),
          integerInput({
            min: 0,
            max: KEYS_UP_DOWN_MAX,
            name: "input-keys-up",
            value: tuning.keysUp,
            classname: sx({ margin: "8px 0 8px 0" }),
            onChange: (nextVal) => {
              const val = Number(nextVal);
              // @ts-ignore
              setState({
                ...state,
                tuning: { ...tuning, keysUp: val },
                recompute: true,
              });
            },
          })
        ),
      ]),
      flex({ alignItems: "center", justifyContent: "center" }, [
        p("Number of keys down"),
        div(
          sx({ width: "96px", margin: "0 0 0 auto", display: "flex" }),
          integerInput({
            min: 0,
            max: KEYS_UP_DOWN_MAX,
            name: "input-keys-down",
            value: tuning.keysDown,
            classname: sx({ margin: "8px 0 8px 0" }),
            onChange: (nextVal) => {
              const val = Number(nextVal);
              // @ts-ignore
              setState({
                ...state,
                tuning: { ...tuning, keysDown: val },
                recompute: true,
              });
            },
          })
        ),
      ]),
    ]
  );
};
