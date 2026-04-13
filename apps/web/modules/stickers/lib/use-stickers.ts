"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useReducer,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";
import { buildSectionLookup, type Section } from "./sticker-parser";

const EMPTY_SECTIONS: Section[] = [];
const EMPTY_NUMBERS: number[] = [];

export type ListKind = "duplicates" | "missing";

function validateDisjoint(dups: number[], miss: number[]): string | null {
  const dupSet = new Set(dups);
  const overlap = miss.filter((n) => dupSet.has(n));
  return overlap.length
    ? `Numeros nao podem estar em ambas listas: ${overlap.join(", ")}`
    : null;
}

function filterValidStickerNumbers(
  numbers: number[],
  maxSticker: number
): number[] {
  return numbers.filter(
    (n) => Number.isInteger(n) && n >= 1 && n <= maxSticker
  );
}

/** Dedupe + ascending sort (canonical order for sticker ids). */
function normalizeStickerList(numbers: number[]): number[] {
  return Array.from(new Set(numbers)).sort((a, b) => a - b);
}

function clampStickerListsToMax(
  duplicates: number[],
  missing: number[],
  maxSticker: number
): { duplicates: number[]; missing: number[] } {
  return {
    duplicates: normalizeStickerList(
      filterValidStickerNumbers(duplicates, maxSticker)
    ),
    missing: normalizeStickerList(
      filterValidStickerNumbers(missing, maxSticker)
    ),
  };
}

function listsEqual(a: number[], b: number[]): boolean {
  return (
    a.length === b.length && a.every((n, i) => n === b[i])
  );
}

type StickersUiState = {
  isDirty: boolean;
  isSaving: boolean;
  error: string | null;
};

type StickersUiAction =
  | { type: "setDirty"; dirty: boolean }
  | { type: "setSaving"; saving: boolean }
  | { type: "setError"; error: string | null };

function stickersUiReducer(
  state: StickersUiState,
  action: StickersUiAction
): StickersUiState {
  switch (action.type) {
    case "setDirty":
      return { ...state, isDirty: action.dirty };
    case "setSaving":
      return { ...state, isSaving: action.saving };
    case "setError":
      return { ...state, error: action.error };
    default:
      return state;
  }
}

const initialStickersUi: StickersUiState = {
  isDirty: false,
  isSaving: false,
  error: null,
};

