import { FiddleStateImpl } from "./types";

export const parseScala = (state: FiddleStateImpl) => (line: string) => {
  if (line.includes(".")) {
    return Math.pow(state.tuning.period, Number(line) / 1200);
  } else if (line.includes("/")) {
    const split = line.split("/");
    return Number(Number(split[0]) / Number(split[1]));
  } else if (line.includes(",")) {
    return Number(line.replace(",", "."));
  } else if (line.includes("\\")) {
    const split = line.split("\\");
    return Math.pow(2, Number(split[0]) / Number(split[1]));
  }
  return Number(line);
};
