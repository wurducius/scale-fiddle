import { flashKeyDownByValue, flashKeyUpByValue } from "./synth-lib";

export var mouseDown = false;
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
  handleKeyDown: any
) => {
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

export const keyUpHandlers = (
  event: KeyboardEvent,
  freq: string[],
  handleKeyUp: any
) => {
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
