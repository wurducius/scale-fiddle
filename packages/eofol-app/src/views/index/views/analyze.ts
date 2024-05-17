import { FiddleState, ScalaUnit } from "../../../types";
import { getIntervalVectorData } from "../../../sheen";
import { createElement, getBreakpoint, getTheme, sx } from "@eofol/eofol";
import { p, unorderedList, div, h1, h2, select } from "@eofol/eofol-simple";
import { largeInputField } from "../../../ui";

const getMatrixIntervalUnitValue =
  (unit: ScalaUnit, baseFreq: number) => (val: number) => {
    let result;
    if (unit === "freq") {
      result = (baseFreq * Math.pow(2, val / 1200)).toFixed(1);
    } else if (unit === "ratio") {
      result = Math.pow(2, val / 1200).toFixed(3);
    } else {
      result = val.toFixed(1);
    }
    const parsedResult = Number(result);
    return Number.isInteger(parsedResult) ? `${parsedResult}.` : result;
  };

const getMatrixIntervalUnitBase = (unit: ScalaUnit, baseFreq: number) => {
  if (unit === "freq") {
    const freqResult = baseFreq.toFixed(1);
    const parsedFreqResult = Number(freqResult);
    return Number.isInteger(parsedFreqResult)
      ? `${parsedFreqResult}.`
      : freqResult;
  }
  if (unit === "ratio") {
    return "1";
  }
  return "0.";
};

const pSecondary = (title: string) => {
  const theme = getTheme();

  return p(
    title,
    sx({
      color: theme.color.secondary.base,
    })
  );
};

const propertyLabel = (property: boolean, title: string) => {
  const theme = getTheme();

  return property
    ? [div(sx({ marginTop: theme.spacing.space2 }), pSecondary(title))]
    : [];
};

const intervalMatrix = (
  intervalMatrixUnit: ScalaUnit,
  baseFreq: number,
  data: IntervalVectorData
) => {
  const array = Array.from({ length: data.scaleLength });

  const tableStyle = sx({
    border: `1px solid grey`,
    width: "80px",
    height: "40px",
  });

  const getUnitValue = getMatrixIntervalUnitValue(
    intervalMatrixUnit,
    Number(baseFreq)
  );
  const unitBase = getMatrixIntervalUnitBase(
    intervalMatrixUnit,
    Number(baseFreq)
  );

  return createElement(
    "table",
    [
      sx({
        margin: "0 auto 0 auto",
        borderCollapse: "collapse",
      }),
    ],
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
              content = matrixItem?.interval
                ? getUnitValue(Number(matrixItem.interval))
                : "error";
            } else {
              content = unitBase;
            }
            return createElement("td", tableStyle, p(content));
          }),
        ])
      ),
    ]
  );
};

const intervalBasicView = (intervalVectorData: IntervalVectorData) => {
  return [
    p(`Scale length: ${intervalVectorData.scaleLength}`),
    p(`Total interval count: ${intervalVectorData.intervalMatrix.length}`),
    p(`Distinct interval count: ${intervalVectorData.intervalTypes.length}`),
    ...propertyLabel(
      intervalVectorData.isPeriodic && !intervalVectorData.isMaximallyPeriodic,
      `Scale is periodic with period length ${intervalVectorData.period} (period is equal to scale length)`
    ),
    ...propertyLabel(
      intervalVectorData.isMaximallyPeriodic,
      "Scale is maximally periodic (period length is 1)"
    ),
  ];
};

const intervalVectorView = (intervalVectorData: IntervalVectorData) => {
  return [
    h2("Interval types"),
    unorderedList({
      type: "none",
      spacing: 4,
      paddingInline: "0",
      data: intervalVectorData.intervalTypes,
      render: (interval) => p(`${interval.interval} (${interval.count}x)`),
    }),
    ...propertyLabel(
      intervalVectorData.isDeepScale,
      "Deep scale condition satisfied (multiplicities of interval types are unique)"
    ),
  ];
};

const intervalSpectrumView = (intervalVectorData: IntervalVectorData) => {
  return [
    h2("Interval spectrum"),
    unorderedList({
      type: "none",
      spacing: 4,
      paddingInline: "0",
      data: intervalVectorData.intervalSpectrum,
      render: (spectrum, i) => [
        // @ts-ignore
        p(`Form ${i + 1} (size ${spectrum.length}):`),
        div(
          sx({ margin: "8px 0 8px 0" }),
          spectrum.map((s) => p(s))
        ),
      ],
    }),
    ...propertyLabel(
      intervalVectorData.isMyhillsProperty,
      "Myhill's property condition satisfied (all spectrum components have size 2 or less)"
    ),
  ];
};

const intervalMatrixView = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void),
  intervalVectorData: IntervalVectorData
) => {
  // @ts-ignore
  const intervalMatrixUnit = state.analyze.intervalMatrixUnits;
  // @ts-ignore
  const baseFreq = state.tuning.baseFreq;

  return div(sx({ marginTop: "32px" }), [
    h2("Interval matrix"),
    largeInputField(
      select({
        options: [
          { id: "cent", title: "Cent" },
          { id: "freq", title: "Frequency" },
          { id: "ratio", title: "Ratio" },
        ],
        name: "select-analyze-interval-matrix-unit",
        value: intervalMatrixUnit,
        onChange: (nextVal) => {
          // @ts-ignore
          setState({
            ...state, // @ts-ignore
            analyze: { ...state.analyze, intervalMatrixUnits: nextVal },
          });
        },
      }),
      sx({ margin: "0 auto 32px auto" })
    ),
    intervalMatrix(intervalMatrixUnit, baseFreq, intervalVectorData),
  ]);
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
  isPeriodic: boolean;
  isMaximallyPeriodic: boolean;
  period: number;
};

const intervalVector = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void),
  intervalVectorData: IntervalVectorData
) => {
  const breakpoint = getBreakpoint();

  return div(
    sx({ display: "flex", flexDirection: "column", justifyContent: "center" }),
    [
      h1("Interval vector"),
      ...intervalBasicView(intervalVectorData),
      div(
        sx({
          flexDirection: !breakpoint.sm ? "row" : "column",
          display: "flex",
          margin: "32px auto 0 auto",
        }),
        [
          div(
            sx({ display: "block", flex: 1 }),
            intervalVectorView(intervalVectorData)
          ),
          div(
            sx({ display: "block", flex: 1 }),
            intervalSpectrumView(intervalVectorData)
          ),
        ]
      ),
      intervalMatrixView(state, setState, intervalVectorData),
      div(sx({ height: "64px" }), ""),
    ]
  );
};

export const analyzeTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const intervalVectorData = getIntervalVectorData(state);

  return [
    div(undefined, [intervalVector(state, setState, intervalVectorData)]),
  ];
};
