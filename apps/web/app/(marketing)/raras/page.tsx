import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { ArrowRight, Crown, Sparkles, Star, Trophy } from "lucide-react";
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
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebPageSchema,
  BASE_URL,
  SITE_NAME,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const TITLE = `Figurinhas Raras Copa 2026 | ${SITE_NAME}`;
const DESCRIPTION =
  "Veja as figurinhas raras (lendas e douradas) de cada seleção no álbum da Copa do Mundo 2026. Ranking por seleção, total de raras e como trocar.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "figurinhas raras copa 2026",
    "figurinhas douradas copa 2026",
    "lendas álbum copa 2026",
    "figurinhas raras álbum copa",
    "troca figurinhas raras",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/raras`,
    type: "website",
  },
  twitter: { title: TITLE, description: DESCRIPTION },
  alternates: { canonical: `${BASE_URL}/raras` },
};

async function loadAllSections() {
  "use cache";
  cacheTag("raras");
  cacheLife("days");
  return convexServer.query(api.album.getSections, {});
}

export default async function RareHubPage() {
  const sections = await loadAllSections();

  const ranked = sections
    .map((s) => ({
      ...s,
      rareCount: s.legendNumbers.length + s.goldenNumbers.length,
    }))
    .sort((a, b) => b.rareCount - a.rareCount);

  const totalLegends = sections.reduce(
    (acc, s) => acc + s.legendNumbers.length,
    0,
  );
  const totalGolden = sections.reduce(
    (acc, s) => acc + s.goldenNumbers.length,
    0,
  );
  const totalRare = totalLegends + totalGolden;
  const teamsWithLegends = sections.filter(
    (s) => s.legendNumbers.length > 0,
  ).length;

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Figurinhas Raras" },
  ]);

  const faqs = [
    {
      question: "Quantas figurinhas raras tem o álbum da Copa 2026?",
      answer: `O álbum tem ${totalRare} figurinhas raras no total: ${totalLegends} lendas e ${totalGolden} douradas, distribuídas entre as ${sections.length} seleções participantes.`,
    },
    {
      question: "Quais seleções têm mais figurinhas raras?",
      answer: `As seleções com mais raras são: ${ranked
        .slice(0, 3)
        .map((s) => `${s.name} (${s.rareCount})`)
        .join(", ")}.`,
    },
    {
      question: "Quantas seleções têm figurinhas de lenda?",
      answer: `${teamsWithLegends} seleções das ${sections.length} têm pelo menos uma figurinha de lenda no álbum da Copa 2026.`,
    },
    {
      question: "Onde trocar figurinhas raras?",
      answer:
        "No Figurinha Fácil você se cadastra grátis com email, marca quais raras tem repetidas e quais ainda precisa, e o sistema encontra colecionadores próximos para trocar.",
    },
  ];
  const faqSchema = generateFAQSchema(faqs);
  const webPageSchema = generateWebPageSchema({
    url: `${BASE_URL}/raras`,
    name: TITLE,
    description: DESCRIPTION,
  });

  return (
    <>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        <section className="relative bg-gradient-to-b from-[#ffc965]/10 via-[#ffc965]/5 to-background py-16 md:py-24 overflow-hidden">
          {/* Premium golden glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ffc965]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">
                  Figurinhas Raras
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <Badge
                variant="outline"
                className="mb-4 border-yellow-500 text-yellow-600"
              >
                <Crown className="h-3 w-3 mr-1" />
                {totalRare} raras no álbum
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Figurinhas Raras{" "}
                <span className="text-primary">Copa do Mundo 2026</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Lendas e douradas de cada seleção do álbum oficial. Veja quantas
                raras cada seleção tem e quais são as mais difíceis de achar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Trocar raras grátis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-y border-[#ffc965]/10 bg-gradient-to-r from-transparent via-[#ffc965]/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-4 rounded-xl bg-card/30 border border-border/30">
                <Crown className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <div className="text-3xl md:text-4xl font-headline font-bold">
                  {sections.length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Seleções
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-[#ffc965]/5 border border-[#ffc965]/20">
                <Star className="h-5 w-5 mx-auto mb-2 text-[#ffc965]" />
                <div className="text-3xl md:text-4xl font-headline font-bold text-[#ffc965]">
                  {totalGolden}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Douradas
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <Sparkles className="h-5 w-5 mx-auto mb-2 text-purple-400" />
                <div className="text-3xl md:text-4xl font-headline font-bold text-purple-400">
                  {totalLegends}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Lendas</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card/30 border border-border/30">
                <Trophy className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                <div className="text-3xl md:text-4xl font-headline font-bold">
                  {totalRare}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total raras
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-10 text-center">
              Ranking de raridade por seleção
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {ranked.map((team, i) => (
                <Link
                  key={team.slug}
                  href={`/raras/${team.slug}`}
                  className="block group"
                >
                  <Card className="transition-all duration-200 hover:border-[#ffc965]/40 hover:shadow-[0_0_20px_rgba(255,201,101,0.1)] group-hover:-translate-y-0.5">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span className="text-3xl">{team.flagEmoji}</span>
                            {i < 3 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ffc965] rounded-full flex items-center justify-center">
                                <Trophy className="h-2.5 w-2.5 text-[#1a1408]" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{team.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              #{i + 1} em raridade
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-[#ffc965]/30 text-[#ffc965]">
                          {team.rareCount}
                        </Badge>
                      </div>
                      <div className="flex gap-2 text-sm">
                        {team.legendNumbers.length > 0 && (
                          <span className="flex items-center gap-1 text-purple-400">
                            <Sparkles className="h-3 w-3" />
                            {team.legendNumbers.length} lendas
                          </span>
                        )}
                        {team.goldenNumbers.length > 0 && (
                          <span className="flex items-center gap-1 text-[#ffc965]">
                            <Star className="h-3 w-3 fill-current" />
                            {team.goldenNumbers.length} douradas
                          </span>
                        )}
                        {team.rareCount === 0 && (
                          <span className="text-muted-foreground">
                            Sem raras especiais
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
      </main>
      <LandingFooter />
    </>
  );
}
