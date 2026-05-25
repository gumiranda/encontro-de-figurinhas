"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@workspace/ui/lib/utils";

interface StickerSEOContentProps {
  displayLabel: string;
  sectionName: string;
  teamSlug: string;
  playerName: string;
  type?: string;
  flagEmoji: string;
}

export function StickerSEOContent({
  displayLabel,
  sectionName,
  teamSlug,
  playerName,
  type,
  flagEmoji,
}: StickerSEOContentProps) {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  const isPlayer = type === "player" || !type;

  const faqs = [
    {
      question: `Como conseguir a figurinha ${displayLabel}?`,
      answer: `A melhor forma de conseguir a figurinha ${displayLabel} é através de trocas com outros colecionadores. No Figurinha Fácil, você marca que precisa dessa figurinha e encontra colecionadores que têm ela repetida para trocar.`,
    },
    {
      question: `Quanto vale a figurinha ${displayLabel}?`,
      answer: `O valor da figurinha ${displayLabel} varia conforme a demanda. No Figurinha Fácil, trocas são sempre 1 por 1 entre colecionadores, sem intermediários ou taxas.`,
    },
    {
      question: `Onde trocar figurinhas da ${sectionName}?`,
      answer: `Você pode trocar figurinhas da ${sectionName} em pontos de troca próximos a você. Cadastre-se no Figurinha Fácil para ver colecionadores ativos em shoppings, bancas e outros locais da sua região.`,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={cn(
            "max-w-3xl mx-auto transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]",
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          )}
        >
          {/* Lead paragraph */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            A figurinha{" "}
            <span className="font-mono font-semibold text-foreground">
              {displayLabel}
            </span>{" "}
            faz parte da coleção da{" "}
            <Link
              href={`/selecao/${teamSlug}`}
              className="text-foreground hover:text-primary hover:underline"
            >
              {sectionName} {flagEmoji}
            </Link>{" "}
            no álbum oficial da Copa do Mundo 2026.
            {isPlayer && playerName && (
              <>
                {" "}
                <strong className="text-foreground">{playerName}</strong> é um
                dos jogadores convocados para representar a {sectionName} no
                mundial.
              </>
            )}
          </p>

          {/* FAQ Collapsibles */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl border border-border/50 bg-background/50 overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-foreground text-left">
                    {faq.question}
                  </span>
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Related team link */}
          <p className="mt-8 text-muted-foreground text-sm">
            Veja todas as{" "}
            <Link
              href={`/selecao/${teamSlug}`}
              className="text-primary hover:underline"
            >
              figurinhas da {sectionName}
            </Link>{" "}
            e encontre as que você precisa para completar a seção.
          </p>
        </div>
      </div>
    </section>
  );
}
