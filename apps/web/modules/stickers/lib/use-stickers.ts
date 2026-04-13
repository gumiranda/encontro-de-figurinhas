"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { toast } from "sonner";
import { buildSectionLookup, type Section, type SectionLookup } from "./sticker-parser";

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

  // Validacao client-side: arrays disjuntos
  const validateDisjoint = useCallback(
    (dups: number[], miss: number[]): string | null => {
      const dupSet = new Set(dups);
      const intersection = miss.filter((n) => dupSet.has(n));
      if (intersection.length > 0) {
        return `Numeros nao podem estar em ambas listas: ${intersection.join(", ")}`;
      }
      return null;
    },
    []
  );

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

      // Validar tamanho (rate limit)
      if (dups.length > 980 || miss.length > 980) {
        setError("Limite de figurinhas excedido");
        return;
      }

      // Validar antes de salvar
      const validationError = validateDisjoint(dups, miss);
      if (validationError) {
        setError(validationError);
        return;
      }
      setError(null);

      // Se finalize=true, salvar imediatamente
      if (finalize) {
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

      // Debounce para saves normais — rele refs no tick do timeout para dados mais recentes
      debounceRef.current = setTimeout(() => {
        const dupsAtSave = dupsRef.current;
        const missAtSave = missRef.current;
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
    [debounceMs, updateStickerList, validateDisjoint]
  );

  // Adicionar figurinhas repetidas
  const addDuplicates = useCallback(
    (numbers: number[]) => {
      const newSet = new Set([...dupsRef.current, ...numbers]);
      const newArray = Array.from(newSet).sort((a, b) => a - b);
      dupsRef.current = newArray;
      setLocalDuplicates(newArray);
      saveWithDebounce();
    },
    [saveWithDebounce]
  );

  // Remover figurinha repetida
  const removeDuplicate = useCallback(
    (num: number) => {
      const newArray = dupsRef.current.filter((n) => n !== num);
      dupsRef.current = newArray;
      setLocalDuplicates(newArray);
      saveWithDebounce();
    },
    [saveWithDebounce]
  );

  // Adicionar figurinhas faltantes
  const addMissing = useCallback(
    (numbers: number[]) => {
      const newSet = new Set([...missRef.current, ...numbers]);
      const newArray = Array.from(newSet).sort((a, b) => a - b);
      missRef.current = newArray;
      setLocalMissing(newArray);
      saveWithDebounce();
    },
    [saveWithDebounce]
  );

  // Remover figurinha faltante
  const removeMissing = useCallback(
    (num: number) => {
      const newArray = missRef.current.filter((n) => n !== num);
      missRef.current = newArray;
      setLocalMissing(newArray);
      saveWithDebounce();
    },
    [saveWithDebounce]
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
  }, [updateStickerList, validateDisjoint]);

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
    (sectionCode: string, mode: "duplicates" | "missing") => {
      const sectionNumbers = getSectionNumbers(sectionCode);
      if (sectionNumbers.length === 0) return;

      if (mode === "duplicates") {
        const newSet = new Set([...dupsRef.current, ...sectionNumbers]);
        const newArray = Array.from(newSet).sort((a, b) => a - b);
        dupsRef.current = newArray;
        setLocalDuplicates(newArray);
        saveWithDebounce();
      } else {
        const newSet = new Set([...missRef.current, ...sectionNumbers]);
        const newArray = Array.from(newSet).sort((a, b) => a - b);
        missRef.current = newArray;
        setLocalMissing(newArray);
        saveWithDebounce();
      }
    },
    [getSectionNumbers, saveWithDebounce]
  );

  // Desmarca todas figurinhas da seção
  const clearSection = useCallback(
    (sectionCode: string, mode: "duplicates" | "missing") => {
      const section = findSection(sectionCode);
      if (!section) return;

      if (mode === "duplicates") {
        const newArray = dupsRef.current.filter(
          (n) => n < section.startNumber || n > section.endNumber
        );
        dupsRef.current = newArray;
        setLocalDuplicates(newArray);
        saveWithDebounce();
      } else {
        const newArray = missRef.current.filter(
          (n) => n < section.startNumber || n > section.endNumber
        );
        missRef.current = newArray;
        setLocalMissing(newArray);
        saveWithDebounce();
      }
    },
    [findSection, saveWithDebounce]
  );

  // Inverte seleção da seção
  const invertSection = useCallback(
    (sectionCode: string, mode: "duplicates" | "missing") => {
      const section = findSection(sectionCode);
      if (!section) return;

      const sectionNumbers = getSectionNumbers(sectionCode);
      const currentList =
        mode === "duplicates" ? dupsRef.current : missRef.current;
      const currentSet = new Set(currentList);

      // Toggle cada número: se está na lista remove, se não está adiciona
      const newList = currentList.filter(
        (n) => n < section.startNumber || n > section.endNumber
      );
      for (const num of sectionNumbers) {
        if (!currentSet.has(num)) {
          newList.push(num);
        }
      }
      newList.sort((a, b) => a - b);

      if (mode === "duplicates") {
        dupsRef.current = newList;
        setLocalDuplicates(newList);
        saveWithDebounce();
      } else {
        missRef.current = newList;
        setLocalMissing(newList);
        saveWithDebounce();
      }
    },
    [findSection, getSectionNumbers, saveWithDebounce]
  );

  // SET completo para o grid (substitui array inteiro)
  const setDuplicates = useCallback(
    (numbers: number[]) => {
      const sorted = [...numbers].sort((a, b) => a - b);
      dupsRef.current = sorted;
      setLocalDuplicates(sorted);
      saveWithDebounce();
    },
    [saveWithDebounce]
  );

  const setMissing = useCallback(
    (numbers: number[]) => {
      const sorted = [...numbers].sort((a, b) => a - b);
      missRef.current = sorted;
      setLocalMissing(sorted);
      saveWithDebounce();
    },
    [saveWithDebounce]
  );

  // Marca TODAS as figurinhas do álbum
  const markAll = useCallback(
    (mode: "duplicates" | "missing") => {
      const allNumbers: number[] = [];
      for (let i = 1; i <= totalStickers; i++) {
        allNumbers.push(i);
      }

      if (mode === "duplicates") {
        dupsRef.current = allNumbers;
        setLocalDuplicates(allNumbers);
        saveWithDebounce();
      } else {
        missRef.current = allNumbers;
        setLocalMissing(allNumbers);
        saveWithDebounce();
      }
    },
    [totalStickers, saveWithDebounce]
  );

  // Desmarca TODAS as figurinhas do álbum
  const clearAll = useCallback(
    (mode: "duplicates" | "missing") => {
      if (mode === "duplicates") {
        dupsRef.current = [];
        setLocalDuplicates([]);
        saveWithDebounce();
      } else {
        missRef.current = [];
        setLocalMissing([]);
        saveWithDebounce();
      }
    },
    [saveWithDebounce]
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
