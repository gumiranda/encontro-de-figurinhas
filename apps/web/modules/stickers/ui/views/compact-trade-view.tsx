"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@workspace/ui/components/button";
import { useStickers } from "../../lib/use-stickers";
import { CompactSectionRow } from "../components/compact-section-row";

const SECTION_EMOJI: Record<string, string> = {
  BRA: "🇧🇷",
  ARG: "🇦🇷",
  FRA: "🇫🇷",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  ESP: "🇪🇸",
  GER: "🇩🇪",
  POR: "🇵🇹",
  USA: "🇺🇸",
  CAN: "🇨🇦",
  MEX: "🇲🇽",
  JPN: "🇯🇵",
  KOR: "🇰🇷",
  NED: "🇳🇱",
  BEL: "🇧🇪",
  SUI: "🇨🇭",
  CRO: "🇭🇷",
  RSA: "🇿🇦",
  CZE: "🇨🇿",
  QAT: "🇶🇦",
  BIH: "🇧🇦",
  MAR: "🇲🇦",
  HAI: "🇭🇹",
  SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  PAR: "🇵🇾",
  AUS: "🇦🇺",
  TUR: "🇹🇷",
  CUW: "🇨🇼",
  CIV: "🇨🇮",
  ECU: "🇪🇨",
  SWE: "🇸🇪",
  TUN: "🇹🇳",
  EGY: "🇪🇬",
  IRN: "🇮🇷",
  NZL: "🇳🇿",
  CPV: "🇨🇻",
  KSA: "🇸🇦",
  URU: "🇺🇾",
  SEN: "🇸🇳",
  NOR: "🇳🇴",
  IRQ: "🇮🇶",
  ALG: "🇩🇿",
  AUT: "🇦🇹",
  JOR: "🇯🇴",
  UZB: "🇺🇿",
  COL: "🇨🇴",
  COD: "🇨🇩",
  GHA: "🇬🇭",
  PAN: "🇵🇦",
  EXT: "⭐️",
  "CC-LAM": "🥤",
};

export function CompactTradeView() {
  const router = useRouter();
  const { missing, sections, isLoading, removeMissing } = useStickers();

  const missingSet = useMemo(() => new Set(missing), [missing]);

  const sectionsWithMissing = useMemo(() => {
    if (!sections.length) return [];

    return sections
      .map((section) => {
        const missingInSection: number[] = [];
        for (let n = section.startNumber; n <= section.endNumber; n++) {
          if (missingSet.has(n)) {
            missingInSection.push(n);
          }
        }
        return {
          ...section,
          emoji: SECTION_EMOJI[section.code.toUpperCase()] ?? "🎫",
          missingNumbers: missingInSection,
        };
      })
      .filter((s) => s.missingNumbers.length > 0);
  }, [sections, missingSet]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-outline-variant/40 bg-background/95 px-4 py-3 backdrop-blur">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => router.back()}
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <h1 className="font-headline text-base font-black uppercase tracking-tight">
            Minhas Faltantes
          </h1>
          <p className="text-xs text-muted-foreground">
            {missing.length} figurinhas · Toque para marcar como obtida
          </p>
        </div>
      </header>

      <main className="px-4 pb-20 pt-2">
        {sectionsWithMissing.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              Nenhuma figurinha faltante!
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cadastre suas faltantes na tela principal.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-x-3 gap-y-2">
            {sectionsWithMissing.map((section) => (
              <CompactSectionRow
                key={`${section.code}-${section.startNumber}`}
                sectionCode={section.code}
                emoji={section.emoji}
                startNumber={section.startNumber}
                relStart={section.relStart}
                missingNumbers={section.missingNumbers}
                onRemove={removeMissing}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
