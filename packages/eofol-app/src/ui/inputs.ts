import { numberInput } from "@eofol/eofol-simple/dist";
import { NumberInputProps } from "@eofol/eofol-types";
import {
  validateIsRequired,
  validateIsNumber,
  validateIsInteger,
  validateIsOverMin,
  validateIsUnderMax,
  validateIsStrictlyOverMin,
} from "../util/validation";

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
