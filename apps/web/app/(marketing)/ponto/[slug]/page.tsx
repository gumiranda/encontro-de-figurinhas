import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Users, Shield, ArrowRight } from "lucide-react";
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
import {
  generateTradePointMetadata,
  generateBreadcrumbSchema,
  generatePlaceSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

interface PontoPageProps {
  params: Promise<{ slug: string }>;
}

// TODO: Replace with actual data fetching when trade points are implemented
async function getTradePoint(slug: string) {
  // Placeholder data for SEO purposes
  // This will be replaced with actual Convex query
  const mockPoints: Record<
    string,
    {
      name: string;
      city: string;
      state: string;
      address: string;
      lat: number;
      lng: number;
    }
  > = {
    "praca-da-se-sp": {
      name: "Praça da Sé",
      city: "São Paulo",
      state: "SP",
      address: "Praça da Sé, Centro, São Paulo - SP",
      lat: -23.5505,
      lng: -46.6333,
    },
    "parque-ibirapuera-sp": {
      name: "Parque Ibirapuera",
      city: "São Paulo",
      state: "SP",
      address: "Av. Pedro Álvares Cabral, Ibirapuera, São Paulo - SP",
      lat: -23.5874,
      lng: -46.6576,
    },
  };

  return mockPoints[slug] || null;
}

export async function generateMetadata({
  params,
}: PontoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const point = await getTradePoint(slug);

  if (!point) {
    return {
      title: "Ponto não encontrado",
    };
  }

  return generateTradePointMetadata(point.name, slug, point.city, point.state);
}

export async function generateStaticParams() {
  // Generate static pages for known trade points
  // This will be expanded when trade points are implemented
  return [
    { slug: "praca-da-se-sp" },
    { slug: "parque-ibirapuera-sp" },
  ];
}

export default async function PontoPage({ params }: PontoPageProps) {
  const { slug } = await params;
  const point = await getTradePoint(slug);

  if (!point) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: point.city, url: `${BASE_URL}/cidade/${point.city.toLowerCase().replace(" ", "-")}` },
    { name: point.name },
  ]);

  const localBusinessSchema = generatePlaceSchema(
    point.name,
    point.city,
    point.state,
    point.lat,
    point.lng
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
                <li>
                  <Link
                    href={`/cidade/${point.city.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-primary"
                  >
                    {point.city}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{point.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                Ponto de Troca
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                {point.name}
              </h1>

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5" />
                <span>{point.address}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Participar das trocas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/arena/map">Ver no mapa</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Horários</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    As trocas geralmente acontecem aos finais de semana, das 10h
                    às 16h. Verifique o calendário atualizado no app.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Comunidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Este ponto reúne dezenas de colecionadores toda semana.
                    Ótimo lugar para encontrar figurinhas raras.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Local público e movimentado, ideal para trocas seguras.
                    Sempre vá acompanhado quando possível.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>
                Troca de figurinhas em {point.name}, {point.city}
              </h2>
              <p>
                O {point.name} é um dos principais pontos de encontro para
                colecionadores de figurinhas em {point.city}. Localizado em{" "}
                {point.address}, o local oferece um ambiente seguro e
                movimentado para realizar trocas.
              </p>

              <h3>Como participar</h3>
              <ol>
                <li>Cadastre-se gratuitamente no Figurinha Fácil</li>
                <li>Informe suas figurinhas repetidas e as que você precisa</li>
                <li>Encontre colecionadores que estarão no {point.name}</li>
                <li>Combine o encontro e realize suas trocas</li>
              </ol>

              <h3>Dicas para trocar em {point.name}</h3>
              <ul>
                <li>Chegue cedo para encontrar mais opções de troca</li>
                <li>Leve suas figurinhas organizadas para facilitar</li>
                <li>Confira as figurinhas antes de finalizar a troca</li>
                <li>Respeite os outros colecionadores da comunidade</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Pronto para trocar figurinhas em {point.name}?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e encontre colecionadores para trocar
              figurinhas.
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
