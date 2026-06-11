import { describe, it } from "node:test";
import assert from "node:assert";
import {
  hasFinalScore,
  isMatchFinished,
  isPredictionRevealed,
  canRecordUserPrediction,
  getPredictionLockReason,
} from "../match-state";

const futureKickoff = Date.now() + 3600_000;
const pastKickoff = Date.now() - 3600_000;

describe("hasFinalScore", () => {
  it("returns true when both scores are defined", () => {
    assert.strictEqual(
      hasFinalScore({ homeScore: 2, awayScore: 1 }),
      true,
    );
  });

  it("returns false when any score is missing", () => {
    assert.strictEqual(hasFinalScore({ homeScore: 2 }), false);
    assert.strictEqual(hasFinalScore({ awayScore: 1 }), false);
    assert.strictEqual(hasFinalScore({}), false);
  });
});

describe("isMatchFinished", () => {
  it("returns true only when status is finished", () => {
    assert.strictEqual(isMatchFinished({ status: "finished" }), true);
  });

  it("returns false for live matches even with a score", () => {
    assert.strictEqual(isMatchFinished({ status: "live" }), false);
  });

  it("returns false for scheduled, aet and penalties", () => {
    assert.strictEqual(isMatchFinished({ status: "scheduled" }), false);
    assert.strictEqual(isMatchFinished({ status: "aet" }), false);
    assert.strictEqual(isMatchFinished({ status: "penalties" }), false);
  });

  it("treats missing status as scheduled", () => {
    assert.strictEqual(isMatchFinished({}), false);
  });
});

describe("isPredictionRevealed", () => {
  it("reveals predictions for live matches", () => {
    assert.strictEqual(
      isPredictionRevealed({
        status: "live",
        homeScore: 1,
        awayScore: 0,
        kickoffAt: pastKickoff,
      }),
      true,
    );
  });

  it("reveals predictions for finished matches", () => {
    assert.strictEqual(
      isPredictionRevealed({
        status: "finished",
        homeScore: 2,
        awayScore: 1,
        kickoffAt: pastKickoff,
      }),
      true,
    );
  });

  it("hides predictions for upcoming matches", () => {
    assert.strictEqual(
      isPredictionRevealed({
        status: "scheduled",
        kickoffAt: futureKickoff,
      }),
      false,
    );
  });
});

describe("canRecordUserPrediction", () => {
  it("blocks predictions for live matches", () => {
    assert.strictEqual(
      canRecordUserPrediction({
        status: "live",
        homeScore: 1,
        awayScore: 0,
        kickoffAt: pastKickoff,
      }),
      false,
    );
  });

  it("blocks predictions for finished matches", () => {
    assert.strictEqual(
      canRecordUserPrediction({
        status: "finished",
        homeScore: 2,
        awayScore: 1,
        kickoffAt: pastKickoff,
      }),
      false,
    );
  });

  it("allows predictions for upcoming matches without a final score", () => {
    assert.strictEqual(
      canRecordUserPrediction({
        status: "scheduled",
        kickoffAt: futureKickoff,
      }),
      true,
    );
  });
});

describe("getPredictionLockReason", () => {
  it("reports in-progress for live matches", () => {
    assert.strictEqual(
      getPredictionLockReason({
        status: "live",
        homeScore: 1,
        awayScore: 0,
        kickoffAt: pastKickoff,
      }),
      "Jogo em andamento. Palpites fechados.",
    );
  });

  it("reports final score for finished matches", () => {
    assert.strictEqual(
      getPredictionLockReason({
        status: "finished",
        homeScore: 2,
        awayScore: 1,
        kickoffAt: pastKickoff,
      }),
      "Placar final definido. Palpites fechados.",
    );
  });
});

describe("user prediction visibility on fixture cards", () => {
  it("keeps user prediction hidden from others before kickoff", () => {
    assert.strictEqual(
      isPredictionRevealed({
        status: "scheduled",
        kickoffAt: futureKickoff,
      }),
      false,
    );
  });

  it("reveals user prediction after kickoff", () => {
    assert.strictEqual(
      isPredictionRevealed({
        status: "scheduled",
        kickoffAt: pastKickoff,
      }),
      true,
    );
  });
});
