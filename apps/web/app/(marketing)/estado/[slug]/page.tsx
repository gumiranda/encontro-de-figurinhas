import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Users, ArrowRight, Store, Building2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateStateMetadata,
  generateBreadcrumbSchema,
  generateStateSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { STATES } from "@/modules/landing/lib/landing-data";

interface StatePageProps {
  params: Promise<{ slug: string }>;
}

function getStaticState(slug: string) {
  return STATES.find((s) => s.slug === slug) ?? null;
}

function getAllStaticStates() {
  return STATES.map((s) => ({ slug: s.slug, code: s.code, name: s.name }));
}

export function generateStaticParams() {
  return STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: StatePageProps): Promise<Metadata> {
  const { slug } = await params;
  const state = getStaticState(slug);

  if (!state) {
    return { title: "Estado não encontrado" };
  }

  const collectorsNum = parseInt(state.collectors.replace(/\D/g, "")) * (state.collectors.includes("k") ? 1000 : 1);
  return generateStateMetadata(state.name, state.slug, state.cities, collectorsNum);
}

export default async function StatePage({ params }: StatePageProps) {
  const { slug } = await params;
  const state = getStaticState(slug);

  if (!state) {
    notFound();
  }

  const citiesCount = state.cities;
  const collectorsCount = state.collectors;
  const tradePointsCount = state.points;
  const topCities: { slug: string; name: string; collectorsCount: number }[] = [];

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Estados", url: `${BASE_URL}/estados` },
    { name: state.name },
  ]);

  const stateSchema = generateStateSchema(state.name, state.slug);

  const otherStates = getAllStaticStates()
    .filter((s) => s.slug !== state.slug)
    .slice(0, 8);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={stateSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
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
                <li className="text-foreground font-medium">{state.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-primary mb-4">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">{state.code}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Troca de Figurinhas em{" "}
                <span className="text-primary">{state.name}</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Encontre colecionadores e pontos de troca de figurinhas em todo
                o estado de {state.name}. Conecte-se com outros apaixonados por
                figurinhas e complete seu álbum da Copa 2026.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/cadastrar-figurinhas/quick">
                    Cadastrar figurinhas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pontos">Ver pontos de troca</Link>
                </Button>
              </div>

              {(citiesCount > 0 ||
                collectorsCount > 0 ||
                tradePointsCount > 0) && (
                <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t">
                  {citiesCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{citiesCount}</p>
                        <p className="text-sm text-muted-foreground">
                          {citiesCount === 1 ? "cidade" : "cidades"}
                        </p>
                      </div>
                    </div>
                  )}
                  {collectorsCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{collectorsCount}</p>
                        <p className="text-sm text-muted-foreground">
                          {collectorsCount === 1
                            ? "colecionador"
                            : "colecionadores"}
                        </p>
                      </div>
                    </div>
                  )}
                  {tradePointsCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{tradePointsCount}</p>
                        <p className="text-sm text-muted-foreground">
                          {tradePointsCount === 1
                            ? "ponto de troca"
                            : "pontos de troca"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Top Cities Section */}
        {topCities.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center">
                Principais cidades em {state.name}
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {topCities.map((city) => (
                  <Link key={city.slug} href={`/cidade/${city.slug}`}>
                    <Card className="hover:border-primary transition-colors h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {city.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {city.collectorsCount > 0 ? (
                            <>
                              {city.collectorsCount}{" "}
                              {city.collectorsCount === 1
                                ? "colecionador ativo"
                                : "colecionadores ativos"}
                            </>
                          ) : (
                            "Seja o primeiro colecionador"
                          )}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-muted-foreground">
                  E mais {Math.max(0, citiesCount - topCities.length)} outras
                  cidades em {state.name}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Troca de figurinhas em {state.name}</h2>
              <p>
                {collectorsCount > 0 ? (
                  <>
                    {state.name} já conta com {collectorsCount}{" "}
                    {collectorsCount === 1
                      ? "colecionador cadastrado"
                      : "colecionadores cadastrados"}{" "}
                    no Figurinha Fácil, distribuídos em {citiesCount}{" "}
                    {citiesCount === 1 ? "cidade" : "cidades"}.
                    {tradePointsCount > 0 && (
                      <>
                        {" "}
                        O estado possui {tradePointsCount}{" "}
                        {tradePointsCount === 1
                          ? "ponto de troca aprovado"
                          : "pontos de troca aprovados"}{" "}
                        onde você pode realizar trocas presenciais.
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {state.name} está pronto para receber colecionadores de
                    figurinhas. Com {citiesCount}{" "}
                    {citiesCount === 1 ? "cidade" : "cidades"} disponíveis, você
                    pode ser um dos primeiros a se cadastrar e ajudar a
                    construir a comunidade de trocas no estado.
                  </>
                )}{" "}
                Com a Copa do Mundo 2026 se aproximando, a busca por figurinhas
                no estado tem crescido.
              </p>

              <h3>Por que usar o Figurinha Fácil em {state.name}?</h3>
              <ul>
                <li>
                  Encontre colecionadores em {citiesCount} cidades do estado
                </li>
                {tradePointsCount > 0 ? (
                  <li>
                    Acesse {tradePointsCount}{" "}
                    {tradePointsCount === 1
                      ? "ponto de troca verificado"
                      : "pontos de troca verificados"}
                  </li>
                ) : (
                  <li>Sugira pontos de troca e ajude a expandir a rede</li>
                )}
                <li>
                  Economize tempo encontrando as figurinhas que você precisa
                </li>
                <li>Conecte-se com uma comunidade ativa de colecionadores</li>
              </ul>

              {topCities.length > 0 && (
                <>
                  <h3>Cidades mais ativas em {state.name}</h3>
                  <p>
                    As cidades com mais colecionadores em {state.name} são:{" "}
                    {topCities.map((city, i) => (
                      <span key={city.slug}>
                        <Link
                          href={`/cidade/${city.slug}`}
                          className="text-primary hover:underline"
                        >
                          {city.name}
                        </Link>
                        {i < topCities.length - 1 ? ", " : "."}
                      </span>
                    ))}
                  </p>
                </>
              )}

              <h3>Outros estados para trocar figurinhas</h3>
              <p>
                Além de {state.name}, você pode encontrar colecionadores em
                outros estados:{" "}
                {otherStates.slice(0, 5).map((s, i) => (
                  <span key={s.slug}>
                    <Link
                      href={`/estado/${s.slug}`}
                      className="text-primary hover:underline"
                    >
                      {s.name}
                    </Link>
                    {i < 4 ? ", " : "."}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        {/* Other States */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-headline font-bold mb-8 text-center">
              Outros estados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4 max-w-4xl mx-auto">
              {otherStates.map((s) => (
                <Link
                  key={s.slug}
                  href={`/estado/${s.slug}`}
                  className="flex flex-col items-center p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-center"
                >
                  <span className="text-sm font-medium">{s.code}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Pronto para começar a trocar em {state.name}?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre suas figurinhas e encontre colecionadores em{" "}
              {citiesCount} {citiesCount === 1 ? "cidade" : "cidades"} do
              estado.
            </p>
            <Button size="lg" asChild>
              <Link href="/cadastrar-figurinhas/quick">
                Cadastrar minhas figurinhas
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
