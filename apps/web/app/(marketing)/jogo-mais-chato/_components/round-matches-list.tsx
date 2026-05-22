"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Trophy } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { MatchCard } from "./match-card";
import styles from "./chato.module.css";

type Props = {
  roundId: Id<"worldCupRounds">;
  roundSlug: string;
  roundName: string;
  isActive: boolean;
};

export function RoundMatchesList({
  roundId,
  roundSlug,
  roundName,
  isActive,
}: Props) {
  const rawMatches = useQuery(api.boringGame.listMatchesByRound, { roundId });

  if (rawMatches === undefined) {
    return (
      <div className="mt-8 flex items-center gap-2 text-muted-foreground">
        <Spinner size={18} variant="circle-filled" />
        <span>Carregando jogos...</span>
      </div>
    );
  }

  const matches = [...rawMatches].sort((a, b) => {
    if (b.totalVotes !== a.totalVotes) return b.totalVotes - a.totalVotes;
    return (b.lastVoteAt ?? 0) - (a.lastVoteAt ?? 0);
  });
  const totalRoundVotes = matches.reduce((acc, m) => acc + m.totalVotes, 0);

  return (
    <>
      <div className={styles.eyebrow}>
        ● {roundName} {isActive ? "· ao vivo" : ""}
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
            roundTotalVotes={totalRoundVotes}
          />
        ))}
      </section>

      <div className="mt-8 flex items-center justify-between gap-4 rounded-xl border border-white/5 p-5">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <div>
            <div className="font-semibold text-sm">Ver vencedor da rodada</div>
            <div className="text-xs text-muted-foreground">
              Quem foi eleito o jogo mais chato até agora
            </div>
          </div>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/jogo-mais-chato/${roundSlug}/resultado`}>
            Resultado
          </Link>
        </Button>
      </div>
    </>
  );
}
