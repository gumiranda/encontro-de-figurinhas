"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type Section = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
};

export function useStickers(debounceMs = 300) {
  // Inline do antigo use-album-config
  const data = useQuery(api.stickers.getUserStickers);
  const sections: Section[] = data?.sections ?? [];
  const totalStickers = data?.totalStickers ?? 980;
  const serverDuplicates = data?.duplicates ?? [];
  const serverMissing = data?.missing ?? [];
  const isLoading = data === undefined;

  // State local para edicao
  const [localDuplicates, setLocalDuplicates] = useState<number[]>([]);
  const [localMissing, setLocalMissing] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStickerList = useMutation(api.stickers.updateStickerList);

  // Timer ref para debounce
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar state local com servidor na primeira carga
  useEffect(() => {
    if (!isLoading) {
      setLocalDuplicates(serverDuplicates);
      setLocalMissing(serverMissing);
    }
  }, [isLoading, serverDuplicates, serverMissing]);

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

  // Salvar com debounce
  const saveWithDebounce = useCallback(
    (dups: number[], miss: number[], finalize: boolean = false) => {
      // Limpar timer anterior
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
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
          .catch((e) => setError(e.message))
          .finally(() => setIsSaving(false));
        return;
      }

      // Debounce para saves normais
      debounceRef.current = setTimeout(() => {
        setIsSaving(true);
        updateStickerList({ duplicates: dups, missing: miss, finalize: false })
          .catch((e) => setError(e.message))
          .finally(() => setIsSaving(false));
      }, debounceMs);
    },
    [debounceMs, updateStickerList, validateDisjoint]
  );

  // Adicionar figurinhas repetidas
  const addDuplicates = useCallback(
    (numbers: number[]) => {
      setLocalDuplicates((prev) => {
        const newSet = new Set([...prev, ...numbers]);
        const newArray = Array.from(newSet).sort((a, b) => a - b);
        saveWithDebounce(newArray, localMissing);
        return newArray;
      });
    },
    [localMissing, saveWithDebounce]
  );

  // Remover figurinha repetida
  const removeDuplicate = useCallback(
    (num: number) => {
      setLocalDuplicates((prev) => {
        const newArray = prev.filter((n) => n !== num);
        saveWithDebounce(newArray, localMissing);
        return newArray;
      });
    },
    [localMissing, saveWithDebounce]
  );

  // Adicionar figurinhas faltantes
  const addMissing = useCallback(
    (numbers: number[]) => {
      setLocalMissing((prev) => {
        const newSet = new Set([...prev, ...numbers]);
        const newArray = Array.from(newSet).sort((a, b) => a - b);
        saveWithDebounce(localDuplicates, newArray);
        return newArray;
      });
    },
    [localDuplicates, saveWithDebounce]
  );

  // Remover figurinha faltante
  const removeMissing = useCallback(
    (num: number) => {
      setLocalMissing((prev) => {
        const newArray = prev.filter((n) => n !== num);
        saveWithDebounce(localDuplicates, newArray);
        return newArray;
      });
    },
    [localDuplicates, saveWithDebounce]
  );

  // Finalizar (clicar no FAB)
  const finalize = useCallback(async () => {
    // Limpar debounce pendente
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Validar
    const validationError = validateDisjoint(localDuplicates, localMissing);
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    if (localDuplicates.length === 0 || localMissing.length === 0) {
      const msg = "Preencha figurinhas repetidas E faltantes antes de continuar";
      setError(msg);
      throw new Error(msg);
    }

    setError(null);
    setIsSaving(true);

    try {
      await updateStickerList({
        duplicates: localDuplicates,
        missing: localMissing,
        finalize: true,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar";
      setError(msg);
      throw e;
    } finally {
      setIsSaving(false);
    }
  }, [localDuplicates, localMissing, updateStickerList, validateDisjoint]);

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

  // Encontra seção pelo código
  const findSection = useCallback(
    (sectionCode: string): Section | undefined => {
      return sections.find((s) => s.code === sectionCode);
    },
    [sections]
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
        setLocalDuplicates((prev) => {
          const newSet = new Set([...prev, ...sectionNumbers]);
          const newArray = Array.from(newSet).sort((a, b) => a - b);
          saveWithDebounce(newArray, localMissing);
          return newArray;
        });
      } else {
        setLocalMissing((prev) => {
          const newSet = new Set([...prev, ...sectionNumbers]);
          const newArray = Array.from(newSet).sort((a, b) => a - b);
          saveWithDebounce(localDuplicates, newArray);
          return newArray;
        });
      }
    },
    [getSectionNumbers, localDuplicates, localMissing, saveWithDebounce]
  );

  // Desmarca todas figurinhas da seção
  const clearSection = useCallback(
    (sectionCode: string, mode: "duplicates" | "missing") => {
      const section = findSection(sectionCode);
      if (!section) return;

      if (mode === "duplicates") {
        setLocalDuplicates((prev) => {
          const newArray = prev.filter(
            (n) => n < section.startNumber || n > section.endNumber
          );
          saveWithDebounce(newArray, localMissing);
          return newArray;
        });
      } else {
        setLocalMissing((prev) => {
          const newArray = prev.filter(
            (n) => n < section.startNumber || n > section.endNumber
          );
          saveWithDebounce(localDuplicates, newArray);
          return newArray;
        });
      }
    },
    [findSection, localDuplicates, localMissing, saveWithDebounce]
  );

  // Inverte seleção da seção
  const invertSection = useCallback(
    (sectionCode: string, mode: "duplicates" | "missing") => {
      const section = findSection(sectionCode);
      if (!section) return;

      const sectionNumbers = getSectionNumbers(sectionCode);
      const currentList = mode === "duplicates" ? localDuplicates : localMissing;
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
        setLocalDuplicates(newList);
        saveWithDebounce(newList, localMissing);
      } else {
        setLocalMissing(newList);
        saveWithDebounce(localDuplicates, newList);
      }
    },
    [findSection, getSectionNumbers, localDuplicates, localMissing, saveWithDebounce]
  );

  // SET completo para o grid (substitui array inteiro)
  const setDuplicates = useCallback(
    (numbers: number[]) => {
      const sorted = [...numbers].sort((a, b) => a - b);
      setLocalDuplicates(sorted);
      saveWithDebounce(sorted, localMissing);
    },
    [localMissing, saveWithDebounce]
  );

  const setMissing = useCallback(
    (numbers: number[]) => {
      const sorted = [...numbers].sort((a, b) => a - b);
      setLocalMissing(sorted);
      saveWithDebounce(localDuplicates, sorted);
    },
    [localDuplicates, saveWithDebounce]
  );

  // Marca TODAS as figurinhas do álbum
  const markAll = useCallback(
    (mode: "duplicates" | "missing") => {
      const allNumbers: number[] = [];
      for (let i = 1; i <= totalStickers; i++) {
        allNumbers.push(i);
      }

      if (mode === "duplicates") {
        setLocalDuplicates(allNumbers);
        saveWithDebounce(allNumbers, localMissing);
      } else {
        setLocalMissing(allNumbers);
        saveWithDebounce(localDuplicates, allNumbers);
      }
    },
    [totalStickers, localDuplicates, localMissing, saveWithDebounce]
  );

  // Desmarca TODAS as figurinhas do álbum
  const clearAll = useCallback(
    (mode: "duplicates" | "missing") => {
      if (mode === "duplicates") {
        setLocalDuplicates([]);
        saveWithDebounce([], localMissing);
      } else {
        setLocalMissing([]);
        saveWithDebounce(localDuplicates, []);
      }
    },
    [localDuplicates, localMissing, saveWithDebounce]
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
