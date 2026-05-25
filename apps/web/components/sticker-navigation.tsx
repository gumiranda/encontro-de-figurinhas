"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface StickerNavigationProps {
  prevSlug: string | null;
  nextSlug: string | null;
  currentNumber: number;
  totalStickers: number;
}

export function StickerNavigation({
  prevSlug,
  nextSlug,
  currentNumber,
  totalStickers,
}: StickerNavigationProps) {
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
            {prevSlug ? (
              <Link
                href={`/figurinha/${prevSlug}`}
                className="flex items-center gap-3 px-4 py-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Anterior</span>
              </Link>
            ) : (
              <div className="w-24" />
            )}

            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground font-mono">
                {currentNumber === 0 ? "00" : currentNumber} / {totalStickers}
              </span>
              <span className="text-[0.6rem] text-muted-foreground/60 hidden sm:block mt-0.5">
                ← → para navegar
              </span>
            </div>

            {nextSlug ? (
              <Link
                href={`/figurinha/${nextSlug}`}
                className="flex items-center gap-3 px-4 py-2 -mr-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium">Próxima</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="w-24" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
