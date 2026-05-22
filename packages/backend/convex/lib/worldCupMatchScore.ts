import { ConvexError } from "convex/values";
import xss from "xss";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { rateLimiter } from "./rateLimiter";

export type WorldCupMatchStatus =
  | "scheduled"
  | "live"
  | "aet"
  | "penalties"
  | "finished";

function sanitizeReason(reason?: string): string | undefined {
  const trimmed = reason?.trim();
  if (!trimmed) return undefined;

  const sanitized = xss(trimmed, {
    whiteList: {},
    stripIgnoreTag: true,
    stripIgnoreTagBody: ["script", "style"],
  }).trim();

  return sanitized || undefined;
}

function validateScores(homeScore: number, awayScore: number) {
  if (
    !Number.isInteger(homeScore) ||
    !Number.isInteger(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    throw new ConvexError("Placar deve ser inteiro e não negativo");
  }
}

/** Single source of truth for worldCupMatches score + status updates. */
export async function updateWorldCupMatchScore(
  ctx: MutationCtx,
  args: {
    adminUserId: Id<"users">;
    matchId: Id<"worldCupMatches">;
    homeScore: number;
    awayScore: number;
    status: WorldCupMatchStatus;
    reason?: string;
  },
) {
  const match = await ctx.db.get(args.matchId);
  if (!match) throw new ConvexError("Jogo não encontrado");

  validateScores(args.homeScore, args.awayScore);

  const sanitizedReason = sanitizeReason(args.reason);
  if (match.status === "finished" && !sanitizedReason) {
    throw new ConvexError("Jogo já finalizado. Informe motivo da correção.");
  }

  await rateLimiter.limit(ctx, "gepetoScoreUpdate", {
    key: args.adminUserId,
    throws: true,
  });

  const now = Date.now();
  const wasFinished = match.status === "finished";

  await ctx.db.insert("scoreAuditLog", {
    matchId: args.matchId,
    adminUserId: args.adminUserId,
    previousScore:
      match.homeScore !== undefined && match.awayScore !== undefined
        ? { home: match.homeScore, away: match.awayScore }
        : undefined,
    newScore: { home: args.homeScore, away: args.awayScore },
    previousStatus: match.status,
    newStatus: args.status,
    changedAt: now,
    reason: sanitizedReason,
  });

  await ctx.db.patch(args.matchId, {
    homeScore: args.homeScore,
    awayScore: args.awayScore,
    status: args.status,
    finishedAt: args.status === "finished" ? now : undefined,
  });

  if (args.status === "finished" && !wasFinished) {
    await ctx.scheduler.runAfter(0, internal.gepeto.awardBadgesForMatch, {
      matchId: args.matchId,
    });
  }

  return { _id: args.matchId, homeScore: args.homeScore, awayScore: args.awayScore };
}
