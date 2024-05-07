import { sx } from "@eofol/eofol";
import { FiddleState } from "../../../types";
import { button, div, h1, p } from "@eofol/eofol-simple";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Aenean fermentum risus id tortor. Nullam at arcu a est sollicitudin euismod. Duis bibendum, lectus ut viverra rhoncus, dolor nunc faucibus libero, eget facilisis enim ipsum id lacus. Vivamus luctus egestas leo. In convallis. Sed ac dolor sit amet purus malesuada congue. Cras pede libero, dapibus nec, pretium sit amet, tempor quis. Pellentesque arcu. Nullam lectus justo, vulputate eget mollis sed, tempor sed magna. Ut tempus purus at lorem. Aliquam in lorem sit amet leo accumsan lacinia. Duis pulvinar. Maecenas libero. Integer imperdiet lectus quis justo.";

const docsLink =
  (
    state: FiddleState,
    setState: undefined | ((nextState: FiddleState) => void)
  ) =>
  (title: string, toTab: number) => {
    return button({
      children: title,
      onClick: () => {
        // @ts-ignore
        setState({ ...state, docsTab: toTab });
      },
    });
  };

const back = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const link = docsLink(state, setState);
  return div(sx({ display: "flex", marginTop: "32px" }), link("Back", 0));
};

const intro = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  const link = docsLink(state, setState);

  return div(sx({ marginTop: "90px" }), [
    h1("Scale fiddle documentation"),
    p(
      "Scale fiddle allows you to create microtonal musical tunings and try them out practically on a synthetizer."
    ),
    p(loremIpsum),
    div(
      sx({
        display: "flex",
        flexDirection: "column",
        width: "256px",
        margin: "32px auto 0 auto",
      }),
      [
        link("Create scales", 1),
        link("Modify scales", 2),
        link("Manually enter scale data", 3),
        link("Play synthetizer", 4),
        link("Analyze scales", 5),
      ]
    ),
  ]);
};

const createScales = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return div(undefined, [
    back(state, setState),
    h1("Create scales"),
    p(loremIpsum),
  ]);
};

const modifyScales = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return div(undefined, [
    back(state, setState),
    h1("Modify scales"),
    p(loremIpsum),
  ]);
};

const manuallyEnterData = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return div(undefined, [
    back(state, setState),
    h1("Manually enter scale data"),
    p(loremIpsum),
  ]);
};

const playSynth = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return div(undefined, [
    back(state, setState),
    h1("Play synthetizer"),
    p(loremIpsum),
  ]);
};

const analyzeScale = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  return div(undefined, [
    back(state, setState),
    h1("Analyze scales"),
    p(loremIpsum),
  ]);
};

export const docsTab = (
  state: FiddleState,
  setState: undefined | ((nextState: FiddleState) => void)
) => {
  // @ts-ignore
  const docsTab = state.docsTab;

  return [
    div(sx({ maxWidth: "640px", margin: "0 auto 0 auto", padding: "0 32px" }), [
      div(undefined, [
        ...(docsTab === 0 ? [intro(state, setState)] : []),
        ...(docsTab === 1 ? [createScales(state, setState)] : []),
        ...(docsTab === 2 ? [modifyScales(state, setState)] : []),
        ...(docsTab === 3 ? [manuallyEnterData(state, setState)] : []),
        ...(docsTab === 4 ? [playSynth(state, setState)] : []),
        ...(docsTab === 5 ? [analyzeScale(state, setState)] : []),
      ]),
    ]),
  ];
};
