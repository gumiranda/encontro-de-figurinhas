import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { MapPin, ArrowRight, Store } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateTradePointsHubMetadata,
  generateBreadcrumbSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = generateTradePointsHubMetadata();

async function loadTradePoints() {
  "use cache";
  cacheTag("trade-points");
  cacheLife("hours");
  return convexServer.query(api.tradePoints.listApprovedGroupedByCity, {});
}

export default async function TradePointsHubPage() {
  const groupedPoints = await loadTradePoints();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Pontos de Troca" },
  ]);

  const totalPoints = groupedPoints.reduce(
    (acc, g) => acc + g.points.length,
    0
  );

  const pointsByState = groupedPoints.reduce<
    Record<string, typeof groupedPoints>
  >((acc, g) => {
    if (!acc[g.state]) acc[g.state] = [];
    acc[g.state]!.push(g);
    return acc;
  }, {});

  const statesSorted = Object.keys(pointsByState).sort();

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">Pontos de Troca</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                <span className="text-primary">{totalPoints} Pontos</span> de
                Troca
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Locais verificados para trocar figurinhas da Copa do Mundo 2026.
                Shoppings, praças, escolas e eventos em todo o Brasil.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {totalPoints === 0 ? (
              <div className="text-center py-16">
                <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-headline font-bold mb-4">
                  Nenhum ponto de troca ainda
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Seja o primeiro a cadastrar um ponto de troca na sua cidade!
                </p>
                <Button asChild>
                  <Link href="/ponto/solicitar">Sugerir ponto de troca</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {statesSorted.map((state) => (
                  <Card key={state}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {state}
                        <Badge variant="secondary" className="ml-2">
                          {pointsByState[state]!.reduce(
                            (acc, g) => acc + g.points.length,
                            0
                          )}{" "}
                          pontos
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pointsByState[state]!.map((city) => (
                          <div key={city.citySlug}>
                            <Link
                              href={`/cidade/${city.citySlug}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {city.cityName}
                            </Link>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {city.points.map((point) => (
                                <Link
                                  key={point.slug}
                                  href={`/ponto/${point.slug}`}
                                >
                                  <Badge
                                    variant="outline"
                                    className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                                  >
                                    {point.name}
                                  </Badge>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Conhece um bom lugar para trocar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Sugira um ponto de troca na sua cidade. Após aprovação, ele
              aparecerá no mapa para todos os colecionadores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild>
                <Link href="/ponto/solicitar">Sugerir ponto de troca</Link>
              </Button>
              <Button size="lg" asChild>
                <Link href="/sign-up">
                  Criar conta grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
