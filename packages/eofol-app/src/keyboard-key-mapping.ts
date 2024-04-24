import { sy } from "@eofol/eofol";
import {
  flashKeyDownByValue,
  flashKeyUpByValue,
  playTone,
  releaseNote,
} from "./synth-lib";
import { theme } from "./theme";
import { FiddleState } from "./types";
import { keyDownHandlers, keyUpHandlers } from "./key-handlers";

export const keyColorOctaveStyle = sy(
  {
    color: theme.secondary,
  },
  "key-color-octave"
);
export const keyColorNonoctaveStyle = sy(
  {
    color: theme.primary,
  },
  "key-color-nonoctave"
);

export const keysDown: Record<number, boolean | undefined> = {};

const handleKeyDownImpl =
  (state: FiddleState) =>
  (event: KeyboardEvent, freq: string[], key: string, index: number) => {
    if (
      event.key === key &&
      !keysDown[index] &&
      document.activeElement === document.body
    ) {
      // @ts-ignore
      playTone(state)(freq[index]);
      // @ts-ignore
      flashKeyDownByValue(freq[index]);
      keysDown[index] = true;
    }
  };

const handleKeyUpImpl =
  (state: FiddleState) =>
  (event: KeyboardEvent, freq: string[], key: string, index: number) => {
    if (event.key === key && keysDown[index]) {
      // @ts-ignore
      releaseNote(state)(freq[index]);
      // @ts-ignore
      const isOctave = state.overview[index].isOctave;
      flashKeyUpByValue(freq[index], isOctave);
      keysDown[index] = false;
    }
  };

export const mapKeyboardKeys = (state: FiddleState) => (freq: string[]) => {
  const handleKeyDown = handleKeyDownImpl(state);
  const handleKeyUp = handleKeyUpImpl(state);

  document.onkeydown = (event) => {
    keyDownHandlers(event, freq, handleKeyDown);
  };

  document.onkeyup = (event) => {
    keyUpHandlers(event, freq, handleKeyUp);
  };
};
