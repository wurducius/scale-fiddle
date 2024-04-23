export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

export var mouseDown = false;
document.body.onmousedown = function () {
  mouseDown = true;
};
document.body.onmouseup = function () {
  mouseDown = false;
};

const trimWhitespaceRegex = /\s/g;

export const trimWhitespace = (str: string) =>
  str.replace(trimWhitespaceRegex, "");
