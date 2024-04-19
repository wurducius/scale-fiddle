import {
  flashKeyDownByValue,
  flashKeyUpByValue,
  playTone,
  releaseNote,
} from "./synth-lib";
import { FiddleState } from "./types";

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
      flashKeyUpByValue(freq[index]);
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
    handleKeyDown(event, freq, "a", 7);
    handleKeyDown(event, freq, "s", 8);
    handleKeyDown(event, freq, "d", 9);
    handleKeyDown(event, freq, "f", 10);
    handleKeyDown(event, freq, "g", 11);
    handleKeyDown(event, freq, "h", 12);
    handleKeyDown(event, freq, "j", 13);
    handleKeyDown(event, freq, "k", 14);
    handleKeyDown(event, freq, "l", 15);
    handleKeyDown(event, freq, "q", 16);
    handleKeyDown(event, freq, "w", 17);
    handleKeyDown(event, freq, "e", 18);
    handleKeyDown(event, freq, "r", 19);
    handleKeyDown(event, freq, "t", 20);
    handleKeyDown(event, freq, "y", 21);
    handleKeyDown(event, freq, "u", 22);
    handleKeyDown(event, freq, "i", 23);
    handleKeyDown(event, freq, "o", 24);
    handleKeyDown(event, freq, "p", 25);
  };

  document.onkeyup = (event) => {
    handleKeyUp(event, freq, "z", 0);
    handleKeyUp(event, freq, "x", 1);
    handleKeyUp(event, freq, "c", 2);
    handleKeyUp(event, freq, "v", 3);
    handleKeyUp(event, freq, "b", 4);
    handleKeyUp(event, freq, "n", 5);
    handleKeyUp(event, freq, "m", 6);
    handleKeyUp(event, freq, "a", 7);
    handleKeyUp(event, freq, "s", 8);
    handleKeyUp(event, freq, "d", 9);
    handleKeyUp(event, freq, "f", 10);
    handleKeyUp(event, freq, "g", 11);
    handleKeyUp(event, freq, "h", 12);
    handleKeyUp(event, freq, "j", 13);
    handleKeyUp(event, freq, "k", 14);
    handleKeyUp(event, freq, "l", 15);
    handleKeyUp(event, freq, "q", 16);
    handleKeyUp(event, freq, "w", 17);
    handleKeyUp(event, freq, "e", 18);
    handleKeyUp(event, freq, "r", 19);
    handleKeyUp(event, freq, "t", 20);
    handleKeyUp(event, freq, "y", 21);
    handleKeyUp(event, freq, "u", 22);
    handleKeyUp(event, freq, "i", 23);
    handleKeyUp(event, freq, "o", 24);
    handleKeyUp(event, freq, "p", 25);
  };
};
