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
import { sy } from "@eofol/eofol";

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
    inputMode: "numeric",
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
    inputMode: "decimal",
    hideArrows: true,
    ...props,
  });

export const decimalPrecisionInput = (
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
    step: 0.0001,
    precision: 4,
    inputMode: "decimal",
    ...props,
  });

const smallInputWidthStyle = sy({ width: "96px" }, "input-small-field-width");

const largeInputWidthStyle = sy({ width: "256px" }, "input-large-field-width");

export const smallInputField = (
  inputChild: Element | Element[],
  styles?: string | undefined
) => div([smallInputWidthStyle, styles], inputChild);

export const largeInputField = (
  inputChild: Element | Element[],
  styles?: string | undefined
) => div([largeInputWidthStyle, styles], inputChild);
