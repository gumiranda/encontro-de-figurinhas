import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Users, ArrowRight, Calendar } from "lucide-react";
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
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

interface CityPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = await convexServer.query(api.cities.getBySlug, { slug });

  if (!city) {
    return {
      title: "Cidade não encontrada",
    };
  }

  return generateCityMetadata(city.name, city.slug, city.state);
}

export async function generateStaticParams() {
  // Generate static pages for major cities
  const majorCitySlugs = [
    "sao-paulo",
    "rio-de-janeiro",
    "belo-horizonte",
    "brasilia",
    "salvador",
    "fortaleza",
    "curitiba",
    "recife",
    "porto-alegre",
    "manaus",
    "goiania",
    "campinas",
    "santos",
    "guarulhos",
    "niteroi",
  ];

  return majorCitySlugs.map((slug) => ({ slug }));
}

export default async function CityPage({ params }: CityPageProps) {
  const { slug } = await params;
  const city = await convexServer.query(api.cities.getBySlug, { slug });

  if (!city) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Cidades", url: `${BASE_URL}/cidades` },
    { name: city.name },
  ]);

  const localBusinessSchema = generatePlaceSchema(
    `Figurinha Fácil ${city.name}`,
    city.name,
    city.state,
    city.lat,
    city.lng
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={localBusinessSchema} />
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
                <li className="text-foreground font-medium">{city.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-primary mb-4">
                <MapPin className="h-5 w-5" />
                <span className="text-sm font-medium">{city.state}</span>
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
                  <Link href="/arena/map">Ver mapa de trocas</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

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
                {city.name} é uma das cidades mais ativas na comunidade de
                colecionadores de figurinhas do Brasil. Com a proximidade da
                Copa do Mundo 2026, a busca por figurinhas e pontos de troca na
                cidade tem crescido significativamente.
              </p>

              <h3>Por que usar o Figurinha Fácil em {city.name}?</h3>
              <ul>
                <li>
                  Encontre colecionadores perto de você em {city.name} e região
                </li>
                <li>
                  Descubra pontos de troca seguros e bem avaliados na cidade
                </li>
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
