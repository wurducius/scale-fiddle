import { createStyle } from "@eofol/eofol";
import { theme } from "./theme";

export const initStyles = () => {
  createStyle(`#eofol { color: ${theme.font}; }`);
  createStyle(`a { color: ${theme.secondaryDark}}`);
  createStyle(`body { background-color: ${theme.background}; }`);

  createStyle(
    `input[type="checkbox"] { width: 24px; height: 24px; accent-color: ${theme.secondary}; cursor: pointer; color: ${theme.backgroundElevation}; }`
  );
  createStyle(
    `input[type="checkbox"]:hover { accent-color: ${theme.secondaryDarker}; }`
  );

  createStyle(
    `input[type="range"] { margin-top: 8px; padding: 0 0 0 0; width: 256px; height: 24px; accent-color: ${theme.secondary}; cursor: pointer; }`
  );
  createStyle(
    `input[type="range"]:hover { accent-color: ${theme.secondaryDarker}; }`
  );

  createStyle(
    `input { cursor: text; padding: 2px 10px; margin-top: 8px; margin-bottom: 8px; font-size: 16px; width: 256px; height: 24px; background-color: ${theme.backgroundElevation}; color: ${theme.secondary}; border: 1px solid ${theme.secondary}; }`
  );

  createStyle(
    `textarea { cursor: text; margin-right: 0; padding: 8px 0px 8px 8px; font-size: 16px; width: 256px; height: 24px; background-color: ${theme.backgroundElevation}; color: ${theme.secondary}; border: 1px solid ${theme.secondary}; }`
  );

  createStyle(
    `select { padding: 6px 10px; margin-top: 8px; font-size: 16px; height: 32px; width: 256px; background-color: ${theme.background}; color: ${theme.secondary}; border: 1px solid ${theme.secondary} }`
  );

  createStyle(
    `button { cursor: pointer; min-height: 28px; font-size: 16px; font-weight: 500; background-color: ${theme.background}; color: ${theme.primary}; border: 1px solid ${theme.primary} }`
  );
  createStyle(
    `button:hover { background-color: ${theme.primaryDarker}; color: ${theme.primaryLighter}; border: 1px solid ${theme.primaryLighter} }`
  );
};
