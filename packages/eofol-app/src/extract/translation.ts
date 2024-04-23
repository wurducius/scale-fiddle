import { en } from "./en";

const storageData = localStorage.getItem("scale-fiddle-locale");

const defaultData = { language: "en" };

const locale = storageData ? JSON.parse(storageData) : defaultData;
const language = locale.language;

export const setLanguage = (language: string) => {
  localStorage.setItem("scale-fiddle-locale", JSON.stringify({ language }));
};

const languages = ["en", "cs"];

const translations: Record<string, any> = {
  en,
  cs: {
    app: {
      name: "Translation test",
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
