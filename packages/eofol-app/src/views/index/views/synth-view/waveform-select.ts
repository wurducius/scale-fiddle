import { select } from "@eofol/eofol-simple";
import { timbrePresets } from "../../../../data";
import { setWaveform } from "../../../../synth";
import { FiddleState } from "../../../../types";

export const waveformSelect = (state: FiddleState, setState: any) =>
  select({
    name: "select-waveform-preset",
    // @ts-ignore
    value: state.synth.waveformPreset,
    options: timbrePresets,
    onChange: (nextVal) => {
      // @ts-ignore
      setState({
        ...state,
        synth: {
          // @ts-ignore
          ...state.synth,
          waveformPreset: nextVal,
        },
      });
      setWaveform(nextVal);
    },
  });
