const valuesArray = (array: string[]) => array.join("\n");

const valuesMap = (length: number, mapper: (n: number) => string) =>
  Array.from({ length })
    .map((item, n) => mapper(n))
    .join("\n");

const majorScale = {
  id: "major-scale",
  title: "Major scale",
  value: valuesArray([
    "200.",
    "400.",
    "500.",
    "700.",
    "900.",
    "1100.",
    "1200.",
  ]),
};

const pentatonic = {
  id: "pentatonic",
  title: "Pentatonic",
  value: valuesArray(["200.", "400.", "700.", "900.", "1200."]),
};

const wholeToneScale = {
  id: "whole-tone-scale",
  title: "Whole-tone scale",
  value: valuesArray(["200.", "400.", "600.", "800.", "1000.", "1200."]),
};

const edo12 = {
  id: "12-edo",
  title: "12edo",
  value: valuesMap(12, (n) => `${100 * (n + 1)}.`),
};

const edo24 = {
  id: "24-edo",
  title: "24edo",
  value: valuesMap(24, (n) => `${50 * (n + 1)}.`),
};

export const scalePresets = [
  majorScale,
  pentatonic,
  wholeToneScale,
  edo12,
  edo24,
];
