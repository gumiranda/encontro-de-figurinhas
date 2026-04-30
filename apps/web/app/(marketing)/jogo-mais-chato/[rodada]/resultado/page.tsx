import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
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
import { BoringStamp } from "../../_components/boring-stamp";
import { MatchCard } from "../../_components/match-card";
import styles from "../../_components/chato.module.css";

type Props = {
  params: Promise<{ rodada: string }>;
};

async function loadRound(slug: string) {
  "use cache";
  cacheTag(`round:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.boringGame.getRoundBySlug, { slug });
}

async function loadResult(roundId: Id<"worldCupRounds">, roundSlug: string) {
  "use cache";
  // Tag granular invalidada por webhook pós-vote → TTL alto sem stale.
  cacheTag(`round:${roundSlug}`);
  cacheLife("hours");
  return convexServer.query(api.boringGame.getRoundResult, { roundId });
}

async function loadAllRoundsForParams() {
  "use cache";
  cacheTag("boring-game:rounds");
  cacheLife("hours");
  return convexServer.query(api.boringGame.listRounds, {});
}

export async function generateStaticParams() {
  const rounds = await loadAllRoundsForParams();
  if (rounds.length === 0) {
    return [{ rodada: "__placeholder__" }];
  }
  return rounds.map((r) => ({ rodada: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rodada } = await params;
  const url = `${BASE_URL}/jogo-mais-chato/${rodada}/resultado`;
  const title = "Resultado — Jogo Mais Chato";
  const description = "Veja o resultado da votação de jogo mais chato da Copa 2026.";

  return {
    title,
    description,
    openGraph: { title, description, url, type: "website" },
    alternates: { canonical: url },
  };
}

export default async function ResultadoPage({ params }: Props) {
  const { rodada } = await params;
  const round = await loadRound(rodada);
  if (!round) notFound();

  const matches = await loadResult(round._id, round.slug);

  const total = matches.reduce((acc, m) => acc + m.totalVotes, 0);
  const winner = matches[0];
  const winnerPct =
    winner && total > 0 ? Math.round((winner.totalVotes / total) * 100) : 0;

  const url = `${BASE_URL}/jogo-mais-chato/${rodada}/resultado`;

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato", url: `${BASE_URL}/jogo-mais-chato` },
    { name: round.name, url: `${BASE_URL}/jogo-mais-chato/${rodada}` },
    { name: "Resultado" },
  ]);

  const sportsEvent = winner
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: `${winner.homeTeamName} x ${winner.awayTeamName}`,
        startDate: new Date(winner.kickoffAt).toISOString(),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        sport: "Association Football",
        competitor: [
          { "@type": "SportsTeam", name: winner.homeTeamName },
          { "@type": "SportsTeam", name: winner.awayTeamName },
        ],
        organizer: {
          "@type": "Organization",
          name: "FIFA",
          url: "https://www.fifa.com",
        },
        url: `${BASE_URL}/jogo-mais-chato/${rodada}/${winner.slug}`,
        ...(winner.venue
          ? { location: { "@type": "Place", name: winner.venue } }
          : {}),
      }
    : null;

  return (
    <>
      <JsonLd
        data={generateCombinedSchema(
          sportsEvent ? [breadcrumb, sportsEvent] : [breadcrumb],
        )}
      />
      <LandingHeader />
      <main id="main-content" className="container mx-auto max-w-3xl px-4 py-10">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/jogo-mais-chato/${rodada}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {round.name}
          </Link>
        </Button>

        <div className={styles.eyebrow}>{round.name} · resultado</div>
        <h1 className={`${styles.heroTitle} mt-3`}>
          O jogo mais{" "}
          <span className={styles.heroAccent}>chato</span> foi:
        </h1>

        {winner ? (
          <Card className="mt-8 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <BoringStamp pct={winnerPct} />
              <div className="flex-1 text-center md:text-left">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-md mx-auto md:mx-0">
                  <div className="flex flex-col items-center gap-2">
                    <div className={`${styles.flag} ${styles.flagLg}`} aria-hidden="true">
                      {winner.homeTeamFlag}
                    </div>
                    <div className="font-semibold text-sm">
                      {winner.homeTeamName}
                    </div>
                  </div>
                  <div className={styles.matchScore}>×</div>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`${styles.flag} ${styles.flagLg}`} aria-hidden="true">
                      {winner.awayTeamFlag}
                    </div>
                    <div className="font-semibold text-sm">
                      {winner.awayTeamName}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  <strong className={`${styles.ffDisplay} text-base`}>
                    {winner.totalVotes.toLocaleString("pt-BR")}
                  </strong>{" "}
                  votos · {winnerPct}% da rodada
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="mt-8 p-8 text-center">
            <p className="text-muted-foreground">
              Ninguém votou nessa rodada ainda.
            </p>
            <Button asChild className="mt-4">
              <Link href={`/jogo-mais-chato/${rodada}`}>Ir votar</Link>
            </Button>
          </Card>
        )}

        {matches.length > 1 ? (
          <section className="mt-10 space-y-3">
            <h2 className={styles.muted}>Ranking da rodada</h2>
            {matches.slice(1).map((m, i) => (
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
                roundTotalVotes={total}
                rank={i + 2}
              />
            ))}
          </section>
        ) : null}
      </main>
      <LandingFooter />
    </>
  );
}
