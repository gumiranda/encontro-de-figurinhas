"use client";

import { useReducer } from "react";
import { useQuery, useMutation } from "convex/react";
import { GaugeIcon } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import type { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Banner,
  BannerIcon,
  BannerTitle,
} from "@workspace/ui/components/kibo-ui/banner";
import {
  Pill,
  PillIndicator,
  type PillIndicatorProps,
} from "@workspace/ui/components/kibo-ui/pill";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import {
  Status,
  StatusIndicator,
  StatusLabel,
  type StatusProps,
} from "@workspace/ui/components/kibo-ui/status";
import { toast } from "sonner";

type MatchStatus = "scheduled" | "live" | "aet" | "penalties" | "finished";

type MatchId = Id<"worldCupMatches">;

interface ScoreState {
  home: number;
  away: number;
  status: MatchStatus;
  reason?: string;
}

interface EditorState {
  editingId: MatchId | null;
  scores: Partial<Record<MatchId, ScoreState>>;
}

type EditorAction =
  | { type: "start"; match: Doc<"worldCupMatches"> }
  | { type: "cancel" }
  | { type: "home"; matchId: MatchId; value: number }
  | { type: "away"; matchId: MatchId; value: number }
  | { type: "status"; matchId: MatchId; value: MatchStatus }
  | { type: "reason"; matchId: MatchId; value: string };

const DEFAULT_SCORE: ScoreState = {
  home: 0,
  away: 0,
  status: "scheduled",
  reason: "",
};

const MATCH_STATUS_META: Record<
  MatchStatus,
  {
    indicator: PillIndicatorProps["variant"];
    label: string;
    status: StatusProps["status"];
  }
> = {
  scheduled: {
    indicator: "info",
    label: "Agendado",
    status: "maintenance",
  },
  live: {
    indicator: "success",
    label: "Ao Vivo",
    status: "online",
  },
  aet: {
    indicator: "warning",
    label: "Prorrogação",
    status: "degraded",
  },
  penalties: {
    indicator: "warning",
    label: "Pênaltis",
    status: "degraded",
  },
  finished: {
    indicator: "error",
    label: "Finalizado",
    status: "offline",
  },
};

function isMatchStatus(value: string): value is MatchStatus {
  return value in MATCH_STATUS_META;
}

function parseScoreValue(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Erro ao atualizar placar";
}

function getScore(scores: EditorState["scores"], matchId: MatchId): ScoreState {
  return scores[matchId] ?? DEFAULT_SCORE;
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "start":
      return {
        editingId: action.match._id,
        scores: {
          ...state.scores,
          [action.match._id]: {
            home: action.match.homeScore ?? 0,
            away: action.match.awayScore ?? 0,
            status: action.match.status ?? "scheduled",
            reason: "",
          },
        },
      };
    case "cancel":
      return { ...state, editingId: null };
    case "home":
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.matchId]: {
            ...getScore(state.scores, action.matchId),
            home: action.value,
          },
        },
      };
    case "away":
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.matchId]: {
            ...getScore(state.scores, action.matchId),
            away: action.value,
          },
        },
      };
    case "status":
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.matchId]: {
            ...getScore(state.scores, action.matchId),
            status: action.value,
          },
        },
      };
    case "reason":
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.matchId]: {
            ...getScore(state.scores, action.matchId),
            reason: action.value,
          },
        },
      };
  }
}

function useMatchScoreEditor() {
  const [state, dispatch] = useReducer(editorReducer, {
    editingId: null,
    scores: {},
  });

  return {
    editingId: state.editingId,
    getScore: (matchId: MatchId) => getScore(state.scores, matchId),
    start: (match: Doc<"worldCupMatches">) =>
      dispatch({ type: "start", match }),
    cancel: () => dispatch({ type: "cancel" }),
    setHome: (matchId: MatchId, value: number) =>
      dispatch({ type: "home", matchId, value }),
    setAway: (matchId: MatchId, value: number) =>
      dispatch({ type: "away", matchId, value }),
    setStatus: (matchId: MatchId, value: MatchStatus) =>
      dispatch({ type: "status", matchId, value }),
    setReason: (matchId: MatchId, value: string) =>
      dispatch({ type: "reason", matchId, value }),
  };
}

