import { en } from "./en";

const storageData = localStorage.getItem("scale-fiddle-locale");

const defaultData = { language: "en" };

const locale = storageData ? JSON.parse(storageData) : defaultData;
export let language = locale.language;

export const setLanguage = (nextLanguage: string) => {
  localStorage.setItem(
    "scale-fiddle-locale",
    JSON.stringify({ language: nextLanguage })
  );
  language = nextLanguage;
  getTranslation(nextLanguage);
};

export const languages = [
  { title: "English", id: "en" },
  { title: "Čeština", id: "cs" },
];

const languageCodeList = languages.map((item) => item.id);

const translations: Record<string, any> = {
  en,
  cs: {
    app: {
      name: "Translation test",
    },
    scale: {
      name: "Stupnice",
    },
  },
};

let translation =
  translations[
    languageCodeList.includes(language) ? language : defaultData.language
  ];

const getTranslation = (language: string) => {
  translation =
    translations[
      languageCodeList.includes(language) ? language : defaultData.language
    ];
};

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
