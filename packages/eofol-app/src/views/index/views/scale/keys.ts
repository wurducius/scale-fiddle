import { sy, sx } from "@eofol/eofol";
import { breakpoint } from "../../../../extract/breakpoint";
import { div } from "../../../../extract/primitive";
import { mouseHandlers, touchHandlers } from "../../../../synth/key-handlers";
import {
  playTone as playToneImpl,
  releaseNote as releaseNoteImpl,
} from "../../../../synth/synth-lib";
import { theme } from "../../../../styles/theme";
import { FiddleState } from "../../../../types";
import { trimWhitespace } from "../../../../util";
import {
  clearKeyElementMap,
  keyActiveHoverStyle,
  keyColorNonoctaveStyle,
  keyColorOctaveStyle,
  setKeyElementMap,
} from "../../../../synth/keyboard-flash";

sy(
  {
    border: `2px solid ${theme.primaryLighter}`,
    backgroundColor: theme.secondaryDark,
  },
  "key-active"
);

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
    return Number(tone.cent).toFixed(state.options.decimalDigitsCent) + "c";
  }
  if (keyLabel === "ratio") {
    // @ts-ignore
    return Number(tone.ratio).toFixed(state.options.decimalDigitsRatio);
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
      sy(
        {
          height: "92px",
          fontSize: "16px",
          border: `2px solid ${theme.primary}`,
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          touchAction: "none",
          direction: "ltr",
        },
        "key-inactive"
      ),
      keyActiveHoverStyle,
      isOctave ? keyColorOctaveStyle : keyColorNonoctaveStyle,
    ],
    keyLabel,
    { id: `key-${val}` },
    mouseHandlers(val, isOctave, playTone, releaseNote)
  );
  setKeyElementMap(val, keyElement);
  return keyElement;
};

export const keys = (state: FiddleState) => {
  const playTone = playToneImpl(state);
  const releaseNote = releaseNoteImpl(state);

  // @ts-ignore
  const freq = state.overview.map((item) => item.freq);

  setTimeout(() => {
    touchHandlers(playTone, releaseNote);
  }, 50);

  clearKeyElementMap();

  return div(
    sx({ maxHeight: "100%" }),
    div(
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
        renderKey(state, freq.length - 1 - i, playTone, releaseNote)
      )
    )
  );
};
