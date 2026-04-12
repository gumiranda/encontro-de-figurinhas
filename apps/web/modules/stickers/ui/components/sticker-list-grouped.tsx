"use client";

import { Trash2 } from "lucide-react";
import { useMemo } from "react";
import {
  formatStickerNumber,
  groupBySections,
  type Section,
} from "../../lib/sticker-parser";

// Flag gradients for known countries
const FLAG_GRADIENTS: Record<string, string> = {
  // Hosts
  EUA: "bg-gradient-to-br from-blue-900 via-red-500 to-white",
  Canadá: "bg-gradient-to-r from-red-600 via-white to-red-600",
  México: "bg-gradient-to-r from-green-600 via-white to-red-600",
  // Grupo A
  "África do Sul": "bg-gradient-to-br from-green-600 via-yellow-400 to-blue-700",
  "Coreia do Sul": "bg-gradient-to-br from-white via-red-500 to-blue-700",
  Tchéquia: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  // Grupo B
  "Bósnia e Herzegovina": "bg-gradient-to-br from-blue-700 to-yellow-400",
  Catar: "bg-gradient-to-r from-white to-rose-800",
  Suíça: "bg-gradient-to-br from-red-600 to-red-700",
  // Grupo C
  Brasil: "bg-gradient-to-br from-green-500 to-yellow-400",
  Marrocos: "bg-gradient-to-b from-red-600 via-red-700 to-green-700",
  Haiti: "bg-gradient-to-b from-blue-800 to-red-600",
  Escócia: "bg-gradient-to-br from-blue-700 to-blue-900",
  // Grupo D
  Paraguai: "bg-gradient-to-b from-red-600 via-white to-blue-700",
  Austrália: "bg-gradient-to-br from-blue-800 to-yellow-400",
  Turquia: "bg-gradient-to-br from-red-600 to-red-700",
  // Grupo E
  Alemanha: "bg-gradient-to-b from-black via-red-600 to-yellow-400",
  Curaçao: "bg-gradient-to-br from-blue-700 to-yellow-400",
  "Costa do Marfim": "bg-gradient-to-r from-orange-500 via-white to-green-600",
  Equador: "bg-gradient-to-b from-yellow-400 via-blue-700 to-red-600",
  // Grupo F
  Holanda: "bg-gradient-to-b from-red-500 via-white to-blue-600",
  Japão: "bg-gradient-to-br from-white to-red-600",
  Suécia: "bg-gradient-to-br from-blue-600 to-yellow-400",
  Tunísia: "bg-gradient-to-br from-red-600 to-red-700",
  // Grupo G
  Bélgica: "bg-gradient-to-r from-black via-yellow-400 to-red-600",
  Egito: "bg-gradient-to-b from-red-600 via-white to-black",
  Irã: "bg-gradient-to-b from-green-600 via-white to-red-600",
  "Nova Zelândia": "bg-gradient-to-br from-blue-900 to-red-600",
  // Grupo H
  Espanha: "bg-gradient-to-b from-red-600 via-yellow-400 to-red-600",
  "Cabo Verde": "bg-gradient-to-br from-blue-800 via-white to-red-600",
  "Arábia Saudita": "bg-gradient-to-br from-green-700 to-green-600",
  Uruguai: "bg-gradient-to-br from-white via-blue-400 to-blue-600",
  // Grupo I
  França: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  Senegal: "bg-gradient-to-r from-green-600 via-yellow-400 to-red-600",
  Iraque: "bg-gradient-to-b from-red-600 via-white to-black",
  Noruega: "bg-gradient-to-br from-red-600 via-white to-blue-800",
  // Grupo J
  Argentina: "bg-gradient-to-b from-blue-300 via-white to-blue-300",
  Argélia: "bg-gradient-to-r from-green-600 to-white",
  Áustria: "bg-gradient-to-b from-red-600 via-white to-red-600",
  Jordânia: "bg-gradient-to-r from-black via-green-600 to-red-600",
  // Grupo K
  Portugal: "bg-gradient-to-r from-green-600 to-red-600",
  "RD Congo": "bg-gradient-to-br from-blue-600 via-yellow-400 to-red-600",
  Uzbequistão: "bg-gradient-to-b from-blue-500 via-white to-green-600",
  Colômbia: "bg-gradient-to-b from-yellow-400 via-blue-700 to-red-600",
  // Grupo L
  Inglaterra: "bg-gradient-to-br from-white to-red-600",
  Croácia: "bg-gradient-to-b from-red-600 via-white to-blue-700",
  Gana: "bg-gradient-to-b from-red-600 via-yellow-400 to-green-700",
  Panamá: "bg-gradient-to-br from-blue-600 via-white to-red-600",
  // Extras
  Extras: "bg-gradient-to-br from-yellow-400 to-orange-500",
};
const getFlagGradient = (name: string) =>
  FLAG_GRADIENTS[name] ?? "bg-gradient-to-br from-gray-500 to-gray-600";

type Props = {
  numbers: number[];
  sections: Section[];
  onRemove: (num: number) => void;
  variant?: "duplicates" | "missing";
};

export function StickerListGrouped({
  numbers,
  sections,
  onRemove,
  variant = "duplicates",
}: Props) {
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
                <div
                  className={`absolute inset-0 ${getFlagGradient(sectionName)} opacity-80`}
                />
              </div>
              <h3 className="font-headline font-bold text-base uppercase tracking-widest text-on-surface-variant">
                {sectionName}
              </h3>
              <span className="text-xs text-on-surface-variant">
                ({sectionNumbers.length})
              </span>
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
                    <span className={`font-headline font-bold ${textColor}`}>
                      {display}
                    </span>
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
