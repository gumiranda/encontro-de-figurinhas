import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, Trophy } from "lucide-react";
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
  generateTeamMetadata,
  generateBreadcrumbSchema,
  generateSportsTeamSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

interface TeamPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

const loadSection = (slug: string) =>
  unstable_cache(
    async (s: string) =>
      convexServer.query(api.album.getSectionBySlug, { slug: s }),
    ["selecao-by-slug"],
    { tags: [`selecao:${slug}`], revalidate: 86400 }
  )(slug);

const loadAllSections = () =>
  unstable_cache(
    async () => convexServer.query(api.album.getSections, {}),
    ["selecao-all"],
    { tags: ["selecao"], revalidate: 86400 }
  )();

export async function generateMetadata({
  params,
}: TeamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = await loadSection(slug);

  if (!section) {
    return {
      title: "Seleção não encontrada",
    };
  }

  return generateTeamMetadata(
    section.name,
    section.slug,
    section.flagEmoji ?? "",
    section.stickerCount
  );
}

export async function generateStaticParams() {
  const slugs = await convexServer.query(api.album.getAllSectionSlugs, {});
  return slugs.map((slug) => ({ slug }));
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { slug } = await params;
  const [section, allSections] = await Promise.all([
    loadSection(slug),
    loadAllSections(),
  ]);

  if (!section) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Seleções", url: `${BASE_URL}/selecoes` },
    { name: section.name },
  ]);

  const teamSchema = generateSportsTeamSchema(section.name, section.code, {
    start: section.startNumber,
    end: section.endNumber,
  });

  const relatedTeams = allSections
    .filter((s) => s.slug !== section.slug)
    .slice(0, 6);

  const hasLegends = section.legendNumbers && section.legendNumbers.length > 0;
  const hasGolden = section.goldenNumbers && section.goldenNumbers.length > 0;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={teamSchema} />
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
                  <Link href="/album-copa-do-mundo-2026" className="hover:text-primary">
                    Álbum Copa 2026
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{section.name}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{section.flagEmoji}</span>
                <Badge variant="secondary" className="text-sm">
                  {section.code}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Figurinhas{" "}
                <span className="text-primary">{section.name}</span>
                <span className="block text-2xl md:text-3xl mt-2 text-muted-foreground font-normal">
                  Copa do Mundo 2026
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Encontre e troque as {section.stickerCount} figurinhas da seleção {section.name}{" "}
                para completar seu álbum da Copa 2026. Números {section.startNumber} a{" "}
                {section.endNumber}.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Começar a trocar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/album-copa-do-mundo-2026">Ver álbum completo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Sticker Range Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-12 text-center">
              Figurinhas da {section.name}
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Numeração</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary mb-2">
                    {section.startNumber} - {section.endNumber}
                  </p>
                  <p className="text-muted-foreground">
                    {section.stickerCount} figurinhas no total
                  </p>
                </CardContent>
              </Card>

              {hasGolden && (
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                    <CardTitle>Figurinhas Douradas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold mb-2">
                      {section.goldenNumbers.map((n) => (
                        <Badge key={n} variant="outline" className="mr-2 mb-2 border-yellow-500 text-yellow-600">
                          #{n}
                        </Badge>
                      ))}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Figurinhas especiais mais raras
                    </p>
                  </CardContent>
                </Card>
              )}

              {hasLegends && (
                <Card>
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6 text-purple-500" />
                    </div>
                    <CardTitle>Lendas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {section.legendNumbers.map((legend) => (
                      <div key={legend.number} className="mb-2">
                        <Badge variant="outline" className="mr-2 border-purple-500 text-purple-600">
                          #{legend.number}
                        </Badge>
                        <span className="font-semibold">{legend.name}</span>
                      </div>
                    ))}
                    <p className="text-muted-foreground text-sm mt-2">
                      Jogadores icônicos da seleção
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Sobre as figurinhas da {section.name}</h2>
              <p>
                A seleção {section.name} {section.flagEmoji} está presente no álbum oficial
                da Copa do Mundo 2026 com {section.stickerCount} figurinhas exclusivas,
                numeradas de {section.startNumber} a {section.endNumber}. Essas figurinhas
                incluem jogadores do elenco, escudo da seleção e momentos históricos.
              </p>

              {hasLegends && (
                <>
                  <h3>Jogadores em destaque</h3>
                  <p>
                    Entre as figurinhas mais procuradas da {section.name} estão:{" "}
                    {section.legendNumbers.map((l, i) => (
                      <span key={l.number}>
                        <strong>{l.name}</strong> (#{l.number})
                        {i < section.legendNumbers.length - 1 ? ", " : "."}
                      </span>
                    ))}{" "}
                    Essas figurinhas são especialmente valorizadas pelos colecionadores.
                  </p>
                </>
              )}

              <h3>Como trocar figurinhas da {section.name}</h3>
              <ul>
                <li>
                  Cadastre-se gratuitamente no Figurinha Fácil
                </li>
                <li>
                  Informe quais figurinhas da {section.name} você tem repetidas
                </li>
                <li>
                  Marque quais números ({section.startNumber}-{section.endNumber}) você ainda precisa
                </li>
                <li>
                  Encontre colecionadores perto de você que têm o que você procura
                </li>
              </ul>

              <h3>Outras seleções para trocar</h3>
              <p>
                Além da {section.name}, você pode trocar figurinhas de outras seleções
                participantes da Copa 2026:{" "}
                {relatedTeams.slice(0, 5).map((team, i) => (
                  <span key={team.slug}>
                    <Link href={`/selecao/${team.slug}`} className="text-primary hover:underline">
                      {team.flagEmoji} {team.name}
                    </Link>
                    {i < 4 ? ", " : "."}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        {/* Related Teams */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-headline font-bold mb-8 text-center">
              Outras seleções
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {relatedTeams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/selecao/${team.slug}`}
                  className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-3xl mb-2">{team.flagEmoji}</span>
                  <span className="text-sm font-medium text-center">{team.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Pronto para completar a {section.name}? {section.flagEmoji}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e encontre as {section.stickerCount} figurinhas
              da {section.name} que você precisa.
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
