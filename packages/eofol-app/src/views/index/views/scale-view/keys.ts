import { getBreakpoint, getTheme, sx } from "@eofol/eofol";
import {
  mouseHandlers,
  setKeyElementMap,
  touchHandlers,
  clearKeyElementMap,
  playTone,
  releaseNote,
  registerMouseHandlers,
} from "../../../../synth";
import { FiddleState, SynthLayout } from "../../../../types";
import { trimWhitespace } from "../../../../util";
import { toFixedCent, toFixedRatio } from "../../../../sheen";
import { bubble, div } from "@eofol/eofol-simple";
import { Breakpoint } from "@eofol/eofol-types";
import {
  EMPTY_LABEL,
  TIMEOUT_ATTACH_TOUCH_HANDLERS_MS,
} from "../../../../data";

const getKeyLabel = (state: FiddleState, i: number) => {
  // @ts-ignore
  const keyLabel = state.options.keyLabel;
  // @ts-ignore
  const tone = state.overview[i];

  if (keyLabel === "freq") {
    return (
      // @ts-ignore
      Number(tone.freq).toFixed(state.options.decimalDigitsFreqOnKeys) + " Hz"
    );
  }
  if (keyLabel === "cent") {
    // @ts-ignore
    return toFixedCent(state, Number(tone.cent)) + "c";
  }
  if (keyLabel === "ratio") {
    // @ts-ignore
    return toFixedRatio(state, Number(tone.ratio));
  }
  if (keyLabel === "name") {
    return trimWhitespace(tone.name);
  }
  return i.toString();
};

const renderKey = (
  state: FiddleState,
  i: number,
  playTone: any,
  releaseNote: any
) => {
  // @ts-ignore
  const val = state.overview[i].freq;
  // @ts-ignore
  const isOctave = state.overview[i].isOctave;
  const keyLabel = getKeyLabel(state, i);

  // @ts-ignore
  const layout = state.synth.layout;
  // @ts-ignore
  const layoutPianoColor = state.synth.layoutPianoColor;

  // @ts-ignore
  const keyElement = div(
    [
      "key-inactive",
      "key-active-hover",
      isOctave ? "key-color-octave" : "key-color-nonoctave",
    ],
    keyLabel,
    { id: `key-${val}` },
    mouseHandlers(val, isOctave, playTone, releaseNote)
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

  const playToneImpl = playTone(state);
  const releaseNoteImpl = releaseNote(state);

  // @ts-ignore
  const freq = state.overview.map((item) => item.freq);

  const isEmpty = freq.length === 0;

  registerMouseHandlers();

  setTimeout(() => {
    touchHandlers(playToneImpl, releaseNoteImpl);
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
        freq.map((val: string, i: number) =>
          renderKey(state, freq.length - 1 - i, playToneImpl, releaseNoteImpl)
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
