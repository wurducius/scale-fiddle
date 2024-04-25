import { debounce, forceRerender } from "@eofol/eofol";
import { theme } from "./theme";

const BREAKPOINT_RESIZE_HANDLER_INTERVAL_MS = 20;

const config = theme.breakpoints;
const breakpoints = config.values;
const keys = config.keys;

type Breakpoint = Record<(typeof keys)[number], boolean>;

export const mediaQueryMaxWidth = (width: number) => () =>
  window.matchMedia(`(max-width: ${width}px)`).matches;

const breakpointQuery = breakpoints.map((value) => mediaQueryMaxWidth(value));

const getBreakpoints = () =>
  keys.reduce((acc, next, i) => ({ ...acc, [next]: breakpointQuery[i]() }), {});

export let breakpoint: Breakpoint = getBreakpoints();

const handleResize = () => {
  breakpoint = getBreakpoints();
};

window.addEventListener("resize", () => {
  debounce(
    () => {
      handleResize();
      forceRerender();
    },
    BREAKPOINT_RESIZE_HANDLER_INTERVAL_MS,
    "debounce-breakpoint-resize-handler"
  );
});
