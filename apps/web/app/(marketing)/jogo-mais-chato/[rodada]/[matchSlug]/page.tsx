import type { Metadata } from "next";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateBreadcrumbSchema,
  generateCombinedSchema,
  generateFAQSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { MatchDetailView } from "../../_components/match-detail-view";

interface Props {
  params: Promise<{ rodada: string; matchSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rodada, matchSlug } = await params;
  const data = await convexServer.query(api.boringGame.getMatchBySlug, {
    slug: matchSlug,
  });
  if (!data) return { title: "Jogo não encontrado" };
  const { match, round } = data;
  const url = `${BASE_URL}/jogo-mais-chato/${rodada}/${matchSlug}`;
  const title = `${match.homeTeamName} x ${match.awayTeamName} — Foi o jogo mais chato?`;
  const description = `Diga por que ${match.homeTeamName} x ${match.awayTeamName} pela ${round.name} foi (ou não foi) chato. ${match.totalVotes.toLocaleString("pt-BR")} já votaram.`;
  return {
    title,
    description,
    openGraph: { title, description, url, type: "website" },
    alternates: { canonical: url },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { rodada, matchSlug } = await params;

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato", url: `${BASE_URL}/jogo-mais-chato` },
    { name: rodada, url: `${BASE_URL}/jogo-mais-chato/${rodada}` },
    { name: matchSlug },
  ]);

  const faq = generateFAQSchema([
    {
      question: "Por que um jogo pode ser considerado chato?",
      answer:
        "A torcida vota nos motivos mais comuns: jogo sem chances de gol, jogo truncado, sem craques em campo, placar morno, narrador dormindo, ou potencial de meme.",
    },
    {
      question: "Como vota?",
      answer:
        "Faça login com sua conta Figurinha Fácil e selecione um ou mais motivos. Você pode mudar seu voto a qualquer momento.",
    },
  ]);

  return (
    <>
      <JsonLd data={generateCombinedSchema([breadcrumb, faq])} />
      <LandingHeader />
      <main
        id="main-content"
        className="container mx-auto max-w-3xl px-4 py-10"
      >
        <MatchDetailView matchSlug={matchSlug} roundSlug={rodada} />
      </main>
      <LandingFooter />
    </>
  );
}
