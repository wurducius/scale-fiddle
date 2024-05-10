import { forceDecimalPoint, joinScale } from "../sheen";
import { SCALE_PRESET_PRECISION_DIGITS_CENT } from "./constants";

const valuesArray = (array: string[]) => joinScale(array);

const valuesMap = (length: number, mapper: (n: number) => string | number) =>
  joinScale(
    Array.from({ length })
      .map((item, n) => mapper(n).toString())
      .map(forceDecimalPoint)
  );

const map = (length: number, mapper: (n: number) => string | number) =>
  Array.from({ length })
    .map((item, n) => mapper(n).toString())
    .map(forceDecimalPoint);

const pickRelative = (values: string[], rel: number[]) => {
  let i = 0;
  const result = [];
  for (let k = 0; k < rel.length; k++) {
    result.push(values[i]);
    i = i + rel[k];
  }
  return valuesArray(result);
};

const ed2 = (n: number) => map(n, (k) => truncate(((k + 1) * 1200) / n));

const truncate = (n: number) => {
  const parsedVal = n.toFixed(SCALE_PRESET_PRECISION_DIGITS_CENT);
  return parsedVal.includes(".") ? parsedVal : `${parsedVal}.`;
};

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
  value: valuesMap(12, (n) => `${truncate(100 * (n + 1))}`),
};

const edo24 = {
  id: "24-edo",
  title: "24edo",
  value: valuesMap(24, (n) => `${truncate(50 * (n + 1))}`),
};

const pelog4tone = {
  id: "pelog4tone",
  title: "4-tone Pelog Scale, Gamelan Bebonangan, Sayan village, Indonesia",
  value: valuesArray(["197.", "570.", "670.", "1200."]),
};

const pythagorean3tonepentatonic = {
  id: "pythagorean3tonepentatonic",
  title: "3-limit Pythagorean Pentatonic Scale",
  value: valuesArray(["9 / 8", "81 / 64", "3 / 2", "27 / 16", "2 / 1"]),
};

const pythagorean3limitdiatonic = {
  id: "pythagorean3limitdiatonic",
  title: "3-limit Pythagorean Diatonic Scale (Ancient Greece)",
  value: valuesArray([
    "9 / 8",
    "81 / 64",
    "4 / 3",
    "3 / 2",
    "27 / 16",
    "243 / 128",
    "2 / 1",
  ]),
};

const pentatonic5limit = {
  id: "pentatonic5limit",
  title: "5-limit Pentatonic Scale",
  value: valuesArray(["9 / 8", "5 / 4", "3 / 2", "5 / 3", "2 / 1"]),
};

const ptolemys5limitintensediatonic = {
  id: "ptolemys5limitintensediatonic",
  title: "5-limit Ptolemy's Intense Diatonic Scale (Ancient Greece, India)",
  value: valuesArray([
    "9 / 8",
    "5 / 4",
    "4 / 3",
    "3 / 2",
    "5 / 3",
    "15 / 8",
    "2 / 1",
  ]),
};

const olympos5limitpentatonic = {
  id: "olympos5limitpentatonic",
  title: "5-limit Olympos Pentatonic (Ancient Greece)",
  value: valuesArray(["16 / 15", "4 / 3", "64 / 45", "16 / 9", "2 / 1"]),
};

const archytas5limitenharmonicgenus = {
  id: "archytas5limitenharmonicgenus",
  title: "7-limit Archytas Enharmonic Genus (Ancient Greece)",
  value: valuesArray([
    "28 / 27",
    "16 / 15",
    "4 / 3",
    "3 / 2",
    "14 / 9",
    "8 / 5",
    "2 / 1",
  ]),
};

const archytas7limitchromaticgenus = {
  id: "archytas7limitchromaticgenus",
  title: "7-limit Archytas Chromatic Genus (Ancient Greece)",
  value: valuesArray([
    "28 / 27",
    "9 / 8",
    "4 / 3",
    "3 / 2",
    "14 / 9",
    "27 / 16",
    "2 / 1",
  ]),
};

const archytas7limitdiatonicgenus = {
  id: "archytas7limitdiatonicgenus",
  title: "7-limit Archytas Diatonic Genus (Ancient Greece)",
  value: valuesArray([
    "28 / 27",
    "32 / 27",
    "4 / 3",
    "3 / 2",
    "14 / 9",
    "16 / 9",
    "2 / 1",
  ]),
};

const wagogo7limitpentatonic = {
  id: "wagogo7limitpentatonic",
  title: "7-limit Wagogo Pentatonic (Tanzania)",
  value: valuesArray(["9 / 8", "5 / 4", "3 / 2", "7 / 4", "2 / 1"]),
};

const centaur7limit12tone = {
  id: "centaur7limit12tone",
  title: "7-limit 12-tone Scale Centaur by Kraig Grady",
  value: valuesArray([
    "21 / 20",
    "9 / 8",
    "7 / 6",
    "5 / 4",
    "4 / 3",
    "7 / 5",
    "3 / 2",
    "14 / 9",
    "5 / 3",
    "7 / 4",
    "15 / 8",
    "2 / 1",
  ]),
};

