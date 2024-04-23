const breakpoints = [640, 1080, 1200, 1600, 2000, 2600];

const mediaQueryMaxWidth = (width: number) => () =>
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

export const breakpoint = {
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
};

//addEventListener("change", () => {
//  small = mediaQuerySmall();
//});
