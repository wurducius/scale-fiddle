import { createElement } from "@eofol/eofol";

export const div = (
  classname?: string | string[] | undefined,
  children?: string | Element | Element[],
  attributes?: any,
  properties?: any
) => createElement("div", classname, children, attributes, properties);
