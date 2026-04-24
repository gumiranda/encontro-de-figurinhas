"use client";

import { useMemo, useReducer } from "react";
import { useDebouncedValue } from "../../../hooks/use-debounce";

export type FiltersState = {
  layer: 1 | 2 | null;
  bidirectionalOnly: boolean;
};

export type FiltersAction =
  | { type: "setLayer"; layer: 1 | 2 | null }
  | { type: "setBidirectionalOnly"; bidirectionalOnly: boolean };

export const initialMatchesFiltersState: FiltersState = {
  layer: null,
  bidirectionalOnly: true,
};

export function filtersReducer(
  state: FiltersState,
  action: FiltersAction
): FiltersState {
  switch (action.type) {
    case "setLayer":
      return { ...state, layer: action.layer };
    case "setBidirectionalOnly":
      return { ...state, bidirectionalOnly: action.bidirectionalOnly };
    default:
      return state;
  }
}

const QUERY_DEBOUNCE_MS = 300;

/**
 * Consolidated match list filters with debounced args for Convex `listMyMatches`.
 * `queryArgs` is memoized with a stable identity when `layer` / `bidirectionalOnly` are unchanged.
 */
export function useMatchesFilters() {
  const [state, dispatch] = useReducer(
    filtersReducer,
    initialMatchesFiltersState
  );

  const debouncedState = useDebouncedValue(state, QUERY_DEBOUNCE_MS);

  const queryArgs = useMemo(
    () => ({
      layer: debouncedState.layer,
      bidirectionalOnly: debouncedState.bidirectionalOnly,
    }),
    [debouncedState.layer, debouncedState.bidirectionalOnly]
  );

  return { state, dispatch, queryArgs };
}
