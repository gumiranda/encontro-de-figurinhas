"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { BoringStamp } from "./boring-stamp";
import { MatchCard } from "./match-card";
import styles from "./chato.module.css";

type Props = {
  roundId: Id<"worldCupRounds">;
  roundSlug: string;
  roundName: string;
};

export function RoundResultView({ roundId, roundSlug, roundName }: Props) {
  const matches = useQuery(api.boringGame.getRoundResult, { roundId });

  if (matches === undefined) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Spinner size={18} variant="circle-filled" />
        <span>Carregando resultado...</span>
      </div>
    );
  }

  const total = matches.reduce((acc, m) => acc + m.totalVotes, 0);
  const winner = matches[0];
  const winnerPct =
    winner && total > 0 ? Math.round((winner.totalVotes / total) * 100) : 0;

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={`/jogo-mais-chato/${roundSlug}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {roundName}
        </Link>
      </Button>

      <div className={styles.eyebrow}>{roundName} · resultado</div>
      <h1 className={`${styles.heroTitle} mt-3`}>
        O jogo mais <span className={styles.heroAccent}>chato</span> foi:
      </h1>

      {winner ? (
        <Card className="mt-8 p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <BoringStamp pct={winnerPct} />
            <div className="flex-1 text-center md:text-left">
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 max-w-md mx-auto md:mx-0">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`${styles.flag} ${styles.flagLg}`}
                    aria-hidden="true"
                  >
                    {winner.homeTeamFlag}
                  </div>
                  <div className="font-semibold text-sm">
                    {winner.homeTeamName}
                  </div>
                </div>
                <div className={styles.matchScoreHero}>
                  {winner.homeScore !== undefined &&
                  winner.awayScore !== undefined
                    ? `${winner.homeScore} × ${winner.awayScore}`
                    : "×"}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`${styles.flag} ${styles.flagLg}`}
                    aria-hidden="true"
                  >
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
            <Link href={`/jogo-mais-chato/${roundSlug}`}>Ir votar</Link>
          </Button>
        </Card>
      )}

      {matches.length > 1 ? (
        <section className="mt-10 space-y-3">
          <h2 className={styles.muted}>Ranking da rodada</h2>
          {matches.slice(1).map((m, i) => (
            <MatchCard
              key={m._id}
              href={`/jogo-mais-chato/${roundSlug}/${m.slug}`}
              homeTeamFlag={m.homeTeamFlag}
              homeTeamName={m.homeTeamName}
              homeTeamCode={m.homeTeamCode}
              awayTeamFlag={m.awayTeamFlag}
              awayTeamName={m.awayTeamName}
              awayTeamCode={m.awayTeamCode}
              homeScore={m.homeScore}
              awayScore={m.awayScore}
              totalVotes={m.totalVotes}
              roundTotalVotes={total}
              rank={i + 2}
            />
          ))}
        </section>
      ) : null}
    </>
  );
}
