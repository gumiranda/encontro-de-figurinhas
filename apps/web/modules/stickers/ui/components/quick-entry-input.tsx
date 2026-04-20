"use client";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Keyboard, Plus } from "lucide-react";
import { useMemo, useState, type KeyboardEvent } from "react";
import {
  buildSectionLookup,
  parseStickers,
  type Section,
} from "../../lib/sticker-parser";

interface FeedbackState {
  added: number;
  formatted: string[];
  rejectedMultiCount: string[];
  invalid: string[];
}

interface QuickEntryInputProps {
  sections: Section[];
  totalStickers: number;
  isLoading: boolean;
  onAdd: (numbers: number[]) => void;
  variant?: "mobile" | "desktop-inline";
  placeholder?: string;
  className?: string;
}

export function QuickEntryInput({
  sections,
  totalStickers,
  isLoading,
  onAdd,
  variant = "mobile",
  placeholder = "Digite números · ex: 42, 108, 250",
  className,
}: QuickEntryInputProps) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);

  const sectionLookup = useMemo(
    () => buildSectionLookup(sections),
    [sections]
  );

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const result = parseStickers(trimmed, sectionLookup, totalStickers);

    if (result.valid.length > 0) {
      onAdd(result.valid);
    }

    setFeedback({
      added: result.valid.length,
      formatted: result.formatted,
      rejectedMultiCount: result.rejectedMultiCount,
      invalid: result.invalid,
    });

    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface-container-low px-3",
          variant === "desktop-inline" ? "py-1.5" : "py-2"
        )}
      >
        <Plus
          aria-hidden="true"
          className="size-5 shrink-0 text-secondary"
          strokeWidth={2.5}
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Carregando álbum…" : placeholder}
          disabled={isLoading}
          aria-label="Entrada rápida de figurinhas"
          aria-describedby="quick-entry-hint"
          className="h-9 flex-1 border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="button"
          onClick={submit}
          disabled={isLoading || !value.trim()}
          size="sm"
          className="bg-secondary text-on-secondary hover:bg-secondary/90"
        >
          {variant === "desktop-inline" ? "Adicionar" : "OK"}
        </Button>
      </div>

      <div id="quick-entry-hint" className="flex items-center gap-2 text-[11px] text-on-surface-variant">
        <Keyboard aria-hidden="true" className="size-3.5 text-outline" />
        <span>Separar por vírgula ·</span>
        <kbd className="inline-flex items-center rounded border border-outline-variant bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-on-surface-variant line-through">
          2x
        </kbd>
        <span>duplicadas ainda não suportadas</span>
      </div>

      {feedback &&
        (feedback.added > 0 ||
          feedback.rejectedMultiCount.length > 0 ||
          feedback.invalid.length > 0) && (
          <div
            role="status"
            aria-live="polite"
            className="space-y-1 rounded-lg border border-outline-variant/30 bg-surface-container px-3 py-2 text-xs"
          >
            {feedback.added > 0 && (
              <p className="text-on-surface-variant">
                <span className="font-bold text-secondary">
                  {feedback.added} adicionada{feedback.added !== 1 ? "s" : ""}
                </span>
                {feedback.formatted.length > 0 &&
                  feedback.formatted.length <= 6 && (
                    <span className="text-outline">
                      {" "}
                      ({feedback.formatted.join(", ")})
                    </span>
                  )}
              </p>
            )}
            {feedback.rejectedMultiCount.length > 0 && (
              <p className="text-tertiary">
                Rejeitadas (múltiplas cópias ainda não suportadas):{" "}
                {feedback.rejectedMultiCount.join(", ")}
              </p>
            )}
            {feedback.invalid.length > 0 && (
              <p className="text-destructive">
                Códigos inválidos: {feedback.invalid.join(", ")}
              </p>
            )}
          </div>
        )}
    </div>
  );
}
