import { FiddleStateImpl } from "../types";

const SCALA_MAX_LINES = 1200;

const SCALA_MAX_LINE_LENGTH = 120;

const SCALE_VALIDATION_ERROR_EMPTY = "Please specify a scale.";

const errorInvalidScala = (line: string) =>
  `Scale data is invalid. Please specify a valid scale according to Scala format. Invalid line: "${line}".`;

const errorOverPeriod = (line: string) =>
  `Scale data is invalid. A scale step is above period interval. Invalid line: "${line}".`;

const errorUnderOne = (line: string) =>
  `Scale data is invalid. A scale step is below interval 1/1. Invalid line: "${line}".`;

const errorLineTooLong = (lineNumber: number, lineLength: number) =>
  `Scale data is invalid. A line is too long. Invalid line number: ${lineNumber} (current length: ${lineLength}, maximum: ${SCALA_MAX_LINE_LENGTH}).`;

const errorTooManyLines = (numberOfLines: number) =>
  ` Scale data is invalid. Too many lines (current: ${numberOfLines}, maximum: ${SCALA_MAX_LINES}).`;

const parseNumber = Number.parseFloat;

const isInvalidNumber = (x: number) => !Number.isFinite(x) || Number.isNaN(x);

const parseScalaCent = (line: string, period: number) => {
  const split = line.split(".");
  if (split.length !== 2) {
    return errorInvalidScala(line);
  }
  if (Number.isNaN(Number(split[0]))) {
    return errorInvalidScala(line);
  }
  if (split[1].length > 0 && Number.isNaN(Number(split[1]))) {
    return errorInvalidScala(line);
  }

  const val = parseNumber(line);
  if (isInvalidNumber(val)) {
    return errorInvalidScala(line);
  }
  return Math.pow(period, val / 1200);
};

const parseScalaRational = (line: string) => {
  const split = line.split("/");
  if (split.length !== 2) {
    return errorInvalidScala(line);
  }
  const a = parseInt(split[0]);
  const b = parseNumber(split[1]);
  if (isInvalidNumber(a)) {
    return errorInvalidScala(line);
  }
  if (isInvalidNumber(b)) {
    return errorInvalidScala(line);
  }
  const c = Number(a / b);
  if (isInvalidNumber(c)) {
    return errorInvalidScala(line);
  }
  return c;
};

const parseScalaRatio = (line: string) => {
  const val = Number(line);
  if (isInvalidNumber(val)) {
    return errorInvalidScala(line);
  }
  return val;
};

const parseScalaEdo = (line: string) => {
  const split = line.split("\\");
  const a = parseNumber(split[0]);
  const b = parseNumber(split[1]);
  if (isInvalidNumber(a)) {
    return errorInvalidScala(line);
  }
  if (isInvalidNumber(b)) {
    return errorInvalidScala(line);
  }
  const c = Number(a / b);
  if (isInvalidNumber(c)) {
    return errorInvalidScala(line);
  }
  const val = Math.pow(2, c);
  if (isInvalidNumber(val)) {
    return errorInvalidScala(line);
  }
  return val;
};

export const parseScala =
  (state: FiddleStateImpl) =>
  (line: string): number => {
    const result = parseScalaValidate(state)(line);

    if (typeof result !== "string") {
      return result;
    } else {
      return 1;
    }
  };

export const parseScalaValidate =
  (state: FiddleStateImpl) =>
  (line: string): number | string => {
    let result: number | string;
    if (line.includes(".")) {
      result = parseScalaCent(line, state.tuning.period);
    } else if (line.includes("/")) {
      result = parseScalaRational(line);
    } else if (line.includes(",")) {
      result = parseScalaRatio(line.replace(",", "."));
    } else if (line.includes("\\")) {
      result = parseScalaEdo(line);
    } else {
      result = parseScalaRatio(line);
    }

    // @ts-ignore
    if (typeof result === "number" && result > state.tuning.period) {
      return errorOverPeriod(line);
    }
    if (typeof result === "number" && result < 1) {
      return errorUnderOne(line);
    }

    return result;
  };

export const softValidate = (lines: string[]) => {
  if (lines.length === 0) {
    return SCALE_VALIDATION_ERROR_EMPTY;
  }

  if (lines.length > SCALA_MAX_LINES) {
    return errorTooManyLines(lines.length);
  }

  const maxLineLength = lines.reduce(
    (acc, next, i) => {
      const nextLength = next.length;
      const accLength = acc.val;
      const isNext = nextLength > accLength;
      return isNext ? { val: nextLength, line: i } : acc;
    },
    { val: 0, line: 0 }
  );
  if (maxLineLength.val > SCALA_MAX_LINE_LENGTH) {
    return errorLineTooLong(
      maxLineLength.line,
      lines[maxLineLength.line].length
    );
  }

  return false;
};
