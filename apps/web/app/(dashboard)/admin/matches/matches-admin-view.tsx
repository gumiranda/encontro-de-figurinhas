"use client";

import { useReducer, useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { Bot, GaugeIcon, Pencil, Users } from "lucide-react";
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
import { ConfidenceMeter, ReasoningCard } from "@/modules/gepeto";

type MatchStatus = "scheduled" | "live" | "aet" | "penalties" | "finished";
type GepetoPrediction = "home" | "draw" | "away";

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

function GepetoPredictionEditor({
  match,
  existingPrediction,
  onCancel,
  onSaved,
}: {
  match: Doc<"worldCupMatches">;
  existingPrediction: Doc<"aiPredictions"> | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const setPrediction = useMutation(api.gepeto.setAIPredictionAdmin);
  const [prediction, setOutcome] = useState<GepetoPrediction | null>(
    existingPrediction?.prediction ?? null,
  );
  const [homeScore, setHomeScore] = useState(
    existingPrediction?.exactScore.home ?? 0,
  );
  const [awayScore, setAwayScore] = useState(
    existingPrediction?.exactScore.away ?? 0,
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!prediction) {
      toast.error("Selecione vitória ou empate");
      return;
    }

    setIsSaving(true);
    try {
      await setPrediction({
        matchId: match._id,
        prediction,
        exactScore: { home: homeScore, away: awayScore },
      });
      toast.success("Palpite salvo manualmente!");
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md border border-dashed p-3">
      <p className="text-sm font-medium">Definir palpite manualmente</p>
      <div className="grid grid-cols-3 gap-2">
        <Button
          type="button"
          variant={prediction === "home" ? "default" : "outline"}
          size="sm"
          onClick={() => setOutcome("home")}
        >
          {match.homeTeamName}
        </Button>
        <Button
          type="button"
          variant={prediction === "draw" ? "default" : "outline"}
          size="sm"
          onClick={() => setOutcome("draw")}
        >
          Empate
        </Button>
        <Button
          type="button"
          variant={prediction === "away" ? "default" : "outline"}
          size="sm"
          onClick={() => setOutcome("away")}
        >
          {match.awayTeamName}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          min={0}
          className="w-16"
          value={homeScore}
          onChange={(e) => setHomeScore(parseScoreValue(e.target.value))}
        />
        <span className="font-bold">x</span>
        <Input
          type="number"
          min={0}
          className="w-16"
          value={awayScore}
          onChange={(e) => setAwayScore(parseScoreValue(e.target.value))}
        />
      </div>
      {existingPrediction ? (
        <p className="text-xs text-muted-foreground">
          Confiança, reasoning e trash talk da IA permanecem iguais.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !prediction}
        >
          {isSaving ? "Salvando..." : "Salvar palpite"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}

function GepetoPredictionDetail({
  match,
  prediction,
}: {
  match: Doc<"worldCupMatches">;
  prediction: Doc<"aiPredictions">;
}) {
  const outcome =
    prediction.prediction === "home"
      ? match.homeTeamName
      : prediction.prediction === "away"
        ? match.awayTeamName
        : "Empate";

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">
        {outcome} · {prediction.exactScore.home} x {prediction.exactScore.away}
      </p>
      <ConfidenceMeter value={prediction.confidence} />
      {prediction.trashTalk ? (
        <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
          &ldquo;{prediction.trashTalk}&rdquo;
        </p>
      ) : null}
      <ReasoningCard reasoning={prediction.reasoning} />
    </div>
  );
}

function TeamEditor({
  match,
  onCancel,
  onSaved,
}: {
  match: Doc<"worldCupMatches">;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const teams = useQuery(api.gepeto.listAvailableTeams, {});
  const updateTeams = useMutation(api.gepeto.updateMatchTeams);
  const [homeTeamCode, setHomeTeamCode] = useState(match.homeTeamCode);
  const [awayTeamCode, setAwayTeamCode] = useState(match.awayTeamCode);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!teams) return;
    const homeTeam = teams.find((t) => t.code === homeTeamCode);
    const awayTeam = teams.find((t) => t.code === awayTeamCode);
    if (!homeTeam || !awayTeam) {
      toast.error("Selecione times válidos");
      return;
    }
    if (homeTeamCode === awayTeamCode) {
      toast.error("Times devem ser diferentes");
      return;
    }

    setIsSaving(true);
    try {
      await updateTeams({ matchId: match._id, homeTeam, awayTeam });
      toast.success("Times atualizados!");
      onSaved();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (!teams) {
    return <div className="text-sm text-muted-foreground">Carregando times...</div>;
  }

  return (
    <div className="space-y-3 rounded-md border border-dashed p-3">
      <p className="text-sm font-medium">Editar times do confronto</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground">Mandante</label>
          <Select value={homeTeamCode} onValueChange={setHomeTeamCode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.code} value={team.code}>
                  {team.flag} {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Visitante</label>
          <Select value={awayTeamCode} onValueChange={setAwayTeamCode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.code} value={team.code}>
                  {team.flag} {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Salvando..." : "Salvar times"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
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
  const generatePrediction = useAction(api.gepeto.generateAIPredictionAdmin);
  const [generatingId, setGeneratingId] = useState<MatchId | null>(null);
  const [editingPredictionId, setEditingPredictionId] = useState<MatchId | null>(
    null,
  );
  const [editingTeamsId, setEditingTeamsId] = useState<MatchId | null>(null);
  const editor = useMatchScoreEditor();

  const handleGenerate = async (matchId: MatchId, force: boolean) => {
    setGeneratingId(matchId);
    try {
      const result = await generatePrediction({ matchId, force });
      if (result?.skipped && result.reason === "already-exists") {
        toast.info("Palpite já existe. Use Regenerar para substituir.");
        return;
      }
      toast.success(force ? "Palpite regenerado!" : "Palpite gerado!");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGeneratingId(null);
    }
  };

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
      <h1 className="text-2xl font-bold mb-2">Gepeto: gerenciar jogos</h1>
      <p className="text-muted-foreground mb-6 max-w-2xl">
        <strong>Placar final</strong> = resultado real (mesmo dado do Jogo Mais
        Chato). <strong>Palpite do Gepeto</strong> = previsão da IA ou ajuste
        manual do admin.
      </p>

      <Banner className="mb-6 bg-muted text-foreground" inset>
        <BannerIcon icon={GaugeIcon} />
        <BannerTitle>
          Placares: 10/min por admin. Palpite GPT: requer OPENAI_API_KEY no
          Convex.
        </BannerTitle>
      </Banner>

      <div className="grid gap-4">
        {matches.map((match) => {
          const score = editor.getScore(match._id);
          const isGenerating = generatingId === match._id;
          const isEditingPrediction = editingPredictionId === match._id;
          const isEditingTeams = editingTeamsId === match._id;

          return (
            <Card key={match._id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex flex-wrap items-center gap-2">
                  <span>{match.homeTeamFlag}</span>
                  <span>{match.homeTeamName}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span>{match.awayTeamName}</span>
                  <span>{match.awayTeamFlag}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => setEditingTeamsId(match._id)}
                  >
                    <Users className="mr-1 h-3 w-3" />
                    Editar times
                  </Button>
                </CardTitle>
                {isEditingTeams && (
                  <TeamEditor
                    match={match}
                    onCancel={() => setEditingTeamsId(null)}
                    onSaved={() => setEditingTeamsId(null)}
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border p-3 space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Palpite do Gepeto (IA)
                  </div>
                  {isEditingPrediction ? (
                    <GepetoPredictionEditor
                      match={match}
                      existingPrediction={match.aiPrediction}
                      onCancel={() => setEditingPredictionId(null)}
                      onSaved={() => setEditingPredictionId(null)}
                    />
                  ) : match.aiPrediction ? (
                    <GepetoPredictionDetail
                      match={match}
                      prediction={match.aiPrediction}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum palpite gerado ainda.
                    </p>
                  )}
                  {!isEditingPrediction ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isGenerating}
                        onClick={() =>
                          handleGenerate(match._id, !!match.aiPrediction)
                        }
                      >
                        <Bot className="mr-2 h-4 w-4" />
                        {isGenerating
                          ? "Gerando..."
                          : match.aiPrediction
                            ? "Regenerar palpite"
                            : "Gerar palpite"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPredictionId(match._id)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {match.aiPrediction
                          ? "Editar manualmente"
                          : "Definir manualmente"}
                      </Button>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-md border p-3 space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Placar final (resultado real)
                  </div>
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
                </div>
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
