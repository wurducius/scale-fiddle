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
  return getTranslation(nextLanguage).then((val) => {
    translation = val;
  });
};

export const languages = [
  { title: "English", id: "en" },
  { title: "Čeština", id: "cs" },
];

const languageCodeList = languages.map((item) => item.id);

function getTranslation(language: string) {
  const target = languageCodeList.includes(language)
    ? language
    : defaultData.language;
  const result = fetch(`translation/${target}.json`).then((res) => res.json());
  return result;
}

// @ts-ignore
let translation = undefined;

getTranslation(language).then((val) => {
  translation = val;
});

export const t = (key: string, defaultValue: string) => {
  // @ts-ignore
  let path = translation;
  if (!path) {
    return defaultValue;
  }
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
