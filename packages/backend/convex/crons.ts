import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "expire checkins",
  { minutes: 30 },
  internal.checkins.expireCheckins,
  {}
);

crons.weekly(
  "decay peakHours",
  { dayOfWeek: "monday", hourUTC: 3, minuteUTC: 0 },
  internal.checkins.decayPeakHours,
  {}
);

crons.weekly(
  "prune scoreBumps",
  { dayOfWeek: "monday", hourUTC: 4, minuteUTC: 0 },
  internal.checkins.pruneScoreBumps,
  {}
);

crons.daily(
  "expire pending trade points",
  { hourUTC: 6, minuteUTC: 0 },
  internal.tradePoints.expireStalePending,
  {}
);

export default crons;
