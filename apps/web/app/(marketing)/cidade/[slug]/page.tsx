import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { MapPin, Users, ArrowRight, Calendar, Store, Navigation } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
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
  generateCityMetadata,
  generateBreadcrumbSchema,
  generatePlaceSchema,
  generateCityItemListSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { stateCodeToSlug, stateCodeToName } from "@/lib/states";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

async function loadCity(slug: string) {
  "use cache";
  cacheTag(`cidade:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.cities.getBySlug, { slug });
}

async function loadCityStats(slug: string) {
  "use cache";
  cacheTag(`cidade:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.cities.getStatsBySlug, { slug });
}

async function loadCityTopPoints(slug: string) {
  "use cache";
  cacheTag(`cidade:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.tradePoints.listTopByCity, { citySlug: slug, limit: 20 });
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await loadCity(slug);

  if (!city) {
    return {
      title: "Cidade não encontrada",
    };
  }

  return generateCityMetadata(city.name, city.slug, city.state);
}

export async function generateStaticParams() {
  const slugs = await convexServer.query(api.cities.listTopActiveForSSG, {});
  return slugs.map((slug) => ({ slug }));
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const [city, stats, topPoints] = await Promise.all([
    loadCity(slug),
    loadCityStats(slug),
    loadCityTopPoints(slug),
  ]);

  if (!city) {
    notFound();
  }

  const collectorsCount = stats?.collectorsCount ?? 0;
  const tradePointsCount = stats?.tradePointsCount ?? 0;
  const visiblePoints = topPoints.slice(0, 20);
  const hasMorePoints = tradePointsCount > visiblePoints.length;

  const stateSlug = stateCodeToSlug(city.state);
  const stateName = stateCodeToName(city.state) ?? city.state;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Estados", url: `${BASE_URL}/estados` },
    ...(stateSlug ? [{ name: stateName, url: `${BASE_URL}/estado/${stateSlug}` }] : []),
    { name: city.name },
  ]);

  const placeSchema = generatePlaceSchema(
    `Figurinha Fácil ${city.name}`,
    city.name,
    city.state,
    city.lat,
    city.lng
  );

  const itemListSchema =
    visiblePoints.length > 0
      ? generateCityItemListSchema(city.slug, city.name, visiblePoints)
      : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={placeSchema} />
      {itemListSchema && <JsonLd data={itemListSchema} />}
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/estados" className="hover:text-primary">
                    Estados
                  </Link>
                </li>
                {stateSlug && (
                  <>
                    <li>/</li>
                    <li>
                      <Link href={`/estado/${stateSlug}`} className="hover:text-primary">
                        {stateName}
                      </Link>
                    </li>
                  </>
                )}
                <li>/</li>
                <li className="text-foreground font-medium">{city.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-primary mb-4">
                <MapPin className="h-5 w-5" />
                <Link href={stateSlug ? `/estado/${stateSlug}` : "/estados"} className="text-sm font-medium hover:underline">
                  {stateName}
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Troca de Figurinhas em{" "}
                <span className="text-primary">{city.name}</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Encontre colecionadores e pontos de troca de figurinhas em{" "}
                {city.name}, {city.state}. Conecte-se com outros apaixonados por
                figurinhas e complete seu álbum.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Começar a trocar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/map?city=${city.slug}`}>Ver mapa de trocas</Link>
                </Button>
              </div>

              {(collectorsCount > 0 || tradePointsCount > 0) && (
                <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t">
                  {collectorsCount > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{collectorsCount}</p>
                        <p className="text-sm text-muted-foreground">
                          {collectorsCount === 1 ? "colecionador ativo" : "colecionadores ativos"}
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
                          {tradePointsCount === 1 ? "ponto de troca" : "pontos de troca"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {visiblePoints.length > 0 && (
          <section className="py-16 md:py-24 border-b">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-headline font-bold">
                      Pontos de troca em {city.name}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      {tradePointsCount === 1
                        ? "1 ponto aprovado nesta cidade"
                        : `${tradePointsCount} pontos aprovados nesta cidade`}
                      {hasMorePoints && " — mostrando os 20 mais recentes"}
                    </p>
                  </div>
                  {hasMorePoints && (
                    <Button variant="outline" asChild>
                      <Link href={`/map?city=${city.slug}`}>
                        <Navigation className="mr-2 h-4 w-4" />
                        Ver todos no mapa
                      </Link>
                    </Button>
                  )}
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {visiblePoints.map((point) => (
                    <li key={point.slug}>
                      <Link
                        href={`/ponto/${point.slug}`}
                        className="group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                      >
                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Store className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium group-hover:text-primary">
                            {point.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {point.address}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center">
              Como funciona em {city.name}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Cadastre suas figurinhas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Informe quais figurinhas você tem repetidas e quais está
                    buscando para completar seu álbum.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Encontre trocas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nossa plataforma conecta você com colecionadores em{" "}
                    {city.name} que têm o que você precisa.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Combine o encontro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Escolha um ponto de troca seguro em {city.name} e realize
                    suas trocas presencialmente.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Troca de figurinhas em {city.name}</h2>
              <p>
                {collectorsCount > 0 ? (
                  <>
                    {city.name} já conta com {collectorsCount}{" "}
                    {collectorsCount === 1
                      ? "colecionador cadastrado"
                      : "colecionadores cadastrados"}{" "}
                    no Figurinha Fácil.{" "}
                    {tradePointsCount > 0 && (
                      <>
                        A cidade possui {tradePointsCount}{" "}
                        {tradePointsCount === 1
                          ? "ponto de troca aprovado"
                          : "pontos de troca aprovados"}{" "}
                        onde você pode realizar trocas presenciais com segurança.
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {city.name}, {city.state}, está pronta para receber
                    colecionadores de figurinhas. Seja um dos primeiros a se
                    cadastrar e ajude a construir a comunidade de trocas na sua
                    cidade.
                  </>
                )}{" "}
                Com a proximidade da Copa do Mundo 2026, a busca por figurinhas
                e pontos de troca na cidade tem crescido significativamente.
              </p>

              <h3>Por que usar o Figurinha Fácil em {city.name}?</h3>
              <ul>
                <li>
                  Encontre colecionadores perto de você em {city.name} e região
                </li>
                {tradePointsCount > 0 ? (
                  <li>
                    Acesse {tradePointsCount}{" "}
                    {tradePointsCount === 1
                      ? "ponto de troca verificado"
                      : "pontos de troca verificados"}{" "}
                    na cidade
                  </li>
                ) : (
                  <li>
                    Sugira pontos de troca seguros e ajude a expandir a rede
                  </li>
                )}
                <li>
                  Economize tempo encontrando exatamente as figurinhas que
                  precisa
                </li>
                <li>
                  Conecte-se com uma comunidade ativa de colecionadores locais
                </li>
              </ul>

              <h3>Álbuns populares para troca em {city.name}</h3>
              <p>
                Os colecionadores de {city.name} estão ativamente trocando
                figurinhas de diversos álbuns, incluindo o álbum oficial da Copa
                do Mundo 2026, álbuns Panini de campeonatos brasileiros, e
                outras coleções populares.
              </p>

              <h3>Outras cidades para trocar figurinhas</h3>
              <p>
                Além de {city.name}, você pode encontrar colecionadores em outras
                grandes cidades do Brasil. Confira:{" "}
                <Link href="/cidade/sao-paulo" className="text-primary hover:underline">São Paulo</Link>,{" "}
                <Link href="/cidade/rio-de-janeiro" className="text-primary hover:underline">Rio de Janeiro</Link>,{" "}
                <Link href="/cidade/belo-horizonte" className="text-primary hover:underline">Belo Horizonte</Link>,{" "}
                <Link href="/cidade/curitiba" className="text-primary hover:underline">Curitiba</Link> e{" "}
                <Link href="/cidade/porto-alegre" className="text-primary hover:underline">Porto Alegre</Link>.
              </p>

              <p>
                Não sabe por onde começar? Veja{" "}
                <Link href="/como-funciona" className="text-primary hover:underline">como funciona o Figurinha Fácil</Link>{" "}
                e comece a trocar figurinhas hoje mesmo.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Pronto para começar a trocar em {city.name}?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e encontre colecionadores na sua região
              hoje mesmo.
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