const centaura7limit12toneoriginal = {
  id: "centaura7limit12toneoriginal",
  title:
    "7-limit 12-tone Scale Centaura (original subharmonic version) by Kraig Grady",
  value: valuesArray([
    "15 / 14",
    "10 / 9",
    "40 / 33",
    "5 / 4",
    "4 / 3",
    "10 / 7",
    "3 / 2",
    "45 / 28",
    "5 / 3",
    "20 / 11",
    "15 / 8",
    "2 / 1",
  ]),
};

const centaura7limit12toneharmonic = {
  id: "centaura7limit12toneharmonic",
  title: "7-limit 12-tone Scale Centaura (harmonic version) by Kraig Grady",
  value: valuesArray([
    "33 / 32",
    "9 / 8",
    "7 / 6",
    "5 / 4",
    "4 / 3",
    "11 / 8",
    "3 / 2",
    "14 / 9",
    "5 / 3",
    "7 / 4",
    "15 / 8",
    "2 / 1",
  ]),
};

const beekeeper7limit16tone = {
  id: "beekeeper7limit16tone",
  title: "7-limit 16-tone Scale Beekeeper by Joakim Bang Larsen (RIP)",
  value: valuesArray([
    "135 / 128",
    "35 / 32",
    "9 / 8",
    "315 / 256",
    "5 / 4",
    "21 / 16",
    "45 / 32",
    "189 / 128",
    "3 / 2",
    "105 / 64",
    "27 / 16",
    "7 / 4",
    "945 / 512",
    "15 / 8",
    "63 / 32",
    "2 / 1",
  ]),
};

const hangaslathi7limit19tone = {
  id: "hangaslathi7limit19tone",
  title: "7-limit 19-tone Scale by Olli Hangaslahti",
  value: valuesArray([
    "28 / 27",
    "16 / 15",
    "10 / 9",
    "125 / 108",
    "6 / 5",
    "5 / 4",
    "9 / 7",
    "4 / 3",
    "25 / 18",
    "36 / 25",
    "3 / 2",
    "14 / 9",
    "8 / 5",
    "5 / 3",
    "216 / 125",
    "9 / 5",
    "15 / 8",
    "27 / 14",
    "2 / 1",
  ]),
};

const venkatarama11limit15tone = {
  id: "venkatarama11limit15tone",
  title: "11-limit 15-tone Scale by Praveen Venkatarama",
  value: valuesArray([
    "33 / 32",
    "21 / 20",
    "9 / 8",
    "7 / 6",
    "5 / 4",
    "4 / 3",
    "11 / 8",
    "7 / 5",
    "3 / 2",
    "14 / 9",
    "5 / 3",
    "55 / 32",
    "7 / 4",
    "15 / 8",
    "2 / 1",
  ]),
};

const partch11limit43tone = {
  id: "partch11limit43tone",
  title: "11-limit 43-tone Scale by Harry Partch",
  value: valuesArray([
    "81 / 80",
    "33 / 32",
    "21 / 20",
    "16 / 15",
    "12 / 11",
    "11 / 10",
    "10 / 9",
    "9 / 8",
    "8 / 7",
    "7 / 6",
    "32 / 27",
    "6 / 5",
    "11 / 9",
    "5 / 4",
    "14 / 11",
    "9 / 7",
    "21 / 16",
    "4 / 3",
    "27 / 20",
    "11 / 8",
    "7 / 5",
    "10 / 7",
    "16 / 11",
    "40 / 27",
    "3 / 2",
    "32 / 21",
    "14 / 9",
    "11 / 7",
    "8 / 5",
    "18 / 11",
    "5 / 3",
    "27 / 16",
    "12 / 7",
    "7 / 4",
    "16 / 9",
    "9 / 5",
    "20 / 11",
    "11 / 6",
    "15 / 8",
    "40 / 21",
    "64 / 33",
    "160 / 81",
    "2 / 1",
  ]),
};

const europeanfolk13limit8tone = {
  id: "europeanfolk13limit8tone",
  title: "13-limit 8-tone European Folk Music Scale",
  value: valuesArray([
    "9 / 8",
    "5 / 4",
    "11 / 8",
    "3 / 2",
    "13 / 8",
    "7 / 4",
    "15 / 8",
    "2 / 1",
  ]),
};

const ibina7scale13limit7tone = {
  id: "ibina7scale13limit7tone",
  title: "13-limit 7-tone Scale Ibina7 by Jacques Dudon",
  value: valuesArray([
    "13 / 12",
    "11 / 9",
    "4 / 3",
    "3 / 2",
    "13 / 8",
    "16 / 9",
    "2 / 1",
  ]),
};

