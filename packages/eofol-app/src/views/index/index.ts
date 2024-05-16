import "./index.css";
import {
  defineBuiltinElement,
  sx,
  registerServiceWorker,
  setTheme,
  getTheme,
  loadLocalStorage,
  saveLocalStorage,
  mergeDeep,
} from "@eofol/eofol";
import { SCALE_FIDDLE_LOCAL_STORAGE_NAME, initialState } from "../../data";
import { updateScale } from "../../sheen";
import { defaultTheme, initStyles, themes } from "../../styles";
import { mapKeyboardKeys, removeKeyHandlers } from "../../synth";
import { FiddleStateImpl } from "../../types";
import {
  appbar,
  scaleTab,
  synthTab,
  optionsTab,
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

const savedStore = loadLocalStorage(SCALE_FIDDLE_LOCAL_STORAGE_NAME);

const initialTheme = savedStore // @ts-ignore
  ? (themes.find((t) => t.id === savedStore.options.theme) ?? defaultTheme)
      .theme
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
    if (state.init) {
      const storedState = loadLocalStorage(SCALE_FIDDLE_LOCAL_STORAGE_NAME);
      const storedStateImpl = storedState ?? state;
      const storedFullState = mergeDeep(initialState, storedStateImpl);
      // @ts-ignore
      setState({ ...storedFullState, init: false });
    } else {
      // @ts-ignore
      const fullStateToSave = mergeDeep(initialState, state); // @ts-ignore
      saveLocalStorage(SCALE_FIDDLE_LOCAL_STORAGE_NAME, fullStateToSave);
    }

    // @ts-ignore
    if (state.recompute) {
      // @ts-ignore
      setState({
        ...state,
        recompute: false, // @ts-ignore
        ...updateScale(state),
      });
    }

    return () => {
      removeKeyHandlers();
    };
  },
  render: (state, setState) => {
    // @ts-ignore
    const tab = state.tab;

    mapKeyboardKeys(state);

    return div(undefined, [
      appbar(state, setState),
      div(sx({ marginTop: "4px" }), [
        ...(tab === 0 ? scaleTab(state, setState) : []),
        ...(tab === 1 ? synthTab(state, setState) : []),
        ...(tab === 2 ? optionsTab(state, setState) : []),
        ...(tab === 4 ? aboutTab(state, setState) : []),
        ...(tab === 5 ? analyzeTab(state, setState) : []),
      ]),
      div(sx({ height: "64px" })),
    ]);
  },
});

registerServiceWorker();
