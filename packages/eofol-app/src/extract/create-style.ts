import { CSSObject } from "../../../../../eofol/packages/eofol-types";

const THEME_STYLE_ELEMENT_ID = "theme-styles";

let themeStyleElement: Element | null = null;

const injectStyle = (rule: string) => {
  if (!themeStyleElement) {
    themeStyleElement = document.getElementById(THEME_STYLE_ELEMENT_ID);
  }
  if (themeStyleElement) {
    themeStyleElement.innerHTML = themeStyleElement.innerHTML + " " + rule;
  }
};

export const createStyle = (rule: string) => {
  injectStyle(rule);
};

export const clearStyle = () => {
  if (themeStyleElement) {
    document.head.removeChild(themeStyleElement);
  }
  const nextStyleElement = document.createElement("style");
  nextStyleElement.id = THEME_STYLE_ELEMENT_ID;
  document.head.insertAdjacentElement("afterbegin", nextStyleElement);
  themeStyleElement = nextStyleElement;
};

const objectNotationToCSSNotation = (label: string) =>
  label
    .split("")
    .map((letter) =>
      letter.toUpperCase() === letter ? "-" + letter.toLowerCase() : letter
    )
    .join("");

export const createStyleObj = (style: CSSObject, classname: string) => {
  // @ts-ignore
  const rule = Object.keys(style).reduce(
    (acc, next) =>
      acc +
      " " +
      objectNotationToCSSNotation(next) +
      ": " +
      // @ts-ignore
      style[next] +
      ";",
    ""
  );
  injectStyle(`${classname} { ${rule} }`);
};
