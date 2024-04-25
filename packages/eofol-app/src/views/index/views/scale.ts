import { button } from "@eofol/eofol-simple";
import { sx } from "@eofol/eofol";
import { breakpoint, div } from "../../../extract";
import { FiddleState } from "../../../types";
import {
  changeScaleMenu,
  scaleLibrary,
  scaleOverview,
  scaleTuning,
  keys,
  formModal,
} from "./scale-view";

const getMenuHeight = () => {
  if (breakpoint.xs) {
    return "1200px";
  }
  if (breakpoint.sm) {
    return "600px";
  }
  return "300px";
};

const inputMenu = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const changeScaleMenuElement = div(
    sx({ flex: 1, padding: "0 0 0 0", height: "300px" }),
    [div(undefined, changeScaleMenu(state, setState))]
  );
  const scaleLibraryElement = div(
    sx({ flex: 1, padding: "0 8px" }),
    scaleLibrary(state, setState)
  );
  const scaleOverviewElement = div(
    sx({ flex: 1, padding: "0 0" }),
    scaleOverview(state, setState)
  );
  const scaleTuningElement = div(
    sx({ flex: 1, padding: "0 0 0 0" }),
    scaleTuning(state, setState)
  );

  return div(
    sx({
      display: "flex",
      height: getMenuHeight(),
      flexDirection: breakpoint.sm ? "column" : "row",
    }),
    !breakpoint.xs
      ? [
          div(sx({ display: "flex", flex: 1, height: "300px" }), [
            changeScaleMenuElement,
            scaleLibraryElement,
          ]),
          div(sx({ display: "flex", flex: 1, height: "300px" }), [
            scaleOverviewElement,
            scaleTuningElement,
          ]),
        ]
      : [
          changeScaleMenuElement,
          scaleLibraryElement,
          scaleOverviewElement,
          scaleTuningElement,
        ]
  );
};

const desktopScaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return [
    inputMenu(state, setState),
    keys(state),
    ...formModal(state, setState),
  ];
};

const mobileScaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const isScaleTab = state.smallTab === 0;
  // @ts-ignore
  const isKeyboardTab = state.smallTab === 1;

  return [
    div(sx({ display: "flex", height: "50px" }), [
      button({
        onClick: () => {
          // @ts-ignore
          setState({ ...state, smallTab: 0 });
        },
        children: "Scale",
      }),
      button({
        onClick: () => {
          // @ts-ignore
          setState({ ...state, smallTab: 1 });
        },
        children: "Keyboard",
      }),
    ]),
    ...(isScaleTab ? [inputMenu(state, setState)] : []),
    ...(isScaleTab ? formModal(state, setState) : []),
    ...(isKeyboardTab ? [keys(state)] : []),
  ];
};

export const scaleTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return !breakpoint.sm
    ? desktopScaleTab(state, setState)
    : mobileScaleTab(state, setState);
};
