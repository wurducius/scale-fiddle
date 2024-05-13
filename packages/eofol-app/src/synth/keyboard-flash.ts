import { KeyMap } from "../types";

export let keyElementsMap: Record<string, Element> = {};

export const clearKeyElementMap = () => {
  keyElementsMap = {};
};
export const setKeyElementMap = (freq: string, element: Element) => {
  keyElementsMap[freq] = element;
};

export const flashKeyDownByValue = (keyVal: KeyMap) => {
  keyElementsMap[keyVal.freq]?.setAttribute(
    "class",
    getInactiveKeyColor(keyVal) + " " + getActiveKeyColor(keyVal)
  );
};
export const flashKeyUpByValue = (keyVal: KeyMap) => {
  keyElementsMap[keyVal.freq]?.setAttribute(
    "class",
    getInactiveKeyColor(keyVal) +
      " " +
      getTextKeyColor(keyVal) +
      " " +
      getActiveHoverKeyColor(keyVal) +
      " " +
      getTextKeyColor(keyVal)
  );
};

export const getInactiveKeyColor = (keyVal: KeyMap) =>
  `key-inactive${keyVal.color ? `-${keyVal.color}` : ""}`;

export const getActiveKeyColor = (keyVal: KeyMap) =>
  `key-active${keyVal.color ? `-${keyVal.color}` : ""}`;

export const getActiveHoverKeyColor = (keyVal: KeyMap) =>
  `key-active-hover${keyVal.color ? `-${keyVal.color}` : ""}`;

export const getTextKeyColor = (keyVal: KeyMap) =>
  `${keyVal.isOctave ? "key-color-octave" : "key-color-nonoctave"}${
    keyVal.color ? `-${keyVal.color}` : ""
  }`;
