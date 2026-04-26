"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { StickerGrid } from "./sticker-grid";
import { getFlagGradient } from "../../lib/flag-gradients";
import type { ListKind } from "../../lib/use-stickers";

type Section = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
  relStart?: number;
};

type Props = {
  sections: Section[];
  mode: ListKind;
  duplicates: number[];
  missing: number[];
  onToggle: (num: number, action: "add" | "remove") => void;
  onBulkAction: (sectionCode: string, action: "all" | "none" | "invert") => void;
};

export function SectionAccordion({
  sections,
  mode,
  duplicates,
  missing,
  onToggle,
  onBulkAction,
}: Props) {
  // Pré-computa contadores por seção
  const sectionCounts = useMemo(() => {
    const duplicatesSet = new Set(duplicates);
    const missingSet = new Set(missing);

    return sections.map((section) => {
      let dupCount = 0;
      let missCount = 0;
      for (let i = section.startNumber; i <= section.endNumber; i++) {
        if (duplicatesSet.has(i)) dupCount++;
        if (missingSet.has(i)) missCount++;
      }
      const sectionSize = section.endNumber - section.startNumber + 1;
      return {
        code: section.code,
        dupCount,
        missCount,
        total: sectionSize,
      };
    });
  }, [sections, duplicates, missing]);

  const duplicatesSet = useMemo(() => new Set(duplicates), [duplicates]);
  const missingSet = useMemo(() => new Set(missing), [missing]);

  return (
    <TooltipProvider delayDuration={300}>
      <Accordion type="single" collapsible className="space-y-2">
        {sections.map((section, idx) => {
          const counts = sectionCounts[idx];
          if (!counts) return null;

          const flagGradient = getFlagGradient(section.code);
          const activeCount = mode === "duplicates" ? counts.dupCount : counts.missCount;
          const countColor = mode === "duplicates" ? "text-emerald-600" : "text-red-500";

          return (
            <AccordionItem
              key={section.code}
              value={section.code}
              className="border border-outline-variant/20 rounded-xl overflow-hidden bg-surface-container-low"
            >
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-surface-container">
                <div className="flex items-center gap-3 w-full">
                  {/* Flag */}
                  <div className="w-8 h-6 rounded-sm overflow-hidden bg-surface-container-high relative shrink-0">
                    <div className={`absolute inset-0 ${flagGradient} opacity-80`} />
                  </div>

                  {/* Name + Code */}
                  <div className="flex-1 text-left">
                    <span className="font-headline font-bold text-sm uppercase tracking-wider text-on-surface">
                      {section.name}
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono ml-2">
                      ({section.code})
                    </span>
                  </div>

                  {/* Counter */}
                  <div className={`text-sm font-bold ${countColor}`}>
                    {activeCount}/{counts.total}
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">
                {/* Bulk actions */}
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => onBulkAction(section.code, "all")}
                    className="cursor-pointer text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
                  >
                    Marcar todas
                  </button>
                  <button
                    type="button"
                    onClick={() => onBulkAction(section.code, "none")}
                    className="cursor-pointer text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
                  >
                    Desmarcar
                  </button>
                  <button
                    type="button"
                    onClick={() => onBulkAction(section.code, "invert")}
                    className="cursor-pointer text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
                  >
                    Inverter
                  </button>
                </div>

                {/* Grid - só renderiza quando expandido */}
                <StickerGrid
                  mode={mode}
                  sectionCode={section.code}
                  sectionStart={section.startNumber}
                  sectionEnd={section.endNumber}
                  relStart={section.relStart}
                  duplicates={duplicatesSet}
                  missing={missingSet}
                  onToggle={onToggle}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </TooltipProvider>
  );
}
