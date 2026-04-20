"use client";

import { Trash2 } from "lucide-react";
import { memo, useCallback, useMemo } from "react";
import {
  buildSectionLookup,
  formatStickerNumber,
  groupBySections,
  type Section,
} from "../../lib/sticker-parser";
import { getFlagGradient } from "../../lib/flag-gradients";
import type { ListKind } from "../../lib/use-stickers";

type Props = {
  numbers: number[];
  sections: Section[];
  onRemove: (num: number) => void;
  variant?: ListKind;
};

function StickerListGroupedBase({
  numbers,
  sections,
  onRemove,
  variant = "duplicates",
}: Props) {
  const lookup = useMemo(() => buildSectionLookup(sections), [sections]);
  const grouped = useMemo(() => groupBySections(numbers, lookup), [numbers, lookup]);

  const handleRemove = useCallback(
    (num: number) => {
      onRemove(num);
    },
    [onRemove]
  );

  if (numbers.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <p className="text-lg font-headline">Nenhuma figurinha cadastrada</p>
        <p className="text-sm mt-2 font-body">
          {variant === "duplicates"
            ? "Digite os numeros das figurinhas repetidas acima"
            : "Digite os numeros das figurinhas que voce precisa"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Array.from(grouped.entries()).map(([sectionCode, sectionNumbers]) => {
        const section = lookup.byCode.get(sectionCode);
        if (!section) return null;
        const sectionName = section.name;
        const isExtra = section.isExtra ?? false;

        return (
          <div key={sectionCode} className="relative">
            {/* Section header with flag */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-6 rounded-sm overflow-hidden bg-surface-container-high relative">
                <div
                  className={`absolute inset-0 ${getFlagGradient(sectionCode)} opacity-80`}
                />
              </div>
              <h3 className="font-headline font-bold text-base uppercase tracking-widest text-on-surface-variant">
                {sectionName}
              </h3>
              <span className="text-xs text-on-surface-variant font-mono">
                ({sectionCode})
              </span>
              <span className="text-xs text-on-surface-variant">
                {sectionNumbers.length}
              </span>
              <div className="flex-1 h-[1px] bg-outline-variant/10 ml-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sectionNumbers.map((num) => {
                const { display } = formatStickerNumber(num, lookup);

                // Colors based on variant and isExtra
                const textColor = isExtra
                  ? "text-tertiary"
                  : variant === "duplicates"
                    ? "text-secondary"
                    : "text-primary";

                const extraStyle = isExtra ? "ring-1 ring-inset ring-tertiary/30" : "";

                return (
                  <div
                    key={num}
                    className={`bg-surface-container-high p-4 rounded-xl flex items-center justify-between group hover:bg-surface-container-highest transition-colors ${extraStyle}`}
                  >
                    <span className={`font-headline font-bold ${textColor}`}>
                      {display}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(num)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive/60 hover:text-destructive"
                      aria-label={`Remover ${display}`}
                    >
                      <Trash2 className="size-4" strokeWidth={2} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}}
    </div>
  );
}

export const StickerListGrouped = memo(StickerListGroupedBase);
