import { FiddleState } from "../../../types";
import { div, h3, h2, p } from "../../../extract";
import { parseScala } from "../../../sheen";
import { createElement, getTheme, sx } from "@eofol/eofol";
import { p as pImpl, unorderedList } from "@eofol/eofol-simple";

const pSecondary = (title: string) => {
  const theme = getTheme();

  return pImpl({
    children: title,
    styles: sx({
      color: theme.color.secondary,
    }),
  });
};

const propertyLabel = (property: boolean, title: string) => {
  const theme = getTheme();

  return property
    ? [div(sx({ marginTop: theme.spacing.space4 }), pSecondary(title))]
    : [];
};

const intervalMatrix = (data: IntervalVectorData) => {
  const array = Array.from({ length: data.scaleLength });

  const tableStyle = sx({
    border: `1px solid grey`,
    minWidth: "80px",
  });

  return createElement(
    "table",
    [sx({ margin: "0 auto 0 auto", borderCollapse: "collapse" })],
    [
      createElement("tr", undefined, [
        createElement("td", tableStyle, ""),
        ...array.map((tone, i) =>
          createElement("td", tableStyle, pSecondary(data.scaleValues[i]))
        ),
      ]),
      ...array.map((tone, i) =>
        createElement("tr", undefined, [
          createElement("td", tableStyle, pSecondary(data.scaleValues[i])),
          ...array.map((item, j) => {
            let content;
            if (i != j) {
              const matrixItem = data.intervalMatrix.find(
                (matrixItem) =>
                  (matrixItem.i === i && matrixItem.j === j) ||
                  (matrixItem.j === i && matrixItem.i === j)
              );
              content = matrixItem?.interval ?? "error";
            } else {
              content = "0.";
            }
            return createElement("td", tableStyle, p(content));
          }),
        ])
      ),
    ]
  );
};

type IntervalVectorData = {
  intervalVectorLength: number;
  intervalMatrix: { i: number; j: number; interval: string }[];
  intervalTypes: { count: number; interval: string }[];
  scaleLength: number;
  scaleValues: string[];
  isDeepScale: boolean;
  intervalSpectrum: string[][];
  isMyhillsProperty: boolean;
};
const intervalVector = (
  state: FiddleState,
  intervalVectorData: IntervalVectorData
) => {
  return div(undefined, [
    h2("Interval vector"),
    p(`Scale length: ${intervalVectorData.scaleLength}`),
    p(`Total interval count: ${intervalVectorData.intervalMatrix.length}`),
    p(`Distinct interval count: ${intervalVectorData.intervalTypes.length}`),
    h3("Interval types"),
    unorderedList({
      type: "none",
      spacing: 4,
      data: intervalVectorData.intervalTypes,
      render: (interval) => p(`${interval.interval} (${interval.count}x)`),
    }),
    ...propertyLabel(
      intervalVectorData.isDeepScale,
      "Deep scale condition satisfied"
    ),
    h3("Interval spectrum"),
    unorderedList({
      type: "none",
      spacing: 4,
      data: intervalVectorData.intervalSpectrum,
      render: (spectrum, i) => [
        // @ts-ignore
        p(`Form ${i + 1} (size ${spectrum.length}):`),
        ...spectrum.map((s) => p(s)),
      ],
    }),
    ...propertyLabel(
      intervalVectorData.isMyhillsProperty,
      "Myhill's property condition satisfied"
    ),
    h3("Interval matrix"),
    intervalMatrix(intervalVectorData),
    div(sx({ height: "64px" }), ""),
  ]);
};

export const analyzeTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const decimalDigitsCent = state.options.decimalDigitsCent;
  // @ts-ignore
  const scaleLength = state.scaleLength;
  // @ts-ignore
  const scaleValues = state.scaleInput.split("\n");
  // @ts-ignore
  const parser = parseScala(state);
  // @ts-ignore
  const scaleVals = state.scaleInput
    .split("\n")
    .map(parser)
    .map((tone: number) => 1200 * Math.log2(tone));

  const intervalVectorLength = (scaleLength * (scaleLength - 1)) / 2;

  const intervalMatrix = [];
  for (let i = 0; i < scaleLength; i++) {
    for (let j = i + 1; j < scaleLength; j++) {
      const deltaForward = Math.abs(scaleVals[i] - scaleVals[j]);
      const deltaBackward = Math.abs(1200 - deltaForward);
      const deltaMin = Math.min(deltaForward, deltaBackward);
      intervalMatrix.push({
        i,
        j,
        interval: deltaMin.toFixed(decimalDigitsCent),
      });
    }
  }

  const intervalTypes = intervalMatrix
    // @ts-ignore
    .reduce((acc, next) => {
      // @ts-ignore
      const thisIntervalIndex = acc.findIndex(
        // @ts-ignore
        (x) => x.interval === next.interval
      );
      if (thisIntervalIndex != -1) {
        const result = acc;
        // @ts-ignore
        acc[thisIntervalIndex] = {
          // @ts-ignore
          ...acc[thisIntervalIndex],
          // @ts-ignore
          count: acc[thisIntervalIndex].count + 1,
        };
        return result;
      } else {
        // @ts-ignore
        return [...acc, { interval: next.interval, count: 1 }];
      }
    }, []) // @ts-ignore
    .map((tone) => ({ ...tone, interval: Number(tone.interval) }))
    .sort((a: any, b: any) => a.interval - b.interval)
    .map((tone: any) => ({
      ...tone,
      interval: tone.interval.toFixed(decimalDigitsCent),
    }));

  let isDeepScale = true;
  const deepScaleCheck: number[] = [];
  for (let i = 0; i < intervalTypes.length; i++) {
    const count = intervalTypes[i].count;
    if (deepScaleCheck.includes(count)) {
      isDeepScale = false;
      break;
    } else {
      deepScaleCheck.push(count);
    }
  }

  const intervalSpectrum = intervalMatrix.reduce((acc, next) => {
    const index = Math.abs(next.i - next.j);
    if (index > scaleLength / 2) {
      return acc;
    }

    const nextAcc = acc;
    const last = nextAcc[index - 1];
    if (Array.isArray(last)) {
      // @ts-ignore
      if (!last.includes(next.interval)) {
        // @ts-ignore
        last.push(next.interval);

        const sortedLast = last // @ts-ignore
          .map((tone) => Number(tone)) // @ts-ignore
          .sort((a, b) => a - b) // @ts-ignore
          .map((tone) => tone.toFixed(state.options.decimalDigitsCent));
        // @ts-ignore
        nextAcc[index - 1] = sortedLast;
      }
    } else {
      // @ts-ignore
      nextAcc[index - 1] = [next.interval];
    }
    return nextAcc;
  }, []);

  const isMyhillsProperty = intervalSpectrum.reduce(
    // @ts-ignore
    (acc, next) => acc && next.length <= 2,
    true
  );

  const intervalVectorData = {
    scaleLength,
    scaleValues,
    intervalMatrix,
    intervalTypes,
    intervalVectorLength,
    isDeepScale,
    intervalSpectrum,
    isMyhillsProperty,
  };

  return [div(undefined, [intervalVector(state, intervalVectorData)])];
};
