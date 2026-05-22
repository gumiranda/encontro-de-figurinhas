import type { Metadata } from "next";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateBreadcrumbSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { RankingList } from "../_components/ranking-list";

const PAGE_URL = `${BASE_URL}/jogo-mais-chato/ranking`;

export const metadata: Metadata = {
  title: "Ranking — Jogos Mais Chatos da Copa 2026",
  description:
    "Top 10 partidas mais chatas da Copa do Mundo 2026 segundo a torcida.",
  openGraph: {
    title: "Ranking — Jogos Mais Chatos da Copa 2026",
    description: "Top 10 partidas mais chatas da Copa do Mundo 2026.",
    url: PAGE_URL,
    type: "website",
  },
  alternates: { canonical: PAGE_URL },
};

export default function RankingPage() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato", url: `${BASE_URL}/jogo-mais-chato` },
    { name: "Ranking" },
  ]);

  return (
    <>
      <JsonLd data={generateCombinedSchema([breadcrumb])} />
      <LandingHeader />
      <main
        id="main-content"
        className="container mx-auto max-w-3xl px-4 py-10"
      >
        <RankingList />
      </main>
      <LandingFooter />
    </>
  );
}
