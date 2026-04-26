import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  generateBreadcrumbSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { MatchCard } from "../_components/match-card";
import styles from "../_components/chato.module.css";

type Props = {
  params: Promise<{ rodada: string }>;
};

async function loadRoundBySlug(slug: string) {
  "use cache";
  cacheTag(`round:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.boringGame.getRoundBySlug, { slug });
}

async function loadMatches(roundId: Id<"worldCupRounds">, roundSlug: string) {
  "use cache";
  // Tag granular = webhook invalida na hora pós-vote. cacheLife alto OK.
  cacheTag(`round:${roundSlug}`);
  cacheLife("hours");
  return convexServer.query(api.boringGame.listMatchesByRound, { roundId });
}

async function loadAllRoundsForParams() {
  "use cache";
  cacheTag("boring-game:rounds");
  cacheLife("hours");
  return convexServer.query(api.boringGame.listRounds, {});
}

export async function generateStaticParams() {
  const rounds = await loadAllRoundsForParams();
  return rounds.map((r) => ({ rodada: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rodada } = await params;
  const url = `${BASE_URL}/jogo-mais-chato/${rodada}`;
  return {
    title: "Jogo Mais Chato — Copa 2026",
    description: "Vote no jogo mais chato da Copa 2026.",
    openGraph: {
      title: "Jogo Mais Chato — Copa 2026",
      description: "Vote no jogo mais chato da Copa 2026.",
      url,
      type: "website",
    },
    alternates: { canonical: url },
  };
}

export default async function RodadaPage({ params }: Props) {
  const { rodada } = await params;
  const round = await loadRoundBySlug(rodada);
  if (!round) notFound();

  const rawMatches = await loadMatches(round._id, round.slug);
  // UX: ordenar por votos desc (mais chato primeiro), tiebreaker lastVoteAt
  const matches = [...rawMatches].sort((a, b) => {
    if (b.totalVotes !== a.totalVotes) return b.totalVotes - a.totalVotes;
    return (b.lastVoteAt ?? 0) - (a.lastVoteAt ?? 0);
  });

  const totalRoundVotes = matches.reduce((acc, m) => acc + m.totalVotes, 0);

  const url = `${BASE_URL}/jogo-mais-chato/${rodada}`;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato", url: `${BASE_URL}/jogo-mais-chato` },
    { name: round.name },
  ]);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Jogos da ${round.name}`,
    itemListElement: matches.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${url}/${m.slug}`,
      name: `${m.homeTeamName} x ${m.awayTeamName}`,
    })),
  };

  return (
    <>
      <JsonLd data={generateCombinedSchema([breadcrumb, itemList])} />
      <LandingHeader />
      <main id="main-content" className="container mx-auto max-w-3xl px-4 py-10">
        <div className={styles.eyebrow}>
          ● {round.name} {round.isActive ? "· ao vivo" : ""}
        </div>
        <h1 className={`${styles.heroTitle} mt-3`}>
          Qual foi <span className={styles.heroAccent}>o jogo mais chato</span>{" "}
          dessa rodada?
        </h1>
        <p className="text-muted-foreground mt-4 max-w-xl">
          Você assistiu. Você sofreu. Agora vote pra dar o troco.
        </p>

        <div className="mt-4 text-xs text-muted-foreground">
          <strong className={styles.ffDisplay}>
            {totalRoundVotes.toLocaleString("pt-BR")}
          </strong>{" "}
          já votaram nessa rodada
        </div>

        <section className="mt-8 space-y-3">
          <h2 className={styles.muted}>
            Escolha um · {matches.length} jogo{matches.length === 1 ? "" : "s"}
          </h2>
          {matches.map((m) => (
            <MatchCard
              key={m._id}
              href={`/jogo-mais-chato/${rodada}/${m.slug}`}
              homeTeamFlag={m.homeTeamFlag}
              homeTeamName={m.homeTeamName}
              homeTeamCode={m.homeTeamCode}
              awayTeamFlag={m.awayTeamFlag}
              awayTeamName={m.awayTeamName}
              awayTeamCode={m.awayTeamCode}
              totalVotes={m.totalVotes}
              roundTotalVotes={totalRoundVotes}
            />
          ))}
        </section>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-white/5 p-5">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <div>
              <div className="font-semibold text-sm">
                Ver vencedor da rodada
              </div>
              <div className="text-xs text-muted-foreground">
                Quem foi eleito o jogo mais chato até agora
              </div>
            </div>
          </div>
          <Button asChild variant="ghost">
            <Link href={`/jogo-mais-chato/${rodada}/resultado`}>
              Resultado
            </Link>
          </Button>
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
