import { flashKeyDownByValue, flashKeyUpByValue } from "./keyboard-flash";

export let mouseDown = false;

document.body.onmousedown = function () {
  mouseDown = true;
};

document.body.onmouseup = function () {
  mouseDown = false;
};

export const mouseHandlers = (
  val: string,
  isOctave: boolean,
  playTone: any,
  releaseNote: any
) => ({
  // @ts-ignore
  onmousedown: () => {
    // @ts-ignore
    playTone(val);
    flashKeyDownByValue(val);
  },
  // @ts-ignore
  onmouseenter: (event) => {
    event.preventDefault();
    if (mouseDown) {
      // @ts-ignore
      playTone(val);
      flashKeyDownByValue(val);
    }
  },
  // @ts-ignore
  onmouseleave: (event) => {
    event.preventDefault();
    // @ts-ignore
    releaseNote(val);
    flashKeyUpByValue(val, isOctave);
  },
  // @ts-ignore
  onmouseup: () => {
    // @ts-ignore
    releaseNote(val);
    flashKeyUpByValue(val, isOctave);
  },
});

export const keyDownHandlers = (
  event: KeyboardEvent,
  freq: string[],
  handleKeyDown: any,
  totalNumberOfKeys: number
) => {
  handleKeyDown(event, freq, "z", 0, totalNumberOfKeys);
  handleKeyDown(event, freq, "x", 1, totalNumberOfKeys);
  handleKeyDown(event, freq, "c", 2, totalNumberOfKeys);
  handleKeyDown(event, freq, "v", 3, totalNumberOfKeys);
  handleKeyDown(event, freq, "b", 4, totalNumberOfKeys);
  handleKeyDown(event, freq, "n", 5, totalNumberOfKeys);
  handleKeyDown(event, freq, "m", 6, totalNumberOfKeys);
  handleKeyDown(event, freq, ",", 7, totalNumberOfKeys);
  handleKeyDown(event, freq, ".", 8, totalNumberOfKeys);
  handleKeyDown(event, freq, "/", 9, totalNumberOfKeys);
  handleKeyDown(event, freq, "a", 10, totalNumberOfKeys);
  handleKeyDown(event, freq, "s", 11, totalNumberOfKeys);
  handleKeyDown(event, freq, "d", 12, totalNumberOfKeys);
  handleKeyDown(event, freq, "f", 13, totalNumberOfKeys);
  handleKeyDown(event, freq, "g", 14, totalNumberOfKeys);
  handleKeyDown(event, freq, "h", 15, totalNumberOfKeys);
  handleKeyDown(event, freq, "j", 16, totalNumberOfKeys);
  handleKeyDown(event, freq, "k", 17, totalNumberOfKeys);
  handleKeyDown(event, freq, "l", 18, totalNumberOfKeys);
  handleKeyDown(event, freq, ";", 19, totalNumberOfKeys);
  handleKeyDown(event, freq, "'", 20, totalNumberOfKeys);
  handleKeyDown(event, freq, "q", 21, totalNumberOfKeys);
  handleKeyDown(event, freq, "w", 22, totalNumberOfKeys);
  handleKeyDown(event, freq, "e", 23, totalNumberOfKeys);
  handleKeyDown(event, freq, "r", 24, totalNumberOfKeys);
  handleKeyDown(event, freq, "t", 25, totalNumberOfKeys);
  handleKeyDown(event, freq, "y", 26, totalNumberOfKeys);
  handleKeyDown(event, freq, "u", 27, totalNumberOfKeys);
  handleKeyDown(event, freq, "i", 28, totalNumberOfKeys);
  handleKeyDown(event, freq, "o", 29, totalNumberOfKeys);
  handleKeyDown(event, freq, "p", 30, totalNumberOfKeys);
  handleKeyDown(event, freq, "[", 31, totalNumberOfKeys);
  handleKeyDown(event, freq, "]", 32, totalNumberOfKeys);
};

