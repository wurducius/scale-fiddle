import "./index.css";
import {
  defineBuiltinElement,
  sx,
  registerServiceWorker,
  setTheme,
  getTheme,
} from "@eofol/eofol";
import { initialState } from "../../data";
import { updateScale } from "../../sheen";
import { defaultTheme, initStyles, themes } from "../../styles";
import { mapKeyboardKeys, removeKeyHandlers } from "../../synth";
import { FiddleStateImpl } from "../../types";
import {
  appbar,
  scaleTab,
  synthTab,
  optionsTab,
  docsTab,
  aboutTab,
  analyzeTab,
} from "./views";
import { div } from "@eofol/eofol-simple";

/*
initTranslation([
  { title: "English", id: "en" },
  { title: "Čeština", id: "cs" },
]);
*/

const storage = localStorage.getItem("scale-fiddle-data");

const initialTheme = storage
  ? (
      themes.find((t) => t.id === JSON.parse(storage).options.theme) ??
      defaultTheme
    ).theme
  : defaultTheme;

setTheme(initialTheme);

const theme = getTheme();
initStyles(theme);

defineBuiltinElement<FiddleStateImpl>({
  tagName: "fiddle-keyboard",
  initialState: {
    ...initialState,
    ...updateScale(initialState),
  },
  effect: (state, setState) => {
    // @ts-ignore
    const stateImpl = state as FiddleStateImpl;

    if (stateImpl.init) {
      const data = localStorage.getItem("scale-fiddle-data");
      if (data) {
        const json = JSON.parse(data);
        // @ts-ignore
        setState({ ...json, init: false });
      } else {
        // @ts-ignore
        setState({ ...state, init: false });
      }
    } else {
      localStorage.setItem("scale-fiddle-data", JSON.stringify(state));
    }

    if (stateImpl.recompute) {
      // @ts-ignore
      setState({
        ...state,
        recompute: false,
        ...updateScale(stateImpl),
      });
    }

    if (stateImpl.form.edo.open) {
      const content = document.getElementById("modal-edo");
      if (content) {
        content.setAttribute("style", "display: block;");
      }
    }

    return () => {
      removeKeyHandlers();
    };
  },
  render: (state, setState) => {
    // @ts-ignore
    const freq = state.overview.map((item) => item.freq);
    // @ts-ignore
    const tab = state.tab;

    mapKeyboardKeys(state)(freq);

    return div(undefined, [
      appbar(state, setState),
      div(sx({ marginTop: "4px" }), [
        ...(tab === 0 ? scaleTab(state, setState) : []),
        ...(tab === 1 ? synthTab(state, setState) : []),
        ...(tab === 2 ? optionsTab(state, setState) : []),
        ...(tab === 3 ? docsTab(state, setState) : []),
        ...(tab === 4 ? aboutTab(state, setState) : []),
        ...(tab === 5 ? analyzeTab(state, setState) : []),
      ]),
      div(sx({ height: "64px" })),
    ]);
  },
});

registerServiceWorker();
