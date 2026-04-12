"use client";

import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { groupBySections, formatStickerNumber, type Section } from "../../lib/sticker-parser";

// Flag gradients for known countries
const FLAG_GRADIENTS: Record<string, string> = {
  Brasil: "bg-gradient-to-br from-green-500 to-yellow-400",
  Argentina: "bg-gradient-to-b from-blue-300 via-white to-blue-300",
  Franca: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  França: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  EUA: "bg-gradient-to-br from-blue-900 via-red-500 to-white",
  Canada: "bg-gradient-to-r from-red-600 via-white to-red-600",
  Canadá: "bg-gradient-to-r from-red-600 via-white to-red-600",
  Mexico: "bg-gradient-to-r from-green-600 via-white to-red-600",
  México: "bg-gradient-to-r from-green-600 via-white to-red-600",
  Alemanha: "bg-gradient-to-b from-black via-red-600 to-yellow-400",
  Espanha: "bg-gradient-to-b from-red-600 via-yellow-400 to-red-600",
  Italia: "bg-gradient-to-r from-green-600 via-white to-red-600",
  Inglaterra: "bg-gradient-to-br from-white to-red-600",
  Portugal: "bg-gradient-to-r from-green-600 to-red-600",
  Holanda: "bg-gradient-to-b from-red-500 via-white to-blue-600",
  Belgica: "bg-gradient-to-r from-black via-yellow-400 to-red-600",
  Extras: "bg-gradient-to-br from-yellow-400 to-orange-500",
};

const getFlagGradient = (name: string) => FLAG_GRADIENTS[name] ?? "bg-gradient-to-br from-gray-500 to-gray-600";

type Props = {
  numbers: number[];
  sections: Section[];
  onRemove: (num: number) => void;
  variant?: "duplicates" | "missing";
};

export function StickerListGrouped({ numbers, sections, onRemove, variant = "duplicates" }: Props) {
  const grouped = useMemo(() => groupBySections(numbers, sections), [numbers, sections]);

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
      {Array.from(grouped.entries()).map(([sectionName, sectionNumbers]) => {
        const section = sections.find((s) => s.name === sectionName);
        const isExtra = section?.isExtra ?? false;

        return (
          <div key={sectionName} className="relative">
            {/* Section header with flag */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-6 rounded-sm overflow-hidden bg-surface-container-high relative">
                <div className={`absolute inset-0 ${getFlagGradient(sectionName)} opacity-80`} />
              </div>
              <h3 className="font-headline font-bold text-base uppercase tracking-widest text-on-surface-variant">
                {sectionName}
              </h3>
              <span className="text-xs text-on-surface-variant">({sectionNumbers.length})</span>
              <div className="flex-1 h-[1px] bg-outline-variant/10 ml-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sectionNumbers.map((num) => {
                const { display } = formatStickerNumber(num, sections);

                // Colors based on variant and isExtra
                const textColor = isExtra
                  ? "text-tertiary"
                  : variant === "duplicates"
                    ? "text-secondary"
                    : "text-primary";

                const borderStyle = isExtra ? "border-l-4 border-tertiary" : "";

                return (
                  <div
                    key={num}
                    className={`bg-surface-container-high p-4 rounded-xl flex items-center justify-between group hover:bg-surface-container-highest transition-colors ${borderStyle}`}
                  >
                    <span className={`font-headline font-bold ${textColor}`}>{display}</span>
                    <button
                      type="button"
                      onClick={() => onRemove(num)}
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
      })}
    </div>
  );
}