export const keyUpHandlers = (
  event: KeyboardEvent,
  freq: string[],
  handleKeyUp: any,
  totalNumberOfKeys: number
) => {
  handleKeyUp(event, freq, "z", 0, totalNumberOfKeys);
  handleKeyUp(event, freq, "x", 1, totalNumberOfKeys);
  handleKeyUp(event, freq, "c", 2, totalNumberOfKeys);
  handleKeyUp(event, freq, "v", 3, totalNumberOfKeys);
  handleKeyUp(event, freq, "b", 4, totalNumberOfKeys);
  handleKeyUp(event, freq, "n", 5, totalNumberOfKeys);
  handleKeyUp(event, freq, "m", 6, totalNumberOfKeys);
  handleKeyUp(event, freq, ",", 7, totalNumberOfKeys);
  handleKeyUp(event, freq, ".", 8, totalNumberOfKeys);
  handleKeyUp(event, freq, "/", 9, totalNumberOfKeys);
  handleKeyUp(event, freq, "a", 10, totalNumberOfKeys);
  handleKeyUp(event, freq, "s", 11, totalNumberOfKeys);
  handleKeyUp(event, freq, "d", 12, totalNumberOfKeys);
  handleKeyUp(event, freq, "f", 13, totalNumberOfKeys);
  handleKeyUp(event, freq, "g", 14, totalNumberOfKeys);
  handleKeyUp(event, freq, "h", 15, totalNumberOfKeys);
  handleKeyUp(event, freq, "j", 16, totalNumberOfKeys);
  handleKeyUp(event, freq, "k", 17, totalNumberOfKeys);
  handleKeyUp(event, freq, "l", 18, totalNumberOfKeys);
  handleKeyUp(event, freq, ";", 19, totalNumberOfKeys);
  handleKeyUp(event, freq, "'", 20, totalNumberOfKeys);
  handleKeyUp(event, freq, "q", 21, totalNumberOfKeys);
  handleKeyUp(event, freq, "w", 22, totalNumberOfKeys);
  handleKeyUp(event, freq, "e", 23, totalNumberOfKeys);
  handleKeyUp(event, freq, "r", 24, totalNumberOfKeys);
  handleKeyUp(event, freq, "t", 25, totalNumberOfKeys);
  handleKeyUp(event, freq, "y", 26, totalNumberOfKeys);
  handleKeyUp(event, freq, "u", 27, totalNumberOfKeys);
  handleKeyUp(event, freq, "i", 28, totalNumberOfKeys);
  handleKeyUp(event, freq, "o", 29, totalNumberOfKeys);
  handleKeyUp(event, freq, "p", 30, totalNumberOfKeys);
  handleKeyUp(event, freq, "[", 31, totalNumberOfKeys);
  handleKeyUp(event, freq, "]", 32, totalNumberOfKeys);
};

let touchedKeys: string[] = [];

export const touchHandlers = (playTone: any, releaseNote: any) => {
  document.addEventListener("touchstart", (e) => {
    const x = e.changedTouches[0]?.clientX;
    const y = e.changedTouches[0]?.clientY;
    const touchedElement = document.elementFromPoint(x, y);
    if (touchedElement) {
      const freq = touchedElement.id.substring(4);
      if (!touchedKeys.includes(freq)) {
        playTone(freq);
        flashKeyDownByValue(freq);
        touchedKeys.push(freq);
      }
    }
  });
  document.addEventListener("touchend", (e) => {
    const x = e.changedTouches[0]?.clientX;
    const y = e.changedTouches[0]?.clientY;
    const touchedElement = document.elementFromPoint(x, y);
    if (touchedElement) {
      const freq = touchedElement.id.substring(4);
      if (touchedKeys.includes(freq)) {
        releaseNote(freq);
        flashKeyUpByValue(freq);
        touchedKeys = touchedKeys.filter((f) => f != freq);
      }
    }
  });
  document.addEventListener("touchmove", (e) => {
    const x = e.changedTouches[0]?.clientX;
    const y = e.changedTouches[0]?.clientY;
    const touchedElement = document.elementFromPoint(x, y);
    if (touchedElement) {
      const freq = touchedElement.id.substring(4);
      touchedKeys.forEach((f) => {
        if (f != freq) {
          releaseNote(f);
          flashKeyUpByValue(f);
        }
      });
      touchedKeys = touchedKeys.filter((f) => f === freq);
      if (!touchedKeys.includes(freq)) {
        playTone(freq);
        flashKeyDownByValue(freq);
        touchedKeys.push(freq);
      }
    }
  });
};
