"use client";

import Link from "next/link";
import { Star, Sparkles } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface Sticker {
  slug: string;
  displayCode: string;
  name: string | null;
  type: string | undefined;
  variant: string | null | undefined;
  relativeNum: number;
}

interface TeamStickerGridProps {
  stickers: Sticker[];
  sectionCode: string;
  flagEmoji: string;
}

export function TeamStickerGrid({
  stickers,
  sectionCode,
  flagEmoji,
}: TeamStickerGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
      {stickers.map((sticker, index) => {
        const isGolden = sticker.relativeNum === 1;
        const isLegend = sticker.variant === "legend";
        const displayNum = sticker.relativeNum === 0 ? "00" : sticker.relativeNum;

        return (
          <Link
            key={sticker.slug}
            href={`/figurinha/${sticker.slug}`}
            className={cn(
              "group relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200",
              "hover:-translate-y-0.5 hover:shadow-lg",
              isGolden || isLegend
                ? "border-[#ffc965]/40 bg-gradient-to-b from-[#3a2f0c]/50 to-[#1a1408]/50 hover:border-[#ffc965]/60 hover:shadow-[0_0_20px_rgba(255,201,101,0.15)]"
                : isLegend
                  ? "border-purple-500/40 bg-gradient-to-b from-purple-900/20 to-purple-950/20 hover:border-purple-500/60"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5"
            )}
            style={{ animationDelay: `${Math.min(index * 20, 500)}ms` }}
          >
            {(isGolden || isLegend) && (
              <div className="absolute -top-1 -right-1">
                {isGolden ? (
                  <Star className="h-3 w-3 text-[#ffc965] fill-[#ffc965]" />
                ) : (
                  <Sparkles className="h-3 w-3 text-purple-400" />
                )}
              </div>
            )}

            <span
              className={cn(
                "font-mono text-xs font-bold tracking-tight",
                isGolden || isLegend ? "text-[#ffc965]" : "text-foreground"
              )}
            >
              {sectionCode}-{displayNum}
            </span>

            {sticker.name && (
              <span className="text-[0.6rem] text-muted-foreground truncate max-w-full mt-0.5">
                {sticker.name.split(" ")[0]}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
