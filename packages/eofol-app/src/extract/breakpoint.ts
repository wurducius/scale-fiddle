import { debounce, forceRerender } from "@eofol/eofol";
import { theme } from "./theme";

const breakpoints = theme.breakpoints.values;

export const mediaQueryMaxWidth = (width: number) => () =>
  window.matchMedia(`(max-width: ${width}px)`).matches;

const mediaQueryXs = mediaQueryMaxWidth(breakpoints[0]);
const mediaQuerySm = mediaQueryMaxWidth(breakpoints[1]);
const mediaQueryMd = mediaQueryMaxWidth(breakpoints[2]);
const mediaQueryLg = mediaQueryMaxWidth(breakpoints[3]);
const mediaQueryXl = mediaQueryMaxWidth(breakpoints[4]);
const mediaQueryXxl = mediaQueryMaxWidth(breakpoints[5]);

let xs = mediaQueryXs();
let sm = mediaQuerySm();
let md = mediaQueryMd();
let lg = mediaQueryLg();
let xl = mediaQueryXl();
let xxl = mediaQueryXxl();

export let breakpoint = {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
};

const handleResize = () => {
  xs = mediaQueryXs();
  sm = mediaQuerySm();
  md = mediaQueryMd();
  lg = mediaQueryLg();
  xl = mediaQueryXl();
  xxl = mediaQueryXxl();

  breakpoint = {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
  };
};

const BREAKPOINT_RESIZE_HANDLER_INTERVAL_MS = 20;

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
