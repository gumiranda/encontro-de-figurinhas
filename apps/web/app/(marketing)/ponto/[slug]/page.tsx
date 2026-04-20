import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";
import {
  MapPin,
  Clock,
  Users,
  Shield,
  ArrowRight,
  Share2,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@workspace/ui/components/kibo-ui/announcement";
import {
  Pill,
  PillIndicator,
} from "@workspace/ui/components/kibo-ui/pill";
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@workspace/ui/components/kibo-ui/status";
import { QRCode } from "@workspace/ui/components/kibo-ui/qr-code";
import {
  Glimpse,
  GlimpseContent,
  GlimpseTrigger,
  GlimpseTitle,
  GlimpseDescription,
} from "@workspace/ui/components/kibo-ui/glimpse";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateTradePointMetadata,
  generateBreadcrumbSchema,
  generateTradePointPlaceSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

interface PontoPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

const loadTradePoint = (slug: string) =>
  unstable_cache(
    async (s: string) => fetchQuery(api.tradePoints.getBySlug, { slug: s }),
    ["ponto-by-slug"],
    { tags: [`ponto:${slug}`], revalidate: 3600 }
  )(slug);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function generateStaticParams() {
  const slugs = await fetchQuery(api.tradePoints.listTopForSSG, {});
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PontoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const point = await loadTradePoint(slug);

  if (!point || !point.city) {
    return {
      title: "Ponto não encontrado",
    };
  }

  return generateTradePointMetadata(
    point.name,
    slug,
    point.city.name,
    point.city.state
  );
}

export default async function PontoPage({ params }: PontoPageProps) {
  const { slug } = await params;
  const point = await loadTradePoint(slug);

  if (!point || !point.city) {
    notFound();
  }

  const isActive = Date.now() - point.lastActivityAt < SEVEN_DAYS_MS;
  const citySlug = point.city.slug;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    {
      name: point.city.name,
      url: `${BASE_URL}/cidade/${citySlug}`,
    },
    { name: point.name },
  ]);

  const placeSchema = generateTradePointPlaceSchema({
    name: point.name,
    slug,
    address: point.address,
    city: point.city.name,
    state: point.city.state,
    lat: point.lat,
    lng: point.lng,
    description: point.description ?? undefined,
  });

  const shareUrl = `${BASE_URL}/ponto/${slug}`;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={placeSchema} />
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
                    href={`/cidade/${citySlug}`}
                    className="hover:text-primary"
                  >
                    {point.city.name}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{point.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Status status={isActive ? "online" : "offline"}>
                  <StatusIndicator />
                  <StatusLabel>
                    {isActive ? "Ativo nesta semana" : "Sem atividade recente"}
                  </StatusLabel>
                </Status>
                <Pill variant="secondary">
                  <PillIndicator variant="success" />
                  {point.confirmedTradesCount}{" "}
                  {point.confirmedTradesCount === 1
                    ? "troca confirmada"
                    : "trocas confirmadas"}
                </Pill>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                {point.name}
              </h1>

              <Glimpse>
                <GlimpseTrigger asChild>
                  <button
                    type="button"
                    className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                    <span className="underline decoration-dotted underline-offset-4">
                      {point.address}
                    </span>
                  </button>
                </GlimpseTrigger>
                <GlimpseContent className="w-80">
                  <GlimpseTitle>{point.name}</GlimpseTitle>
                  <GlimpseDescription>
                    {point.city.name} - {point.city.state} ·{" "}
                    {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
                  </GlimpseDescription>
                </GlimpseContent>
              </Glimpse>

              <Announcement
                variant="outline"
                className="mb-6 w-fit border-primary/30 text-primary"
              >
                <AnnouncementTag>
                  <Shield className="h-3 w-3" aria-hidden="true" />
                </AnnouncementTag>
                <AnnouncementTitle className="text-xs">
                  Ponto público · vá acompanhado(a) e leve apenas figurinhas
                </AnnouncementTitle>
              </Announcement>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Participar das trocas
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/map">Ver no mapa</Link>
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
                    {point.suggestedHours ??
                      "As trocas geralmente acontecem aos finais de semana, das 10h às 16h. Verifique o calendário atualizado no app."}
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
                    {point.confirmedTradesCount > 0
                      ? `${point.confirmedTradesCount} trocas já foram confirmadas neste ponto.`
                      : "Seja um dos primeiros a confirmar trocas neste ponto."}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Compartilhe</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-3">
                  <div className="rounded-lg border bg-card p-3">
                    <QRCode
                      data={shareUrl}
                      className="h-32 w-32"
                      foreground="currentColor"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Escaneie para abrir este ponto no celular.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content — prose via typography wrapper */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="typography max-w-3xl mx-auto">
              <h2>
                Troca de figurinhas em {point.name}, {point.city.name}
              </h2>
              {point.description ? (
                <p>{point.description}</p>
              ) : (
                <p>
                  O {point.name} é um dos principais pontos de encontro para
                  colecionadores de figurinhas em {point.city.name}. Localizado
                  em {point.address}, o local oferece um ambiente seguro e
                  movimentado para realizar trocas.
                </p>
              )}

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
