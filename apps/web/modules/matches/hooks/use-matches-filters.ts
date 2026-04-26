"use client";

import { useMemo, useReducer } from "react";
import { useDebouncedValue } from "../../../hooks/use-debounce";

export type FiltersState = {
  // Server-side (triggers query, debounced)
  layer: 1 | 2 | null;
  bidirectionalOnly: boolean;
  verifiedOnly: boolean;
  // Client-side (filters in memory, instant)
  nearOnly: boolean;
  raresOnly: boolean;
  sortByMatch: boolean;
};

export type FiltersAction =
  | { type: "setLayer"; layer: 1 | 2 | null }
  | { type: "setBidirectionalOnly"; bidirectionalOnly: boolean }
  | { type: "setVerifiedOnly"; verifiedOnly: boolean }
  | { type: "setNearOnly"; nearOnly: boolean }
  | { type: "setRaresOnly"; raresOnly: boolean }
  | { type: "setSortByMatch"; sortByMatch: boolean }
  | { type: "clearClientFilters" }
  | { type: "clearAllFilters" };

export const initialMatchesFiltersState: FiltersState = {
  layer: null,
  /** false = "Todos" / one-way or two-way; true = mão dupla only */
  bidirectionalOnly: false,
  verifiedOnly: false,
  nearOnly: false,
  raresOnly: false,
  sortByMatch: false,
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
    case "setVerifiedOnly":
      return { ...state, verifiedOnly: action.verifiedOnly };
    case "setNearOnly":
      return { ...state, nearOnly: action.nearOnly };
    case "setRaresOnly":
      return { ...state, raresOnly: action.raresOnly };
    case "setSortByMatch":
      return { ...state, sortByMatch: action.sortByMatch };
    case "clearClientFilters":
      return { ...state, nearOnly: false, raresOnly: false, sortByMatch: false };
    case "clearAllFilters":
      return initialMatchesFiltersState;
    default:
      return state;
  }
}

const QUERY_DEBOUNCE_MS = 300;

/**
 * Consolidated match list filters with debounced args for Convex `listMyMatches`.
 * Server-side filters (layer, bidirectionalOnly, verifiedOnly) are debounced.
 * Client-side filters (nearOnly, raresOnly, sortByMatch) are instant.
 */
export function useMatchesFilters() {
  const [state, dispatch] = useReducer(
    filtersReducer,
    initialMatchesFiltersState
  );

  const debouncedServerState = useDebouncedValue(
    { layer: state.layer, bidirectionalOnly: state.bidirectionalOnly, verifiedOnly: state.verifiedOnly },
    QUERY_DEBOUNCE_MS
  );

  const queryArgs = useMemo(
    () => ({
      layer: debouncedServerState.layer,
      bidirectionalOnly: debouncedServerState.bidirectionalOnly,
      verifiedOnly: debouncedServerState.verifiedOnly,
    }),
    [debouncedServerState.layer, debouncedServerState.bidirectionalOnly, debouncedServerState.verifiedOnly]
  );

  const clientFilters = useMemo(
    () => ({
      nearOnly: state.nearOnly,
      raresOnly: state.raresOnly,
      sortByMatch: state.sortByMatch,
    }),
    [state.nearOnly, state.raresOnly, state.sortByMatch]
  );

  const hasActiveClientFilters = state.nearOnly || state.raresOnly;

  const hasActiveFilters = useMemo(
    () =>
      state.layer !== null ||
      state.bidirectionalOnly ||
      state.verifiedOnly ||
      state.nearOnly ||
      state.raresOnly,
    [state.layer, state.bidirectionalOnly, state.verifiedOnly, state.nearOnly, state.raresOnly]
  );

  return { state, dispatch, queryArgs, clientFilters, hasActiveClientFilters, hasActiveFilters };
}
