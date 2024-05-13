import { KeyMap } from "../types";
import { flashKeyDownByValue, flashKeyUpByValue } from "./keyboard-flash";

export let mouseDown = false;

export const registerMouseHandlers = () => {
  document.onmousedown = () => {
    mouseDown = true;
  };

  document.onmouseup = () => {
    mouseDown = false;
  };
};

export const mouseHandlers = (
  keyVal: KeyMap,
  playTone: any,
  releaseNote: any
) => {
  const val = keyVal.freq;

  return {
    // @ts-ignore
    onmousedown: () => {
      // @ts-ignore
      playTone(val);
      flashKeyDownByValue(keyVal);
    },
    // @ts-ignore
    onmouseenter: (event) => {
      event.preventDefault();
      if (mouseDown) {
        // @ts-ignore
        playTone(val);
        flashKeyDownByValue(keyVal);
      }
    },
    // @ts-ignore
    onmouseleave: (event) => {
      event.preventDefault();
      // @ts-ignore
      releaseNote(val);
      flashKeyUpByValue(keyVal);
    },
    // @ts-ignore
    onmouseup: () => {
      // @ts-ignore
      releaseNote(val);
      flashKeyUpByValue(keyVal);
    },
  };
};

export const keyDownHandlers = (event: KeyboardEvent, handleKeyDown: any) => {
  handleKeyDown(event, "z", 0);
  handleKeyDown(event, "x", 1);
  handleKeyDown(event, "c", 2);
  handleKeyDown(event, "v", 3);
  handleKeyDown(event, "b", 4);
  handleKeyDown(event, "n", 5);
  handleKeyDown(event, "m", 6);
  handleKeyDown(event, ",", 7);
  handleKeyDown(event, ".", 8);
  handleKeyDown(event, "/", 9);
  handleKeyDown(event, "a", 10);
  handleKeyDown(event, "s", 11);
  handleKeyDown(event, "d", 12);
  handleKeyDown(event, "f", 13);
  handleKeyDown(event, "g", 14);
  handleKeyDown(event, "h", 15);
  handleKeyDown(event, "j", 16);
  handleKeyDown(event, "k", 17);
  handleKeyDown(event, "l", 18);
  handleKeyDown(event, ";", 19);
  handleKeyDown(event, "'", 20);
  handleKeyDown(event, "q", 21);
  handleKeyDown(event, "w", 22);
  handleKeyDown(event, "e", 23);
  handleKeyDown(event, "r", 24);
  handleKeyDown(event, "t", 25);
  handleKeyDown(event, "y", 26);
  handleKeyDown(event, "u", 27);
  handleKeyDown(event, "i", 28);
  handleKeyDown(event, "o", 29);
  handleKeyDown(event, "p", 30);
  handleKeyDown(event, "[", 31);
  handleKeyDown(event, "]", 32);
};

export const keyUpHandlers = (event: KeyboardEvent, handleKeyUp: any) => {
  handleKeyUp(event, "z", 0);
  handleKeyUp(event, "x", 1);
  handleKeyUp(event, "c", 2);
  handleKeyUp(event, "v", 3);
  handleKeyUp(event, "b", 4);
  handleKeyUp(event, "n", 5);
  handleKeyUp(event, "m", 6);
  handleKeyUp(event, ",", 7);
  handleKeyUp(event, ".", 8);
  handleKeyUp(event, "/", 9);
  handleKeyUp(event, "a", 10);
  handleKeyUp(event, "s", 11);
  handleKeyUp(event, "d", 12);
  handleKeyUp(event, "f", 13);
  handleKeyUp(event, "g", 14);
  handleKeyUp(event, "h", 15);
  handleKeyUp(event, "j", 16);
  handleKeyUp(event, "k", 17);
  handleKeyUp(event, "l", 18);
  handleKeyUp(event, ";", 19);
  handleKeyUp(event, "'", 20);
  handleKeyUp(event, "q", 21);
  handleKeyUp(event, "w", 22);
  handleKeyUp(event, "e", 23);
  handleKeyUp(event, "r", 24);
  handleKeyUp(event, "t", 25);
  handleKeyUp(event, "y", 26);
  handleKeyUp(event, "u", 27);
  handleKeyUp(event, "i", 28);
  handleKeyUp(event, "o", 29);
  handleKeyUp(event, "p", 30);
  handleKeyUp(event, "[", 31);
  handleKeyUp(event, "]", 32);
};

let touchedKeys: string[] = [];

const getTouchedKeys = () => touchedKeys;

const addTouchedKey = (touchedKey: string) => touchedKeys.push(touchedKey);

const removeTouchedKey = (touchedKey: string) => {
  touchedKeys = touchedKeys.filter((f) => f != touchedKey);
};

const handleTouch = (handler: (freq: string) => void) => (e: TouchEvent) => {
  const x = e.changedTouches[0]?.clientX;
  const y = e.changedTouches[0]?.clientY;
  const touchedElement = document.elementFromPoint(x, y);
  if (touchedElement) {
    const touchedElementId = touchedElement.id;
    if (touchedElementId.startsWith("key-")) {
      handler(touchedElementId.substring(4));
    }
  }
};

export const touchHandlers = (
  playTone: any,
  releaseNote: any,
  keyMap: KeyMap[]
) => {
  const touchStartHandler = handleTouch((freq) => {
    if (!getTouchedKeys().includes(freq)) {
      playTone(freq);
      const keyVal = keyMap.find((keyV) => keyV.freq === freq); // @ts-ignore
      flashKeyDownByValue(keyVal);
      addTouchedKey(freq);
    }
  });

  document.ontouchstart = touchStartHandler;

  const touchEndHandler = handleTouch((freq) => {
    if (getTouchedKeys().includes(freq)) {
      releaseNote(freq);
      const keyVal = keyMap.find((keyV) => keyV.freq === freq); // @ts-ignore
      flashKeyUpByValue(keyVal);
      removeTouchedKey(freq);
    }
  });

  document.ontouchend = touchEndHandler;

  const touchMoveHandler = handleTouch((freq) => {
    getTouchedKeys().forEach((f) => {
      if (f != freq) {
        releaseNote(f);
        const keyValF = keyMap.find((keyV) => keyV.freq === f); // @ts-ignore
        flashKeyUpByValue(keyValF);
      }
    });
    removeTouchedKey(freq);
    if (!getTouchedKeys().includes(freq)) {
      playTone(freq);
      const keyVal = keyMap.find((keyV) => keyV.freq === freq); // @ts-ignore
      flashKeyDownByValue(keyVal);
      addTouchedKey(freq);
    }
  });

  document.ontouchmove = touchMoveHandler;
};

export const removeKeyHandlers = () => {
  document.onkeydown = null;
  document.onkeyup = null;
  document.ontouchstart = null;
  document.ontouchend = null;
  document.ontouchmove = null;
  document.onmouseup = null;
  document.onmousedown = null;
};
