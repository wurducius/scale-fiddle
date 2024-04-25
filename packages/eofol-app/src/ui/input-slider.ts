import { input } from "@eofol/eofol-simple";
import { createStyle, sx, cx, createElement } from "@eofol/eofol";
import { div } from "../extract";
import { theme } from "../styles";

createStyle('input[type="range"].lg { max-width: 500px; width: 100%; }');

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
    [sx({ color: theme.secondary }), cx(classname)],
    [
      createElement(labelTag ?? "p", undefined, label),
      div(
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
