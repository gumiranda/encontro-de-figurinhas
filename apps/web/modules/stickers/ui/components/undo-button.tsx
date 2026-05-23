"use client";

import { Undo2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface UndoButtonProps {
  canUndo: boolean;
  onUndo: () => void;
  className?: string;
}

export function UndoButton({ canUndo, onUndo, className }: UndoButtonProps) {
  if (!canUndo) return null;

  return (
    <button
      type="button"
      onClick={onUndo}
      className={cn(
        "fixed right-4 bottom-20 z-40 flex h-12 w-12 items-center justify-center rounded-full",
        "bg-surface-container-highest border border-outline-variant shadow-lg",
        "text-primary hover:bg-surface-container active:scale-95 transition-all",
        className
      )}
      aria-label="Desfazer última ação"
    >
      <Undo2 className="h-5 w-5" />
    </button>
  );
}
