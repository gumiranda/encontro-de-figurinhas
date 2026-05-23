import type { Doc } from "@workspace/backend/_generated/dataModel";

type MatchScoreFields = Pick<Doc<"worldCupMatches">, "homeScore" | "awayScore">;
type MatchPredictionFields = Pick<
  Doc<"worldCupMatches">,
  "kickoffAt" | "homeScore" | "awayScore"
>;

export function hasFinalScore(match: MatchScoreFields) {
  return match.homeScore !== undefined && match.awayScore !== undefined;
}

export function isPredictionRevealed(match: MatchPredictionFields) {
  return match.kickoffAt <= Date.now() || hasFinalScore(match);
}

export function canRecordUserPrediction(match: MatchPredictionFields) {
  return match.kickoffAt > Date.now() && !hasFinalScore(match);
}

export function getPredictionLockReason(match: MatchPredictionFields) {
  if (hasFinalScore(match)) {
    return "Placar final definido. Palpites fechados.";
  }
  if (match.kickoffAt <= Date.now()) {
    return "Jogo em andamento. Palpites fechados.";
  }
  return null;
}
