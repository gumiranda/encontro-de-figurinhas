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

crons.cron(
  "cleanup orphan cover storage",
  "0 2 * * *",
  internal.tradePoints.cleanupOrphanCoverStorage,
  {}
);

crons.cron(
  "prune blog view idempotency",
  "0 1 * * *",
  internal.blog.pruneViewIdempotency,
  {}
);

crons.cron(
  "prune old reports",
  "0 3 * * 0", // Sunday 03:00 UTC
  internal.reports.pruneOldReports,
  {}
);

crons.cron(
  "prune unsubscribed newsletters",
  "0 4 1 * *", // 1st of month 04:00 UTC
  internal.newsletter.pruneUnsubscribed,
  {}
);

crons.cron(
  "prune orphan post interactions",
  "0 2 * * 0", // Sunday 02:00 UTC
  internal.blog.pruneOrphanPostInteractions,
  {}
);

crons.cron(
  "prune orphan post metrics",
  "30 2 * * 0", // Sunday 02:30 UTC
  internal.blog.pruneOrphanPostMetrics,
  {}
);

export default crons;
