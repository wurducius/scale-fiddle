import {
  p as pImpl,
  h1 as h1Impl,
  h2 as h2Impl,
  h3 as h3Impl,
  h4 as h4Impl,
  h5 as h5Impl,
  h6 as h6Impl,
} from "@eofol/eofol-simple";
import { cx, sy } from "@eofol/eofol";

type TypographyNodeContent = (string | Element)[] | (string | Element);

const typographyNoGuttersStyle = sy(
  { marginTop: 0, marginBottom: 0 },
  "typography-base-no-gutters"
);

export const p = (
  content: TypographyNodeContent,
  noGutters?: boolean,
  styles?: string
) =>
  pImpl({
    children: content,
    styles: cx(noGutters ? typographyNoGuttersStyle : undefined, styles),
  });

export const h1 = (
  content: TypographyNodeContent,
  noGutters?: boolean,
  styles?: string
) =>
  h1Impl({
    children: content,
    styles: cx(noGutters ? typographyNoGuttersStyle : undefined, styles),
  });

export const h2 = (
  content: TypographyNodeContent,
  noGutters?: boolean,
  styles?: string
) =>
  h2Impl({
    children: content,
    styles: cx(noGutters ? typographyNoGuttersStyle : undefined, styles),
  });

export const h3 = (
  content: TypographyNodeContent,
  noGutters?: boolean,
  styles?: string
) =>
  h3Impl({
    children: content,
    styles: cx(noGutters ? typographyNoGuttersStyle : undefined, styles),
  });

export const h4 = (
  content: TypographyNodeContent,
  noGutters?: boolean,
  styles?: string
) =>
  h4Impl({
    children: content,
    styles: noGutters ? typographyNoGuttersStyle : undefined,
  });

export const h5 = (
  content: TypographyNodeContent,
  noGutters?: boolean,
  styles?: string
) =>
  h5Impl({
    children: content,
    styles: noGutters ? typographyNoGuttersStyle : undefined,
  });

export const h6 = (
  content: TypographyNodeContent,
  noGutters?: boolean,
  styles?: string
) =>
  h6Impl({
    children: content,
    styles: noGutters ? typographyNoGuttersStyle : undefined,
  });