const ibina7scale13limit12toneextension = {
  id: "ibina7scale13limit12toneextension",
  title: "13-limit 12-tone Extension of Ibina7 by Jacques Dudon",
  value: valuesArray([
    "13 / 12",
    "9 / 8",
    "32 / 27",
    "11 / 9",
    "4 / 3",
    "13 / 9",
    "3 / 2",
    "13 / 8",
    "27 / 16",
    "16 / 9",
    "11 / 6",
    "2 / 1",
  ]),
};

const met24ji1scale13limit24tone = {
  id: "met24ji1scale13limit24tone",
  title: "13-limit 24-tone Scale Met24JI1 by Margo Schulter",
  value: valuesArray([
    "91 / 88",
    "14 / 13",
    "10 / 9",
    "9 / 8",
    "7 / 6",
    "13 / 11",
    "11 / 9",
    "14 / 11",
    "21 / 16",
    "4 / 3",
    "11 / 8",
    "63 / 44",
    "189 / 128",
    "3 / 2",
    "14 / 9",
    "21 / 13",
    "5 / 3",
    "22 / 13",
    "7 / 4",
    "39 / 22",
    "11 / 6",
    "21 / 11",
    "63 / 32",
    "2 / 1",
  ]),
};

const gamelanslendroequalpentatonic = {
  id: "gamelanslendroequalpentatonic",
  title: "5ed2, Equal Pentatonic, Gamelan Slendro (Indonesia)",
  value: valuesArray(ed2(5)),
};

const equalhexatonicwholetone = {
  id: "equalhexatonicwholetone",
  title: "6ed2, Equal Hexatonic, Whole-tone Scale",
  value: valuesArray(ed2(6)),
};

const equalheptatonic = {
  id: "equalheptatonic",
  title: "7ed2, Equal Heptatonic (Thailand, Georgia)",
  value: valuesArray(ed2(7)),
};

const equalnonatonic = {
  id: "equalnonatonic",
  title:
    "9ed2, Equal Nonatonic, Theoretical Nine-tone Gamelan Pelog (Indonesia)",
  value: valuesArray(ed2(9)),
};

const gamelanpelog5tone = {
  id: "gamelanpelog5tone",
  title: "5-9ed2 (11 3 1 3), Five-tone Gamelan Pelog (Indonesia)",
  value: pickRelative(ed2(9), [1, 1, 3, 1, 3]),
};

const gamelanpelog7tone = {
  id: "gamelanpelog7tone",
  title: "7-9ed2 (11 21 1 12), Seven-tone Gamelan Pelog (Indonesia)",
  value: pickRelative(ed2(9), [1, 1, 2, 1, 1, 1, 2]),
};

const equaldecatonic = {
  id: "equaldecatonic",
  title: "10ed2, Equal Decatonic",
  value: valuesArray(ed2(10)),
};

const chromaticscale = {
  id: "chromaticscale",
  title: "12ed2, Chromatic Scale (Standard Western)",
  value: valuesArray(ed2(12)),
};

const perfectfourth = {
  id: "perfectfourth",
  title: "2-12ed2 (5), Perfect Fourth",
  value: pickRelative(ed2(12), [5]),
};

const perfectfifth = {
  id: "perfectfifth",
  title: "2-12ed2 (7), Perfect Fifth",
  value: pickRelative(ed2(12), [7]),
}; //1

const tritone = {
  id: "tritone",
  title: "2-12ed2 (6), Tritone",
  value: pickRelative(ed2(12), [6]),
};

const majorchord = {
  id: "majorchord",
  title: "3-12ed2 (43), Major Triad, Major Chord",
  value: pickRelative(ed2(12), [4, 3]),
};

const minorchord = {
  id: "minorchord",
  title: "3-12ed2 (34), Minor Triad, Minor Chord",
  value: pickRelative(ed2(12), [3, 4]),
};

const augmentedchord = {
  id: "augmentedchord",
  title: "3-12ed2 (44), Augmented Triad, Augmented Chord",
  value: pickRelative(ed2(12), [4, 4]),
};

// See, divisions of the tetrachord, pages 18-19, 21-22, 41, 49, 53, 56-59, 68, 74-83, 95-96
const lydiantetrachord = {
  id: "lydiantetrachord",
  title: "4-12ed2 (221), Lydian Tetrachord, Major Tetrachord",
  value: pickRelative(ed2(12), [2, 2, 1]),
};

const doriantetrachord = {
  id: "doriantetrachord",
  title: "4-12ed2 (212), Dorian Tetrachord, Minor Tetrachord",
  value: pickRelative(ed2(12), [2, 1, 2]),
}; //3

const phrygiantetrachord = {
  id: "phrygiantetrachord",
  title:
    "4-12ed2 (122), Phrygian Tetrachord, Upper Minor Tetrachord, Diatonic Tetrachord",
  value: pickRelative(ed2(12), [1, 2, 2]),
}; //3

