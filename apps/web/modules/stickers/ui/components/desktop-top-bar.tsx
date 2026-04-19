"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRight, Save } from "lucide-react";

interface DesktopTopBarProps {
  totalStickers: number;
  isDirty: boolean;
  isSaving: boolean;
  ctaMode: "continue" | "save";
  canContinue: boolean;
  onContinue: () => void;
  onFlush: () => void;
  className?: string;
}

export function DesktopTopBar({
  totalStickers,
  isDirty,
  isSaving,
  ctaMode,
  canContinue,
  onContinue,
  onFlush,
  className,
}: DesktopTopBarProps) {
  return (
    <header
      className={cn(
        "mb-6 hidden items-start justify-between gap-6 md:flex",
        className
      )}
    >
      <div>
        <h1 className="font-headline text-3xl font-black leading-none tracking-tight">
          Cadastrar{" "}
          <span className="text-secondary font-black">figurinhas</span>
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Álbum oficial da Copa do Mundo 2026 · {totalStickers} posições
        </p>
      </div>

      <div className="flex items-center gap-2">
        {ctaMode === "continue" ? (
          <Button
            onClick={onContinue}
            disabled={!canContinue || isSaving}
            className="gap-1.5 bg-gradient-to-r from-primary to-primary-dim text-primary-foreground"
          >
            {isSaving ? "Salvando…" : "Continuar para o mapa"}
            {!isSaving && <ArrowRight className="size-4" />}
          </Button>
        ) : isDirty ? (
          <Button onClick={onFlush} disabled={isSaving} className="gap-1.5">
            <Save className="size-4" />
            {isSaving ? "Salvando…" : "Salvar alterações"}
          </Button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-outline-variant/40 bg-surface-container px-3 py-2 text-sm font-medium text-on-surface-variant">
            Salvo ✓
          </span>
        )}
      </div>
    </header>
  );
}