export function useStickers(debounceMs = 300) {
  const data = useQuery(api.stickers.getUserStickers);
  const sections: Section[] = data?.sections ?? EMPTY_SECTIONS;
  const totalStickers = data?.totalStickers ?? 980;
  const serverDuplicates = data?.duplicates ?? EMPTY_NUMBERS;
  const serverMissing = data?.missing ?? EMPTY_NUMBERS;
  const isLoading = data === undefined;

  const sectionLookup = useMemo(
    () => buildSectionLookup(sections),
    [sections]
  );

  const [localDuplicates, setLocalDuplicates] = useState<number[]>([]);
  const [localMissing, setLocalMissing] = useState<number[]>([]);
  const [{ isDirty, isSaving, error }, dispatch] = useReducer(
    stickersUiReducer,
    initialStickersUi
  );

  const updateStickerList = useMutation(api.stickers.updateStickerList);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const editCountRef = useRef(0);

  const dupsRef = useRef<number[]>([]);
  const missRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isLoading && !isDirty) {
      setLocalDuplicates(serverDuplicates);
      setLocalMissing(serverMissing);
      dupsRef.current = serverDuplicates;
      missRef.current = serverMissing;
    }
  }, [isLoading, serverDuplicates, serverMissing, isDirty]);

  const saveWithDebounce = useCallback(() => {
    dispatch({ type: "setDirty", dirty: true });
    editCountRef.current++;
    const editId = editCountRef.current;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const dups = dupsRef.current;
    const miss = missRef.current;

    const lengthExceeded = dups.length > 980 || miss.length > 980;

    if (lengthExceeded) {
      dispatch({ type: "setError", error: "Limite de figurinhas excedido" });
      return;
    }

    debounceRef.current = setTimeout(() => {
      const dupsAtSave = dupsRef.current;
      const missAtSave = missRef.current;

      if (dupsAtSave.length > 980 || missAtSave.length > 980) {
        dispatch({ type: "setError", error: "Limite de figurinhas excedido" });
        return;
      }
      const validationError = validateDisjoint(dupsAtSave, missAtSave);
      if (validationError) {
        dispatch({ type: "setError", error: validationError });
        return;
      }
      dispatch({ type: "setError", error: null });

      dispatch({ type: "setSaving", saving: true });
      updateStickerList({
        duplicates: dupsAtSave,
        missing: missAtSave,
        finalize: false,
      })
        .then(() => {
          if (editCountRef.current === editId) {
            dispatch({ type: "setDirty", dirty: false });
          }
        })
        .catch((e) => {
          dispatch({ type: "setError", error: e.message });
          toast.error("Erro ao salvar. Tente novamente.");
        })
        .finally(() => {
          dispatch({ type: "setSaving", saving: false });
        });
    }, debounceMs);
  }, [debounceMs, updateStickerList]);

  useEffect(() => {
    const { duplicates: d, missing: m } = clampStickerListsToMax(
      dupsRef.current,
      missRef.current,
      totalStickers
    );
    if (listsEqual(d, dupsRef.current) && listsEqual(m, missRef.current)) {
      return;
    }
    dupsRef.current = d;
    missRef.current = m;
    setLocalDuplicates(d);
    setLocalMissing(m);
    if (isDirty) {
      saveWithDebounce();
    }
  }, [totalStickers, isDirty, saveWithDebounce]);

  const applyListUpdate = useCallback(
    (kind: ListKind, computeNext: (prev: number[]) => number[]) => {
      if (kind === "duplicates") {
        const next = computeNext(dupsRef.current);
        dupsRef.current = next;
        setLocalDuplicates(next);
      } else {
        const next = computeNext(missRef.current);
        missRef.current = next;
        setLocalMissing(next);
      }
      saveWithDebounce();
    },
    [saveWithDebounce]
  );

  const addNumbers = useCallback(
    (kind: ListKind, numbers: number[]) => {
      const valid = filterValidStickerNumbers(numbers, totalStickers);
      if (!valid.length) return;
      applyListUpdate(kind, (prev) =>
        normalizeStickerList([...prev, ...valid])
      );
    },
    [applyListUpdate, totalStickers]
  );

  const removeNumber = useCallback(
    (kind: ListKind, num: number) => {
      if (!Number.isInteger(num) || num < 1 || num > totalStickers) return;
      applyListUpdate(kind, (prev) => prev.filter((n) => n !== num));
    },
    [applyListUpdate, totalStickers]
  );

  const setList = useCallback(
    (kind: ListKind, numbers: number[]) => {
      const valid = filterValidStickerNumbers(numbers, totalStickers);
      applyListUpdate(kind, () => normalizeStickerList(valid));
    },
    [applyListUpdate, totalStickers]
  );

  const addDuplicates = useCallback(
    (numbers: number[]) => addNumbers("duplicates", numbers),
    [addNumbers]
  );
  const addMissing = useCallback(
    (numbers: number[]) => addNumbers("missing", numbers),
    [addNumbers]
  );
  const removeDuplicate = useCallback(
    (num: number) => removeNumber("duplicates", num),
    [removeNumber]
  );
  const removeMissing = useCallback(
    (num: number) => removeNumber("missing", num),
    [removeNumber]
  );
  const setDuplicates = useCallback(
    (numbers: number[]) => setList("duplicates", numbers),
    [setList]
  );
  const setMissing = useCallback(
    (numbers: number[]) => setList("missing", numbers),
    [setList]
  );

  const finalize = useCallback(async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const dups = dupsRef.current;
    const miss = missRef.current;

    const validationError = validateDisjoint(dups, miss);
    if (validationError) {
      dispatch({ type: "setError", error: validationError });
      throw new Error(validationError);
    }

    if (dups.length === 0 || miss.length === 0) {
      const msg = "Preencha figurinhas repetidas E faltantes antes de continuar";
      dispatch({ type: "setError", error: msg });
      throw new Error(msg);
    }

    dispatch({ type: "setError", error: null });
    dispatch({ type: "setSaving", saving: true });

    try {
      await updateStickerList({
        duplicates: dups,
        missing: miss,
        finalize: true,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar";
      dispatch({ type: "setError", error: msg });
      throw e;
    } finally {
      dispatch({ type: "setSaving", saving: false });
    }
  }, [updateStickerList]);

  const canFinalize =
    localDuplicates.length > 0 && localMissing.length > 0 && !isSaving;

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function findSection(sectionCode: string): Section | undefined {
    return sectionLookup.byCode.get(sectionCode.toUpperCase());
  }

  function getSectionNumbers(sectionCode: string): number[] {
    const section = findSection(sectionCode);
    if (!section) return [];
    const numbers: number[] = [];
    for (let i = section.startNumber; i <= section.endNumber; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  const markAllInSection = useCallback(
    (sectionCode: string, mode: ListKind) => {
      const sectionNumbers = getSectionNumbers(sectionCode);
      if (sectionNumbers.length === 0) return;

      applyListUpdate(mode, (prev) =>
        normalizeStickerList([...prev, ...sectionNumbers])
      );
    },
    [sectionLookup, applyListUpdate]
  );

  const clearSection = useCallback(
    (sectionCode: string, mode: ListKind) => {
      const section = findSection(sectionCode);
      if (!section) return;

      applyListUpdate(mode, (prev) =>
        prev.filter((n) => n < section.startNumber || n > section.endNumber)
      );
    },
    [sectionLookup, applyListUpdate]
  );

  const invertSection = useCallback(
    (sectionCode: string, mode: ListKind) => {
      const section = findSection(sectionCode);
      if (!section) return;

      const sectionNumbers = getSectionNumbers(sectionCode);
      applyListUpdate(mode, (currentList) => {
        const currentSet = new Set(currentList);
        const newList = currentList.filter(
          (n) => n < section.startNumber || n > section.endNumber
        );
        for (const num of sectionNumbers) {
          if (!currentSet.has(num)) {
            newList.push(num);
          }
        }
        return normalizeStickerList(newList);
      });
    },
    [sectionLookup, applyListUpdate]
  );

  const markAll = useCallback(
    (mode: ListKind) => {
      const allNumbers = Array.from({ length: totalStickers }, (_, i) => i + 1);
      applyListUpdate(mode, () => allNumbers);
    },
    [totalStickers, applyListUpdate]
  );

  const clearAll = useCallback(
    (mode: ListKind) => {
      applyListUpdate(mode, () => []);
    },
    [applyListUpdate]
  );

  return {
    duplicates: localDuplicates,
    missing: localMissing,
    sections,
    totalStickers,
    isLoading,
    isSaving,
    error,
    canFinalize,

    addDuplicates,
    removeDuplicate,
    addMissing,
    removeMissing,
    finalize,

    markAllInSection,
    clearSection,
    invertSection,

    markAll,
    clearAll,

    setDuplicates,
    setMissing,
  };
}
