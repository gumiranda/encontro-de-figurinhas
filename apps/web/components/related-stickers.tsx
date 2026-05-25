"use client";

import Link from "next/link";
import { Star, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";
import { cn } from "@workspace/ui/lib/utils";

interface RelatedSticker {
  number: number;
  relativeNum: number;
  slug: string;
  isGolden: boolean;
  isLegend: boolean;
  legendName?: string | null;
}

interface RelatedStickersProps {
  teamName: string;
  teamCode: string;
  teamSlug: string;
  flagEmoji?: string;
  stickers: RelatedSticker[];
  currentNumber: number;
}

export function RelatedStickers({
  teamName,
  teamCode,
  teamSlug,
  flagEmoji,
  stickers,
  currentNumber,
}: RelatedStickersProps) {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [badgesRef, badgesVisible] = useScrollRevealGroup(stickers.length);

  if (stickers.length === 0) return null;

  return (
    <section className="py-12 md:py-16 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div
            ref={headerRef}
            className={cn(
              "flex items-end justify-between mb-6 flex-wrap gap-4 transition-all duration-500",
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            )}
          >
            <div>
              <h2 className="text-xl md:text-2xl font-headline font-bold flex items-center gap-2">
                {flagEmoji && <span className="text-2xl">{flagEmoji}</span>}
                Outras figurinhas da {teamName}
              </h2>
              <p className="text-muted-foreground mt-1">
                Explore mais figurinhas desta seleção
              </p>
            </div>
            <Link
              href={`/selecao/${teamSlug}`}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todas da {teamName}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div ref={badgesRef} className="flex flex-wrap gap-2">
            {stickers.map((sticker, index) => (
              <Link
                key={sticker.number}
                href={`/figurinha/${sticker.slug}`}
                className={cn(
                  "transition-all duration-300 ease-out",
                  badgesVisible[index]
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                )}
                style={{ transitionDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                <Badge
                  variant={sticker.isGolden || sticker.isLegend ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-transform duration-200 hover:scale-105 text-base px-3 py-1.5",
                    sticker.isGolden && "bg-yellow-500 hover:bg-yellow-600 text-black",
                    sticker.isLegend && "bg-purple-600 hover:bg-purple-700",
                    !sticker.isGolden && !sticker.isLegend && "hover:bg-primary hover:text-primary-foreground"
                  )}
                  title={sticker.legendName ?? undefined}
                >
                  {teamCode}-{sticker.relativeNum}
                  {sticker.isGolden && <Star className="h-3 w-3 ml-1 fill-current" />}
                  {sticker.isLegend && <Sparkles className="h-3 w-3 ml-1" />}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
