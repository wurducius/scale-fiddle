import { defaultTheme } from "./default-theme";

export function mergeDeep(target: any, source: any) {
  const result = { ...target, ...source };
  for (const key of Object.keys(result)) {
    result[key] =
      typeof target[key] == "object" && typeof source[key] == "object"
        ? mergeDeep(target[key], source[key])
        : structuredClone(result[key]);
  }
  return result;
}

export type Theme = {
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

export const setTheme = (styles: Partial<Theme>) => {
  theme = createTheme(styles);
};
