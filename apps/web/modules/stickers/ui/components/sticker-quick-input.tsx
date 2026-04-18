"use client";

import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import {
  buildSectionLookup,
  parseStickers,
  type Section,
} from "../../lib/sticker-parser";
import type { ListKind } from "../../lib/use-stickers";

type StickerQuickInputProps = {
  mode: ListKind;
  sections: Section[];
  onAdd: (numbers: number[]) => void;
};

type FeedbackState = {
  added: number;
  formatted: string[];
  invalid: string[];
} | null;

export function StickerQuickInput({
  mode,
  sections,
  onAdd,
}: StickerQuickInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const sectionLookup = useMemo(
    () => buildSectionLookup(sections),
    [sections]
  );
  const totalStickers = useMemo(
    () => sections.reduce((max, section) => Math.max(max, section.endNumber), 0),
    [sections]
  );

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(timer);
  }, [feedback]);

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    const result = parseStickers(inputValue, sectionLookup, totalStickers);

    if (result.valid.length > 0) {
      onAdd(result.valid);
      setFeedback({
        added: result.valid.length,
        formatted: result.formatted,
        invalid: result.invalid,
      });
      setInputValue("");
    } else if (result.invalid.length > 0) {
      setFeedback({
        added: 0,
        formatted: [],
        invalid: result.invalid,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const borderGradient =
    mode === "duplicates"
      ? "bg-gradient-to-r from-secondary/20 to-primary/20"
      : "bg-gradient-to-r from-primary/20 to-secondary/20";

  return (
    <div className="relative group">
      <div
        className={`absolute -inset-0.5 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500 ${borderGradient}`}
      />

      <div className="relative bg-surface-container-highest rounded-xl p-5 border border-outline-variant/15">
        <Label className="block text-xs font-bold uppercase tracking-widest text-primary mb-3 font-label">
          Entrada Rapida
        </Label>

        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="BRA-10, ARG-1-15, ENG-5 (codigos FIFA)"
          className="w-full bg-transparent border-none focus:ring-0 focus-visible:ring-0 text-on-surface placeholder:text-outline font-body text-lg resize-none h-24"
        />

        {feedback && (
          <div className="mt-3 space-y-1">
            {feedback.added > 0 && (
              <p className="text-emerald-600 text-xs">
                {feedback.added} adicionada{feedback.added !== 1 ? "s" : ""}
                {feedback.formatted.length > 0 && feedback.formatted.length <= 5 && (
                  <span className="text-emerald-500">
                    {" "}({feedback.formatted.join(", ")})
                  </span>
                )}
              </p>
            )}
            {feedback.invalid.length > 0 && (
              <p className="text-destructive text-xs">
                Codigos invalidos: {feedback.invalid.join(", ")}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-on-surface-variant mt-3">
          Pressione Enter para adicionar. Use hifen: BRA-10, BRA-1-15 (range)
        </p>
      </div>
    </div>
  );
}
