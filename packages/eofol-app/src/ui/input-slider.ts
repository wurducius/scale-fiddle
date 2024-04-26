import { input } from "@eofol/eofol-simple";
import { cx, createElement, sy } from "@eofol/eofol";
import { div, theme } from "../extract";

export const sliderInput = (
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

  return div(
    ["input-slider-base", cx(classname)],
    [
      createElement(labelTag ?? "p", undefined, label),
      div("input-slider-parent", [
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
      ]),
    ]
  );
};
