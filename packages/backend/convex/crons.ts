import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "expire stale spots",
  { minutes: 15 },
  internal.spots.expireStale
);

export default crons;
