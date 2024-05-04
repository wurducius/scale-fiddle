import { FiddleStateImpl } from "../types";

const parseScalaCent = (line: string, period: number) => {
  const val = Number(line);
  if (!Number.isFinite(val) || Number.isNaN(val)) {
    return false;
  }
  return Math.pow(period, val / 1200);
};

const parseScalaRational = (line: string) => {
  const split = line.split("/");
  if (split.length !== 2) {
    return false;
  }
  const a = Number(split[0]);
  const b = Number(split[1]);
  if (!Number.isFinite(a) || Number.isNaN(a)) {
    return false;
  }
  if (!Number.isFinite(b) || Number.isNaN(b)) {
    return false;
  }
  const c = Number(a / b);
  if (!Number.isFinite(c) || Number.isNaN(c)) {
    return false;
  }
  return c;
};

const parseScalaRatio = (line: string) => {
  const val = Number(line);
  if (!Number.isFinite(val) || Number.isNaN(val)) {
    return false;
  }
  return val;
};

const parseScalaEdo = (line: string) => {
  const split = line.split("\\");
  const a = Number(split[0]);
  const b = Number(split[1]);
  if (!Number.isFinite(a) || Number.isNaN(a)) {
    return false;
  }
  if (!Number.isFinite(b) || Number.isNaN(b)) {
    return false;
  }
  const c = Number(a / b);
  if (!Number.isFinite(c) || Number.isNaN(c)) {
    return false;
  }
  const val = Math.pow(2, c);
  if (!Number.isFinite(val) || Number.isNaN(val)) {
    return false;
  }
  return val;
};

export const parseScala =
  (state: FiddleStateImpl) =>
  (line: string): number => {
    const result = parseScalaValidate(state)(line);

    if (typeof result !== "boolean") {
      return result;
    } else {
      return 1;
    }
  };

export const parseScalaValidate =
  (state: FiddleStateImpl) =>
  (line: string): number | false => {
    let result: number | false;
    if (line.includes(".")) {
      result = parseScalaCent(line, state.tuning.period);
    } else if (line.includes("/")) {
      result = parseScalaRational(line);
    } else if (line.includes(",")) {
      result = parseScalaCent(line.replace(",", "."), state.tuning.period);
    } else if (line.includes("\\")) {
      result = parseScalaEdo(line);
    } else {
      result = parseScalaRatio(line);
    }
    return result;
  };
