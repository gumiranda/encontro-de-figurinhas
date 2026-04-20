"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Save } from "lucide-react";

interface MobileFabBarProps {
  addedToday: number;
  addedDups: number;
  isDirty: boolean;
  isSaving: boolean;
  ctaMode: "continue" | "save";
  canContinue: boolean;
  onContinue: () => void;
  onFlush: () => void;
  className?: string;
}

export function MobileFabBar({
  addedToday,
  addedDups,
  isDirty,
  isSaving,
  ctaMode,
  canContinue,
  onContinue,
  onFlush,
  className,
}: MobileFabBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-[var(--mobile-fab-offset)] z-30 flex items-center gap-2 rounded-2xl border border-outline-variant/60 bg-surface-container-highest/90 p-2 shadow-lg backdrop-blur-md lg:hidden",
        className
      )}
    >
      <div className="flex-1 px-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
          Nesta sessão
        </p>
        <p className="flex items-baseline gap-1">
          <span className="font-headline text-lg font-black text-secondary">
            +{addedToday}
          </span>
          {addedDups > 0 && (
            <span className="text-[11px] text-outline">
              ({addedDups} dup)
            </span>
          )}
        </p>
      </div>

      {ctaMode === "continue" ? (
        <Button
          onClick={onContinue}
          disabled={!canContinue || isSaving}
          size="sm"
          className="gap-1 bg-gradient-to-r from-primary to-primary-dim text-primary-foreground"
        >
          {isSaving ? "Salvando…" : "Continuar"}
          {!isSaving && <ArrowRight className="size-4" />}
        </Button>
      ) : isDirty ? (
        <Button
          onClick={onFlush}
          disabled={isSaving}
          size="sm"
          className="gap-1.5"
        >
          <Save className="size-4" />
          {isSaving ? "Salvando…" : "Salvar"}
        </Button>
      ) : (
        <span className="px-3 py-1.5 text-xs font-medium text-on-surface-variant">
          Salvo ✓
        </span>
      )}
    </div>
  );
}
