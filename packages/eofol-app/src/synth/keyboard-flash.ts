import { sx } from "@eofol/eofol";
import { theme } from "../extract";

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
      (isOctave ? "key-color-octave" + " " : "") +
      keyActiveHoverStyle
  );
};
