import { createStyle } from "@eofol/eofol";
import { Theme } from "@eofol/eofol-types";

export const initStyles = (theme: Theme) => {
  createStyle(
    `@media (hover: hover) and (pointer: fine) { .key-active-hover:hover { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.backgroundElevation}; } }`
  );

  createStyle(
    `.key-active-hover:hover { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.backgroundElevation}; }`
  );

  createStyle(
    `.key-inactive { height: 92px; fontSize: ${theme.typography.text.fontSize}; border: 2px solid ${theme.color.primary}; background-color: black; display: flex; justify-content: center; align-items: center; cursor: pointer; user-select: none; touch-action: none; direction: ltr; }`
  );

  createStyle(
    `.key-active { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.secondaryDark}; }`
  );

  createStyle(`.key-color-octave { color: ${theme.color.secondary}; }`);

  createStyle(`.key-color-nonoctave { color: ${theme.color.primary}; }`);
};
