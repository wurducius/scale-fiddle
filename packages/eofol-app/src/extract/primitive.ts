import { createElement, cx, sx as sxx, sy } from "@eofol/eofol";

export const div = (
  classname?: string | string[] | undefined,
  children?: string | Element | Element[],
  attributes?: any,
  properties?: any
) => createElement("div", classname, children, attributes, properties);

const FlexStyleBase = sy({ display: "flex" }, "flex-base");

export const flex = (
  {
    grow,
    justifyContent,
    alignItems,
    flexDirection,
    flexWrap,
    sx,
  }: {
    grow?: number;
    justifyContent?: string;
    alignItems?: string;
    flexDirection?: string;
    flexWrap?: string;
    sx?: string;
  },
  children: string | Element | Element[]
) =>
  div(
    cx(
      FlexStyleBase,
      sxx({
        flex: grow ?? "inherit",
        justifyContent: justifyContent ?? "inherit",
        alignItems: alignItems ?? "inherit",
        // @ts-ignore
        flexDirection: flexDirection ?? "inherit",
        // @ts-ignore
        flexWrap: flexWrap ?? "inherit",
      }),
      sx
    ),
    children
  );

const CenterStyleBase = sy(
  { display: "flex", justifyContent: "center", alignItems: "center" },
  "center-base"
);

export const center = (children: string | Element | Element[]) =>
  div(CenterStyleBase, children);
