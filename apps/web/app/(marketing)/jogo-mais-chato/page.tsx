import type { Metadata } from "next";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateBreadcrumbSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ChatoHomeLive } from "./_components/chato-home-live";

const PAGE_URL = `${BASE_URL}/jogo-mais-chato`;

export const metadata: Metadata = {
  title: "Jogo Mais Chato da Copa 2026 — Vote!",
  description:
    "Vote no jogo mais chato de cada rodada da Copa do Mundo 2026. Eleja partidas mornas, narradores dormindo e potencial de meme.",
  keywords: [
    "jogo mais chato copa 2026",
    "votação copa do mundo",
    "jogo chato",
    "ranking jogos copa",
    "torcida copa 2026",
  ],
  openGraph: {
    title: "Jogo Mais Chato da Copa 2026 — Vote!",
    description:
      "Vote no jogo mais chato de cada rodada da Copa do Mundo 2026.",
    url: PAGE_URL,
    type: "website",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function JogoMaisChatoHomePage() {
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato" },
  ]);

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Jogo Mais Chato da Copa 2026",
    description:
      "Vote no jogo mais chato de cada rodada da Copa do Mundo 2026.",
    url: PAGE_URL,
  };

  return (
    <>
      <JsonLd data={generateCombinedSchema([webPage, breadcrumb])} />
      <LandingHeader />
      <main id="main-content" className="container mx-auto max-w-3xl px-4 py-10">
        <ChatoHomeLive />
      </main>
      <LandingFooter />
    </>
  );
}
