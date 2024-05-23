import { mergeDeep } from "@eofol/eofol";

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
    primary: {
      base: "#03dac6",
      //  light: "#35E1D1",
      //  dark: "#02AE9E",
    },
    secondary: {
      base: "#86b1ff",
      //  dark: "#6B8DCC",
      //  light: "#9EC0FF",
    },
    background: {
      base: "#121212",
      elevation: "#333333",
      card: "#2d3748",
    },
    font: "#03dac6",
    error: "#fc8181",
  },
});

const fuchsiaTheme = mergeDeep(commonTheme, {
  color: {
    primary: {
      base: "#00ffff",
      //  base: "fuchsia",
      //  light: "hsl(300, 100%, 65%)",
      // dark: "hsl(300, 100%, 25%)",
    },
    secondary: {
      base: "#86b1ff",
      //  base: "hsl(180, 100%, 50%)",
      //  dark: "hsl(180, 100%, 35%)",
      //  light: "hsl(180, 100%, 65%)",
    },
    background: {
      base: "#121212",
      elevation: "#333333",
      card: "#2d3748",
    },
    font: "fuchsia",
    error: "#fc8181",
  },
});

const lightTheme = mergeDeep(commonTheme, {
  color: {
    primary: {
      base: "#166abd",
    },
    secondary: {
      base: "#9c27b0",
    },
    background: {
      base: "#ffffff",
      elevation: "#dddddd",
      card: "#bababa",
    },
    font: "black",
    error: "#fc8181",
  },
});

export const themes = [
  { theme: cyanTheme, id: "dark-cyan", title: "Cyan dark" },
  { theme: fuchsiaTheme, id: "dark-fuchsia", title: "Fuchsia dark" },
  { theme: lightTheme, id: "light-any", title: "Light" },
];

export const defaultTheme = cyanTheme;
