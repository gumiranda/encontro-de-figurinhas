"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { ExternalLink, Trophy } from "lucide-react";
import { toast } from "sonner";

function formatDate(value: number) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminBoringGamePage() {
  const rounds = useQuery(api.boringGame.listRoundsForAdmin, {});
  const setRoundActive = useMutation(api.boringGame.setRoundActive);
  const setMatchScore = useMutation(api.boringGame.setMatchScore);
  const [pendingId, setPendingId] = useState<Id<"worldCupRounds"> | null>(null);
  const [pendingMatchId, setPendingMatchId] =
    useState<Id<"worldCupMatches"> | null>(null);
  const [scores, setScores] = useState<
    Record<string, { home: string; away: string }>
  >({});

  const getScoreDraft = (
    match: NonNullable<typeof rounds>[number]["matches"][number],
  ) =>
    scores[String(match._id)] ?? {
      home: match.homeScore?.toString() ?? "",
      away: match.awayScore?.toString() ?? "",
    };

  const setScoreDraft = (
    match: NonNullable<typeof rounds>[number]["matches"][number],
    field: "home" | "away",
    value: string,
  ) => {
    const current = getScoreDraft(match);
    setScores((prev) => ({
      ...prev,
      [String(match._id)]: { ...current, [field]: value },
    }));
  };

  const handleToggle = async (
    roundId: Id<"worldCupRounds">,
    isActive: boolean,
  ) => {
    setPendingId(roundId);
    try {
      await setRoundActive({ roundId, isActive });
      toast.success(isActive ? "Rodada ativada" : "Rodada desativada");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar");
    } finally {
      setPendingId(null);
    }
  };

  const handleSaveScore = async (
    match: NonNullable<typeof rounds>[number]["matches"][number],
  ) => {
    const draft = getScoreDraft(match);
    const homeScore = Number(draft.home);
    const awayScore = Number(draft.away);

    if (
      draft.home.trim() === "" ||
      draft.away.trim() === "" ||
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore) ||
      homeScore < 0 ||
      awayScore < 0
    ) {
      toast.error("Placar precisa ser inteiro e não negativo");
      return;
    }

    setPendingMatchId(match._id);
    try {
      await setMatchScore({ matchId: match._id, homeScore, awayScore });
      toast.success("Placar salvo");
      setScores((prev) => ({
        ...prev,
        [String(match._id)]: {
          home: String(homeScore),
          away: String(awayScore),
        },
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar");
    } finally {
      setPendingMatchId(null);
    }
  };

  if (!rounds) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner size={18} variant="circle-filled" />
          <span>Carregando rodadas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Jogo Mais Chato</h1>
          </div>
          <p className="text-muted-foreground">
            Controle quais rodadas aparecem abertas para votação. O placar é
            único — salvar aqui também atualiza Gepeto e libera votação.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/matches">Placar e status completos</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/jogo-mais-chato">
              Ver feature
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {rounds.map((round) => {
          const isPending = pendingId === round._id;

          return (
            <Card key={round._id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{round.name}</CardTitle>
                    <CardDescription>
                      {round.phase} · {formatDate(round.startDate)} a{" "}
                      {formatDate(round.endDate)}
                    </CardDescription>
                  </div>
                  <Badge variant={round.isActive ? "default" : "secondary"}>
                    {round.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={round.isActive ? "secondary" : "default"}
                    disabled={isPending}
                    onClick={() => handleToggle(round._id, !round.isActive)}
                  >
                    {isPending
                      ? "Salvando..."
                      : round.isActive
                        ? "Desativar votação"
                        : "Ativar votação"}
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/jogo-mais-chato/${round.slug}`}>
                      Abrir rodada
                    </Link>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href={`/jogo-mais-chato/${round.slug}/resultado`}>
                      Ver resultado
                    </Link>
                  </Button>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <h2 className="text-sm font-semibold">Partidas</h2>
                  {round.matches.map((match) => {
                    const draft = getScoreDraft(match);
                    const isSavingScore = pendingMatchId === match._id;
                    const hasScore =
                      match.homeScore !== undefined &&
                      match.awayScore !== undefined;
                    const draftHasScore =
                      draft.home.trim() !== "" && draft.away.trim() !== "";

                    return (
                      <div
                        key={match._id}
                        className="flex flex-wrap items-center gap-3 rounded-md border p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">
                            {match.homeTeamFlag} {match.homeTeamName} vs{" "}
                            {match.awayTeamName} {match.awayTeamFlag}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(match.kickoffAt).toLocaleString("pt-BR")}
                          </div>
                        </div>

                        <Badge variant={hasScore ? "default" : "secondary"}>
                          {draftHasScore
                            ? `${draft.home} x ${draft.away}`
                            : hasScore
                              ? `${match.homeScore} x ${match.awayScore}`
                              : "Sem placar"}
                        </Badge>

                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min={0}
                            className="w-16"
                            value={draft.home}
                            onChange={(event) =>
                              setScoreDraft(match, "home", event.target.value)
                            }
                            aria-label={`Placar de ${match.homeTeamName}`}
                          />
                          <span className="font-bold">x</span>
                          <Input
                            type="number"
                            min={0}
                            className="w-16"
                            value={draft.away}
                            onChange={(event) =>
                              setScoreDraft(match, "away", event.target.value)
                            }
                            aria-label={`Placar de ${match.awayTeamName}`}
                          />
                        </div>

                        <Button
                          size="sm"
                          disabled={isSavingScore}
                          onClick={() => handleSaveScore(match)}
                        >
                          {isSavingScore ? "Salvando..." : "Salvar placar"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
