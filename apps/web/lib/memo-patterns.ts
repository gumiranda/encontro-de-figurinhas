/**
 * Common memoization patterns for performance optimization
 * Use these patterns to prevent unnecessary re-renders and expensive computations
 */

import { useMemo, useCallback } from "react";

/**
 * Memoize array equality check by reference
 * Useful for useDependencyList or memo deps
 */
export const useMemoizedArray = <T,>(arr: T[]): T[] => {
  return useMemo(() => arr, [JSON.stringify(arr)]);
};

/**
 * Memoize object equality check by reference
 * Useful for complex object props in memoized components
 */
export const useMemoizedObject = <T extends Record<string, unknown>>(
  obj: T
): T => {
  return useMemo(() => obj, [JSON.stringify(obj)]);
};

/**
 * Create a stable callback that doesn't change between renders
 * Prevents unnecessary re-renders of child components
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps) as T;
};

/**
 * Memoize the result of a filtering operation
 * Useful for expensive list filters (e.g., trade points by distance)
 */
export const useFilteredList = <T,>(
  list: T[],
  filterFn: (item: T) => boolean,
  deps: React.DependencyList = []
) => {
  return useMemo(
    () => list.filter(filterFn),
    [list, ...deps]
  );
};

/**
 * Memoize the result of a sorting operation
 * Useful for sorted lists of trade points, matches, etc
 */
export const useSortedList = <T,>(
  list: T[],
  compareFn: (a: T, b: T) => number,
  deps: React.DependencyList = []
) => {
  return useMemo(
    () => [...list].sort(compareFn),
    [list, ...deps]
  );
};

/**
 * Memoize the result of a map transformation
 * Useful for computing derived data (e.g., match scores)
 */
export const useMappedList = <T, U>(
  list: T[],
  mapFn: (item: T, index: number) => U,
  deps: React.DependencyList = []
) => {
  return useMemo(
    () => list.map(mapFn),
    [list, ...deps]
  );
};

/**
 * Debounced callback for expensive operations
 * Useful for search, location queries, etc
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay, ...deps]
  ) as T;
};

/**
 * Throttled callback for frequently-fired events
 * Useful for scroll events, window resize, etc
 */
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T => {
  const lastCallRef = React.useRef(0);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    },
    [callback, delay, ...deps]
  ) as T;
};
