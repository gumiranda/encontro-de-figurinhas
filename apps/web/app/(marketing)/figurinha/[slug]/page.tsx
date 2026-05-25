import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { ArrowRight, ArrowLeft, ArrowRightIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateStickerMetadata,
  generateBreadcrumbSchema,
  generateProductSchema,
  generateStickerFAQSchema,
  generatePersonSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { RelatedStickers } from "@/components/related-stickers";
import { StickerHero } from "@/components/sticker-hero";
import { QuickFactsStrip } from "@/components/quick-facts-strip";
import { TradingStepsSection } from "@/components/trading-steps-section";
import { StickerSEOContent } from "@/components/sticker-seo-content";
import { StickerNavigation } from "@/components/sticker-navigation";

interface StickerPageProps {
  params: Promise<{ slug: string }>;
}

async function loadStickerBySlug(slug: string) {
  "use cache";
  cacheTag(`figurinha:${slug}`);
  cacheLife("days");
  return convexServer.query(api.album.getStickerDetailBySlug, { slug });
}

async function loadRelatedStickers(number: number) {
  "use cache";
  cacheTag(`figurinha:related:${number}`);
  cacheLife("days");
  return convexServer.query(api.album.getRelatedStickers, { number, limit: 8 });
}

async function loadAlbumConfig() {
  "use cache";
  cacheTag("album-config");
  cacheLife("days");
  return convexServer.query(api.album.getPublicAlbumCount, {});
}

async function loadAdjacentSlugs(absoluteNum: number) {
  "use cache";
  cacheTag(`figurinha:adjacent:${absoluteNum}`);
  cacheLife("days");
  return convexServer.query(api.album.getAdjacentStickerSlugs, { absoluteNum });
}

export async function generateMetadata({
  params,
}: StickerPageProps): Promise<Metadata> {
  const { slug } = await params;

  let sticker: Awaited<ReturnType<typeof loadStickerBySlug>>;
  try {
    sticker = await loadStickerBySlug(slug);
  } catch {
    return { title: "Figurinha" };
  }

  if (!sticker) {
    return { title: "Figurinha não encontrada" };
  }

  const relDisplay =
    sticker.relativeNum === 0 ? "00" : String(sticker.relativeNum);
  const displayLabel = `${sticker.sectionCode}-${relDisplay}`;

  const isGoldenSticker = (sticker.isGolden ?? false) || sticker.relativeNum === 1;
  const isLegendSticker = sticker.isLegend ?? false;

  return generateStickerMetadata({
    number: sticker.absoluteNum,
    slug: sticker.slug,
    displayLabel,
    teamName: sticker.sectionName,
    flagEmoji: sticker.flagEmoji ?? "",
    isGolden: isGoldenSticker,
    isLegend: isLegendSticker,
    legendName: sticker.legendName,
    playerName: sticker.name,
    stickerType: sticker.type,
  });
}

export async function generateStaticParams() {
  const stickers = await convexServer.query(api.album.getAllStickerDetailsForSitemap, {});
  if (stickers.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return stickers.map((s) => ({ slug: s.slug }));
}

export default async function StickerPage({ params }: StickerPageProps) {
  const { slug } = await params;

  const [sticker, albumCount] = await Promise.all([
    loadStickerBySlug(slug),
    loadAlbumConfig(),
  ]);

  if (!sticker) {
    notFound();
  }

  const [relatedStickers, adjacentSlugs] = await Promise.all([
    loadRelatedStickers(sticker.absoluteNum),
    loadAdjacentSlugs(sticker.absoluteNum),
  ]);

  const relDisplay =
    sticker.relativeNum === 0 ? "00" : String(sticker.relativeNum);
  const displayLabel = `${sticker.sectionCode}-${relDisplay}`;
  const teamSlug = sticker.sectionCode.toLowerCase();
  const isGoldenSticker = (sticker.isGolden ?? false) || sticker.relativeNum === 1;
  const isLegendSticker = sticker.isLegend ?? false;

  const breadcrumbItems = [
    { label: "Figurinhas", href: "/figurinhas" },
    { label: sticker.sectionName, href: `/selecao/${teamSlug}` },
    { label: displayLabel },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Álbum Copa 2026", url: `${BASE_URL}/album-copa-do-mundo-2026` },
    { name: sticker.sectionName, url: `${BASE_URL}/selecao/${teamSlug}` },
    { name: `Figurinha ${displayLabel}` },
  ]);

  const productSchema = generateProductSchema({
    number: sticker.absoluteNum,
    displayLabel,
    teamName: sticker.sectionName,
    isGolden: isGoldenSticker,
    isLegend: isLegendSticker,
    legendName: sticker.legendName,
    playerName: sticker.name,
    stickerType: sticker.type,
  });

  const faqSchema = generateStickerFAQSchema(
    displayLabel,
    sticker.sectionName,
    sticker.name
  );

  const personSchema = sticker.type === "player" && sticker.name
    ? generatePersonSchema({
        name: sticker.name,
        slug: sticker.slug,
        teamName: sticker.sectionName,
        teamCode: sticker.sectionCode,
        nationality: sticker.sectionName,
        isLegend: isLegendSticker,
      })
    : null;

  const { prevSlug, nextSlug } = adjacentSlugs;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      {personSchema && <JsonLd data={personSchema} />}
      <LandingHeader />
      <main className="min-h-screen">
        {/* Hero Section - Asymmetric with Sticker Visual */}
        <StickerHero
          displayLabel={displayLabel}
          sectionCode={sticker.sectionCode}
          sectionName={sticker.sectionName}
          teamSlug={teamSlug}
          flagEmoji={sticker.flagEmoji ?? ""}
          name={sticker.name}
          type={sticker.type}
          variant={sticker.variant ?? undefined}
          relativeNum={sticker.relativeNum}
          breadcrumbItems={breadcrumbItems}
        />

        {/* Quick Facts Strip */}
        <QuickFactsStrip
          flagEmoji={sticker.flagEmoji ?? ""}
          sectionName={sticker.sectionName}
          sectionCode={sticker.sectionCode}
          displayLabel={displayLabel}
          type={sticker.type}
          relativeNum={sticker.relativeNum}
        />

        {/* Navigation Section */}
        <StickerNavigation
          prevSlug={prevSlug}
          nextSlug={nextSlug}
          currentNumber={sticker.absoluteNum}
          totalStickers={albumCount.totalStickers}
        />

        {/* Trading Steps Section */}
        <TradingStepsSection displayLabel={displayLabel} />

        {/* Related Stickers Section */}
        {relatedStickers && relatedStickers.stickers.length > 0 && (
          <RelatedStickers
            teamName={relatedStickers.teamName}
            teamCode={relatedStickers.teamCode}
            teamSlug={relatedStickers.teamSlug}
            flagEmoji={relatedStickers.flagEmoji}
            stickers={relatedStickers.stickers}
            currentNumber={sticker.absoluteNum}
          />
        )}

        {/* SEO Content with Collapsible FAQ */}
        <StickerSEOContent
          displayLabel={displayLabel}
          sectionName={sticker.sectionName}
          teamSlug={teamSlug}
          playerName={sticker.name}
          type={sticker.type}
          flagEmoji={sticker.flagEmoji ?? ""}
        />

        {/* Final CTA Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">
              Precisa da{" "}
              <span className="font-mono text-primary">{displayLabel}</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Cadastre-se e encontre colecionadores com essa figurinha.
            </p>
            <Button size="lg" asChild className="transition-transform hover:-translate-y-0.5">
              <Link href="/sign-up">
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
