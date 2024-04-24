import { sx, createStyle, sy } from "@eofol/eofol";
import { theme } from "../styles/theme";

export const keyColorOctaveStyle = sy(
  {
    color: theme.secondary,
  },
  "key-color-octave"
);
export const keyColorNonoctaveStyle = sy(
  {
    color: theme.primary,
  },
  "key-color-nonoctave"
);

export let keyElementsMap: Record<string, Element> = {};
export const clearKeyElementMap = () => {
  keyElementsMap = {};
};
export const setKeyElementMap = (freq: string, element: Element) => {
  keyElementsMap[freq] = element;
};

export const keyActiveHoverStyle = sx(
  {
    border: `2px solid ${theme.primaryLighter}`,
    backgroundColor: theme.backgroundElevation,
  },
  "hover"
);

createStyle(
  `@media (hover: hover) and (pointer: fine) { .${keyActiveHoverStyle}:hover { border: 2px solid ${theme.secondaryLighter}; background-color: ${theme.secondaryLighter}; } }`
);

export const flashKeyDownByValue = (freq: string) => {
  keyElementsMap[freq]?.setAttribute("class", "key-inactive key-active");
};
export const flashKeyUpByValue = (freq: string, isOctave?: boolean) => {
  keyElementsMap[freq]?.setAttribute(
    "class",
    "key-inactive " +
      (isOctave ? keyColorOctaveStyle + " " : "") +
      keyActiveHoverStyle
  );
};
