import { initialState } from "../../initial-state";
import { mapKeyboardKeys } from "../../synth/keyboard-key-mapping";
import { FiddleStateImpl } from "../../types";
import { registerServiceWorker, defineBuiltinElement, sx } from "@eofol/eofol";
import "../../styles/base.css";
import "./index.css";
import { updateScale } from "../../sheen/sheen";
import { appbar } from "./views/appbar";
import { scaleTab, synthTab, optionsTab, aboutTab } from "./views";
import { docsTab } from "./views/docs";
import { initStyles } from "../../styles/styles";
import { analyzeTab } from "./views/analyze";
import { div } from "../../extract/primitive";

initStyles();

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
