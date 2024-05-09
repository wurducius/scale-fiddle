import {
  div,
  numberInput,
  validateIsInteger,
  validateIsNumber,
  validateIsOverMin,
  validateIsRequired,
  validateIsStrictlyOverMin,
  validateIsUnderMax,
} from "@eofol/eofol-simple";
import { NumberInputProps } from "@eofol/eofol-types";
import { sx } from "@eofol/eofol";

export const integerInput = (props: NumberInputProps) =>
  numberInput({
    // @ts-ignore
    validation: [
      validateIsRequired,
      validateIsNumber,
      validateIsInteger,
      validateIsOverMin(props.min ?? 1),
      props.max && validateIsUnderMax(props.max),
    ].filter(Boolean),
    step: 1,
    ...props,
  });

export const decimalInput = (
  props: NumberInputProps & { minNotIncluded?: boolean }
) =>
  numberInput({
    // @ts-ignore
    validation: [
      validateIsRequired,
      validateIsNumber,
      props.minNotIncluded
        ? validateIsStrictlyOverMin(props.min ?? 0)
        : validateIsOverMin(props.min ?? 0),
      props.max && validateIsUnderMax(props.max),
    ].filter(Boolean),
    hideArrows: true,
    ...props,
  });

export const smallInputField = (inputChild: Element | Element[]) =>
  div(sx({ width: "96px" }), inputChild);

export const largeInputField = (inputChild: Element | Element[]) =>
  div(sx({ width: "256px" }), inputChild);
