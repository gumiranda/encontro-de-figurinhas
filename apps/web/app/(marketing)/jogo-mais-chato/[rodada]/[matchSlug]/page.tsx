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
import {
  generateBreadcrumbSchema,
  generateCombinedSchema,
  generateFAQSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { VoteCard } from "../../_components/vote-card";
import styles from "../../_components/chato.module.css";

interface Props {
  params: Promise<{ rodada: string; matchSlug: string }>;
}

async function loadMatchBySlug(slug: string) {
  "use cache";
  // Tag granular invalidada por webhook pós-vote → TTL alto sem stale.
  cacheTag(`match:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.boringGame.getMatchBySlug, { slug });
}

const REASON_LABEL: Record<string, string> = {
  sem_chances: "Não teve chances de gol",
  jogo_truncado: "Jogo muito truncado",
  sem_estrelas: "Sem craques em campo",
  placar_morno: "Placar morno demais",
  narrador_dormindo: "O narrador dormiu",
  meme_potencial: "Tem potencial de meme",
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { rodada, matchSlug } = await params;
  const data = await loadMatchBySlug(matchSlug);
  if (!data) return { title: "Jogo não encontrado" };
  const { match, round } = data;
  const url = `${BASE_URL}/jogo-mais-chato/${rodada}/${matchSlug}`;
  const title = `${match.homeTeamName} x ${match.awayTeamName} — Foi o jogo mais chato?`;
  const description = `Diga por que ${match.homeTeamName} x ${match.awayTeamName} pela ${round.name} foi (ou não foi) chato. ${match.totalVotes.toLocaleString("pt-BR")} já votaram.`;
  return {
    title,
    description,
    openGraph: { title, description, url, type: "website" },
    alternates: { canonical: url },
  };
}

export default async function MatchDetailPage({ params }: Props) {
  const { rodada, matchSlug } = await params;
  const data = await loadMatchBySlug(matchSlug);
  if (!data) notFound();
  const { match, round } = data;

  const url = `${BASE_URL}/jogo-mais-chato/${rodada}/${matchSlug}`;

  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato", url: `${BASE_URL}/jogo-mais-chato` },
    { name: round.name, url: `${BASE_URL}/jogo-mais-chato/${rodada}` },
    { name: `${match.homeTeamName} x ${match.awayTeamName}` },
  ]);

  const sportsEvent = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${match.homeTeamName} x ${match.awayTeamName}`,
    startDate: new Date(match.kickoffAt).toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: "Association Football",
    competitor: [
      { "@type": "SportsTeam", name: match.homeTeamName },
      { "@type": "SportsTeam", name: match.awayTeamName },
    ],
    organizer: {
      "@type": "Organization",
      name: "FIFA",
      url: "https://www.fifa.com",
    },
    url,
    ...(match.venue
      ? { location: { "@type": "Place", name: match.venue } }
      : {}),
  };

  const faq = generateFAQSchema([
    {
      question: `Por que ${match.homeTeamName} x ${match.awayTeamName} pode ser considerado chato?`,
      answer:
        "A torcida vota nos motivos mais comuns: jogo sem chances de gol, jogo truncado, sem craques em campo, placar morno, narrador dormindo, ou potencial de meme.",
    },
    {
      question: "Como vota?",
      answer:
        "Faça login com sua conta Figurinha Fácil e selecione um ou mais motivos. Você pode mudar seu voto a qualquer momento.",
    },
  ]);

  const totalReasonVotes = Object.values(match.reasonCounts).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <>
      <JsonLd data={generateCombinedSchema([breadcrumb, sportsEvent, faq])} />
      <LandingHeader />
      <main id="main-content" className="container mx-auto max-w-3xl px-4 py-10">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/jogo-mais-chato/${rodada}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {round.name}
          </Link>
        </Button>

        <div className={styles.eyebrow}>{round.name}</div>
        <h1 className={`${styles.heroTitle} mt-3`}>
          {match.homeTeamName}{" "}
          <span className={styles.heroAccent}>×</span> {match.awayTeamName}
        </h1>

        <Card className="mt-6 p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className={`${styles.flag} ${styles.flagLg}`} aria-hidden="true">
                {match.homeTeamFlag}
              </div>
              <div className="font-semibold text-base text-center">
                {match.homeTeamName}
              </div>
              <div className="text-xs text-muted-foreground">
                {match.homeTeamCode}
              </div>
            </div>
            <div className={`${styles.matchScore} text-2xl`}>×</div>
            <div className="flex flex-col items-center gap-2">
              <div className={`${styles.flag} ${styles.flagLg}`} aria-hidden="true">
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

        <div className="mt-6">
          <VoteCard
            matchId={match._id}
            matchSlug={matchSlug}
            initialReasons={[]}
          />
        </div>

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
                      <span className={`${styles.ffDisplay} text-sm w-12 text-right`}>
                        {pct}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </section>
        ) : null}
      </main>
      <LandingFooter />
    </>
  );
}
