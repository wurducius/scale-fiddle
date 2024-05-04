import { clearStyle, createStyleObj, createStyle } from "@eofol/eofol";
import { Theme } from "@eofol/eofol-types";
import { keyActiveHoverStyle } from "../synth";

export const initStyles = (theme: Theme) => {
  clearStyle();

  createStyleObj({ color: theme.color.font }, "#eofol");

  createStyleObj({ color: theme.color.secondaryDark }, "a");
  createStyleObj({ color: theme.color.secondaryLighter }, "a:hover");

  createStyleObj({ backgroundColor: theme.color.background }, "body");

  createStyleObj(
    {
      width: "24px",
      height: "24px",
      accentColor: theme.color.secondary,
      cursor: "pointer",
      color: theme.color.backgroundElevation,
    },
    `input[type="checkbox"]`
  );
  createStyleObj(
    { accentColor: theme.color.secondaryDarker },
    `input[type="checkbox"]:hover`
  );

  createStyleObj(
    {
      marginTop: theme.spacing.space1,
      padding: "0 0 0 0",
      width: "256px",
      height: "24px",
      accentColor: theme.color.secondary,
      cursor: "pointer",
    },
    `input[type="range"]`
  );
  createStyleObj(
    { accentColor: theme.color.secondaryDarker },
    `input[type="range"]:hover`
  );

  createStyle('input[type="range"].lg { width: 500px; }');

  createStyle(
    `input { cursor: text; padding: 2px 10px; margin-top: 8px; margin-bottom: 8px; font-size: ${theme.typography.text.fontSize}; width: 256px; height: 24px; background-color: ${theme.color.backgroundElevation}; color: ${theme.color.secondary}; border: 1px solid ${theme.color.secondary}; }`
  );
  createStyle(
    `input:focus:not(.input-base-invalid) { outline: 2px solid ${theme.color.secondary}; }`
  );
  createStyle(
    `.number-input-hide-arrows::-webkit-outer-spin-button, .number-input-hide-arrows::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; } .number-input-hide-arrows { -moz-appearance: textfield; }`
  );

  createStyle(
    `textarea { cursor: text; margin-right: 0; padding: 8px 0 8px 8px; font-size: ${theme.typography.text.fontSize}; width: 256px; height: 24px; background-color: ${theme.color.backgroundElevation}; color: ${theme.color.secondary}; border: 1px solid ${theme.color.secondary}; }`
  );

  createStyle(`textarea:focus { outline: 2px solid ${theme.color.secondary} }`);

  createStyle(
    `select { padding: 6px 10px; margin-top: 8px; font-size: ${theme.typography.text.fontSize}; height: 36px; width: 256px; background-color: ${theme.color.background}; color: ${theme.color.secondary}; border: 1px solid ${theme.color.secondary} }`
  );

  createStyle(`select:focus { outline: 2px solid ${theme.color.secondary} }`);

  createStyle(
    `button { cursor: pointer; min-height: 36px; padding: 0 16px; font-size: ${theme.typography.text.fontSize}; font-weight: 500; background-color: ${theme.color.background}; color: ${theme.color.primary}; border: 1px solid ${theme.color.primary} }`
  );
  createStyle(
    `button:hover { background-color: ${theme.color.primaryDarker}; color: #000000; border: 1px solid ${theme.color.primaryLighter} }`
  );

  createStyle(
    `@media (hover: hover) and (pointer: fine) { .${keyActiveHoverStyle}:hover { border: 2px solid ${theme.color.secondaryLighter}; background-color: ${theme.color.secondaryLighter}; } }`
  );

  createStyle(
    `.key-inactive { height: 92px; fontSize: ${theme.typography.text.fontSize}; border: 2px solid ${theme.color.primary}; background-color: black; display: flex; justify-content: center; align-items: center; cursor: pointer; user-select: none; touch-action: none; direction: ltr; }`
  );

  createStyle(
    `.key-active { border: 2px solid ${theme.color.primaryLighter}; background-color: ${theme.color.secondaryDark}; }`
  );

  createStyle(`.key-color-octave { color: ${theme.color.secondary}; }`);

  createStyle(`.key-color-nonoctave { color: ${theme.color.primary}; }`);

  const getButtonStyle = (isSecondary: boolean, isActive: boolean) => ({
    fontSize: theme.typography.text.fontSize,
    backgroundColor: isActive ? theme.color.primary : "black",
    color: isSecondary
      ? theme.color.secondary
      : isActive
      ? "black"
      : theme.color.primary,
    border: `1px solid ${
      isSecondary ? theme.color.secondary : theme.color.primary
    }`,
  });

  createStyleObj(getButtonStyle(false, false), ".button-primary");
  createStyleObj(getButtonStyle(false, true), ".button-primary-active");
  createStyleObj(getButtonStyle(true, false), ".button-secondary");
  createStyleObj(getButtonStyle(true, true), ".button-secondary-active");

  const getButtonHoverStyle = (isSecondary: boolean) => ({
    backgroundColor: isSecondary
      ? theme.color.secondaryDark
      : theme.color.primaryDarker,
    color: "#000000",
    border: `1px solid ${
      isSecondary ? theme.color.secondaryLighter : theme.color.primaryLighter
    }`,
  });

  createStyleObj(getButtonHoverStyle(false), ".button-primary:hover");
  createStyleObj(getButtonHoverStyle(true), ".button-secondary:hover");

  createStyleObj({ color: theme.color.secondary }, ".input-slider-base");
  createStyleObj({ color: theme.color.primary }, ".input-slider-base-primary");

  createStyleObj(
    {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.space2,
      justifyContent: "center",
    },
    "input-slider-parent"
  );
};
