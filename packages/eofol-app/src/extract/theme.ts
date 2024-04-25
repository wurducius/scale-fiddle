import { defaultTheme } from "./default-theme";

function isObject(item: any) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function mergeDeep(target: any, ...sources: any) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

type Theme = {
  color: Record<string, string>;
  typography: Record<string, { fontSize: string }>;
  spacing: Record<string, string>;
  breakpoints: {
    values: number[];
    keys: string[];
  };
};

const createTheme = (styles: Partial<Theme>) => mergeDeep(defaultTheme, styles);

export let theme: Theme = createTheme({});

export const setTheme = (styles: any) => {
  theme = createTheme(styles);
};
