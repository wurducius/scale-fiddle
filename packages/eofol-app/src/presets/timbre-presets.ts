const WAVEFORM_SERIES_LENGTH = 20;

const array = Array.from({ length: WAVEFORM_SERIES_LENGTH });

const sine = { title: "Sine", id: "sine", value: [0, 1] };

const triangle = {
  title: "Triangle",
  id: "triangle",
  value: array.map((item, n) => (n % 2 === 0 ? 0 : Math.pow(-1, (n - 1) / 2))),
};

const sawtooth = {
  title: "Sawtooth",
  id: "sawtooth",
  value: array.map((item, n) => (n === 0 ? 1 : (n % 2 === 0 ? 1 : -1) / n)),
};

const square = {
  title: "Square",
  id: "square",
  value: array.map((item, n) => (n % 2 === 0 ? 0 : 1 / n)),
};

const full = {
  title: "Full",
  id: "full",
  value: array.map((item, n) => 1),
};

const even = {
  title: "Even",
  id: "even",
  value: array.map((item, n) => (n % 2 === 0 ? 1 : 0)),
};

const odd = {
  title: "Odd",
  id: "odd",
  value: array.map((item, n) => (n % 2 === 1 ? 1 : 0)),
};

const distortedOrgan = {
  title: "Distorted organ",
  id: "distorted-organ",
  value: [0, 0, 1, 1, 1],
};

export const timbrePresets = [
  sine,
  triangle,
  sawtooth,
  square,
  full,
  even,
  odd,
  distortedOrgan,
];
