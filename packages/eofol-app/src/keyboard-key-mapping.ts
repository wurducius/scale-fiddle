import { sy } from "@eofol/eofol";
import {
  flashKeyDownByValue,
  flashKeyUpByValue,
  playTone,
  releaseNote,
} from "./synth-lib";
import { theme } from "./theme";
import { FiddleState } from "./types";

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
      const isOctave = Number(state.overview[index].ratio) === 1;
      flashKeyUpByValue(freq[index], isOctave);
      keysDown[index] = false;
    }
  };

export const mapKeyboardKeys = (state: FiddleState) => (freq: string[]) => {
  const handleKeyDown = handleKeyDownImpl(state);
  const handleKeyUp = handleKeyUpImpl(state);

  document.onkeydown = (event) => {
    handleKeyDown(event, freq, "z", 0);
    handleKeyDown(event, freq, "x", 1);
    handleKeyDown(event, freq, "c", 2);
    handleKeyDown(event, freq, "v", 3);
    handleKeyDown(event, freq, "b", 4);
    handleKeyDown(event, freq, "n", 5);
    handleKeyDown(event, freq, "m", 6);
    handleKeyDown(event, freq, ",", 7);
    handleKeyDown(event, freq, ".", 8);
    handleKeyDown(event, freq, "/", 9);
    handleKeyDown(event, freq, "a", 10);
    handleKeyDown(event, freq, "s", 11);
    handleKeyDown(event, freq, "d", 12);
    handleKeyDown(event, freq, "f", 13);
    handleKeyDown(event, freq, "g", 14);
    handleKeyDown(event, freq, "h", 15);
    handleKeyDown(event, freq, "j", 16);
    handleKeyDown(event, freq, "k", 17);
    handleKeyDown(event, freq, "l", 18);
    handleKeyDown(event, freq, ";", 19);
    handleKeyDown(event, freq, "'", 20);
    handleKeyDown(event, freq, "q", 21);
    handleKeyDown(event, freq, "w", 22);
    handleKeyDown(event, freq, "e", 23);
    handleKeyDown(event, freq, "r", 24);
    handleKeyDown(event, freq, "t", 25);
    handleKeyDown(event, freq, "y", 26);
    handleKeyDown(event, freq, "u", 27);
    handleKeyDown(event, freq, "i", 28);
    handleKeyDown(event, freq, "o", 29);
    handleKeyDown(event, freq, "p", 30);
    handleKeyDown(event, freq, "[", 31);
    handleKeyDown(event, freq, "]", 32);
  };

  document.onkeyup = (event) => {
    handleKeyUp(event, freq, "z", 0);
    handleKeyUp(event, freq, "x", 1);
    handleKeyUp(event, freq, "c", 2);
    handleKeyUp(event, freq, "v", 3);
    handleKeyUp(event, freq, "b", 4);
    handleKeyUp(event, freq, "n", 5);
    handleKeyUp(event, freq, "m", 6);
    handleKeyUp(event, freq, ",", 7);
    handleKeyUp(event, freq, ".", 8);
    handleKeyUp(event, freq, "/", 9);
    handleKeyUp(event, freq, "a", 10);
    handleKeyUp(event, freq, "s", 11);
    handleKeyUp(event, freq, "d", 12);
    handleKeyUp(event, freq, "f", 13);
    handleKeyUp(event, freq, "g", 14);
    handleKeyUp(event, freq, "h", 15);
    handleKeyUp(event, freq, "j", 16);
    handleKeyUp(event, freq, "k", 17);
    handleKeyUp(event, freq, "l", 18);
    handleKeyUp(event, freq, ";", 19);
    handleKeyUp(event, freq, "'", 20);
    handleKeyUp(event, freq, "q", 21);
    handleKeyUp(event, freq, "w", 22);
    handleKeyUp(event, freq, "e", 23);
    handleKeyUp(event, freq, "r", 24);
    handleKeyUp(event, freq, "t", 25);
    handleKeyUp(event, freq, "y", 26);
    handleKeyUp(event, freq, "u", 27);
    handleKeyUp(event, freq, "i", 28);
    handleKeyUp(event, freq, "o", 29);
    handleKeyUp(event, freq, "p", 30);
    handleKeyUp(event, freq, "[", 31);
    handleKeyUp(event, freq, "]", 32);
  };
};
