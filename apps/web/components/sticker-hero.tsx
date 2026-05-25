"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { LandingCard } from "@/modules/landing/ui/components/landing-card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { cn } from "@workspace/ui/lib/utils";

interface StickerHeroProps {
  displayLabel: string;
  sectionCode: string;
  sectionName: string;
  teamSlug: string;
  flagEmoji: string;
  name: string;
  type?: string;
  variant?: string;
  relativeNum: number;
  breadcrumbItems: Array<{ label: string; href?: string }>;
}

export function StickerHero({
  displayLabel,
  sectionCode,
  sectionName,
  teamSlug,
  flagEmoji,
  name,
  type,
  variant,
  relativeNum,
  breadcrumbItems,
}: StickerHeroProps) {
  const isLegend = variant === "legend";
  const isGoldenSticker = relativeNum === 1;
  const cardVariant = isLegend ? "sticker-legend" : isGoldenSticker ? "sticker-legend" : "sticker";

  const stickerType = type ?? "player";

  const typeLabel =
    stickerType === "escudo"
      ? "Escudo"
      : stickerType === "team_photo"
        ? "Foto do Time"
        : stickerType === "special"
          ? "Especial"
          : "Jogador";

  const description =
    stickerType === "escudo"
      ? `Escudo oficial da ${sectionName} no álbum Copa 2026.`
      : stickerType === "team_photo"
        ? `Foto oficial do elenco da ${sectionName}.`
        : stickerType === "special"
          ? `Figurinha especial do álbum Copa 2026.`
          : `${name} representa a ${sectionName} na Copa 2026.`;

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Content Column */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Breadcrumbs
              items={breadcrumbItems}
              className="mb-6 animate-fade-in-up"
            />

            {/* Eyebrow */}
            <div
              className="flex items-center gap-2 mb-4 animate-fade-in-up"
              style={{ animationDelay: "50ms" }}
            >
              <Badge variant="outline" className="text-xs uppercase tracking-wider">
                {typeLabel}
              </Badge>
              {isGoldenSticker && (
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-yellow-950 text-xs">
                  {isLegend ? "Lenda" : "Dourada"}
                </Badge>
              )}
            </div>

            {/* Display Label */}
            <div
              className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <span className="text-muted-foreground">{sectionCode}-</span>
              <span className={cn(isGoldenSticker ? "text-[#ffc965]" : "text-foreground")}>
                {displayLabel.split("-")[1]}
              </span>
            </div>

            {/* Player Name */}
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold tracking-tight mb-3 animate-fade-in-up"
              style={{ animationDelay: "150ms" }}
            >
              {name}
            </h1>

            {/* Team Link */}
            <p
              className="text-lg text-muted-foreground mb-6 animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <Link
                href={`/selecao/${teamSlug}`}
                className="hover:text-primary hover:underline inline-flex items-center gap-2"
              >
                <span className="text-2xl">{flagEmoji}</span>
                {sectionName}
              </Link>
              {" · "}Copa do Mundo 2026
            </p>

            {/* Description */}
            <p
              className="text-muted-foreground mb-8 max-w-lg animate-fade-in-up"
              style={{ animationDelay: "250ms" }}
            >
              {description}
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <Button size="lg" asChild className="transition-transform hover:-translate-y-0.5">
                <Link href="/sign-up">
                  Encontrar para trocar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href={`/selecao/${teamSlug}`}>
                  Ver todas da {sectionName}
                </Link>
              </Button>
            </div>
          </div>

          {/* Sticker Visual Column */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div
              className="relative animate-fade-in-scale"
              style={{ animationDelay: "200ms" }}
            >
              {/* Ethereal glow */}
              <div
                className={cn(
                  "absolute -inset-8 blur-3xl -z-10 rounded-full",
                  isGoldenSticker ? "bg-[#ffc965]/15" : "bg-primary/10"
                )}
              />
              <LandingCard
                variant={cardVariant}
                code={displayLabel}
                flag={flagEmoji}
                photoText={stickerType === "player" ? name.split(" ")[0] : stickerType}
                className="w-48 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