function MatchStatusBadge({ status }: { status?: MatchStatus }) {
  const current = status ?? "scheduled";
  const meta = MATCH_STATUS_META[current];

  return (
    <Status status={meta.status}>
      <StatusIndicator />
      <StatusLabel>{meta.label}</StatusLabel>
    </Status>
  );
}

function ScorePill({ match }: { match: Doc<"worldCupMatches"> }) {
  const status = match.status ?? "scheduled";
  const meta = MATCH_STATUS_META[status];

  return (
    <Pill className="text-base font-semibold" variant="secondary">
      <PillIndicator variant={meta.indicator} />
      {match.homeScore ?? "-"} x {match.awayScore ?? "-"}
    </Pill>
  );
}

export function MatchesAdminView() {
  const matches = useQuery(api.gepeto.listMatchesForAdmin, {});
  const updateScore = useMutation(api.gepeto.updateMatchScore);
  const editor = useMatchScoreEditor();

  const handleSave = async (matchId: MatchId) => {
    const score = editor.getScore(matchId);
    const reason = score.reason?.trim() || undefined;

    try {
      await updateScore({
        matchId,
        homeScore: score.home,
        awayScore: score.away,
        status: score.status,
        reason,
      });
      toast.success("Placar atualizado!");
      editor.cancel();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!matches) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner size={18} variant="circle-filled" />
          <span>Carregando jogos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gepeto: gerenciar placares</h1>

      <Banner className="mb-6 bg-muted text-foreground" inset>
        <BannerIcon icon={GaugeIcon} />
        <BannerTitle>
          Atualizações de placar são limitadas a 10 por minuto por admin.
        </BannerTitle>
      </Banner>

      <div className="grid gap-4">
        {matches.map((match) => {
          const score = editor.getScore(match._id);

          return (
            <Card key={match._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex flex-wrap items-center gap-2">
                  <span>{match.homeTeamFlag}</span>
                  <span>{match.homeTeamName}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span>{match.awayTeamName}</span>
                  <span>{match.awayTeamFlag}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editor.editingId === match._id ? (
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        className="w-16"
                        value={score.home}
                        onChange={(e) =>
                          editor.setHome(
                            match._id,
                            parseScoreValue(e.target.value),
                          )
                        }
                      />
                      <span className="font-bold">x</span>
                      <Input
                        type="number"
                        min={0}
                        className="w-16"
                        value={score.away}
                        onChange={(e) =>
                          editor.setAway(
                            match._id,
                            parseScoreValue(e.target.value),
                          )
                        }
                      />
                    </div>

                    <Select
                      value={score.status}
                      onValueChange={(v) => {
                        if (isMatchStatus(v)) editor.setStatus(match._id, v);
                      }}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Agendado</SelectItem>
                        <SelectItem value="live">Ao Vivo</SelectItem>
                        <SelectItem value="aet">Prorrogação</SelectItem>
                        <SelectItem value="penalties">Pênaltis</SelectItem>
                        <SelectItem value="finished">Finalizado</SelectItem>
                      </SelectContent>
                    </Select>

                    {match.status === "finished" && (
                      <Input
                        placeholder="Motivo da correção"
                        className="w-48"
                        value={score.reason ?? ""}
                        onChange={(e) =>
                          editor.setReason(match._id, e.target.value)
                        }
                      />
                    )}

                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(match._id)}>
                        Salvar
                      </Button>
                      <Button variant="ghost" onClick={editor.cancel}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 items-center">
                    <ScorePill match={match} />
                    <MatchStatusBadge status={match.status} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editor.start(match)}
                    >
                      Editar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {matches.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            Nenhum jogo encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
