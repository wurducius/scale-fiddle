import { mergeDeep } from "../extract";

const commonTheme = {
  typography: {
    text: {
      fontSize: "16px",
    },
    title: {
      fontSize: "20px",
    },
    heading: {
      fontSize: "24px",
    },
    tableSmall: {
      fontSize: "12px",
    },
  },
  breakpoints: { values: [640, 1080, 1200, 1600, 2000, 2600] },
};

const cyanTheme = mergeDeep(commonTheme, {
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
});

const fuchsiaTheme = mergeDeep(commonTheme, {
  color: {
    primary: "fuchsia",
    primaryLighter: "hsl(300, 100%, 65%)",
    primaryDarker: "hsl(300, 100%, 25%)",

    secondary: "hsl(180, 100%, 50%)",
    secondaryDarker: "hsl(180, 100%, 35%)",
    secondaryLighter: "hsl(180, 100%, 65%)",

    secondaryDark: "darkcyan",

    font: "fuchsia",

    background: "#121212",
    backgroundElevation: "#333333",
    backgroundModal: "#2d3748",
  },
});

const testTheme = mergeDeep(commonTheme, {
  color: {
    primary: "red",
    primaryLighter: "red",
    primaryDarker: "red",

    secondary: "green",
    secondaryDarker: "green",
    secondaryLighter: "green",

    secondaryDark: "green",

    font: "black",

    background: "#121212",
    backgroundElevation: "#333333",
    backgroundModal: "#2d3748",
  },
});

export const themes = [
  { theme: cyanTheme, id: "dark-cyan", title: "Cyan dark" },
  { theme: fuchsiaTheme, id: "dark-fuchsia", title: "Fuchsia dark" },
];

export const defaultTheme = cyanTheme;