const chromatictetrachord = {
  id: "chromatictetrachord",
  title: "4-12ed2 (113), Chromatic Tetrachord",
  value: pickRelative(ed2(12), [1, 1, 3]),
}; //4

const harmonictetrachord = {
  id: "harmonictetrachord",
  title: "4-12ed2 (131), Harmonic Tetrachord",
  value: pickRelative(ed2(12), [1, 3, 1]),
}; //4

const chromatictetrachord2 = {
  id: "chromatictetrachord2",
  title: "4-12ed2 (311), Chromatic Tetrachord 2",
  value: pickRelative(ed2(12), [3, 1, 1]),
}; //4

const diminishedseventhchord = {
  id: "diminishedseventhchord",
  title: "4-12ed2 (333), Diminished Seventh Chord",
  value: pickRelative(ed2(12), [3, 3, 3]),
};

const majorpentachord = {
  id: "majorpentachord",
  title:
    "5-12ed2 (221 2), Major Pentachord, Ionian Pentachord, Mixolydian Pentachord",
  value: pickRelative(ed2(12), [2, 2, 1, 2]),
}; //5

const minorpentachord = {
  id: "minorpentachord",
  title:
    "5-12ed2 (212 2), Minor Pentachord, Dorian Pentachord, Aeolian Pentachord",
  value: pickRelative(ed2(12), [2, 1, 2, 2]),
}; //5

const majorpentatonic = {
  id: "majorpentatonic",
  title: "5-12ed2 (2 23 23), Major Pentatonic",
  value: pickRelative(ed2(12), [2, 2, 3, 2, 3]),
}; //6

const minorpentatonic = {
  id: "minorpentatonic",
  title: "5-12ed2 (32 2 32), Minor Pentatonic",
  value: pickRelative(ed2(12), [3, 2, 2, 3, 2]),
}; //6

const bluesscale = {
  id: "bluesscale",
  title: "6-12ed2 (32 11 32), 'Blues Scale'",
  value: pickRelative(ed2(12), [3, 2, 1, 1, 3, 2]),
};

const wholetonescalex = {
  id: "wholetonescalex",
  title: "6-12ed2 (222222), Whole-tone Scale",
  value: valuesArray(ed2(6)),
};

const majorionian = {
  id: "majorionian",
  title: "7-12ed2 (221 2 221), Major, Ionian",
  value: pickRelative(ed2(12), [2, 2, 1, 2, 2, 2, 1]),
}; //7

const melodicminordescending = {
  id: "melodicminordescending",
  title:
    "7-12ed2 (212 2 122), Melodic Minor Descending, Natural Minor, Aeolian",
  value: pickRelative(ed2(12), [2, 1, 2, 2, 1, 2, 2]),
}; //7

const phrygianmaqamkurd = {
  id: "phrygianmaqamkurd",
  title: "7-12ed2 (122 2 122), Maqam Kurd, Phrygian",
  value: pickRelative(ed2(12), [1, 2, 2, 2, 1, 2, 2]),
}; //7

const melodicminorascending = {
  id: "melodicminorascending",
  title:
    "7-12ed2 (212 2 221), Melodic Minor Ascending, 'Jazz Minor', 'Hawaiian'",
  value: pickRelative(ed2(12), [2, 1, 2, 2, 2, 2, 1]),
}; //8

const majorminor = {
  id: "majorminor",
  title: "7-12ed2 (221 2 122), Major-Minor",
  value: pickRelative(ed2(12), [2, 2, 1, 2, 1, 2, 2]),
}; //8

