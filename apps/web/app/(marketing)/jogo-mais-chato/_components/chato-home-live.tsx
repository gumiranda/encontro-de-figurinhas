"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowRight, Trophy } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import styles from "./chato.module.css";

export function ChatoHomeLive() {
  const activeRound = useQuery(api.boringGame.getActiveRound, {});
  const allRounds = useQuery(api.boringGame.listRounds, {});

  if (activeRound === undefined || allRounds === undefined) {
    return (
      <div className="mt-8 flex items-center gap-2 text-muted-foreground">
        <Spinner size={18} variant="circle-filled" />
        <span>Carregando rodadas...</span>
      </div>
    );
  }

  return (
    <>
      <div className={styles.eyebrow}>● Jogo Mais Chato · Copa 2026</div>
      <h1 className={`${styles.heroTitle} mt-3`}>
        Qual foi <span className={styles.heroAccent}>o jogo mais chato</span>{" "}
        dessa Copa?
      </h1>
      <p className="text-muted-foreground mt-4 max-w-xl">
        Você assistiu. Você sofreu. Agora vote pra dar o troco.
      </p>

      {activeRound ? (
        <Card className="mt-8 p-5 flex items-center justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              Rodada ao vivo
            </Badge>
            <div className={`${styles.ffDisplay} text-lg`}>
              {activeRound.name}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {activeRound.phase === "groups"
                ? "Fase de Grupos"
                : activeRound.phase}
            </div>
          </div>
          <Button asChild className={`${styles.btnMeme} h-12 px-6`}>
            <Link href={`/jogo-mais-chato/${activeRound.slug}`}>
              Votar agora <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </Card>
      ) : null}

      {allRounds.length > 0 ? (
        <section className="mt-10">
          <h2 className={`${styles.muted} mb-3`}>Todas as rodadas</h2>
          <div className="grid gap-2">
            {allRounds.map((r) => (
              <Link
                key={r._id}
                href={`/jogo-mais-chato/${r.slug}`}
                className="block"
              >
                <Card className="p-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.isActive ? "Ao vivo" : "Encerrada"}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 flex items-center justify-between gap-4 rounded-xl border border-white/5 p-5">
        <div className="flex items-center gap-3">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <div>
            <div className="font-semibold text-sm">Ranking all-time</div>
            <div className="text-xs text-muted-foreground">
              Os jogos mais chatos de todas as rodadas
            </div>
          </div>
        </div>
        <Button asChild variant="ghost">
          <Link href="/jogo-mais-chato/ranking">
            Ver ranking <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </>
  );
}
