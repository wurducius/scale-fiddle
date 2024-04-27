import { FiddleState } from "../types";
import { mod, onlyUnique } from "../util";
import { parseScala } from "./scala";

export const initModify = (state: FiddleState) => {
  // @ts-ignore
  const scale = state.scaleInput;

  // @ts-ignore
  const parser = parseScala(state);

  const parsedScale = scale.split("\n").map(parser);
  return parsedScale.map((tone: number) => 1200 * Math.log2(tone));
};

export const outputScaleCents = (state: FiddleState, result: number[]) => {
  // @ts-ignore
  const decimalDigitsCent = state.options.decimalDigitsCent;

  return result
    .map((tone) => {
      const normalized = mod(tone, 1200);
      return normalized === 0 ? 1200 : normalized;
    })
    .filter(onlyUnique)
    .map((tone: number) => tone.toFixed(decimalDigitsCent))
    .map((tone) => (tone.includes(".") ? tone : tone + "."));
};

export const outputScale = (state: FiddleState, result: number[]) => {
  // @ts-ignore
  const decimalDigitsCent = state.options.decimalDigitsCent;

  return result
    .map((tone) => {
      const normalized = mod(tone, 1200);
      return normalized === 0 ? 1200 : normalized;
    })
    .filter(onlyUnique)
    .sort((a, b) => a - b)
    .map((tone: number) => tone.toFixed(decimalDigitsCent))
    .map((tone) => (tone.includes(".") ? tone : tone + "."))
    .join("\n");
};