/*
{
  title: "7-12ed2 (2 221 212), Acoustic Scale",
  value: pickRel(centEd2(12), [2, 2, 2, 1, 2, 1, 2]),
}, //8
{
  title:
    "7-12ed2 (1 2 122 22), Altered Dominant, Diminished Whole-tone, Superlocrian",
  value: pickRel(centEd2(12), [1, 2, 1, 2, 2, 2, 2]),
}, //8

{
  title: "7-12ed2 (122 2 221), Neapolitan Major, Lydian Major",
  value: pickRel(centEd2(12), [1, 2, 2, 2, 2, 2, 1]),
},

{
  title:
    "7-12ed2 (122 2 131), Neapolitan Minor, Maqam Shahnaz Kurdi, 'Hungarian Romani'",
  value: pickRel(centEd2(12), [1, 2, 2, 2, 1, 3, 1]),
},

{
  title: "7-12ed2 (221 2 131), Harmonic Major, 'Ethiopian'",
  value: pickRel(centEd2(12), [2, 2, 1, 2, 1, 3, 1]),
},

{
  title: "7-12ed2 (212 2 131), Harmonic Minor, Maqam Bayat-e-Esfahan",
  value: pickRel(centEd2(12), [2, 1, 2, 2, 1, 3, 1]),
},

{
  title: "7-12ed2 (1 311 2 31), Raga Lalita, 'Persian'",
  value: pickRel(centEd2(12), [1, 3, 1, 1, 2, 3, 1]),
},

{
  title: "7-12ed2 (131 2 131), Double Harmonic Major, Maqam Hijazkar",
  value: pickRel(centEd2(12), [1, 3, 1, 2, 1, 3, 1]), //9
},
{
  title:
    "7-12ed2 (2 131 131), Double Harmonic Minor, 'Hungarian Minor', 'Egyptian Heptatonic', 'Flamenco Mode'",
  value: pickRel(centEd2(12), [2, 1, 3, 1, 1, 3, 1]), //9
},
{
  title: "7-12ed2 (212 1 213), Moravian Píšťalková",
  value: pickRel(centEd2(12), [2, 1, 2, 1, 2, 1, 3]),
},
{
  title: "7-12ed2 (312 1 212), 'Hungarian Major'",
  value: pickRel(centEd2(12), [3, 1, 2, 1, 2, 1, 2]),
},

{
  title:
    "8-12ed2 (221 221 11), Maqam Shawq Awir, 'Chinese Eight-Tone', 'Dominant Bebop', ",
  value: pickRel(centEd2(12), [2, 2, 1, 2, 2, 1, 1, 1]),
},
{
  title: "8-12ed2 (21 21 21 21), Diminished, 'Arabian A'",
  value: pickRel(centEd2(12), [2, 1, 2, 1, 2, 1, 2, 1]), //10
},
{
  title: "8-12ed2 (12 12 12 12), Dominant Diminished, 'Diminished Blues'",
  value: pickRel(centEd2(12), [1, 2, 1, 2, 1, 2, 1, 2]), //10
},

{ title: "19ed2, Approximate 1/3-comma Meantone", value: centEd2(19) },
{ title: "22ed2", value: centEd2(22) },
{
  title: "24ed2, Quarter-tone Scale (Standard Arabic/Persian)",
  value: centEd2(24),
},
{
  title: "3-24ed2 (77), Neutral Triad, Neutral Chord",
  value: pickRel(centEd2(24), [7, 7]),
},
{
  title: "4-24ed2 (118), Enharmonic Tetrachord",
  value: pickRel(centEd2(24), [1, 1, 8]),
},
{
  title: "7-24ed2 (433 4 433), Maqam Rast",
  value: pickRel(centEd2(24), [4, 3, 3, 4, 4, 3, 3]),
}, //1200, 1300, 1500] },
{
  title: "7-24ed2 (4 433 325), Acoustic Scale",
  value: pickRel(centEd2(24), [4, 4, 3, 3, 3, 2, 5]),
},

{ title: "31ed2, Approximate 1/4-comma Meantone", value: centEd2(31) },
{ title: "34ed2", value: centEd2(34) },
{ title: "41ed2", value: centEd2(41) },
{ title: "46ed2", value: centEd2(46) },
{ title: "50ed2, Approximate 2/7-comma Meantone", value: centEd2(50) },
{
  title: "53ed2, Approximate Pythagorean (Standard Turkish)",
  value: centEd2(53),
},
{
  title:
    "7-53ed2 (4 14 4   9   4 14 4), Double Harmonic Major, Maqam Hijazkar",
  value: pickRel(centEd2(53), [4, 14, 4, 9, 4, 14, 4]),
},
{
  title: "12-53ed2 (54535 45 53635), Eagle 53, Marveldene, Checkmate",
  value: pickRel(centEd2(53), [5, 4, 5, 3, 5, 4, 5, 5, 3, 6, 3, 5]),
},
{
  title: "12-53ed2 (45454 54 45454), Approximate 12-tone Pythagorean",
  value: pickRel(centEd2(53), [4, 5, 4, 5, 4, 5, 4, 4, 5, 4, 5, 4]),
},
{
  title:
    "22-53ed2 (41 31 41 31 41 31 4 41 31 41 31 4), Indian 22-Śruti Scale",
  value: pickRel(
    centEd2(53),
    [4, 1, 3, 1, 4, 1, 3, 1, 4, 1, 3, 1, 4, 4, 1, 3, 1, 4, 1, 3, 1, 4]
  ),
},

{ title: "55ed2, Approximate 1/6-comma Meantone", value: centEd2(55) },
{ title: "72ed2", value: centEd2(72) },
{ title: "96ed2", value: centEd2(96) },
{ title: "13ed3, Bohlen-Pierce", value: centEd(13, 3) },
{
  title: "7-limit Bohlen-Pierce",
  value: pitchArray2centArray([
    1,
    27 / 25,
    25 / 21,
    9 / 7,
    7 / 5,
    75 / 49,
    5 / 3,
    9 / 5,
    49 / 25,
    15 / 7,
    7 / 3,
    63 / 25,
    25 / 9,
    3 / 1,
  ]),
},
//{ label: "34.188ed2, Carlos Gamma", value: centEd(34.188, 2), }, //Doesn't work!!!
{
  title: "15ed1169.48c, Carlos Alpha",
  value: centEd(15, 2 ** (1169.48 / 1200)),
},
{
  title: "19ed1211.5c, Carlos Beta",
  value: centEd(19, 2 ** (1211.5 / 1200)),
},
{
  title: "34ed1193.35c, Carlos Gamma",
  value: centEd(34, 2 ** (1193.35 / 1200)),
}, // 1.9923328581429061327259883692604
//{ label: "30ed3, Approximate 1/3-comma Meantone", value: centEd(30, 3), },
{ title: "49ed3, Approximate 1/4-comma Meantone", value: centEd(49, 3) },
//{ label: "79ed3, Approximate 2/7-comma Meantone", value: centEd(79, 3), },
//{ label: "87ed3, Approximate 1/6-comma Meantone", value: centEd(87, 3), },
{
  title: "Yarman36a",
  value: [
    0, 48.96259, 80.00646, 97.641, 153.15171, 182.37782, 198.747, 250.5906,
    281.92285, 303.638, 352.33605, 381.64137, 396.078, 452.58771, 483.95429,
    501.356, 550.22657, 579.63309, 594.119, 654.22784, 683.40325, 699.744,
    748.76828, 779.85037, 801.683, 853.08301, 882.34301, 896.757, 950.63271,
    981.99929, 1001.88, 1050.68187, 1080.04783, 1094.514, 1154.54271,
    1185.90929,
  ],
},
{
  title: "12-Yarman36a",
  value: [
    0, 97.64058, 198.74659, 303.63775, 396.0776, 501.35622, 594.11855,
    699.74399, 801.68275, 896.7572, 1001.88049, 1094.51356,
  ],
},
{
  title: "Yarman 12-159ed2",
  value: [
    0, 90.56604, 196.22642, 301.88679, 392.45283, 498.113208, 588.67925,
    701.886792, 792.45283, 898.11321, 1003.77358, 1094.33962,
  ],
},
{
  title: "Secor Proportionally Beating 12-tone Well-temperament",
  value: [
    0, 86.5333, 194.5568, 294.12876, 389.11361, 499.91792, 585.54105,
    697.2784, 789.37483, 891.83521, 997.96292, 1086.39201,
  ],
},
];

export const presetScalesOld = [
//{ label: "Equal Monotonic, 1ed2", value: centEd2(1) },
//{ label: "Equal Ditonic, 2ed2", value: centEd2(2) },
//{ label: "Equal Tritonic, 3ed2", value: centEd2(3) },
//{ label: "Equal Tetratonic, 4ed2", value: centEd2(4) }, //math.range(0, 4, 1) },
{ label: "5ed2, Equal Pentatonic, Gamelan Slendro", value: centEd2(5) },
{ label: "6ed2, Equal Hexatonic, Whole-tone Scale", value: centEd2(6) },
{ label: "7ed2, Equal Heptatonic, Thai, Georgian", value: centEd2(7) },
{
  label: "9ed2, Equal Nonatonic, Theoretical Nine-tone Gamelan Pelog",
  value: centEd2(9),
},
{
  label: "   5-9ed2 (11 3 1 3), Five-tone Gamelan Pelog", //"●○•‒»
  value: [0, 133.33, 266.67, 666.67, 800],
},
{
  label: "   7-9ed2 (11 21 1 12),  Seven-tone Gamelan Pelog",
  value: [0, 133.33, 266.67, 533.33, 666.67, 800, 933.33],
},
{ label: "10ed2, Equal Decatonic", value: centEd2(10) },
{ label: "12ed2, Chromatic Scale, Standard Western", value: centEd2(12) },

{ label: "   3-12ed2 (34), Minor Chord", value: [0, 300, 700] }, // 34
{ label: "   3-12ed2 (43), Major Chord", value: [0, 400, 700] }, // 43
{
  label: "   4-12ed2 (122), Upper Minor Tetrachord, Diatonic Tetrachord",
  value: [0, 100, 300, 500], // 122
},
{
  label: "   4-12ed2 (212), Minor Tetrachord",
  value: [0, 200, 300, 500],
}, // 212
{
  label: "   4-12ed2 (221), Major Tetrachord",
  value: [0, 200, 400, 500],
}, // 221

{
  label: "   4-12ed2 (113), Chromatic Tetrachord",
  value: [0, 100, 200, 500],
}, // 113
{
  label: "   4-12ed2 (131), Harmonic Tetrachord",
  value: [0, 100, 400, 500],
}, // 131
{
  label: "   4-12ed2 (311), Chromatic Tetrachord 2",
  value: [0, 300, 400, 500],
}, // 311

{
  label:
    "   5-12ed2 (212 2), Minor Pentachord, Dorian Pentachord, Aeolian Pentachord",
  value: [0, 200, 300, 500, 700],
},
{
  label:
    "   5-12ed2 (221 2), Major Pentachord, Ionian Pentachord, Mixolydian Pentachord",
  value: [0, 200, 400, 500, 700],
},

{
  label: "   5-12ed2 (32 2 32), Minor Pentatonic",
  value: [0, 300, 500, 700, 1000],
},
{
  label: "   5-12ed2 (2 23 23), Major Pentatonic",
  value: [0, 200, 400, 700, 900],
},

{ label: "   6-12ed2 (222222), Whole-tone Scale", value: centEd2(6) },
{
  label: "   6-12ed2 (32 11 32), 'Blues Scale'",
  value: [0, 300, 500, 600, 700, 1000],
},

{
  label: "   7-12ed2 (221 2 221), Major, Ionian",
  value: [0, 200, 400, 500, 700, 900, 1100],
},
{
  label: "   7-12ed2 (221 2 131), Harmonic Major, 'Ethiopian'",
  value: [0, 200, 400, 500, 700, 800, 1100],
},
{
  label: "   7-12ed2 (221 2 122), Major-Minor",
  value: [0, 200, 400, 500, 700, 800, 1000],
},
{
  label: "   7-12ed2 (122 2 221), Neapolitan Major, Lydian Major",
  value: [0, 100, 300, 500, 700, 900, 1100],
},
{
  label: "   7-12ed2 (312 1 212), 'Hungarian Major'",
  value: [0, 300, 400, 600, 700, 900, 1000],
},
{
  label: "   7-12ed2 (212 1 213), Moravian Píšťalková",
  value: [0, 200, 300, 500, 600, 800, 900],
},
{
  label:
    "   7-12ed2 (212 2 122), Melodic Minor Descending, Natural Minor, Aeolian",
  value: [0, 200, 300, 500, 700, 800, 1000],
},
{
  label:
    "   7-12ed2 (212 2 221), Melodic Minor Ascending, 'Jazz Minor', 'Hawaiian'",
  value: [0, 200, 300, 500, 700, 900, 1100],
},
{
  label: "   7-12ed2 (2 221 212), Acoustic",
  value: [0, 200, 400, 600, 700, 900, 1000],
},
{
  label: "   7-12ed2 (212 2 131), Harmonic Minor, Maqam Bayat-e-Esfahan",
  value: [0, 200, 300, 500, 700, 800, 1100],
},
{
  label:
    "   7-12ed2 (122 2 131), Neapolitan Minor, Maqam Shahnaz Kurdi, 'Hungarian Romani'",
  value: [0, 100, 300, 500, 700, 800, 1100],
},
{
  label:
    "   7-12ed2 (2 131 131), Double Harmonic Minor, 'Hungarian Minor', 'Egyptian Heptatonic', 'Flamenco Mode'",
  value: [0, 200, 300, 600, 700, 800, 1100],
},
{
  label: "   7-12ed2 (1 311 2 31), Raga Lalita, 'Persian'",
  value: [0, 100, 400, 500, 600, 800, 1100],
},
{
  label:
    "   7-12ed2 (1 212 222), Altered Dominant, Diminished Whole-tone, Superlocrian",
  value: [0, 100, 300, 400, 600, 800, 1000],
},
{
  label: "   7-12ed2 (131 2 131), Maqam Hijazkar, Double Harmonic",
  value: [0, 100, 400, 500, 700, 800, 1100],
},
{
  label: "   7-12ed2 (122 2 122), Maqam Kurd, Phrygian",
  value: [0, 100, 300, 500, 700, 800, 1000],
},

{
  label:
    "   8-12ed2 (221 221 11), Maqam Shawq Awir, 'Chinese Eight-Tone', 'Dominant Bebop', ",
  value: [0, 200, 400, 500, 700, 900, 1000, 1100],
},
{
  label: "   8-12ed2 (21 21 21 21), Diminished, 'Arabian A'",
  value: [0, 200, 300, 500, 600, 800, 900, 1100],
},
{
  label:
    "   8-12ed2 (12 12 12 12), Dominant Diminished, 'Diminished Blues'",
  value: [0, 100, 300, 400, 600, 700, 900, 1000],
},

{ label: "19ed2, Approximate 1/3-comma Meantone", value: centEd2(19) },
{ label: "22ed2", value: centEd2(22) },
{
  label: "24ed2, Quarter-tone Scale, Standard Arabic/Persian",
  value: centEd2(24),
},
{ label: "   3-24ed2 (77), Neutral Chord", value: [0, 350, 700] },
{
  label: "   4-24ed2 (11 8), Enharmonic Tetrachord",
  value: [0, 50, 100, 500],
},
{
  label: "   7-24ed2 (433 4 433), Maqam Rast",
  value: [0, 200, 350, 500, 700, 900, 1050],
}, //1200, 1300, 1500] },
{
  label: "   7-24ed2 (4 433 325), Acoustic Scale",
  value: [0, 200, 400, 550, 700, 850, 950],
},

{ label: "31ed2, Approximate 1/4-comma Meantone", value: centEd2(31) },
{ label: "34ed2", value: centEd2(34) },
{ label: "41ed2", value: centEd2(41) },
{ label: "46ed2", value: centEd2(46) },
{ label: "50ed2, Approximate 2/7-comma Meantone", value: centEd2(50) },
{ label: "53ed2, Approximate Pythagorean", value: centEd2(53) },
{ label: "55ed2, Approximate 1/6-comma Meantone", value: centEd2(55) },
{ label: "72ed2", value: centEd2(72) },
{ label: "96ed2", value: centEd2(96) },
{ label: "13ed3, Bohlen-Pierce Scale", value: centEd(13, 3) },
//{ label: "30ed3, Approximate 1/3-comma Meantone", value: centEd(30, 3) },
{ label: "49ed3, Approximate 1/4-comma Meantone", value: centEd(49, 3) },
//{ label: "79ed3, Approximate 2/7-comma Meantone", value: centEd(79, 3) },
//{ label: "87ed3, Approximate 1/6-comma Meantone", value: centEd(87, 3) },
{
  label: "Yarman36a",
  value: [
    0, 48.96259, 80.00646, 97.641, 153.15171, 182.37782, 198.747, 250.5906,
    281.92285, 303.638, 352.33605, 381.64137, 396.078, 452.58771, 483.95429,
    501.356, 550.22657, 579.63309, 594.119, 654.22784, 683.40325, 699.744,
    748.76828, 779.85037, 801.683, 853.08301, 882.34301, 896.757, 950.63271,
    981.99929, 1001.88, 1050.68187, 1080.04783, 1094.514, 1154.54271,
    1185.90929,
  ],
},
{
  label: "12-Yarman36a",
  value: [
    0, 97.64058, 198.74659, 303.63775, 396.0776, 501.35622, 594.11855,
    699.74399, 801.68275, 896.7572, 1001.88049, 1094.51356,
  ],
},
{
  label: "Yarman 12-159ed2",
  value: [
    0, 90.56604, 196.22642, 301.88679, 392.45283, 498.113208, 588.67925,
    701.886792, 792.45283, 898.11321, 1003.77358, 1094.33962,
  ],
},
{
  label: "Secor Proportionally Beating 12-tone Well-temperament",
  value: [
    0, 86.5333, 194.5568, 294.12876, 389.11361, 499.91792, 585.54105,
    697.2784, 789.37483, 891.83521, 997.96292, 1086.39201,
  ],
},
*/

