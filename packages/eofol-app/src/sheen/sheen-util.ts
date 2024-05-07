import { FiddleState } from "../types";
import { mod, onlyUnique } from "../util";
import { parseScala } from "./scala";

export const initModify = (state: FiddleState) => {
  // @ts-ignore
  const scale = state.scaleInput;

  // @ts-ignore
  const parser = parseScala(state);

  const parsedScale = splitScale(scale).map(parser);
  return parsedScale.map(ratioToCent);
};

export const outputScaleCents = (state: FiddleState, result: number[]) => {
  // @ts-ignore
  const periodCent = ratioToCent(state.tuning.period);

  return result
    .map((tone) => {
      const normalized = mod(tone, periodCent);
      return normalized === 0 ? periodCent : normalized;
    })
    .filter(onlyUnique)
    .map((tone: number) => toFixedCent(state, tone))
    .map(forceDecimalPoint);
};

export const outputScale = (state: FiddleState, result: number[]) => {
  // @ts-ignore
  const periodCent = ratioToCent(state.tuning.period);

  return joinScale(
    result
      .map((tone) => {
        const normalized = mod(tone, periodCent);
        return normalized === 0 ? periodCent : normalized;
      })
      .filter(onlyUnique)
      .sort(sortNumbers)
      .map((tone: number) => toFixedCent(state, tone))
      .map(forceDecimalPoint)
  );
};

export const ratioToCent = (tone: number) => 1200 * Math.log2(tone);

export const sortNumbers = (a: number, b: number) => a - b;

export const splitScale = (scaleInput: string) => scaleInput.split("\n");

export const joinScale = (scale: string[]) => scale.join("\n");

export const toFixedCent = (
  state: FiddleState,
  val: number // @ts-ignore
) => val.toFixed(state.options.decimalDigitsCent);

export const toFixedFreq = (
  state: FiddleState,
  val: number // @ts-ignore
) => val.toFixed(state.options.decimalDigitsFreq);

export const toFixedRatio = (
  state: FiddleState,
  val: number // @ts-ignore
) => val.toFixed(state.options.decimalDigitsRatio);

export const forceDecimalPoint = (tone: string) =>
  tone.includes(".") ? tone : tone + ".";
