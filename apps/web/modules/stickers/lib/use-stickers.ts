"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
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

/** Valid ints only; Set removes duplicate entries callers may send; sort is canonical order. */
function normalizeStickerList(valid: number[]): number[] {
  return Array.from(new Set(valid)).sort((a, b) => a - b);
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

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

  const saveWithDebounce = useCallback(
    (finalize: boolean = false) => {
      setIsDirty(true);
      editCountRef.current++;
      const editId = editCountRef.current;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const dups = dupsRef.current;
      const miss = missRef.current;

      const quickError =
        dups.length > 980 || miss.length > 980
          ? "Limite de figurinhas excedido"
          : validateDisjoint(dups, miss);
      setError(quickError);

      if (finalize) {
        if (quickError) {
          return;
        }
        setIsSaving(true);
        updateStickerList({ duplicates: dups, missing: miss, finalize: true })
          .then(() => {
            if (editCountRef.current === editId) {
              setIsDirty(false);
            }
          })
          .catch((e) => {
            setError(e.message);
            toast.error("Erro ao salvar. Tente novamente.");
          })
          .finally(() => setIsSaving(false));
        return;
      }

      debounceRef.current = setTimeout(() => {
        const dupsAtSave = dupsRef.current;
        const missAtSave = missRef.current;

        if (dupsAtSave.length > 980 || missAtSave.length > 980) {
          setError("Limite de figurinhas excedido");
          return;
        }
        const validationError = validateDisjoint(dupsAtSave, missAtSave);
        if (validationError) {
          setError(validationError);
          return;
        }
        setError(null);

        setIsSaving(true);
        updateStickerList({
          duplicates: dupsAtSave,
          missing: missAtSave,
          finalize: false,
        })
          .then(() => {
            if (editCountRef.current === editId) {
              setIsDirty(false);
            }
          })
          .catch((e) => {
            setError(e.message);
            toast.error("Erro ao salvar. Tente novamente.");
          })
          .finally(() => setIsSaving(false));
      }, debounceMs);
    },
    [debounceMs, updateStickerList]
  );

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

  const addDuplicates = useCallback(
    (numbers: number[]) => {
      const valid = filterValidStickerNumbers(numbers, totalStickers);
      if (!valid.length) return;
      applyListUpdate("duplicates", (prev) =>
        Array.from(new Set([...prev, ...valid])).sort((a, b) => a - b)
      );
    },
    [applyListUpdate, totalStickers]
  );

  const removeDuplicate = useCallback(
    (num: number) => {
      if (!Number.isInteger(num) || num < 1 || num > totalStickers) return;
      applyListUpdate("duplicates", (prev) => prev.filter((n) => n !== num));
    },
    [applyListUpdate, totalStickers]
  );

  const addMissing = useCallback(
    (numbers: number[]) => {
      const valid = filterValidStickerNumbers(numbers, totalStickers);
      if (!valid.length) return;
      applyListUpdate("missing", (prev) =>
        Array.from(new Set([...prev, ...valid])).sort((a, b) => a - b)
      );
    },
    [applyListUpdate, totalStickers]
  );

  const removeMissing = useCallback(
    (num: number) => {
      if (!Number.isInteger(num) || num < 1 || num > totalStickers) return;
      applyListUpdate("missing", (prev) => prev.filter((n) => n !== num));
    },
    [applyListUpdate, totalStickers]
  );

  const finalize = useCallback(async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const dups = dupsRef.current;
    const miss = missRef.current;

    const validationError = validateDisjoint(dups, miss);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    if (dups.length === 0 || miss.length === 0) {
      const msg = "Preencha figurinhas repetidas E faltantes antes de continuar";
      setError(msg);
      throw new Error(msg);
    }

    setError(null);
    setIsSaving(true);

    try {
      await updateStickerList({
        duplicates: dups,
        missing: miss,
        finalize: true,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar";
      setError(msg);
      throw e;
    } finally {
      setIsSaving(false);
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

  const findSection = useCallback(
    (sectionCode: string): Section | undefined => {
      return sectionLookup.byCode.get(sectionCode.toUpperCase());
    },
    [sectionLookup]
  );

  const getSectionNumbers = useCallback(
    (sectionCode: string): number[] => {
      const section = findSection(sectionCode);
      if (!section) return [];
      const numbers: number[] = [];
      for (let i = section.startNumber; i <= section.endNumber; i++) {
        numbers.push(i);
      }
      return numbers;
    },
    [findSection]
  );

  const markAllInSection = useCallback(
    (sectionCode: string, mode: ListKind) => {
      const sectionNumbers = getSectionNumbers(sectionCode);
      if (sectionNumbers.length === 0) return;

      applyListUpdate(mode, (prev) =>
        Array.from(new Set([...prev, ...sectionNumbers])).sort((a, b) => a - b)
      );
    },
    [getSectionNumbers, applyListUpdate]
  );

  const clearSection = useCallback(
    (sectionCode: string, mode: ListKind) => {
      const section = findSection(sectionCode);
      if (!section) return;

      applyListUpdate(mode, (prev) =>
        prev.filter((n) => n < section.startNumber || n > section.endNumber)
      );
    },
    [findSection, applyListUpdate]
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
        newList.sort((a, b) => a - b);
        return newList;
      });
    },
    [findSection, getSectionNumbers, applyListUpdate]
  );

  const setDuplicates = useCallback(
    (numbers: number[]) => {
      const valid = filterValidStickerNumbers(numbers, totalStickers);
      applyListUpdate("duplicates", () => normalizeStickerList(valid));
    },
    [applyListUpdate, totalStickers]
  );

  const setMissing = useCallback(
    (numbers: number[]) => {
      const valid = filterValidStickerNumbers(numbers, totalStickers);
      applyListUpdate("missing", () => normalizeStickerList(valid));
    },
    [applyListUpdate, totalStickers]
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