const limitScales = [
  pelog4tone,
  pythagorean3tonepentatonic,
  pythagorean3limitdiatonic,
  pentatonic5limit,
  ptolemys5limitintensediatonic,
  olympos5limitpentatonic,
  archytas5limitenharmonicgenus,
  archytas7limitchromaticgenus,
  archytas7limitdiatonicgenus,
  wagogo7limitpentatonic,
  centaur7limit12tone,
  centaura7limit12toneoriginal,
  centaura7limit12toneharmonic,
  beekeeper7limit16tone,
  hangaslathi7limit19tone,
  venkatarama11limit15tone,
  partch11limit43tone,
  europeanfolk13limit8tone,
  ibina7scale13limit7tone,
  ibina7scale13limit12toneextension,
  met24ji1scale13limit24tone,
];

const equalScales = [
  gamelanslendroequalpentatonic,
  gamelanpelog5tone,
  gamelanpelog7tone,
  equalhexatonicwholetone,
  equalheptatonic,
  equalnonatonic,
  equaldecatonic,
  chromaticscale,
];

const chordScales = [
  perfectfourth,
  perfectfifth,
  majorchord,
  minorchord,
  augmentedchord,
  tritone,
];

const tetrachordScales = [
  lydiantetrachord,
  doriantetrachord,
  phrygiantetrachord,
  harmonictetrachord,
  chromatictetrachord,
  chromatictetrachord2,
  diminishedseventhchord,
];

const pentaScales = [
  majorpentatonic,
  majorminor,
  majorpentachord,
  minorpentachord,
  minorpentatonic,
  bluesscale,
];

const largeScales = [
  wholetonescalex,
  majorionian,
  melodicminordescending,
  melodicminorascending,
  phrygianmaqamkurd,
];

export const scalePresets = [
  {
    group: "Basic",
    options: [majorScale, pentatonic, wholeToneScale, edo12, edo24],
  },
  {
    group: "Limit",
    options: limitScales,
  },
  {
    group: "Equal temperament",
    options: equalScales,
  },
  {
    group: "Chords",
    options: chordScales,
  },
  {
    group: "Tetrachords",
    options: tetrachordScales,
  },
  {
    group: "Pentatonic",
    options: pentaScales,
  },
  {
    group: "Heptatonic",
    options: largeScales,
  },
];

export const scalePresetsFlat = scalePresets
  .map((group) => group.options)
  .flat();
