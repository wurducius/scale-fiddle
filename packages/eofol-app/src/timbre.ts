const WAVEFORM_SERIES_LENGTH = 20;

export const timbrePresets = [
  { title: "Sine", id: "sine", value: [0, 1] },
  {
    title: "Triangle",
    id: "triangle",
    value: Array.from({ length: WAVEFORM_SERIES_LENGTH }).map((item, n) =>
      n % 2 === 0 ? 0 : Math.pow(-1, (n - 1) / 2)
    ),
  },
  {
    title: "Sawtooth",
    id: "sawtooth",
    value: Array.from({ length: WAVEFORM_SERIES_LENGTH }).map((item, n) =>
      n === 0 ? 1 : (n % 2 === 0 ? 1 : -1) / n
    ),
  },
  {
    title: "Square",
    id: "square",
    value: Array.from({ length: WAVEFORM_SERIES_LENGTH }).map((item, n) =>
      n % 2 === 0 ? 0 : 1 / n
    ),
  },
  { title: "Distorted organ", id: "distorted-organ", value: [0, 0, 1, 1, 1] },
];
