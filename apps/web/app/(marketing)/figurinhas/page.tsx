import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { ArrowRight, Star, Trophy, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateStickersHubMetadata,
  generateBreadcrumbSchema,
  generateItemListSchema,
  generateCombinedSchema,
  generateSportsEventSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StickersHubClient } from "@/components/stickers-hub-client";

export const metadata: Metadata = generateStickersHubMetadata();

async function loadTeams() {
  "use cache";
  cacheTag("album");
  cacheLife("hours");
  return convexServer.query(api.album.getSections, {});
}

export default async function StickersHubPage() {
  const teams = await loadTeams();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Figurinhas" },
  ]);

  const itemListSchema = generateItemListSchema(
    "Figurinhas da Copa do Mundo 2026",
    "Lista completa das 980 figurinhas do álbum oficial Panini da Copa do Mundo FIFA 2026, organizadas por seleção.",
    teams.map((t) => ({
      name: `Figurinhas ${t.name} ${t.flagEmoji}`,
      url: `${BASE_URL}/selecao/${t.slug}`,
      description: `${t.stickerCount} figurinhas, ${t.goldenNumbers.length} douradas`,
    }))
  );

  const combinedSchema = generateCombinedSchema([breadcrumbSchema, itemListSchema, generateSportsEventSchema()]);

  const totalStickers = teams.reduce((acc, t) => acc + t.stickerCount, 0);
  const totalGolden = teams.reduce((acc, t) => acc + t.goldenNumbers.length, 0);
  const totalLegends = teams.reduce((acc, t) => acc + t.legendNumbers.length, 0);

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumbs items={[{ label: "Figurinhas" }]} className="mb-8" />

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Todas as{" "}
                <span className="text-primary">{totalStickers} Figurinhas</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Lista completa das figurinhas do álbum da Copa do Mundo 2026.
                Clique em qualquer figurinha para ver detalhes e encontrar quem
                tem para trocar.
              </p>

              <div className="flex flex-wrap gap-4">
                <Badge variant="secondary" className="text-sm py-1.5 px-3">
                  <Sparkles className="h-4 w-4 mr-1" />
                  {totalStickers} figurinhas
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-1.5 px-3 text-yellow-600 border-yellow-600"
                >
                  <Star className="h-4 w-4 mr-1 fill-yellow-600" />
                  {totalGolden} douradas
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-1.5 px-3 text-purple-600 border-purple-600"
                >
                  <Trophy className="h-4 w-4 mr-1" />
                  {totalLegends} lendas
                </Badge>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <StickersHubClient teams={teams} />
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Quais figurinhas você precisa?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre suas repetidas e faltantes. O sistema encontra
              automaticamente colecionadores com as figurinhas que você precisa.
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
