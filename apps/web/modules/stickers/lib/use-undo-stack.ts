"use client";

import { useState, useCallback } from "react";

type UndoEntry = {
  key: string;
  prevValue: number;
};

const MAX_HISTORY = 20;

export function useUndoStack() {
  const [history, setHistory] = useState<UndoEntry[]>([]);

  const push = useCallback((key: string, prevValue: number) => {
    setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), { key, prevValue }]);
  }, []);

  const pop = useCallback((): UndoEntry | null => {
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    return last ?? null;
  }, [history]);

  const clear = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    canUndo: history.length > 0,
    historyLength: history.length,
    push,
    pop,
    clear,
  };
}
