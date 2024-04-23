const storageData = localStorage.getItem("scale-fiddle-locale");

const defaultData = { language: "en" };

const locale = storageData ? JSON.parse(storageData) : defaultData;
const language = locale.language;

export const setLanguage = (language: string) => {
  localStorage.setItem("scale-fiddle-locale", JSON.stringify({ language }));
};

const languages = ["en"];

const translations: Record<string, any> = {
  en: {
    app: {
      name: "Scale Fiddle",
      version: "Version 0.3",
      nameWithVersion: "Scale Fiddle v0.3",
    },
    about: {
      name: "About",
      createdBy: "Created by ",
      microtonalStructureTheoryTeam: "Microtonal Structure Theory team",
      developmentAndDesign: " (development & design)",
      analysisAndTesting: " (development & design)",
      developedUsing: "Developed using ",
      mitLicense: "MIT license",
    },
    appbar: {
      panic: "Panic",
      shareScale: "Share scale",
      microtonalStructureTheory: "Microtonal Structure Theory",
    },
    scale: {
      name: "Scale",
    },
    synth: {
      name: "Synth",
    },
    analyze: {
      name: "Analyze",
    },
    options: {
      name: "Options",
      precision: "Precision",
      synthConfiguration: "Synth configuration",
    },
    docs: {
      name: "Docs",
      fullName: "Documentation",
    },
    shared: {
      underConstruction: "UNDER CONSTRUCTION",
      frequency: "Frequency",
      cent: "Cent",
      ratio: "Ratio",
      frequencyOnKeys: "Frequency on keys",
      startGain: "Start gain",
      startTime: "Start time",
      endGain: "End gain",
      endTime: "End time",
    },
  },
};

const translation =
  translations[languages.includes(language) ? language : defaultData.language];

export const t = (key: string, defaultValue: string) => {
  let path = translation;
  let val;
  try {
    key.split(".").forEach((part) => {
      path = path[part];
    });
    val = path ?? defaultValue;
  } catch (ex) {
    val = defaultValue;
  }
  return val;
};
