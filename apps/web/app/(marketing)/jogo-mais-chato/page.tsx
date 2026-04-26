import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
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
import styles from "./_components/chato.module.css";

const PAGE_URL = `${BASE_URL}/jogo-mais-chato`;

async function loadActiveRound() {
  "use cache";
  cacheTag("boring-game:active");
  cacheLife("minutes");
  return convexServer.query(api.boringGame.getActiveRound, {});
}

async function loadRounds() {
  "use cache";
  cacheTag("boring-game:rounds");
  cacheLife("hours");
  return convexServer.query(api.boringGame.listRounds, {});
}

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

export default async function JogoMaisChatoHomePage() {
  const [activeRound, allRounds] = await Promise.all([
    loadActiveRound(),
    loadRounds(),
  ]);

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
                {activeRound.phase === "groups" ? "Fase de Grupos" : activeRound.phase}
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
      </main>
      <LandingFooter />
    </>
  );
}
