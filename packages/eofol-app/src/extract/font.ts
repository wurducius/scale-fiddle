import {
  p as pImpl,
  h1 as h1Impl,
  h2 as h2Impl,
  h3 as h3Impl,
  h4 as h4Impl,
  h5 as h5Impl,
  h6 as h6Impl,
} from "@eofol/eofol-simple";

type TypographyNodeContent = (string | Element)[] | (string | Element);

export const p = (content: TypographyNodeContent) =>
  pImpl({ children: content });

export const h1 = (content: TypographyNodeContent) =>
  h1Impl({ children: content });

export const h2 = (content: TypographyNodeContent) =>
  h2Impl({ children: content });

export const h3 = (content: TypographyNodeContent) =>
  h3Impl({ children: content });

export const h4 = (content: TypographyNodeContent) =>
  h4Impl({ children: content });

export const h5 = (content: TypographyNodeContent) =>
  h5Impl({ children: content });

export const h6 = (content: TypographyNodeContent) =>
  h6Impl({ children: content });
