import { Timbre } from "../types";
import { WAVEFORM_SERIES_LENGTH } from "./constants";

const array = Array.from({ length: WAVEFORM_SERIES_LENGTH });

const sine = { title: "Sine", id: "sine", real: [0, 1], imag: [0, 0] };

const triangle = {
  title: "Triangle",
  id: "triangle",
  real: array.map((item, n) => (n % 2 === 0 ? 0 : Math.pow(-1, (n - 1) / 2))),
  imag: array.map(() => 0),
};

const sawtooth = {
  title: "Sawtooth",
  id: "sawtooth",
  real: array.map((item, n) => (n === 0 ? 1 : (n % 2 === 0 ? 1 : -1) / n)),
  imag: array.map(() => 0),
};

const square = {
  title: "Square",
  id: "square",
  real: array.map((item, n) => (n % 2 === 0 ? 0 : 1 / n)),
  imag: array.map(() => 0),
};

const full = {
  title: "Full",
  id: "full",
  real: array.map((item, n) => 1),
  imag: array.map(() => 0),
};

const even = {
  title: "Even",
  id: "even",
  real: array.map((item, n) => (n % 2 === 0 ? 1 : 0)),
  imag: array.map(() => 0),
};

const odd = {
  title: "Odd",
  id: "odd",
  real: array.map((item, n) => (n % 2 === 1 ? 1 : 0)),
  imag: array.map(() => 0),
};

const distortedOrgan = {
  title: "Distorted organ",
  id: "distorted-organ",
  real: [0, 0, 1, 1, 1],
  imag: [0, 0, 0, 0, 0],
};

const guitarSimple = {
  title: "Guitar simple",
  id: "guitar-simple",
  real: [
    0, 0.7, 0.3, 0.1, 0.05, 0.1, 0.4, 0.4, 0.3, 0.2, 0.1, 0.2, 0.2, 0.15, 0.1,
    0.2, 0.2, 0.1, 0.1, 0.5,
  ],
  imag: array.map(() => 0),
};

const piano = {
  id: "piano",
  title: "Piano",
  real: [
    0, 0, -0.203569, 0.5, -0.401676, 0.137128, -0.104117, 0.115965, -0.004413,
    0.067884, -0.00888, 0.0793, -0.038756, 0.011882, -0.030883, 0.027608,
    -0.013429, 0.00393, -0.014029, 0.00972, -0.007653, 0.007866, -0.032029,
    0.046127, -0.024155, 0.023095, -0.005522, 0.004511, -0.003593, 0.011248,
    -0.004919, 0.008505,
  ],
  imag: [
    0, 0.147621, 0, 0.000007, -0.00001, 0.000005, -0.000006, 0.000009, 0,
    0.000008, -0.000001, 0.000014, -0.000008, 0.000003, -0.000009, 0.000009,
    -0.000005, 0.000002, -0.000007, 0.000005, -0.000005, 0.000005, -0.000023,
    0.000037, -0.000021, 0.000022, -0.000006, 0.000005, -0.000004, 0.000014,
    -0.000007, 0.000012,
  ],
};

const bass = {
  id: "bass",
  title: "Bass",
  real: [
    0.0, -0.000001, -0.085652, 0.034718, -0.036957, 0.014576, -0.005792,
    0.003677, -0.002998, 0.001556, -0.000486, 0.0015, -0.000809, 0.000955,
    -0.000169, 0.000636, -0.000682, 0.000663, -0.000166, 0.000509, -0.00042,
    0.000194, -0.000025, 0.000267, -0.000299, 0.000226, -0.000038, 0.000163,
    -0.000273, 0.000141, -0.000047, 0.000109,
  ],
  imag: [
    0.0, 0.5, -0.000001, 0.0, -0.000001, 0.000001, -0.0, 0.0, -0.0, 0.0, -0.0,
    0.0, -0.0, 0.0, -0.0, 0.0, -0.0, 0.0, -0.0, 0.0, -0.0, 0.0, -0.0, 0.0, -0.0,
    0.0, -0.0, 0.0, -0.0, 0.0, -0.0, 0.0,
  ],
};

const guitar = {
  id: "guitar",
  title: "Guitar",
  real: [
    0.0, -0.0, -0.179748, 0.252497, -0.212162, 0.069443, -0.067304, 0.006291,
    -0.063344, 0.007604, -0.069661, 0.004429, -0.01903, 0.000601, -0.001895,
    0.000841, -0.009026, 0.001311, -0.024059, 0.002217, -0.019063, 0.002118,
    -0.04849, 0.000659, -0.007014, 0.000529, -0.003632, 0.000157, -0.000265,
    0.000046, -0.000325, 0.000503,
  ],
  imag: [
    0.0, 0.20893, -0.000001, 0.000004, -0.000005, 0.000003, -0.000004, 0.0,
    -0.000006, 0.000001, -0.00001, 0.000001, -0.000004, 0.0, -0.000001, 0.0,
    -0.000003, 0.000001, -0.000012, 0.000001, -0.000011, 0.000001, -0.000035,
    0.000001, -0.000006, 0.0, -0.000004, 0.0, 0.0, 0.0, 0.0, 0.000001,
  ],
};

const basic = [sine, triangle, sawtooth, square];

const basicDerived = [full, even, odd];

const instruments = [distortedOrgan, guitarSimple, piano, bass, guitar];

export const timbrePresets: { group: string; options: Timbre[] }[] = [
  { group: "Basic", options: basic },
  { group: "Derived", options: basicDerived },
  { group: "Instruments", options: instruments },
];

export const timbrePresetsFlat: Timbre[] = timbrePresets
  .map((item) => item.options)
  .flat();
