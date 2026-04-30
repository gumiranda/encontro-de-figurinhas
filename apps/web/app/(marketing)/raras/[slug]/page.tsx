import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { ArrowRight, Crown, Sparkles, Star } from "lucide-react";
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
  generateRareMetadata,
  generateRareCollectionSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

interface RarePageProps {
  params: Promise<{ slug: string }>;
}

async function loadSection(slug: string) {
  "use cache";
  cacheTag(`raras:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.album.getSectionBySlug, { slug });
}

async function loadAllSections() {
  "use cache";
  cacheTag("raras");
  cacheLife("hours");
  return convexServer.query(api.album.getSections, {});
}

export async function generateMetadata({
  params,
}: RarePageProps): Promise<Metadata> {
  const { slug } = await params;
  const section = await loadSection(slug);
  if (!section) return { title: "Seleção não encontrada" };
  return generateRareMetadata(
    section.name,
    section.slug,
    section.flagEmoji ?? "",
    section.legendNumbers.length,
    section.goldenNumbers.length
  );
}

export async function generateStaticParams() {
  const slugs = await convexServer.query(api.album.getAllSectionSlugs, {});
  if (slugs.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export default async function RarePage({ params }: RarePageProps) {
  const { slug } = await params;
  const [section, allSections] = await Promise.all([
    loadSection(slug),
    loadAllSections(),
  ]);

  if (!section) notFound();

  const legendCount = section.legendNumbers.length;
  const goldenCount = section.goldenNumbers.length;
  const rareTotal = legendCount + goldenCount;
  const regularCount = section.stickerCount - rareTotal;
  const rarePercent = Math.round((rareTotal / section.stickerCount) * 100);

  const goldenSet = new Set(section.goldenNumbers);
  const legendNumberSet = new Set(section.legendNumbers.map((l) => l.number));
  const overlapping = section.legendNumbers.filter((l) =>
    goldenSet.has(l.number)
  );

  const avgLegends =
    allSections.reduce((acc, s) => acc + s.legendNumbers.length, 0) /
    allSections.length;
  const avgGolden =
    allSections.reduce((acc, s) => acc + s.goldenNumbers.length, 0) /
    allSections.length;

  const moreRareTeams = allSections
    .filter((s) => s.slug !== section.slug)
    .map((s) => ({
      ...s,
      rareCount: s.legendNumbers.length + s.goldenNumbers.length,
    }))
    .sort((a, b) => b.rareCount - a.rareCount)
    .slice(0, 6);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Seleções", url: `${BASE_URL}/selecoes` },
    { name: section.name, url: `${BASE_URL}/selecao/${section.slug}` },
    { name: "Figurinhas Raras" },
  ]);

  const collectionSchema = generateRareCollectionSchema(
    section.name,
    section.slug,
    section.legendNumbers.map((l) => l.name),
    goldenCount
  );

  const faqs = [
    {
      question: `Quantas figurinhas raras a seleção ${section.name} tem na Copa 2026?`,
      answer: `A ${section.name} tem ${rareTotal} figurinhas raras: ${legendCount} lendas e ${goldenCount} douradas. Isso representa ${rarePercent}% das ${section.stickerCount} figurinhas da seleção.`,
    },
    {
      question: `Quais são as lendas da ${section.name}?`,
      answer:
        legendCount > 0
          ? `As lendas da ${section.name} são: ${section.legendNumbers
              .map(
                (l) =>
                  `${l.name} (${section.code}-${l.number - section.startNumber + 1})`
              )
              .join(", ")}.`
          : `A ${section.name} não tem figurinhas de lenda nesta edição.`,
    },
    {
      question: `Como trocar figurinhas raras da ${section.name}?`,
      answer: `Cadastre-se gratuitamente no Figurinha Fácil, marque as raras da ${section.name} que você tem repetidas e as que ainda precisa. O sistema encontra outros colecionadores com match.`,
    },
    {
      question: `Lendas e douradas são diferentes?`,
      answer: `Sim. Douradas são figurinhas com acabamento especial (foil), mais difíceis de achar nos pacotes. Lendas são figurinhas dedicadas a jogadores históricos da seleção. Algumas figurinhas podem ser dourada e lenda ao mesmo tempo.`,
    },
  ];
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />
      <JsonLd data={faqSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-yellow-500/5 to-background py-16 md:py-24">
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
                  <Link
                    href={`/selecao/${section.slug}`}
                    className="hover:text-primary"
                  >
                    {section.name}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">Figurinhas Raras</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{section.flagEmoji}</span>
                <Badge
                  variant="outline"
                  className="text-sm border-yellow-500 text-yellow-600"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  {rareTotal} raras
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Figurinhas Raras da{" "}
                <span className="text-primary">{section.name}</span>
                <span className="block text-2xl md:text-3xl mt-2 text-muted-foreground font-normal">
                  Copa do Mundo 2026
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                {rareTotal > 0 ? (
                  <>
                    A seleção {section.name} tem{" "}
                    <strong>{rareTotal} figurinhas raras</strong> no álbum da
                    Copa 2026 — {legendCount} lendas e {goldenCount} douradas.
                    Veja quais são e como trocar.
                  </>
                ) : (
                  <>
                    A seleção {section.name} não tem figurinhas raras especiais
                    nesta edição do álbum, mas você ainda pode trocar suas{" "}
                    {section.stickerCount} figurinhas regulares.
                  </>
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Trocar raras grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/selecao/${section.slug}`}>
                    Ver todas da {section.name}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-y bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-600">
                  {goldenCount}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Douradas
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-600">
                  {legendCount}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Lendas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold">
                  {rarePercent}%
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  do álbum dela
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-muted-foreground">
                  {regularCount}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Regulares
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lendas */}
        {legendCount > 0 && (
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="h-7 w-7 text-purple-500" />
                  <h2 className="text-2xl md:text-3xl font-headline font-bold">
                    Lendas da {section.name}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Figurinhas dedicadas a jogadores históricos. As mais
                  procuradas pelos colecionadores.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {section.legendNumbers.map((legend) => {
                    const code = `${section.code}-${legend.number - section.startNumber + 1}`;
                    const alsoGolden = goldenSet.has(legend.number);
                    return (
                      <Card key={legend.number} className="border-purple-500/30">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <Badge
                              variant="outline"
                              className="border-purple-500 text-purple-600 font-mono"
                            >
                              {code}
                            </Badge>
                            {alsoGolden && (
                              <Badge
                                variant="outline"
                                className="border-yellow-500 text-yellow-600"
                              >
                                <Star className="h-3 w-3 mr-1" />
                                Dourada
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold">
                            {legend.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Lenda da seleção {section.name}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Douradas */}
        {goldenCount > 0 && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <Star className="h-7 w-7 text-yellow-500" />
                  <h2 className="text-2xl md:text-3xl font-headline font-bold">
                    Douradas da {section.name}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-8">
                  Figurinhas com acabamento especial em foil, distribuídas em
                  menor quantidade nos pacotes.
                </p>
                <div className="flex flex-wrap gap-3">
                  {section.goldenNumbers.map((n) => {
                    const code = `${section.code}-${n - section.startNumber + 1}`;
                    const isAlsoLegend = legendNumberSet.has(n);
                    return (
                      <Badge
                        key={n}
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 font-mono text-base px-4 py-2"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {code}
                        {isAlsoLegend && (
                          <Sparkles className="h-3 w-3 ml-1 text-purple-500" />
                        )}
                      </Badge>
                    );
                  })}
                </div>
                {overlapping.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-6">
                    <Sparkles className="inline h-3 w-3 text-purple-500 mr-1" />
                    indica figurinha que é dourada <em>e</em> lenda — dupla
                    raridade.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Comparativo + SEO content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>{section.name} comparada às outras seleções</h2>
              <p>
                A média entre as 48 seleções da Copa 2026 é de{" "}
                <strong>{avgLegends.toFixed(1)} lendas</strong> e{" "}
                <strong>{avgGolden.toFixed(1)} douradas</strong> por seleção. A{" "}
                {section.name} tem {legendCount}{" "}
                {legendCount === 1 ? "lenda" : "lendas"} e {goldenCount}{" "}
                {goldenCount === 1 ? "dourada" : "douradas"} —{" "}
                {rareTotal > avgLegends + avgGolden
                  ? "acima da média, então o álbum dela tende a ser mais difícil de fechar."
                  : rareTotal < avgLegends + avgGolden
                    ? "abaixo da média, então o álbum dela tende a ser mais acessível."
                    : "exatamente na média."}
              </p>

              <h2>Como funciona a raridade no álbum Copa 2026</h2>
              <p>
                O álbum oficial da Copa do Mundo 2026 traz três níveis de
                raridade dentro de cada seleção:
              </p>
              <ul>
                <li>
                  <strong>Regulares</strong> — jogadores e escudo. Distribuição
                  normal nos pacotes.
                </li>
                <li>
                  <strong>Douradas</strong> — acabamento foil, impressas em
                  menor quantidade. Tipicamente 1 a 2 por seleção.
                </li>
                <li>
                  <strong>Lendas</strong> — homenagem a jogadores históricos.
                  Algumas seleções têm zero, outras têm múltiplas.
                </li>
              </ul>
              <p>
                Uma figurinha pode ser <strong>dourada e lenda</strong> ao mesmo
                tempo — essas são as mais raras de todas.
              </p>

              <h2>Como trocar figurinhas raras da {section.name}</h2>
              <ol>
                <li>
                  Cadastre-se grátis com email no{" "}
                  <Link href="/sign-up">Figurinha Fácil</Link>.
                </li>
                <li>
                  Marque as raras da {section.name} que você já tem repetidas.
                </li>
                <li>
                  Marque as que ainda faltam (
                  {section.legendNumbers
                    .slice(0, 2)
                    .map(
                      (l) =>
                        `${section.code}-${l.number - section.startNumber + 1}`
                    )
                    .join(", ") ||
                    `${section.code}-1`}
                  , etc).
                </li>
                <li>
                  O sistema cruza com colecionadores próximos e sugere trocas.
                </li>
              </ol>

              <h2>Veja também</h2>
              <ul>
                <li>
                  <Link href={`/selecao/${section.slug}`}>
                    Todas as figurinhas da {section.name}
                  </Link>
                </li>
                <li>
                  <Link href="/album-copa-do-mundo-2026">
                    Álbum Copa do Mundo 2026 completo
                  </Link>
                </li>
                <li>
                  <Link href="/custo-album-copa-2026">
                    Quanto custa fechar o álbum da Copa 2026
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-10 text-center">
                Perguntas frequentes
              </h2>
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <Card key={faq.question}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Other rare pages */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-headline font-bold mb-8 text-center">
              Raras de outras seleções
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {moreRareTeams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/raras/${team.slug}`}
                  className="flex flex-col items-center p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <span className="text-3xl mb-2">{team.flagEmoji}</span>
                  <span className="text-sm font-medium text-center">
                    {team.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {team.rareCount} raras
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Falta uma rara da {section.name}? {section.flagEmoji}
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se grátis e encontre quem tem a {section.code}-X que
              você precisa.
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
