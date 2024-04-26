import "../../styles/base.css";
import "./index.css";
import { defineBuiltinElement, sx, registerServiceWorker } from "@eofol/eofol";
import { initialState } from "../../data";
import { div, setTheme, theme } from "../../extract";
import { updateScale } from "../../sheen";
import { defaultTheme, initStyles, themes } from "../../styles";
import { mapKeyboardKeys } from "../../synth";
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

const storage = localStorage.getItem("scale-fiddle-data");

const initialTheme = storage
  ? (
      themes.find((t) => t.id === JSON.parse(storage).options.theme) ??
      defaultTheme
    ).theme
  : defaultTheme;

setTheme(initialTheme);

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
    ]);
  },
});

registerServiceWorker();
