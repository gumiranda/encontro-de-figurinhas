"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";
import { buildSectionLookup, type Section, type SectionLookup } from "./sticker-parser";

function validateDisjoint(dups: number[], miss: number[]): string | null {
  const dupSet = new Set(dups);
  const overlap = miss.filter((n) => dupSet.has(n));
  return overlap.length
    ? `Numeros nao podem estar em ambas listas: ${overlap.join(", ")}`
    : null;
}

export function useStickers(debounceMs = 300) {
  // Inline do antigo use-album-config
  const data = useQuery(api.stickers.getUserStickers);
  const sections: Section[] = data?.sections ?? [];
  const totalStickers = data?.totalStickers ?? 980;
  const serverDuplicates = data?.duplicates ?? [];
  const serverMissing = data?.missing ?? [];
  const isLoading = data === undefined;

  // SectionLookup memoizado para O(1) lookups
  const sectionLookup = useMemo(
    () => buildSectionLookup(sections),
    [sections]
  );

  // State local para edicao
  const [localDuplicates, setLocalDuplicates] = useState<number[]>([]);
  const [localMissing, setLocalMissing] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const updateStickerList = useMutation(api.stickers.updateStickerList);

  // Timer ref para debounce e edit counter para race conditions
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const editCountRef = useRef(0);

  // Refs espelham listas locais para saves/debounce sem closure stale (fonte de verdade no timeout)
  const dupsRef = useRef<number[]>([]);
  const missRef = useRef<number[]>([]);

  // Sincronizar state local com servidor quando idle
  useEffect(() => {
    if (!isLoading && !isDirty) {
      setLocalDuplicates(serverDuplicates);
      setLocalMissing(serverMissing);
      dupsRef.current = serverDuplicates;
      missRef.current = serverMissing;
    }
  }, [isLoading, serverDuplicates, serverMissing, isDirty]);

  // Salvar com debounce e isDirty tracking (le sempre dupsRef/missRef no momento do save, nao arrays capturados)
  const saveWithDebounce = useCallback(
    (finalize: boolean = false) => {
      // Marcar como dirty e capturar edit ID
      setIsDirty(true);
      editCountRef.current++;
      const editId = editCountRef.current;

      // Limpar timer anterior
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      const dups = dupsRef.current;
      const miss = missRef.current;

      // Feedback imediato (UI) — nao bloqueia o debounce; o save revalida no tick do timeout
      const quickError =
        dups.length > 980 || miss.length > 980
          ? "Limite de figurinhas excedido"
          : validateDisjoint(dups, miss);
      setError(quickError);

      // Se finalize=true, validar e salvar no mesmo instante (sem gap entre validacao e persist)
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

      // Debounce: validacao completa dentro do timeout, imediatamente antes do persist
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

  type ListKind = "duplicates" | "missing";

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
      applyListUpdate("duplicates", (prev) =>
        Array.from(new Set([...prev, ...numbers])).sort((a, b) => a - b)
      );
    },
    [applyListUpdate]
  );

  const removeDuplicate = useCallback(
    (num: number) => {
      applyListUpdate("duplicates", (prev) => prev.filter((n) => n !== num));
    },
    [applyListUpdate]
  );

  const addMissing = useCallback(
    (numbers: number[]) => {
      applyListUpdate("missing", (prev) =>
        Array.from(new Set([...prev, ...numbers])).sort((a, b) => a - b)
      );
    },
    [applyListUpdate]
  );

  const removeMissing = useCallback(
    (num: number) => {
      applyListUpdate("missing", (prev) => prev.filter((n) => n !== num));
    },
    [applyListUpdate]
  );

  // Finalizar (clicar no FAB)
  const finalize = useCallback(async () => {
    // Limpar debounce pendente
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const dups = dupsRef.current;
    const miss = missRef.current;

    // Validar
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

  // Verificar se pode finalizar (FAB habilitado)
  const canFinalize =
    localDuplicates.length > 0 && localMissing.length > 0 && !isSaving;

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // === BULK ACTIONS ===

  // Encontra seção pelo código - O(1) com Map
  const findSection = useCallback(
    (sectionCode: string): Section | undefined => {
      return sectionLookup.byCode.get(sectionCode.toUpperCase());
    },
    [sectionLookup]
  );

  // Gera array de números para uma seção
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

  // Marca todas figurinhas da seção
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

  // Desmarca todas figurinhas da seção
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

  // Inverte seleção da seção
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

  // SET completo para o grid (substitui array inteiro)
  const setDuplicates = useCallback(
    (numbers: number[]) => {
      applyListUpdate("duplicates", () => [...numbers].sort((a, b) => a - b));
    },
    [applyListUpdate]
  );

  const setMissing = useCallback(
    (numbers: number[]) => {
      applyListUpdate("missing", () => [...numbers].sort((a, b) => a - b));
    },
    [applyListUpdate]
  );

  // Marca TODAS as figurinhas do álbum
  const markAll = useCallback(
    (mode: ListKind) => {
      const allNumbers: number[] = [];
      for (let i = 1; i <= totalStickers; i++) {
        allNumbers.push(i);
      }
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
    // State
    duplicates: localDuplicates,
    missing: localMissing,
    sections,
    totalStickers,
    isLoading,
    isSaving,
    error,
    canFinalize,

    // Actions - Individual
    addDuplicates,
    removeDuplicate,
    addMissing,
    removeMissing,
    finalize,

    // Actions - Bulk
    markAllInSection,
    clearSection,
    invertSection,

    // Actions - Global
    markAll,
    clearAll,

    // Actions - Set (for grid)
    setDuplicates,
    setMissing,
  };
}
