const THEME_STYLE_ELEMENT_ID = "theme-styles";

let themeStyleElement: Element | null = null;

export const createStyle = (rule: string) => {
  if (!themeStyleElement) {
    themeStyleElement = document.getElementById(THEME_STYLE_ELEMENT_ID);
  }
  if (themeStyleElement) {
    themeStyleElement.innerHTML = themeStyleElement.innerHTML + " " + rule;
  }
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
