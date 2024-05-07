import { getBreakpoint, getTheme, sx } from "@eofol/eofol";
import {
  mouseHandlers,
  setKeyElementMap,
  touchHandlers,
  clearKeyElementMap,
  playTone,
  releaseNote,
} from "../../../../synth";
import { FiddleState } from "../../../../types";
import { trimWhitespace } from "../../../../util";
import { toFixedCent, toFixedRatio } from "../../../../sheen";
import { bubble, div } from "@eofol/eofol-simple";

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

export const keys = (state: FiddleState) => {
  const theme = getTheme();
  const breakpoint = getBreakpoint();

  // @ts-ignore
  const scaleInvalid = state.scaleInvalid;

  const playToneImpl = playTone(state);
  const releaseNoteImpl = releaseNote(state);

  // @ts-ignore
  const freq = state.overview.map((item) => item.freq);

  setTimeout(() => {
    touchHandlers(playToneImpl, releaseNoteImpl);
  }, 50);

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
    : div(
        sx({
          display: "grid",
          gridTemplateColumns: breakpoint.md
            ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
            : "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
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
