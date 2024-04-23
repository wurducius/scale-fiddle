export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

const trimWhitespaceRegex = /\s/g;

export const trimWhitespace = (str: string) =>
  str.replace(trimWhitespaceRegex, "");
