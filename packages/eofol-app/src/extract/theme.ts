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
  };
};

const defaultTheme = {
  color: {
    primary: "#03dac6",
    primaryLighter: "#35E1D1",
    primaryDarker: "#02AE9E",

    secondary: "#86b1ff",
    secondaryDarker: "#6B8DCC",
    secondaryLighter: "#9EC0FF",

    secondaryDark: "#6B8DCC",

    font: "#03dac6",

    background: "#121212",
    backgroundElevation: "#333333",
    backgroundModal: "#2d3748",
  },
  typography: {},
  spacing: {
    space1: "8px",
    space2: "16px",
    space3: "24px",
    space4: "32px",
    space5: "40px",
    space6: "48px",
    space7: "56px",
    space8: "64px",
    space9: "72px",
    space10: "80px",
  },
  breakpoints: { values: [640, 1080, 1200, 1600, 2000, 2600] },
  shape: {},
  zIndex: {},
  config: {},
  components: {},
};

const createTheme = (styles: Partial<Theme>) => mergeDeep(defaultTheme, styles);

export let theme: Theme = createTheme({});

export const setTheme = (styles: any) => {
  theme = createTheme(styles);
};
