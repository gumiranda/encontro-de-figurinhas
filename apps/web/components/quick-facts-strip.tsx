"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@workspace/ui/lib/utils";

interface QuickFactsStripProps {
  flagEmoji: string;
  sectionName: string;
  sectionCode: string;
  displayLabel: string;
  type?: string;
  relativeNum: number;
}

export function QuickFactsStrip({
  flagEmoji,
  sectionName,
  sectionCode,
  displayLabel,
  type,
  relativeNum,
}: QuickFactsStripProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  const stickerType = type ?? "player";
  const isGoldenSticker = relativeNum === 1;

  const typeLabel =
    stickerType === "escudo"
      ? "Escudo"
      : stickerType === "team_photo"
        ? "Foto do Time"
        : stickerType === "special"
          ? "Especial"
          : "Jogador";

  const typeIcon =
    stickerType === "escudo"
      ? "🛡️"
      : stickerType === "team_photo"
        ? "📸"
        : stickerType === "special"
          ? "✨"
          : "⚽";

  return (
    <section className="py-5 md:py-6 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={cn(
            "flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm transition-all duration-500",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          {/* Team */}
          <div className="flex items-center gap-2">
            <span className="text-xl">{flagEmoji}</span>
            <span className="text-muted-foreground">{sectionName}</span>
          </div>

          <span className="hidden sm:inline text-border">•</span>

          {/* Type */}
          <div className="flex items-center gap-2">
            <span className="text-base">{typeIcon}</span>
            <span className="text-muted-foreground">{typeLabel}</span>
          </div>

          <span className="hidden sm:inline text-border">•</span>

          {/* Code */}
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground">
              {displayLabel}
            </span>
            <span className="text-muted-foreground text-xs">
              ({sectionCode})
            </span>
          </div>

          {isGoldenSticker && (
            <>
              <span className="hidden sm:inline text-border">•</span>
              <div className="flex items-center gap-2">
                <span className="text-base">✨</span>
                <span className="text-[#ffc965] font-medium">Dourada</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
