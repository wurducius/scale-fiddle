import { playTone, releaseNote } from "./synth-lib";
import { FiddleState } from "../types";
import { keyDownHandlers, keyUpHandlers } from "./key-handlers";
import { flashKeyDownByValue, flashKeyUpByValue } from "./keyboard-flash";
import { getBreakpoint } from "@eofol/eofol/dist";

export const keysDown: Record<number, boolean | undefined> = {};

const handleKeyDownImpl =
  (state: FiddleState) =>
  (event: KeyboardEvent, freq: string[], key: string, index: number) => {
    if (
      event.key.toLowerCase() === key &&
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
    if (event.key.toLowerCase() === key && keysDown[index]) {
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

  const breakpoint = getBreakpoint();
  // @ts-ignore
  const isScaleTab = state.tab === 0;
  // @ts-ignore
  const isKeysSmallTab = state.smallTab === 1;
  const small = breakpoint.sm; // @ts-ignore
  const isInvalid = state.scaleInvalid;
  const isKeyboardActive =
    isScaleTab && ((small && isKeysSmallTab) || !small) && !isInvalid;

  document.onkeydown = (event) => {
    if (isKeyboardActive) {
      keyDownHandlers(event, freq, handleKeyDown);
    }
  };

  document.onkeyup = (event) => {
    if (isKeyboardActive) {
      keyUpHandlers(event, freq, handleKeyUp);
    }
  };
};
