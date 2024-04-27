import { FiddleState } from "../types";
import { mod } from "../util";
import { parseScala } from "./scala";

export const modifyTranspose = (state: FiddleState, t: number) => {
  // @ts-ignore
  const scale = state.scaleInput;
  // @ts-ignore
  const decimalDigitsCent = state.options.decimalDigitsCent;
  // @ts-ignore
  const parser = parseScala(state);

  const parsedScale = scale.split("\n").map(parser);
  const centsScale = parsedScale.map((tone: number) => 1200 * Math.log2(tone));

  const result: number[] = centsScale.map((tone: number) => {
    const out = mod(tone + Number(t), 1200);
    return out === 0 ? 1200 : out;
  });

  const output = result
    .sort((a, b) => a - b)
    .map((tone: number) => tone.toFixed(decimalDigitsCent))
    .map((tone) => (tone.includes(".") ? tone : tone + "."))
    .join("\n");

  return output;
};
