import { inputBase } from "@eofol/eofol-simple";
import { cx, createElement, getTheme, sx } from "@eofol/eofol";
import { div } from "../extract";

const sliderInputX = ({
  value,
  name,
  onChange,
  onInput,
  onBlur,
  onFocus,
  classname,
  min,
  max,
  step,
  disabled,
  readonly,
  scheme,
}: {
  value: string;
  name: string;
  onChange: (nextVal: number) => void;
  onInput?: (nextVal: number) => void;
  onBlur?: (nextVal: number) => void;
  onFocus?: (nextVal: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readonly?: boolean;
  scheme?: "primary" | "secondary";
  classname?: string;
}) => {
  const theme = getTheme();

  const baseStyle = sx({
    color: scheme === "primary" ? theme.color.primary : theme.color.secondary,
  });

  const parentStyle = sx({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.space2,
    justifyContent: "center",
  });

  return inputBase({
    name,
    value,
    onChange: (nextVal: string) => onChange(Number(nextVal)),
    onInput: onInput
      ? (nextVal: string) => onInput(Number(nextVal))
      : undefined,
    onBlur: onBlur ? (nextVal: string) => onBlur(Number(nextVal)) : undefined,
    onFocus: onFocus
      ? (nextVal: string) => onFocus(Number(nextVal))
      : undefined,
    type: "range",
    min: min ?? 0,
    max: max ?? 100,
    step: step ?? 1,
    disabled,
    readonly,
    classname: cx(
      baseStyle,
      classname,
      sx({
        marginTop: theme.spacing.space1,
        padding: "0 0 0 0",
        width: "256px",
        height: "24px",
        accentColor: theme.color.secondary,
        cursor: "pointer",
      }),
      sx({ accentColor: theme.color.secondaryDarker }, ":hover")
    ),
  });
};

export const sliderInput = (
  label: string,
  value: string,
  setter: (nextValue: string) => void,
  labelTag?: undefined | string,
  adornmentMap?: (val: string) => string,
  large?: boolean,
  classname?: string,
  id?: string,
  isPrimary?: boolean
) => {
  const theme = getTheme();

  const getDisplayValue = (val: string) =>
    adornmentMap ? adornmentMap(val) : val;
  const displayId = "input-slider-value-display-" + id;

  return div(
    [
      isPrimary ? "input-slider-base-primary" : "input-slider-base",
      cx(classname),
    ],
    [
      createElement(labelTag ?? "p", undefined, label),
      div(cx(large && sx({ width: "500px" })), [
        sliderInputX({
          scheme: isPrimary ? "primary" : "secondary",
          name: "input-slider-" + label,
          value,
          onChange: (nextVal) => {
            setter(nextVal.toString());
          },
          onInput: (nextVal) => {
            const displayElement = document.getElementById(displayId);
            if (displayElement) {
              displayElement.innerHTML = getDisplayValue(nextVal.toString());
            }
          },
          classname,
        }),
        createElement(
          "h3",
          sx({
            color: isPrimary ? theme.color.primary : theme.color.secondary,
          }),
          getDisplayValue(value),
          {
            id: displayId,
          }
        ),
      ]),
    ]
  );
};
