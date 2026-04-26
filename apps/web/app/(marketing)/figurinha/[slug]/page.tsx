import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, ArrowLeft, ArrowRightIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateStickerMetadata,
  generateBreadcrumbSchema,
  generateProductSchema,
  generateStickerFAQSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RelatedStickers } from "@/components/related-stickers";

// ISR: revalidate every 24 hours
export const revalidate = 86400;

// Only pre-generated slugs, unknown slugs → 404 immediately
export const dynamicParams = false;

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

  return generateStickerMetadata({
    number: sticker.absoluteNum,
    slug: sticker.slug,
    displayLabel,
    teamName: sticker.sectionName,
    flagEmoji: sticker.flagEmoji ?? "",
    isGolden: false,
    isLegend: false,
    legendName: undefined,
    playerName: sticker.name,
    stickerType: sticker.type,
  });
}

export async function generateStaticParams() {
  const stickers = await convexServer.query(api.album.getAllStickerDetailsForSitemap, {});
  return stickers.map((s) => ({ slug: s.slug }));
}

export default async function StickerPage({ params }: StickerPageProps) {
  const { slug } = await params;

  const [sticker, albumConfig] = await Promise.all([
    loadStickerBySlug(slug),
    loadAlbumConfig(),
  ]);

  if (!sticker) {
    notFound();
  }

  const relatedStickers = await loadRelatedStickers(sticker.absoluteNum);

  const relDisplay =
    sticker.relativeNum === 0 ? "00" : String(sticker.relativeNum);
  const displayLabel = `${sticker.sectionCode}-${relDisplay}`;
  const teamSlug = sticker.sectionCode.toLowerCase();

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
    isGolden: false,
    isLegend: false,
    legendName: undefined,
    playerName: sticker.name,
    stickerType: sticker.type,
  });

  const faqSchema = generateStickerFAQSchema(
    displayLabel,
    sticker.sectionName,
    sticker.name
  );

  // Prev/next use number URLs (middleware redirects to slug)
  const prevNumber = sticker.absoluteNum > 0 ? sticker.absoluteNum - 1 : null;
  const nextNumber =
    sticker.absoluteNum < albumConfig.totalStickers - 1
      ? sticker.absoluteNum + 1
      : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <JsonLd data={faqSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={breadcrumbItems} className="mb-8" />

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-5xl">{sticker.flagEmoji}</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {displayLabel}
                </Badge>
                {sticker.variant && sticker.variant !== "base" && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-yellow-400 text-yellow-950">
                    <Star className="h-3 w-3 mr-1" />
                    {sticker.variant.charAt(0).toUpperCase() + sticker.variant.slice(1)}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-4">
                {sticker.name}
                <span className="block text-xl font-normal text-muted-foreground mt-2">
                  {displayLabel} - {sticker.sectionName}
                </span>
              </h1>

              <p className="text-xl text-muted-foreground mb-2">
                <Link
                  href={`/selecao/${teamSlug}`}
                  className="hover:text-primary hover:underline"
                >
                  {sticker.sectionName}
                </Link>{" "}
                - Copa do Mundo 2026
              </p>

              <p className="text-lg text-muted-foreground mb-8">
                {sticker.type === "escudo"
                  ? `Escudo oficial da seleção ${sticker.sectionName} no álbum Copa do Mundo 2026.`
                  : sticker.type === "team_photo"
                    ? `Foto oficial do elenco da ${sticker.sectionName} para a Copa 2026.`
                    : sticker.type === "special"
                      ? `Figurinha especial do álbum Copa do Mundo 2026.`
                      : `${sticker.name}, jogador da seleção ${sticker.sectionName}. Figurinha ${displayLabel} do álbum Copa 2026.`}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Encontrar para trocar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/selecao/${teamSlug}`}>
                    Ver todas da {sticker.sectionName}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center max-w-xl mx-auto">
              {prevNumber ? (
                <Link
                  href={`/figurinha/${prevNumber}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Anterior</span>
                </Link>
              ) : (
                <div />
              )}
              <span className="text-sm text-muted-foreground">
                {displayLabel} (
                {sticker.absoluteNum === 0 ? "00" : sticker.absoluteNum} de{" "}
                {albumConfig.totalStickers})
              </span>
              {nextNumber ? (
                <Link
                  href={`/figurinha/${nextNumber}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <span>Próxima</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{sticker.flagEmoji}</span>
                    Seleção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{sticker.sectionName}</p>
                  <p className="text-sm text-muted-foreground">
                    Código FIFA: {sticker.sectionCode}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-lg font-semibold capitalize">
                    {sticker.type === "team_photo" ? "Foto do Time" : sticker.type ?? "Jogador"}
                  </span>
                  {sticker.variant && sticker.variant !== "base" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Variante: {sticker.variant}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Como trocar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Cadastre-se grátis</li>
                    <li>2. Marque como "tenho" ou "preciso"</li>
                    <li>3. Encontre um match</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Sobre a figurinha {displayLabel}</h2>
              <p>
                A figurinha {displayLabel} faz parte da coleção da{" "}
                <Link href={`/selecao/${teamSlug}`}>{sticker.sectionName}</Link>{" "}
                {sticker.flagEmoji} no álbum oficial da Copa do Mundo 2026.
                {sticker.type === "player" && (
                  <>
                    {" "}<strong>{sticker.name}</strong> é um dos jogadores convocados
                    para representar a {sticker.sectionName} no mundial.
                  </>
                )}
              </p>

              <h3>Como conseguir a figurinha {displayLabel}</h3>
              <p>
                A melhor forma de conseguir a figurinha {displayLabel} é através de
                trocas com outros colecionadores. No Figurinha Fácil, você pode:
              </p>
              <ul>
                <li>
                  Marcar que precisa da figurinha {displayLabel} no seu perfil
                </li>
                <li>
                  Encontrar colecionadores que têm ela repetida
                </li>
                <li>
                  Combinar uma troca presencial em um ponto de troca seguro
                </li>
              </ul>

              <h3>Outras figurinhas da {sticker.sectionName}</h3>
              <p>
                A {sticker.sectionName} possui diversas figurinhas no álbum da Copa
                2026.{" "}
                <Link href={`/selecao/${teamSlug}`}>
                  Veja todas as figurinhas da {sticker.sectionName}
                </Link>{" "}
                e encontre as que você precisa para completar a seção.
              </p>
            </div>
          </div>
        </section>

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

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Precisa da figurinha {displayLabel}?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e encontre colecionadores que têm essa
              figurinha para trocar.
            </p>
            <Button size="lg" asChild>
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
