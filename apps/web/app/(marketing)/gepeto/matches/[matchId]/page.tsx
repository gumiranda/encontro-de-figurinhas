import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { GepetoMatchClient } from "./client";

interface Props {
  params: Promise<{ matchId: string }>;
}

async function getMatchData(matchId: string) {
  const convexMatchId = matchId as Id<"worldCupMatches">;
  let match;

  try {
    match = await fetchQuery(api.boringGame.getMatch, {
      matchId: convexMatchId,
    });
  } catch {
    return null;
  }

  if (!match) return null;

  const aiPrediction = await fetchQuery(api.gepeto.getAIPrediction, {
    matchId: convexMatchId,
  });

  return { match, aiPrediction, matchId: convexMatchId };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { matchId } = await params;
  const data = await getMatchData(matchId);

  if (!data) {
    return { title: "Jogo não encontrado" };
  }

  const { match, aiPrediction } = data;
  const predictionText = aiPrediction
    ? aiPrediction.prediction === "home"
      ? match.homeTeamName
      : aiPrediction.prediction === "away"
        ? match.awayTeamName
        : "Empate"
    : "Em análise";

  return {
    title: `Gepeto prevê: ${match.homeTeamName} x ${match.awayTeamName}`,
    description: `A IA Gepeto previu ${predictionText} para ${match.homeTeamName} x ${match.awayTeamName}. Faça seu palpite e ganhe o badge "Bati a IA"!`,
    openGraph: {
      title: `Gepeto prevê: ${match.homeTeamName} x ${match.awayTeamName}`,
      description: `Previsão da IA: ${predictionText}`,
    },
  };
}

export default async function GepetoMatchPage({ params }: Props) {
  const { matchId } = await params;
  const data = await getMatchData(matchId);

  if (!data) {
    notFound();
  }

  const { match, aiPrediction, matchId: convexMatchId } = data;

  return (
    <>
      <LandingHeader />
      <main className="container mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {match.homeTeamFlag} {match.homeTeamName} vs {match.awayTeamName}{" "}
            {match.awayTeamFlag}
          </h1>
          <p className="text-muted-foreground">
            {new Date(match.kickoffAt).toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <GepetoMatchClient matchId={convexMatchId} match={match} />
      </main>
      <LandingFooter />
    </>
  );
}
