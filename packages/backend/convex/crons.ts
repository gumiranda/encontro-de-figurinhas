import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "expire checkins",
  { minutes: 30 },
  internal.checkins.expireCheckins,
  {}
);

crons.interval(
  "batch recompute matches",
  { hours: 6 },
  internal.matches.batchRecomputeMatches,
  {}
);

crons.cron(
  "decay peakHours",
  "0 3 * * 1",
  internal.checkins.decayPeakHours,
  {}
);

crons.cron(
  "prune scoreBumps",
  "0 4 * * 1",
  internal.checkins.pruneScoreBumps,
  {}
);

crons.cron(
  "expire pending trade points",
  "0 6 * * *",
  internal.tradePoints.expireStalePending,
  {}
);

crons.cron(
  "reconcile activeCheckinsCount (drift detection)",
  "0 5 * * *",
  internal.tradePoints.reconcileActiveCheckinsCount,
  {}
);

export default crons;
