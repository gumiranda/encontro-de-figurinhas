import Link from "next/link";
import { Star, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

interface RelatedSticker {
  number: number;
  relativeNum: number;
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
  if (stickers.length === 0) return null;

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
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

          <div className="flex flex-wrap gap-2">
            {stickers.map((sticker) => (
              <Link key={sticker.number} href={`/figurinha/${sticker.number}`}>
                <Badge
                  variant={sticker.isGolden || sticker.isLegend ? "default" : "outline"}
                  className={`
                    cursor-pointer transition-transform duration-200 hover:scale-105 text-base px-3 py-1.5
                    ${sticker.isGolden ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                    ${sticker.isLegend ? "bg-purple-600 hover:bg-purple-700" : ""}
                    ${!sticker.isGolden && !sticker.isLegend ? "hover:bg-primary hover:text-primary-foreground" : ""}
                  `}
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
