import { createStyle } from "@eofol/eofol";
import { Theme } from "@eofol/eofol-types";

const keyFontWeight = 500;

export const initStyles = (theme: Theme) => {
  createStyle(
    `@media (hover: hover) and (pointer: fine) { .key-active-hover:hover { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.backgroundElevation}; } }`
  );

  createStyle(
    `.key-active-hover:hover { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.backgroundElevation}; }`
  );
  createStyle(
    `.key-active-hover-b:hover { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.primary}; }`
  );
  createStyle(
    `.key-active-hover-w:hover { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.primary}; }`
  );

  createStyle(
    `.key-inactive { height: 92px; font-size: ${theme.typography.text.fontSize}; border: 2px solid ${theme.color.primary}; background-color: black; display: flex; justify-content: center; align-items: center; cursor: pointer; user-select: none; touch-action: none; direction: ltr; }`
  );
  createStyle(
    `.key-inactive-b { height: 92px; font-size: ${theme.typography.text.fontSize}; border: 2px solid ${theme.color.primary}; background-color: black; display: flex; justify-content: center; align-items: center; cursor: pointer; user-select: none; touch-action: none; direction: ltr; }`
  );
  createStyle(
    `.key-inactive-w { height: 92px; font-size: ${theme.typography.text.fontSize}; border: 2px solid ${theme.color.primary}; background-color: white; display: flex; justify-content: center; align-items: center; cursor: pointer; user-select: none; touch-action: none; direction: ltr; }`
  );

  createStyle(
    `.key-active { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.secondaryDark}; }`
  );
  createStyle(
    `.key-active-b { border: 2px solid ${theme.color.primaryLighter}; background-color: grey; }`
  );
  createStyle(
    `.key-active-w { border: 2px solid ${theme.color.primaryLighter}; background-color: grey; }`
  );

  createStyle(
    `.key-color-octave { font-weight: ${keyFontWeight};  color: ${theme.color.secondary}; }`
  );
  createStyle(
    `.key-color-octave-b { font-weight: ${keyFontWeight}; color: ${theme.color.secondaryDark}; }`
  );
  createStyle(
    `.key-color-octave-w { font-weight: ${keyFontWeight}; color: ${theme.color.secondaryDark}; }`
  );

  createStyle(
    `.key-color-nonoctave { font-weight: ${keyFontWeight}; color: ${theme.color.primary}; }`
  );
  createStyle(
    `.key-color-nonoctave-b { font-weight: ${keyFontWeight}; color: white; }`
  );
  createStyle(
    `.key-color-nonoctave-w { font-weight: ${keyFontWeight}; color: black; }`
  );
};
