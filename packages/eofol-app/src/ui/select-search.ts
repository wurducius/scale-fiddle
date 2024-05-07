import { defineSelectSearch } from "@eofol/eofol-simple";
import { SelectOptions } from "@eofol/eofol-types";

export const defineSelectSearchScalePreset = ({
  options,
}: {
  options: SelectOptions;
}) => {
  defineSelectSearch({
    tagName: "select-search",
    options,
    storeName: "select-search-preset",
    inputElementId: "select-search-preset-scale",
  });
};
