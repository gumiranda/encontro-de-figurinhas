"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { WeeklyNarrative } from "@/modules/gepeto";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card, CardContent } from "@workspace/ui/components/card";

interface WeeklyClientProps {
  weekNumber: number;
  year: number;
  initialNarrative?: {
    weekNumber: number;
    year: number;
    narrative: string;
    gepetoScore: number;
    communityScore: number;
  } | null;
}

function displayName(
  profile: { displayNickname?: string; nickname?: string } | null | undefined,
) {
  return profile?.displayNickname?.trim() || profile?.nickname || "colecionador";
}

const PHASE_NAMES: Record<number, string> = {
  1: "Fase de Grupos A",
  2: "Fase de Grupos B",
  3: "Oitavas de Final",
  4: "Quartas de Final",
  5: "Semifinais",
  6: "Disputa 3º Lugar",
  7: "Final",
};

export function WeeklyClient({
  weekNumber,
  year,
  initialNarrative,
}: WeeklyClientProps) {
  const narrative = useQuery(api.gepeto.getWeeklyNarrative, {
    weekNumber,
    year,
  });
  const profile = useQuery(api.users.getProfileSettings);

  const data = narrative ?? initialNarrative;
  const userNickname = displayName(profile);

  if (narrative === undefined && !initialNarrative) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">📖</div>
          <h2 className="text-lg font-semibold mb-2">
            Capítulo {weekNumber} ainda não foi escrito
          </h2>
          <p className="text-muted-foreground text-sm">
            O Gepeto ainda está analisando os jogos desta semana. Volte em breve!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Mock highlights - in production these would come from the backend
  const mockHighlights = [
    {
      matchup: "BRA × ARG",
      gepetoPrediction: "2-1",
      actualResult: "2-1",
      gepetoGotIt: true,
      communityGotIt: false,
      gepetoVoice: "Brasil em casa, Argentina sem Otamendi. Era 2-1 desde a escalação.",
      reasoning: [
        "Brasil 80% aproveitamento nos últimos 5 jogos",
        "Argentina marca 1.1 gols/jogo fora de casa",
        "Vini Jr. fez 4 gols nos últimos 3 contra ARG",
      ],
    },
    {
      matchup: "FRA × NED",
      gepetoPrediction: "1-0",
      actualResult: "0-1",
      gepetoGotIt: false,
      communityGotIt: true,
      gepetoVoice: "Subestimei Gakpo. Reconheço o erro. Na próxima eu acerto.",
      reasoning: [
        "Apostei na defesa francesa que estava 4 jogos sem sofrer",
        "Mas Gakpo fez 3 gols nos últimos 2 amistosos",
        "Mbappé jogou contundido",
      ],
    },
  ];

  return (
    <WeeklyNarrative
      weekNumber={data.weekNumber}
      phase={PHASE_NAMES[data.weekNumber] ?? `Semana ${data.weekNumber}`}
      gepetoScore={data.gepetoScore}
      communityScore={data.communityScore}
      totalMatches={16}
      narrative={data.narrative}
      highlights={mockHighlights}
      topHumans={[
        { nickname: userNickname, score: 14, isMe: true },
        { nickname: "rafa_dias", score: 13 },
        { nickname: "carol_m", score: 12 },
      ]}
      onShare={() => {
        const text = `Capítulo ${data.weekNumber} - Gepeto ${data.gepetoScore} x ${data.communityScore} Humanos`;
        if (navigator.share) {
          navigator.share({ text, url: window.location.href });
        }
      }}
    />
  );
}
