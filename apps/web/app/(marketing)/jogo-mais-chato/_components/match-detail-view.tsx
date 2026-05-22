"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { VoteCard } from "./vote-card";
import styles from "./chato.module.css";

const REASON_LABEL: Record<string, string> = {
  sem_chances: "Não teve chances de gol",
  jogo_truncado: "Jogo muito truncado",
  sem_estrelas: "Sem craques em campo",
  placar_morno: "Placar morno demais",
  narrador_dormindo: "O narrador dormiu",
  meme_potencial: "Tem potencial de meme",
};

type Props = {
  matchSlug: string;
  roundSlug: string;
};

export function MatchDetailView({ matchSlug, roundSlug }: Props) {
  const data = useQuery(api.boringGame.getMatchBySlug, { slug: matchSlug });

  if (data === undefined) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Spinner size={18} variant="circle-filled" />
        <span>Carregando jogo...</span>
      </div>
    );
  }

  if (data === null) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        Jogo não encontrado ou rodada inativa.
      </Card>
    );
  }

  const { match, round } = data;
  const totalReasonVotes = Object.values(match.reasonCounts).reduce(
    (a, b) => a + b,
    0,
  );
  const hasScore =
    match.homeScore !== undefined && match.awayScore !== undefined;

  return (
    <>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href={`/jogo-mais-chato/${roundSlug}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {round.name}
        </Link>
      </Button>

      <div className={styles.eyebrow}>{round.name}</div>
      <h1 className={`${styles.heroTitle} mt-3`}>
        {match.homeTeamName} <span className={styles.heroAccent}>×</span>{" "}
        {match.awayTeamName}
      </h1>

      <Card className="mt-6 p-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div
              className={`${styles.flag} ${styles.flagLg}`}
              aria-hidden="true"
            >
              {match.homeTeamFlag}
            </div>
            <div className="font-semibold text-base text-center">
              {match.homeTeamName}
            </div>
            <div className="text-xs text-muted-foreground">
              {match.homeTeamCode}
            </div>
          </div>
          <div className={styles.matchScoreHero}>
            {hasScore ? `${match.homeScore} × ${match.awayScore}` : "×"}
          </div>
          <div className="flex flex-col items-center gap-2">
            <div
              className={`${styles.flag} ${styles.flagLg}`}
              aria-hidden="true"
            >
              {match.awayTeamFlag}
            </div>
            <div className="font-semibold text-base text-center">
              {match.awayTeamName}
            </div>
            <div className="text-xs text-muted-foreground">
              {match.awayTeamCode}
            </div>
          </div>
        </div>
        {match.venue ? (
          <div className="mt-4 text-xs text-center text-muted-foreground">
            {match.venue}
          </div>
        ) : null}
        <div className="mt-4 text-center">
          <strong className={`${styles.ffDisplay} text-lg`}>
            {match.totalVotes.toLocaleString("pt-BR")}
          </strong>{" "}
          <span className="text-xs text-muted-foreground uppercase tracking-widest">
            votos · jogo chato
          </span>
        </div>
      </Card>

      {hasScore ? (
        <div className="mt-6">
          <VoteCard
            matchId={match._id}
            matchSlug={matchSlug}
            initialReasons={[]}
          />
        </div>
      ) : (
        <Card className="mt-6 p-5 text-center">
          <p className="text-sm text-muted-foreground">
            Votação abre quando o placar for definido.
          </p>
        </Card>
      )}

      {totalReasonVotes > 0 ? (
        <section className="mt-8">
          <h2 className={`${styles.muted} mb-3`}>Motivos mais votados</h2>
          <div className="grid gap-2">
            {Object.entries(match.reasonCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([key, count]) => {
                const pct =
                  totalReasonVotes > 0
                    ? Math.round((count / totalReasonVotes) * 100)
                    : 0;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 text-xs text-muted-foreground"
                  >
                    <span className="w-44 truncate text-foreground/80 text-sm">
                      {REASON_LABEL[key] ?? key}
                    </span>
                    <div className={`${styles.barTrack} flex-1`}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span
                      className={`${styles.ffDisplay} text-sm w-12 text-right`}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
          </div>
        </section>
      ) : null}
    </>
  );
}
