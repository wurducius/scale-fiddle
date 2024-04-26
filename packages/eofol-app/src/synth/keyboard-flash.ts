import { sx, sy } from "@eofol/eofol";
import { theme } from "../extract";

export const keyColorOctaveStyle = sy(
  {
    color: theme.color.secondary,
  },
  "key-color-octave"
);
export const keyColorNonoctaveStyle = sy(
  {
    color: theme.color.primary,
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
    border: `2px solid ${theme.color.primaryLighter}`,
    backgroundColor: theme.color.backgroundElevation,
  },
  "hover"
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
