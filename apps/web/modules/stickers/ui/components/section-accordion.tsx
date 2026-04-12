"use client";

import { useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { StickerGrid } from "./sticker-grid";

// Flag gradients by FIFA code
const FLAG_GRADIENTS: Record<string, string> = {
  USA: "bg-gradient-to-br from-blue-900 via-red-500 to-white",
  CAN: "bg-gradient-to-r from-red-600 via-white to-red-600",
  MEX: "bg-gradient-to-r from-green-600 via-white to-red-600",
  RSA: "bg-gradient-to-br from-green-600 via-yellow-400 to-blue-700",
  KOR: "bg-gradient-to-br from-white via-red-500 to-blue-700",
  CZE: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  BIH: "bg-gradient-to-br from-blue-700 to-yellow-400",
  QAT: "bg-gradient-to-r from-white to-rose-800",
  SUI: "bg-gradient-to-br from-red-600 to-red-700",
  BRA: "bg-gradient-to-br from-green-500 to-yellow-400",
  MAR: "bg-gradient-to-b from-red-600 via-red-700 to-green-700",
  HAI: "bg-gradient-to-b from-blue-800 to-red-600",
  SCO: "bg-gradient-to-br from-blue-700 to-blue-900",
  PAR: "bg-gradient-to-b from-red-600 via-white to-blue-700",
  AUS: "bg-gradient-to-br from-blue-800 to-yellow-400",
  TUR: "bg-gradient-to-br from-red-600 to-red-700",
  GER: "bg-gradient-to-b from-black via-red-600 to-yellow-400",
  CUW: "bg-gradient-to-br from-blue-700 to-yellow-400",
  CIV: "bg-gradient-to-r from-orange-500 via-white to-green-600",
  ECU: "bg-gradient-to-b from-yellow-400 via-blue-700 to-red-600",
  NED: "bg-gradient-to-b from-red-500 via-white to-blue-600",
  JPN: "bg-gradient-to-br from-white to-red-600",
  SWE: "bg-gradient-to-br from-blue-600 to-yellow-400",
  TUN: "bg-gradient-to-br from-red-600 to-red-700",
  BEL: "bg-gradient-to-r from-black via-yellow-400 to-red-600",
  EGY: "bg-gradient-to-b from-red-600 via-white to-black",
  IRN: "bg-gradient-to-b from-green-600 via-white to-red-600",
  NZL: "bg-gradient-to-br from-blue-900 to-red-600",
  ESP: "bg-gradient-to-b from-red-600 via-yellow-400 to-red-600",
  CPV: "bg-gradient-to-br from-blue-800 via-white to-red-600",
  KSA: "bg-gradient-to-br from-green-700 to-green-600",
  URU: "bg-gradient-to-br from-white via-blue-400 to-blue-600",
  FRA: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  SEN: "bg-gradient-to-r from-green-600 via-yellow-400 to-red-600",
  IRQ: "bg-gradient-to-b from-red-600 via-white to-black",
  NOR: "bg-gradient-to-br from-red-600 via-white to-blue-800",
  ARG: "bg-gradient-to-b from-blue-300 via-white to-blue-300",
  ALG: "bg-gradient-to-r from-green-600 to-white",
  AUT: "bg-gradient-to-b from-red-600 via-white to-red-600",
  JOR: "bg-gradient-to-r from-black via-green-600 to-red-600",
  POR: "bg-gradient-to-r from-green-600 to-red-600",
  COD: "bg-gradient-to-br from-blue-600 via-yellow-400 to-red-600",
  UZB: "bg-gradient-to-b from-blue-500 via-white to-green-600",
  COL: "bg-gradient-to-b from-yellow-400 via-blue-700 to-red-600",
  ENG: "bg-gradient-to-br from-white to-red-600",
  CRO: "bg-gradient-to-b from-red-600 via-white to-blue-700",
  GHA: "bg-gradient-to-b from-red-600 via-yellow-400 to-green-700",
  PAN: "bg-gradient-to-br from-blue-600 via-white to-red-600",
  EXT: "bg-gradient-to-br from-yellow-400 to-orange-500",
};

type Section = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
};

type Props = {
  sections: Section[];
  mode: "duplicates" | "missing";
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
    <Accordion type="single" collapsible className="space-y-2">
      {sections.map((section, idx) => {
        const counts = sectionCounts[idx];
        if (!counts) return null;

        const flagGradient = FLAG_GRADIENTS[section.code] ?? "bg-gradient-to-br from-gray-500 to-gray-600";
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
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
                >
                  Marcar todas
                </button>
                <button
                  type="button"
                  onClick={() => onBulkAction(section.code, "none")}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
                >
                  Desmarcar
                </button>
                <button
                  type="button"
                  onClick={() => onBulkAction(section.code, "invert")}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
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
                duplicates={duplicatesSet}
                missing={missingSet}
                onToggle={onToggle}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
