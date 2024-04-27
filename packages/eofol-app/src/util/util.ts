export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

const trimWhitespaceRegex = /\s/g;

export const trimWhitespace = (str: string) =>
  str.replace(trimWhitespaceRegex, "");

export function onlyUnique(
  value: string | number,
  index: number,
  array: any[]
) {
  return array.indexOf(value) === index;
}
