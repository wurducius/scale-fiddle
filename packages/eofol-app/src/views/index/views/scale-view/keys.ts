import { getBreakpoint, getTheme, sx } from "@eofol/eofol";
import {
  mouseHandlers,
  setKeyElementMap,
  touchHandlers,
  clearKeyElementMap,
  playTone,
  releaseNote,
  registerMouseHandlers,
  getActiveHoverKeyColor,
  getInactiveKeyColor,
  getTextKeyColor,
} from "../../../../synth";
import { FiddleState, KeyMap, SynthLayout } from "../../../../types";
import { trimWhitespace } from "../../../../util";
import { toFixedCent, toFixedRatio } from "../../../../sheen";
import { bubble, div } from "@eofol/eofol-simple";
import { Breakpoint } from "@eofol/eofol-types";
import {
  EMPTY_LABEL,
  TIMEOUT_ATTACH_TOUCH_HANDLERS_MS,
} from "../../../../data";

const getKeyLabel = (
  state: FiddleState,
  keyVal: { freq: string; isOctave?: boolean; name: string },
  i: number
) => {
  // @ts-ignore
  const keyLabel = state.options.keyLabel;

  if (keyLabel === "freq") {
    return (
      // @ts-ignore
      Number(keyVal.freq).toFixed(state.options.decimalDigitsFreqOnKeys) + " Hz"
    );
  }
  if (keyLabel === "cent") {
    // @ts-ignore
    return toFixedCent(state, Number(keyVal.cent)) + "c";
  }
  if (keyLabel === "ratio") {
    // @ts-ignore
    return toFixedRatio(state, Number(keyVal.ratio));
  }
  if (keyLabel === "name") {
    return trimWhitespace(keyVal.name);
  }
  return (i + 1).toString();
};

const renderKey = (
  state: FiddleState,
  keyVal: KeyMap,
  i: number,
  playTone: any,
  releaseNote: any
) => {
  // @ts-ignore
  const val = keyVal.freq;
  // @ts-ignore
  const isOctave = keyVal.isOctave;
  const keyLabel = getKeyLabel(state, keyVal, i);

  // @ts-ignore
  const keyElement = div(
    [
      getInactiveKeyColor(keyVal),
      getActiveHoverKeyColor(keyVal),
      getTextKeyColor(keyVal),
    ],
    keyLabel,
    { id: `key-${val}` },
    mouseHandlers(keyVal, playTone, releaseNote)
  );
  setKeyElementMap(val, keyElement);
  return keyElement;
};

const getGridColumns = (
  synthLayout: SynthLayout,
  layoutIsoUp: number,
  layoutIsoRight: number,
  breakpoint: Breakpoint
) => {
  if (synthLayout === "linear") {
    return breakpoint.md
      ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
      : "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
  } else if (synthLayout === "iso") {
    return Array.from({ length: layoutIsoUp })
      .map((item, i) => "1fr")
      .join(" ");
  } else {
    // @TODO
    return breakpoint.md
      ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
      : "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr";
  }
};

export const keys = (state: FiddleState) => {
  const theme = getTheme();
  const breakpoint = getBreakpoint();

  // @ts-ignore
  const scaleInvalid = state.scaleInvalid;

  // @ts-ignore
  const synthLayout = state.synth.layout;
  // @ts-ignore
  const layoutIsoUp = state.synth.layoutIsoUp;
  // @ts-ignore
  const layoutIsoRight = state.synth.layoutIsoRight;
  // @ts-ignore
  const colors = state.synth.layoutPianoColor;

  const playToneImpl = playTone(state);
  const releaseNoteImpl = releaseNote(state);

  // @ts-ignore
  const mappedFreq = state.keyMap;
  const isEmpty = mappedFreq.length === 0;

  registerMouseHandlers();

  setTimeout(() => {
    touchHandlers(playToneImpl, releaseNoteImpl, mappedFreq);
  }, TIMEOUT_ATTACH_TOUCH_HANDLERS_MS);

  clearKeyElementMap();

  const keysContentElement = scaleInvalid
    ? div(
        sx({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100% - 21px)",
          position: "relative",
          width: "128px",
          margin: "128px auto 0 auto",
        }),
        bubble("Cannot render synth keyboard because scale is invalid.", true)
      )
    : isEmpty
    ? div(
        sx({
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: "16px",
          margin: "128px auto 0 auto",
        }),
        EMPTY_LABEL
      )
    : div(
        sx({
          display: "grid",
          gridTemplateColumns: getGridColumns(
            synthLayout,
            layoutIsoUp,
            layoutIsoRight,
            breakpoint
          ),
          columnGap: 0,
          rowGap: 0,
          gridAutoFlow: "dense",
          direction: "rtl",
        }),
        mappedFreq.map((val: any, i: number) =>
          renderKey(
            state,
            mappedFreq[mappedFreq.length - 1 - i],
            mappedFreq.length - 1 - i,
            playToneImpl,
            releaseNoteImpl
          )
        )
      );

  return div(
    sx({
      maxHeight: "100%",
      paddingTop: theme.spacing.space3,
    }),
    keysContentElement
  );
};
