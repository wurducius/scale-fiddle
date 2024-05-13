import { playTone, releaseNote } from "./synth-lib";
import { FiddleState } from "../types";
import { keyDownHandlers, keyUpHandlers } from "./key-handlers";
import { flashKeyDownByValue, flashKeyUpByValue } from "./keyboard-flash";
import { getBreakpoint } from "@eofol/eofol";

export const keysDown: Record<number, boolean | undefined> = {};

const handleKeyDownImpl =
  (state: FiddleState, freq: string[], totalNumberOfKeys: number) =>
  (event: KeyboardEvent, key: string, index: number) => {
    if (
      index < totalNumberOfKeys &&
      event.key.toLowerCase() === key &&
      !keysDown[index]
    ) {
      // @ts-ignore
      playTone(state)(freq[index]);
      // @ts-ignore
      flashKeyDownByValue(freq[index]);
      keysDown[index] = true;
    }
  };

const handleKeyUpImpl =
  (state: FiddleState, freq: string[], totalNumberOfKeys: number) =>
  (event: KeyboardEvent, key: string, index: number) => {
    if (
      index < totalNumberOfKeys &&
      event.key.toLowerCase() === key &&
      keysDown[index]
    ) {
      // @ts-ignore
      releaseNote(state)(freq[index]);
      // @ts-ignore
      const isOctave = state.overview[index].isOctave;
      flashKeyUpByValue(freq[index], isOctave);
      keysDown[index] = false;
    }
  };

export const mapKeyboardKeys = (state: FiddleState) => (freq: string[]) => {
  const breakpoint = getBreakpoint();

  // @ts-ignore
  const totalNumberOfKeys = state.tuning.keysUp + state.tuning.keysDown;

  const handleKeyDown = handleKeyDownImpl(state, freq, totalNumberOfKeys);
  const handleKeyUp = handleKeyUpImpl(state, freq, totalNumberOfKeys);

  // @ts-ignore
  const isScaleTab = state.tab === 0;
  // @ts-ignore
  const isKeysSmallTab = state.smallTab === 1;
  const small = breakpoint.sm; // @ts-ignore
  const isInvalid = state.scaleInvalid;
  const isKeyboardActive =
    isScaleTab && ((small && isKeysSmallTab) || !small) && !isInvalid;

  document.onkeydown = (event) => {
    if (isKeyboardActive && document.activeElement === document.body) {
      keyDownHandlers(event, handleKeyDown);
    }
  };

  document.onkeyup = (event) => {
    if (isKeyboardActive && document.activeElement === document.body) {
      keyUpHandlers(event, handleKeyUp);
    }
  };
};
