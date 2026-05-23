"use client";

import { Button } from "@workspace/ui/components/button";
import { X, Check, Plus } from "lucide-react";

interface BulkActionBarProps {
  selectedCount: number;
  onClear: () => void;
  onMarkHave: () => void;
  onMarkDupe: () => void;
}

export function BulkActionBar({
  selectedCount,
  onClear,
  onMarkHave,
  onMarkDupe,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky bottom-3 z-50 mx-2 flex items-center gap-2 rounded-xl border border-tertiary bg-surface-container-highest p-2.5 shadow-2xl">
      <button
        type="button"
        onClick={onClear}
        className="grid h-7 w-7 place-items-center rounded-lg border border-outline-variant bg-transparent text-muted-foreground hover:text-on-surface transition-colors"
        aria-label="Limpar seleção"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <span className="font-mono text-xs font-bold text-tertiary">
        {selectedCount} selecionada{selectedCount > 1 ? "s" : ""}
      </span>

      <div className="flex-1" />

      <Button
        size="sm"
        variant="secondary"
        onClick={onMarkDupe}
        className="h-8 gap-1.5 px-2.5 text-xs"
      >
        <Plus className="h-3 w-3" />
        Repetida
      </Button>

      <Button
        size="sm"
        onClick={onMarkHave}
        className="h-8 gap-1.5 px-2.5 text-xs"
      >
        <Check className="h-3 w-3" />
        Tenho
      </Button>
    </div>
  );
}
