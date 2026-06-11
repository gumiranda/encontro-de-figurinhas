import type { Doc } from "@workspace/backend/_generated/dataModel";

type MatchScoreFields = Pick<Doc<"worldCupMatches">, "homeScore" | "awayScore">;
type MatchStatusFields = {
  status?: string;
};
type MatchPredictionFields = Pick<
  Doc<"worldCupMatches">,
  "kickoffAt" | "status" | "homeScore" | "awayScore"
>;

export function hasFinalScore(match: MatchScoreFields) {
  return match.homeScore !== undefined && match.awayScore !== undefined;
}

export function isMatchFinished(match: MatchStatusFields) {
  return (match.status ?? "scheduled") === "finished";
}

export function isPredictionRevealed(match: MatchPredictionFields) {
  return match.kickoffAt <= Date.now() || isMatchFinished(match);
}

export function canRecordUserPrediction(match: MatchPredictionFields) {
  return (
    match.kickoffAt > Date.now() &&
    !isMatchFinished(match) &&
    !hasFinalScore(match)
  );
}

export function getPredictionLockReason(match: MatchPredictionFields) {
  if (isMatchFinished(match)) {
    return "Placar final definido. Palpites fechados.";
  }
  if (match.kickoffAt <= Date.now()) {
    return "Jogo em andamento. Palpites fechados.";
  }
  return null;
}
