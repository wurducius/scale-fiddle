import { getSearchParams, setSearchParams } from "@eofol/eofol";
import { FiddleStateImpl } from "../types";

export const setURLSearchParams = (state: FiddleStateImpl) => {
  setSearchParams({
    scale: encodeURIComponent(state.scaleInput),
    period: encodeURIComponent(state.tuning.period),
  });
};

const getURLSearchParams = () => {
  const searchParams = getSearchParams();
  return {
    scale: decodeURIComponent(searchParams.scale),
    period: decodeURIComponent(searchParams.period),
  };
};

export const getSearchParamState = () => {
  const searchParams = getURLSearchParams();
  const searchScale =
    searchParams.scale !== "undefined" ? searchParams.scale : undefined;
  const searchPeriod =
    searchParams.period !== "undefined" ? searchParams.period : undefined;

  const initialSearchState: Record<string, any> = {};
  if (searchScale) {
    initialSearchState.scaleInput = searchScale;
  }
  if (searchPeriod) {
    initialSearchState.tuning = { period: Number(searchPeriod) };
  }

  return initialSearchState;
};
