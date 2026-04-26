import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateBreadcrumbSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import styles from "../_components/chato.module.css";

const PAGE_URL = `${BASE_URL}/jogo-mais-chato/ranking`;

async function loadRanking() {
  "use cache";
  cacheTag("ranking");
  cacheLife("minutes");
  return convexServer.query(api.boringGame.getAllTimeRanking, { limit: 10 });
}

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

export default async function RankingPage() {
  const ranked = await loadRanking();

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato", url: `${BASE_URL}/jogo-mais-chato` },
    { name: "Ranking" },
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ranking — Jogos Mais Chatos da Copa 2026",
    itemListElement: ranked.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: m.round
        ? `${BASE_URL}/jogo-mais-chato/${m.round.slug}/${m.slug}`
        : undefined,
      name: `${m.homeTeamName} x ${m.awayTeamName}`,
    })),
  };

  const top = ranked[0];
  // Datas derivadas APENAS dos docs (não Date.now()) — Next 16 cacheComponents
  // rejeita Date.now() em Server Component sem leitura prévia de request data.
  const article = top
    ? (() => {
        const oldestCreation = ranked.reduce(
          (min, m) => Math.min(min, m._creationTime),
          top._creationTime,
        );
        const lastModified = ranked.reduce(
          (max, m) => Math.max(max, m.lastVoteAt ?? m._creationTime),
          top._creationTime,
        );
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Qual o jogo mais chato da Copa do Mundo 2026?",
          author: { "@type": "Organization", name: "Figurinha Fácil" },
          publisher: {
            "@type": "Organization",
            name: "Figurinha Fácil",
            logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.svg` },
          },
          datePublished: new Date(oldestCreation).toISOString(),
          dateModified: new Date(lastModified).toISOString(),
          articleBody: `Até agora o jogo mais chato da Copa do Mundo 2026 segundo a torcida é ${top.homeTeamName} x ${top.awayTeamName}, com ${top.totalVotes.toLocaleString("pt-BR")} votos.`,
          speakable: {
            "@type": "SpeakableSpecification",
            // data-attribute selectors são imunes a renaming de classes
            // CSS-module + sobrevivem a Tailwind purge.
            cssSelector: [
              "[data-speakable='headline']",
              "[data-speakable='summary']",
            ],
          },
          url: PAGE_URL,
        };
      })()
    : null;

  return (
    <>
      <JsonLd
        data={generateCombinedSchema(
          article ? [breadcrumb, itemList, article] : [breadcrumb, itemList],
        )}
      />
      <LandingHeader />
      <main id="main-content" className="container mx-auto max-w-3xl px-4 py-10">
        <div className={styles.eyebrow}>● Hall do Sono · Copa 2026</div>
        <h1 className={`${styles.heroTitle} mt-3`} data-speakable="headline">
          Os <span className={styles.heroAccent}>jogos mais chatos</span> da
          Copa
        </h1>
        <p
          className="text-muted-foreground mt-4 max-w-xl"
          data-speakable="summary"
        >
          {top
            ? `Até agora, ${top.homeTeamName} x ${top.awayTeamName} lidera com ${top.totalVotes.toLocaleString("pt-BR")} votos.`
            : "Aguardando os primeiros votos da torcida."}
        </p>

        <section className="mt-10 space-y-3">
          {ranked.map((m, i) => {
            const href = m.round
              ? `/jogo-mais-chato/${m.round.slug}/${m.slug}`
              : "#";
            return (
              <Link key={m._id} href={href}>
                <Card className="p-4 flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
                  <div className="flex items-center gap-2">
                    {i < 3 ? (
                      <Trophy
                        className={
                          i === 0
                            ? "h-5 w-5 text-yellow-400"
                            : i === 1
                              ? "h-5 w-5 text-gray-300"
                              : "h-5 w-5 text-amber-700"
                        }
                      />
                    ) : (
                      <Badge variant="secondary" className="font-mono">
                        {i + 1}
                      </Badge>
                    )}
                  </div>
                  <div className={styles.flag} aria-hidden="true">
                    {m.homeTeamFlag}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {m.homeTeamName} × {m.awayTeamName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {m.round?.name ?? ""}
                    </div>
                  </div>
                  <div className={styles.flag} aria-hidden="true">
                    {m.awayTeamFlag}
                  </div>
                  <div className="text-right">
                    <div className={`${styles.ffDisplay} text-base text-yellow-400`}>
                      {m.totalVotes.toLocaleString("pt-BR")}
                    </div>
                    <div className="text-xs text-muted-foreground">votos</div>
                  </div>
                </Card>
              </Link>
            );
          })}
          {ranked.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              Nenhum voto ainda.
            </Card>
          ) : null}
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
