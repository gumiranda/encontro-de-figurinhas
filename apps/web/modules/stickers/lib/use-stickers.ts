"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export function useStickers(debounceMs = 300) {
  // Inline do antigo use-album-config
  const data = useQuery(api.stickers.getUserStickers);
  const sections = data?.sections ?? [];
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

    // Actions
    addDuplicates,
    removeDuplicate,
    addMissing,
    removeMissing,
    finalize,
  };
}
