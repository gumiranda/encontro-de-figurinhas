"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Trophy } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import styles from "./chato.module.css";

export function RankingList() {
  const ranked = useQuery(api.boringGame.getAllTimeRanking, { limit: 10 });

  if (ranked === undefined) {
    return (
      <div className="mt-10 flex items-center gap-2 text-muted-foreground">
        <Spinner size={18} variant="circle-filled" />
        <span>Carregando ranking...</span>
      </div>
    );
  }

  const top = ranked[0];

  return (
    <>
      <div className={styles.eyebrow}>● Hall do Sono · Copa 2026</div>
      <h1 className={`${styles.heroTitle} mt-3`} data-speakable="headline">
        Os <span className={styles.heroAccent}>jogos mais chatos</span> da Copa
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
                    {m.homeTeamName}{" "}
                    {m.homeScore !== undefined && m.awayScore !== undefined
                      ? `${m.homeScore} × ${m.awayScore}`
                      : "×"}{" "}
                    {m.awayTeamName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {m.round?.name ?? ""}
                  </div>
                </div>
                <div className={styles.flag} aria-hidden="true">
                  {m.awayTeamFlag}
                </div>
                <div className="text-right">
                  <div
                    className={`${styles.ffDisplay} text-base text-yellow-400`}
                  >
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
    </>
  );
}
