"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Label } from "@workspace/ui/components/label";
import { parseStickers, formatStickerNumber, type Section } from "../../lib/sticker-parser";

type StickerQuickInputProps = {
  mode: "duplicates" | "missing";
  chips: number[];
  sections: Section[];
  totalStickers: number;
  onAdd: (numbers: number[]) => void;
  onRemove: (num: number) => void;
};

export function StickerQuickInput({
  mode,
  chips,
  sections,
  totalStickers,
  onAdd,
  onRemove,
}: StickerQuickInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [invalidEntries, setInvalidEntries] = useState<string[]>([]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.trim()) {
        const result = parseStickers(value, sections, totalStickers);
        setInvalidEntries(result.invalid);

        if (result.valid.length > 0) {
          onAdd(result.valid);
        }
      } else {
        setInvalidEntries([]);
      }
    },
    [onAdd, sections, totalStickers]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (inputValue.trim()) {
          const result = parseStickers(inputValue, sections, totalStickers);
          if (result.valid.length > 0) {
            onAdd(result.valid);
            setInputValue("");
            setInvalidEntries([]);
          }
        }
      }
    },
    [inputValue, onAdd, sections, totalStickers]
  );

  const chipColor = mode === "duplicates"
    ? "bg-secondary/10 border-secondary/20 text-secondary"
    : "bg-primary/10 border-primary/20 text-primary";

  return (
    <div className="relative group">
      {/* Gradient border blur effect */}
      <div
        className={`absolute -inset-0.5 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-500 ${
          mode === "duplicates"
            ? "bg-gradient-to-r from-secondary/20 to-primary/20"
            : "bg-gradient-to-r from-primary/20 to-secondary/20"
        }`}
      />

      <div className="relative bg-surface-container-highest rounded-xl p-5 border border-outline-variant/15">
        <Label className="block text-xs font-bold uppercase tracking-widest text-primary mb-3 font-label">
          Entrada Rapida
        </Label>

        <Textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Digite os codigos (ex: BRA 12, FRA 14, ARG 10)"
          className="w-full bg-transparent border-none focus:ring-0 focus-visible:ring-0 text-on-surface placeholder:text-outline font-body text-lg resize-none h-24"
        />

        {/* Erro de entradas invalidas */}
        {invalidEntries.length > 0 && (
          <p className="text-destructive text-xs mt-2">
            Entradas invalidas: {invalidEntries.join(", ")}
          </p>
        )}

        {/* Chips */}
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {chips.slice(0, 20).map((num) => {
              const { display } = formatStickerNumber(num, sections);
              return (
                <span
                  key={num}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold font-label border ${chipColor}`}
                >
                  {display}
                  <button
                    type="button"
                    onClick={() => onRemove(num)}
                    className="hover:text-white transition-colors"
                    aria-label={`Remover ${display}`}
                  >
                    <X className="size-3.5" strokeWidth={2.5} />
                  </button>
                </span>
              );
            })}
            {chips.length > 20 && (
              <span className="text-on-surface-variant text-xs self-center">
                +{chips.length - 20} mais
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
