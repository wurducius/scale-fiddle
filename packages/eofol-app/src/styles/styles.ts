import { createStyle } from "@eofol/eofol";
import { theme } from "../extract";

export const initStyles = () => {
  createStyle(`#eofol { color: ${theme.color.font}; }`);
  createStyle(`a { color: ${theme.color.secondaryDark}}`);
  createStyle(`body { background-color: ${theme.color.background}; }`);

  createStyle(
    `input[type="checkbox"] { width: 24px; height: 24px; accent-color: ${theme.color.secondary}; cursor: pointer; color: ${theme.color.backgroundElevation}; }`
  );
  createStyle(
    `input[type="checkbox"]:hover { accent-color: ${theme.color.secondaryDarker}; }`
  );

  createStyle(
    `input[type="range"] { margin-top: ${theme.spacing.space1}; padding: 0 0 0 0; width: 256px; height: 24px; accent-color: ${theme.color.secondary}; cursor: pointer; }`
  );
  createStyle(
    `input[type="range"]:hover { accent-color: ${theme.color.secondaryDarker}; }`
  );

  createStyle(
    `input { cursor: text; padding: 2px 10px; margin-top: 8px; margin-bottom: 8px; font-size: ${theme.typography.text.fontSize}; width: 256px; height: 24px; background-color: ${theme.color.backgroundElevation}; color: ${theme.color.secondary}; border: 1px solid ${theme.color.secondary}; }`
  );
  createStyle(`input:focus { outline: 2px solid ${theme.color.secondary}; }`);

  createStyle(
    `textarea { cursor: text; margin-right: 0; padding: 8px 0 8px 8px; font-size: ${theme.typography.text.fontSize}; width: 256px; height: 24px; background-color: ${theme.color.backgroundElevation}; color: ${theme.color.secondary}; border: 1px solid ${theme.color.secondary}; }`
  );

  createStyle(
    `select { padding: 6px 10px; margin-top: 8px; font-size: ${theme.typography.text.fontSize}; height: 36px; width: 256px; background-color: ${theme.color.background}; color: ${theme.color.secondary}; border: 1px solid ${theme.color.secondary} }`
  );

  createStyle(
    `button { cursor: pointer; min-height: 36px; padding: 0 16px; font-size: ${theme.typography.text.fontSize}; font-weight: 500; background-color: ${theme.color.background}; color: ${theme.color.primary}; border: 1px solid ${theme.color.primary} }`
  );
  createStyle(
    `button:hover { background-color: ${theme.color.primaryDarker}; color: #000000; border: 1px solid ${theme.color.primaryLighter} }`
  );
};
