import { cx, createElement, getTheme, sx } from "@eofol/eofol";
import { div, sliderInput } from "@eofol/eofol-simple";

export const sliderInputCustom = (
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
        sliderInput({
          size: "sm",
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
