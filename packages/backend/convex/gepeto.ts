import { ConvexError, v } from "convex/values";
import { z } from "zod";
import { api, internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  type MutationCtx,
  type QueryCtx,
  query,
} from "./_generated/server";
import { getAuthenticatedUser, requireAdmin, requireAuth } from "./lib/auth";
import { rateLimiter } from "./lib/rateLimiter";
import { sanitizeUserInput } from "./lib/sanitize";
import { Role } from "./lib/types";
import { updateWorldCupMatchScore } from "./lib/worldCupMatchScore";

// ============ HELPERS ============

function getMatchResult(
  homeScore: number,
  awayScore: number,
): "home" | "draw" | "away" {
  if (homeScore > awayScore) return "home";
  if (awayScore > homeScore) return "away";
  return "draw";
}

function hasFinalScore(
  match: Pick<Doc<"worldCupMatches">, "homeScore" | "awayScore">,
) {
  return match.homeScore !== undefined && match.awayScore !== undefined;
}

function isPredictionRevealed(
  match: Pick<Doc<"worldCupMatches">, "kickoffAt" | "homeScore" | "awayScore">,
) {
  return match.kickoffAt <= Date.now() || hasFinalScore(match);
}

function canRecordUserPrediction(
  match: Pick<Doc<"worldCupMatches">, "kickoffAt" | "homeScore" | "awayScore">,
) {
  return match.kickoffAt > Date.now() && !hasFinalScore(match);
}

type AiOutcome = "win" | "loss" | "tie";

const predictionResponseSchema = z.object({
  prediction: z.enum(["home", "draw", "away"]),
  exactScore: z.object({
    home: z.number().int().min(0),
    away: z.number().int().min(0),
  }),
  confidence: z.number().int().min(0).max(100),
  reasoning: z.array(z.string().trim().min(1)).length(3),
  trashTalk: z.string().trim().min(1),
});

type ParsedPredictionResponse = z.infer<typeof predictionResponseSchema>;

function getISOWeekNumber(date: Date): number {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

function buildPredictionPrompt(match: {
  homeTeamName: string;
  awayTeamName: string;
  venue?: string;
  kickoffAt: number;
}): string {
  return `Você é Gepeto, uma IA de palpites de futebol.

TAREFA: Prever o resultado de ${match.homeTeamName} vs ${match.awayTeamName}.

RESPONDA EXATAMENTE NESTE FORMATO JSON:
{
  "prediction": "home" ou "draw" ou "away",
  "exactScore": { "home": número, "away": número },
  "confidence": número de 0 a 100,
  "reasoning": ["insight 1", "insight 2", "insight 3"],
  "trashTalk": "frase provocativa curta"
}

REGRAS:
- Confidence entre 50-85 (nunca 100% certeza)
- Reasoning: 3 insights técnicos curtos com dados plausíveis
- TrashTalk: tom de rivalidade amigável`;
}

function parsePredictionResponse(content: string): ParsedPredictionResponse {
  const json = JSON.parse(content);
  return predictionResponseSchema.parse(json);
}

type PredictionChoice = "home" | "draw" | "away";
type GepetoPoolPrivacy = "private" | "city" | "open";

const POOL_NAME_MAX = 36;
const POOL_DESCRIPTION_MAX = 140;
const POOL_COMMENT_MAX = 300;

const poolPrivacyValidator = v.union(
  v.literal("private"),
  v.literal("city"),
  v.literal("open"),
);

function publicUserSnapshot(user: Doc<"users">) {
  return {
    _id: user._id,
    nickname: user.nickname ?? null,
    displayNickname: (
      user.displayNickname ??
      user.nickname ??
      user.name ??
      "Colecionador"
    ).slice(0, 32),
    avatarSeed: user._id,
    cityId: user.cityId ?? null,
  };
}

function sanitizeLimited(input: string | undefined, maxLength: number) {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return undefined;
  return sanitizeUserInput(trimmed).slice(0, maxLength);
}

function normalizeInviteCode(input: string) {
  return input
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 12);
}

function makeInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function buildUniqueInviteCode(ctx: MutationCtx) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = makeInviteCode();
    const existing = await ctx.db
      .query("gepetoPools")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", code))
      .unique();
    if (!existing) return code;
  }
  throw new ConvexError("Não foi possível gerar convite");
}

function validatePoolInput(args: {
  name: string;
  emoji?: string;
  color?: string;
  privacy: GepetoPoolPrivacy;
  knockoutMultiplier?: number;
  finalMultiplier?: number;
}) {
  const name = args.name.trim();
  if (name.length < 3 || name.length > POOL_NAME_MAX) {
    throw new ConvexError("Nome do bolão deve ter entre 3 e 36 caracteres");
  }
  if ((args.emoji ?? "⚽").trim().length > 8) {
    throw new ConvexError("Emoji inválido");
  }
  if (args.color && !/^#[0-9A-Fa-f]{6}$/.test(args.color)) {
    throw new ConvexError("Cor inválida");
  }
  for (const value of [
    args.knockoutMultiplier ?? 3,
    args.finalMultiplier ?? 5,
  ]) {
    if (!Number.isFinite(value) || value < 1 || value > 10) {
      throw new ConvexError("Multiplicador inválido");
    }
  }
}

async function assertPoolMember(
  ctx: QueryCtx | MutationCtx,
  poolId: Id<"gepetoPools">,
  userId: Id<"users">,
) {
  const membership = await ctx.db
    .query("gepetoPoolMembers")
    .withIndex("by_pool_user", (q) =>
      q.eq("poolId", poolId).eq("userId", userId),
    )
    .unique();
  if (!membership || !membership.isActive) {
    throw new ConvexError("Você não participa deste bolão");
  }
  return membership;
}

function maskAiPrediction<T extends Doc<"aiPredictions"> | null>(
  prediction: T,
  isRevealed: boolean,
) {
  if (!prediction) return null;
  if (isRevealed) return prediction;
  return {
    ...prediction,
    prediction: null,
    exactScore: null,
    reasoning: [],
    trashTalk: undefined,
  };
}

function isOpenMatch(
  match: Pick<Doc<"worldCupMatches">, "homeScore" | "awayScore" | "status">,
) {
  if (hasFinalScore(match)) return false;
  return (match.status ?? "scheduled") !== "finished";
}

async function getCurrentMatch(ctx: QueryCtx) {
  const now = Date.now();
  const matches = await ctx.db.query("worldCupMatches").collect();
  if (matches.length === 0) return null;

  const openMatches = matches.filter(isOpenMatch);

  const live = openMatches
    .filter((match) => (match.status ?? "scheduled") === "live")
    .sort((a, b) => a.kickoffAt - b.kickoffAt)[0];
  if (live) return live;

  const inProgress = openMatches
    .filter((match) => match.kickoffAt <= now)
    .sort((a, b) => a.kickoffAt - b.kickoffAt)[0];
  if (inProgress) return inProgress;

  const upcoming = openMatches
    .filter((match) => match.kickoffAt > now)
    .sort((a, b) => a.kickoffAt - b.kickoffAt)[0];
  if (upcoming) return upcoming;

  return null;
}

async function getPoolSummary(
  ctx: QueryCtx,
  membership: Doc<"gepetoPoolMembers">,
) {
  const pool = await ctx.db.get(membership.poolId);
  if (!pool) return null;
  const members = await ctx.db
    .query("gepetoPoolMembers")
    .withIndex("by_pool", (q) => q.eq("poolId", pool._id))
    .collect();
  const activeMemberCount = members.filter((member) => member.isActive).length;
  return { ...pool, membership, activeMemberCount };
}

async function getLeaderboardRows(ctx: QueryCtx, limit: number) {
  const rows = await ctx.db
    .query("userAiStats")
    .withIndex("by_wins")
    .order("desc")
    .take(limit);
  return Promise.all(
    rows.map(async (row, index) => {
      const user = await ctx.db.get(row.userId);
      return {
        rank: index + 1,
        ...row,
        user: user ? publicUserSnapshot(user) : null,
      };
    }),
  );
}

function getRoundMultiplier(
  pool: Doc<"gepetoPools">,
  round: Doc<"worldCupRounds"> | null,
) {
  const normalizeRoundText = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const roundName = normalizeRoundText(round?.name ?? "");
  const phase = normalizeRoundText(`${round?.phase ?? ""} ${roundName}`);
  if (
    /\bfinal\b/.test(roundName) &&
    !/(semi|oitava|quarta|avos|terceiro|third)/.test(roundName)
  ) {
    return pool.finalMultiplier;
  }
  if (
    phase.includes("oitava") ||
    phase.includes("quarta") ||
    phase.includes("semi") ||
    phase.includes("avos") ||
    phase.includes("mata") ||
    phase.includes("knockout")
  ) {
    return pool.knockoutMultiplier;
  }
  return 1;
}

function scorePredictionAgainstMatch(
  prediction: {
    prediction: PredictionChoice;
    exactScore?: { home: number; away: number } | null;
  },
  match: Doc<"worldCupMatches">,
  multiplier: number,
) {
  if (
    match.status !== "finished" ||
    match.homeScore === undefined ||
    match.awayScore === undefined
  ) {
    return 0;
  }
  const actual = getMatchResult(match.homeScore, match.awayScore);
  const hasExactScore =
    prediction.exactScore &&
    prediction.exactScore.home === match.homeScore &&
    prediction.exactScore.away === match.awayScore;
  if (hasExactScore) return 25 * multiplier;
  if (prediction.prediction === actual) return 10 * multiplier;
  const hasOneTeamScore =
    prediction.exactScore &&
    (prediction.exactScore.home === match.homeScore ||
      prediction.exactScore.away === match.awayScore);
  const score = hasOneTeamScore ? 5 : 0;
  return score * multiplier;
}

async function scorePoolMember(
  ctx: QueryCtx,
  pool: Doc<"gepetoPools">,
  member: Doc<"gepetoPoolMembers">,
) {
  const rows = [];
  if (member.role === "gepeto") {
    rows.push(...(await ctx.db.query("aiPredictions").take(300)));
  } else if (member.userId) {
    const userId = member.userId;
    rows.push(
      ...(await ctx.db
        .query("userPredictions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .take(300)),
    );
  }

  // Batch fetch all matches and rounds instead of sequential awaits
  const matchIds = [...new Set(rows.map((r) => r.matchId))];
  const matches = await Promise.all(matchIds.map((id) => ctx.db.get(id)));
  const matchById = new Map(
    matches
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .map((m) => [m._id, m]),
  );

  const roundIds = [
    ...new Set(
      matches
        .filter((m): m is NonNullable<typeof m> => m !== null)
        .map((m) => m.roundId),
    ),
  ];
  const rounds = await Promise.all(roundIds.map((id) => ctx.db.get(id)));
  const roundById = new Map(
    rounds
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .map((r) => [r._id, r]),
  );

  let points = 0;
  let exactHits = 0;
  let correctHits = 0;
  for (const row of rows) {
    const match = matchById.get(row.matchId);
    if (!match) continue;
    const round = roundById.get(match.roundId) ?? null;
    const multiplier = getRoundMultiplier(pool, round);
    const earned = scorePredictionAgainstMatch(row, match, multiplier);
    points += earned;
    if (
      earned > 0 &&
      row.prediction ===
        getMatchResult(match.homeScore ?? 0, match.awayScore ?? 0)
    ) {
      correctHits++;
    }
    if (
      match.status === "finished" &&
      row.exactScore &&
      row.exactScore.home === match.homeScore &&
      row.exactScore.away === match.awayScore
    ) {
      exactHits++;
    }
  }

  return { member, points, correctHits, exactHits };
}

async function insertPoolPredictionActivities(
  ctx: MutationCtx,
  user: Doc<"users">,
  match: Doc<"worldCupMatches">,
  now: number,
) {
  const memberships = await ctx.db
    .query("gepetoPoolMembers")
    .withIndex("by_user", (q) => q.eq("userId", user._id))
    .collect();

  const display = publicUserSnapshot(user).displayNickname;
  const message = `${display} lacrou palpite em ${match.homeTeamName} x ${match.awayTeamName}.`;
  for (const membership of memberships) {
    if (!membership.isActive) continue;
    await ctx.db.insert("gepetoPoolActivities", {
      poolId: membership.poolId,
      userId: user._id,
      type: "prediction",
      matchId: match._id,
      message,
      createdAt: now,
    });
  }
}

// ============ QUERIES ============

export const getAIPrediction = query({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    return ctx.db
      .query("aiPredictions")
      .withIndex("by_match", (q) => q.eq("matchId", matchId))
      .unique();
  },
});

export const getUserPrediction = query({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;

    const match = await ctx.db.get(matchId);
    if (!match) return null;

    const prediction = await ctx.db
      .query("userPredictions")
      .withIndex("by_user_match", (q) =>
        q.eq("userId", user._id).eq("matchId", matchId),
      )
      .unique();

    if (!prediction) return null;

    const isRevealed = isPredictionRevealed(match);
    const badge = await ctx.db
      .query("userAiBadges")
      .withIndex("by_user_match", (q) =>
        q.eq("userId", user._id).eq("matchId", matchId),
      )
      .unique();

    return {
      ...prediction,
      exactScore: isRevealed ? prediction.exactScore : null,
      isRevealed,
      hasBadge: !!badge,
    };
  },
});

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    return ctx.db
      .query("userAiStats")
      .withIndex("by_wins")
      .order("desc")
      .take(limit);
  },
});

export const getWeeklyNarrative = query({
  args: { weekNumber: v.number(), year: v.number() },
  handler: async (ctx, { weekNumber, year }) => {
    return ctx.db
      .query("aiWeeklyNarratives")
      .withIndex("by_week_year", (q) =>
        q.eq("year", year).eq("weekNumber", weekNumber),
      )
      .unique();
  },
});

export const getDashboardHub = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const now = new Date();
    const weekNumber = getISOWeekNumber(now);
    const year = now.getFullYear();

    const [nextMatch, stats, narrative, memberships, leaderboard] =
      await Promise.all([
        getCurrentMatch(ctx),
        ctx.db
          .query("userAiStats")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .unique(),
        ctx.db
          .query("aiWeeklyNarratives")
          .withIndex("by_week_year", (q) =>
            q.eq("year", year).eq("weekNumber", weekNumber),
          )
          .unique(),
        ctx.db
          .query("gepetoPoolMembers")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .take(6),
        getLeaderboardRows(ctx, 6),
      ]);

    const pools = (
      await Promise.all(
        memberships.map((member) => getPoolSummary(ctx, member)),
      )
    )
      .filter((pool) => pool !== null)
      .filter((pool) => pool.membership.isActive);

    const aiPrediction = nextMatch
      ? await ctx.db
          .query("aiPredictions")
          .withIndex("by_match", (q) => q.eq("matchId", nextMatch._id))
          .unique()
      : null;
    const userPrediction = nextMatch
      ? await ctx.db
          .query("userPredictions")
          .withIndex("by_user_match", (q) =>
            q.eq("userId", user._id).eq("matchId", nextMatch._id),
          )
          .unique()
      : null;

    return {
      user: publicUserSnapshot(user),
      nextMatch,
      aiPrediction: maskAiPrediction(
        aiPrediction,
        nextMatch ? isPredictionRevealed(nextMatch) : false,
      ),
      userPrediction,
      stats: stats ?? {
        userId: user._id,
        winCount: 0,
        lossCount: 0,
        tieCount: 0,
        totalMatches: 0,
        lastUpdated: Date.now(),
      },
      narrative,
      pools,
      leaderboard,
    };
  },
});

export const listDashboardFixtures = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const rateLimit = await rateLimiter.check(
      ctx,
      "gepetoDashboardFixturesRead",
      { key: user._id },
    );
    if (!rateLimit.ok) return [];

    const rounds = await ctx.db
      .query("worldCupRounds")
      .withIndex("by_order")
      .collect();
    const userPredictions = await ctx.db
      .query("userPredictions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(300);
    const userPredictionByMatch = new Map(
      userPredictions.map((prediction) => [prediction.matchId, prediction]),
    );

    return Promise.all(
      rounds.map(async (round) => {
        const matches = await ctx.db
          .query("worldCupMatches")
          .withIndex("by_round_kickoff", (q) => q.eq("roundId", round._id))
          .collect();

        const hydratedMatches = await Promise.all(
          matches.map(async (match) => {
            const aiPrediction = await ctx.db
              .query("aiPredictions")
              .withIndex("by_match", (q) => q.eq("matchId", match._id))
              .unique();
            const predictionCount = await ctx.db
              .query("userPredictions")
              .withIndex("by_match", (q) => q.eq("matchId", match._id))
              .take(200);

            return {
              ...match,
              aiPrediction: maskAiPrediction(
                aiPrediction,
                isPredictionRevealed(match),
              ),
              userPrediction: (() => {
                const prediction = userPredictionByMatch.get(match._id);
                if (!prediction) return null;
                return {
                  ...prediction,
                  exactScore: prediction.exactScore,
                };
              })(),
              communityCount: predictionCount.length,
            };
          }),
        );

        return {
          ...round,
          matches: hydratedMatches.sort((a, b) => a.kickoffAt - b.kickoffAt),
        };
      }),
    );
  },
});

export const getDashboardMatch = query({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    const user = await requireAuth(ctx);
    const rateLimit = await rateLimiter.check(ctx, "gepetoDashboardMatchRead", {
      key: user._id,
    });
    if (!rateLimit.ok) {
      throw new ConvexError("Muitas tentativas. Tente novamente em instantes.");
    }

    const match = await ctx.db.get(matchId);
    if (!match) throw new ConvexError("Jogo não encontrado");
    const now = Date.now();
    const nextMatchStart = Math.max(now, match.kickoffAt + 1);

    const [
      round,
      aiPrediction,
      userPrediction,
      badge,
      result,
      allPredictions,
      upcomingMatches,
    ] = await Promise.all([
      ctx.db.get(match.roundId),
      ctx.db
        .query("aiPredictions")
        .withIndex("by_match", (q) => q.eq("matchId", matchId))
        .unique(),
      ctx.db
        .query("userPredictions")
        .withIndex("by_user_match", (q) =>
          q.eq("userId", user._id).eq("matchId", matchId),
        )
        .unique(),
      ctx.db
        .query("userAiBadges")
        .withIndex("by_user_match", (q) =>
          q.eq("userId", user._id).eq("matchId", matchId),
        )
        .unique(),
      ctx.db
        .query("userAiMatchResults")
        .withIndex("by_user_match", (q) =>
          q.eq("userId", user._id).eq("matchId", matchId),
        )
        .unique(),
      ctx.db
        .query("userPredictions")
        .withIndex("by_match", (q) => q.eq("matchId", matchId))
        .take(500),
      ctx.db
        .query("worldCupMatches")
        .withIndex("by_kickoff", (q) => q.gte("kickoffAt", nextMatchStart))
        .take(24),
    ]);
    const nextMatches = upcomingMatches
      .filter(
        (upcoming) =>
          !hasFinalScore(upcoming) && upcoming.status !== "finished",
      )
      .slice(0, 3);
    const ownPrediction =
      userPrediction && userPrediction.userId === user._id
        ? userPrediction
        : null;

    const community = allPredictions.reduce(
      (acc, prediction) => {
        acc[prediction.prediction] += 1;
        return acc;
      },
      { home: 0, draw: 0, away: 0 } satisfies Record<PredictionChoice, number>,
    );

    return {
      match,
      round,
      aiPrediction: maskAiPrediction(aiPrediction, isPredictionRevealed(match)),
      userPrediction: ownPrediction
        ? {
            ...ownPrediction,
            exactScore: ownPrediction.exactScore,
            isRevealed: isPredictionRevealed(match),
            hasBadge: !!badge,
          }
        : null,
      nextMatches: nextMatches.map((nextMatch) => ({
        _id: nextMatch._id,
        homeTeamCode: nextMatch.homeTeamCode,
        homeTeamName: nextMatch.homeTeamName,
        homeTeamFlag: nextMatch.homeTeamFlag,
        awayTeamCode: nextMatch.awayTeamCode,
        awayTeamName: nextMatch.awayTeamName,
        awayTeamFlag: nextMatch.awayTeamFlag,
        kickoffAt: nextMatch.kickoffAt,
        venue: nextMatch.venue,
      })),
      result,
      community: {
        total: allPredictions.length,
        counts: community,
      },
    };
  },
});

export const listLeaderboardWithUsers = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    await requireAuth(ctx);
    return getLeaderboardRows(ctx, Math.min(Math.max(limit, 1), 100));
  },
});

export const listMyPools = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const memberships = await ctx.db
      .query("gepetoPoolMembers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    const pools = await Promise.all(
      memberships.map((member) => getPoolSummary(ctx, member)),
    );
    return pools
      .filter((pool) => pool !== null)
      .filter((pool) => pool.membership.isActive);
  },
});

export const getPoolDetail = query({
  args: { poolId: v.id("gepetoPools") },
  handler: async (ctx, { poolId }) => {
    const user = await requireAuth(ctx);
    const pool = await ctx.db.get(poolId);
    if (!pool) throw new ConvexError("Bolão não encontrado");
    await assertPoolMember(ctx, poolId, user._id);

    const [members, activities, nextMatch] = await Promise.all([
      ctx.db
        .query("gepetoPoolMembers")
        .withIndex("by_pool", (q) => q.eq("poolId", poolId))
        .collect(),
      ctx.db
        .query("gepetoPoolActivities")
        .withIndex("by_pool_created", (q) => q.eq("poolId", poolId))
        .order("desc")
        .take(60),
      getCurrentMatch(ctx),
    ]);

    const activeMembers = members.filter((member) => member.isActive);
    const rankings = await Promise.all(
      activeMembers.map((member) => scorePoolMember(ctx, pool, member)),
    );
    const hydratedActivities = await Promise.all(
      activities.map(async (activity) => {
        const actor = activity.userId
          ? await ctx.db.get(activity.userId)
          : null;
        const target = activity.targetUserId
          ? await ctx.db.get(activity.targetUserId)
          : null;
        return {
          ...activity,
          actor: actor ? publicUserSnapshot(actor) : null,
          target: target ? publicUserSnapshot(target) : null,
        };
      }),
    );

    return {
      pool,
      members: activeMembers,
      activities: hydratedActivities,
      nextMatch,
      ranking: rankings
        .sort((a, b) => b.points - a.points)
        .map((row, index) => ({ ...row, rank: index + 1 })),
    };
  },
});

// Internal: Get match data for AI prediction
export const getMatchForPrediction = internalQuery({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    return ctx.db.get(matchId);
  },
});

// Internal: Get AI prediction (for use in actions to avoid circular ref)
export const getAIPredictionInternal = internalQuery({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    return ctx.db
      .query("aiPredictions")
      .withIndex("by_match", (q) => q.eq("matchId", matchId))
      .unique();
  },
});

// Admin: List matches with scores + Gepeto palpite
export const listMatchesForAdmin = query({
  args: { roundId: v.optional(v.id("worldCupRounds")) },
  handler: async (ctx, { roundId }) => {
    await requireAdmin(ctx);

    const matches = roundId
      ? await ctx.db
          .query("worldCupMatches")
          .withIndex("by_round_kickoff", (q) => q.eq("roundId", roundId))
          .order("desc")
          .take(100)
      : await ctx.db.query("worldCupMatches").order("desc").take(100);

    return Promise.all(
      matches.map(async (match) => {
        const aiPrediction = await ctx.db
          .query("aiPredictions")
          .withIndex("by_match", (q) => q.eq("matchId", match._id))
          .unique();
        return { ...match, aiPrediction: aiPrediction ?? null };
      }),
    );
  },
});

export const assertAdmin = internalQuery({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (!user || (user.role !== Role.SUPERADMIN && user.role !== Role.CEO)) {
      throw new ConvexError("Sem permissão");
    }
    return user._id;
  },
});

// ============ MUTATIONS ============

export const recordUserPrediction = mutation({
  args: {
    matchId: v.id("worldCupMatches"),
    prediction: v.union(
      v.literal("home"),
      v.literal("draw"),
      v.literal("away"),
    ),
    exactScore: v.optional(
      v.object({
        home: v.number(),
        away: v.number(),
      }),
    ),
  },
  handler: async (ctx, { matchId, prediction, exactScore }) => {
    const user = await requireAuth(ctx);
    const match = await ctx.db.get(matchId);

    if (!match) throw new ConvexError("Jogo não encontrado");
    if (!canRecordUserPrediction(match)) {
      throw new ConvexError(
        hasFinalScore(match)
          ? "Placar final definido. Palpites fechados."
          : "Jogo já começou. Palpites fechados.",
      );
    }

    // Validate exactScore bounds
    if (exactScore) {
      if (exactScore.home < 0 || exactScore.away < 0) {
        throw new ConvexError("Placar não pode ser negativo");
      }
    }

    let predictionRateLimit: { ok: boolean; retryAfter?: number };
    try {
      predictionRateLimit = await rateLimiter.limit(ctx, "gepetoPrediction", {
        key: user._id,
        throws: true,
      });
    } catch {
      throw new ConvexError(
        "Muitas tentativas. Aguarde alguns minutos antes de palpitar de novo.",
      );
    }
    if (!predictionRateLimit.ok) {
      throw new ConvexError(
        "Muitas tentativas. Aguarde alguns minutos antes de palpitar de novo.",
      );
    }

    const existing = await ctx.db
      .query("userPredictions")
      .withIndex("by_user_match", (q) =>
        q.eq("userId", user._id).eq("matchId", matchId),
      )
      .unique();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, {
        prediction,
        exactScore,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("userPredictions", {
        userId: user._id,
        matchId,
        prediction,
        exactScore,
        createdAt: now,
        updatedAt: now,
      });
    }
    await insertPoolPredictionActivities(ctx, user, match, now);
  },
});

export const createPool = mutation({
  args: {
    name: v.string(),
    emoji: v.optional(v.string()),
    color: v.optional(v.string()),
    description: v.optional(v.string()),
    privacy: poolPrivacyValidator,
    includeGepeto: v.optional(v.boolean()),
    knockoutMultiplier: v.optional(v.number()),
    finalMultiplier: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);
    validatePoolInput(args);

    const now = Date.now();
    const inviteCode = await buildUniqueInviteCode(ctx);
    const snapshot = publicUserSnapshot(user);
    const poolId = await ctx.db.insert("gepetoPools", {
      ownerUserId: user._id,
      name: sanitizeUserInput(args.name.trim()).slice(0, POOL_NAME_MAX),
      emoji: (args.emoji ?? "⚽").trim().slice(0, 8),
      color: args.color ?? "#95AAFF",
      description: sanitizeLimited(args.description, POOL_DESCRIPTION_MAX),
      privacy: args.privacy,
      cityId: args.privacy === "city" ? user.cityId : undefined,
      inviteCode,
      includeGepeto: args.includeGepeto ?? true,
      knockoutMultiplier: args.knockoutMultiplier ?? 3,
      finalMultiplier: args.finalMultiplier ?? 5,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("gepetoPoolMembers", {
      poolId,
      userId: user._id,
      role: "owner",
      displayNickname: snapshot.displayNickname,
      avatarSeed: snapshot.avatarSeed,
      joinedAt: now,
      isActive: true,
    });

    if (args.includeGepeto ?? true) {
      await ctx.db.insert("gepetoPoolMembers", {
        poolId,
        role: "gepeto",
        displayNickname: "Gepeto",
        avatarSeed: "gepeto",
        joinedAt: now,
        isActive: true,
      });
      await ctx.db.insert("gepetoPoolActivities", {
        poolId,
        type: "gepeto",
        message: "Gepeto entrou no bolão para provocar a mesa.",
        createdAt: now,
      });
    }

    await ctx.db.insert("gepetoPoolActivities", {
      poolId,
      userId: user._id,
      type: "join",
      message: `${snapshot.displayNickname} criou o bolão.`,
      createdAt: now,
    });

    return { poolId, inviteCode };
  },
});

export const getPoolInvitePreview = query({
  args: { inviteCode: v.string() },
  handler: async (ctx, { inviteCode }) => {
    const code = normalizeInviteCode(inviteCode);
    if (!code) return null;

    const pool = await ctx.db
      .query("gepetoPools")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", code))
      .unique();
    if (!pool) return null;

    const members = await ctx.db
      .query("gepetoPoolMembers")
      .withIndex("by_pool", (q) => q.eq("poolId", pool._id))
      .collect();
    const activeMembers = members.filter((member) => member.isActive);
    const owner = await ctx.db.get(pool.ownerUserId);

    return {
      _id: pool._id,
      name: pool.name,
      emoji: pool.emoji,
      color: pool.color,
      description: pool.description ?? null,
      privacy: pool.privacy,
      includeGepeto: pool.includeGepeto,
      activeMemberCount: activeMembers.length,
      ownerName: owner ? publicUserSnapshot(owner).displayNickname : null,
    };
  },
});

export const joinPoolByCode = mutation({
  args: { inviteCode: v.string() },
  handler: async (ctx, { inviteCode }) => {
    const user = await requireAuth(ctx);
    const code = normalizeInviteCode(inviteCode);
    if (!code) throw new ConvexError("Código inválido");

    const pool = await ctx.db
      .query("gepetoPools")
      .withIndex("by_inviteCode", (q) => q.eq("inviteCode", code))
      .unique();
    if (!pool) throw new ConvexError("Bolão não encontrado");
    if (pool.privacy === "city" && pool.cityId && user.cityId !== pool.cityId) {
      throw new ConvexError("Este bolão é da cidade do dono");
    }

    const existing = await ctx.db
      .query("gepetoPoolMembers")
      .withIndex("by_pool_user", (q) =>
        q.eq("poolId", pool._id).eq("userId", user._id),
      )
      .unique();
    const now = Date.now();
    const snapshot = publicUserSnapshot(user);

    if (existing) {
      if (!existing.isActive) {
        await ctx.db.patch(existing._id, {
          isActive: true,
          displayNickname: snapshot.displayNickname,
          avatarSeed: snapshot.avatarSeed,
          joinedAt: now,
        });
      }
    } else {
      await ctx.db.insert("gepetoPoolMembers", {
        poolId: pool._id,
        userId: user._id,
        role: "member",
        displayNickname: snapshot.displayNickname,
        avatarSeed: snapshot.avatarSeed,
        joinedAt: now,
        isActive: true,
      });
    }

    await ctx.db.insert("gepetoPoolActivities", {
      poolId: pool._id,
      userId: user._id,
      type: "join",
      message: `${snapshot.displayNickname} entrou pelo convite ${pool.inviteCode}.`,
      createdAt: now,
    });

    return { poolId: pool._id };
  },
});

export const postPoolComment = mutation({
  args: {
    poolId: v.id("gepetoPools"),
    message: v.string(),
  },
  handler: async (ctx, { poolId, message }) => {
    const user = await requireAuth(ctx);
    await assertPoolMember(ctx, poolId, user._id);
    const cleaned = sanitizeLimited(message, POOL_COMMENT_MAX);
    if (!cleaned) throw new ConvexError("Comentário vazio");

    await ctx.db.insert("gepetoPoolActivities", {
      poolId,
      userId: user._id,
      type: "comment",
      message: cleaned,
      createdAt: Date.now(),
    });
  },
});

export const pokePoolMember = mutation({
  args: {
    poolId: v.id("gepetoPools"),
    targetMemberId: v.id("gepetoPoolMembers"),
  },
  handler: async (ctx, { poolId, targetMemberId }) => {
    const user = await requireAuth(ctx);
    await assertPoolMember(ctx, poolId, user._id);
    const target = await ctx.db.get(targetMemberId);
    if (!target || target.poolId !== poolId || !target.isActive) {
      throw new ConvexError("Membro não encontrado");
    }
    if (target.userId === user._id)
      throw new ConvexError("Escolha outro membro");

    const actor = publicUserSnapshot(user).displayNickname;
    await ctx.db.insert("gepetoPoolActivities", {
      poolId,
      userId: user._id,
      type: "poke",
      targetUserId: target.userId,
      message: `${actor} cutucou ${target.displayNickname} para lacrar um palpite.`,
      createdAt: Date.now(),
    });
  },
});

const MANUAL_PREDICTION_DEFAULTS = {
  confidence: 70,
  reasoning: [
    "Palpite calculado friamente.",
    "Baseado em dados irreais e confusos.",
    "Confira o resultado no apito final.",
  ],
  modelVersion: "manual",
} as const;

function validateAIPredictionPayload(args: {
  exactScore: { home: number; away: number };
  confidence: number;
  reasoning: string[];
}) {
  if (
    !Number.isInteger(args.exactScore.home) ||
    !Number.isInteger(args.exactScore.away) ||
    args.exactScore.home < 0 ||
    args.exactScore.away < 0 ||
    !Number.isInteger(args.confidence) ||
    args.confidence < 0 ||
    args.confidence > 100 ||
    args.reasoning.length !== 3 ||
    args.reasoning.some((item) => item.trim().length === 0)
  ) {
    throw new ConvexError("Palpite inválido");
  }
}

export const setAIPredictionAdmin = mutation({
  args: {
    matchId: v.id("worldCupMatches"),
    prediction: v.union(
      v.literal("home"),
      v.literal("draw"),
      v.literal("away"),
    ),
    exactScore: v.object({
      home: v.number(),
      away: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const match = await ctx.db.get(args.matchId);
    if (!match) throw new ConvexError("Jogo não encontrado");

    const existing = await ctx.db
      .query("aiPredictions")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .unique();

    if (existing) {
      validateAIPredictionPayload({
        exactScore: args.exactScore,
        confidence: existing.confidence,
        reasoning: existing.reasoning,
      });

      await ctx.db.patch(existing._id, {
        prediction: args.prediction,
        exactScore: args.exactScore,
      });
      return;
    }

    const confidence = MANUAL_PREDICTION_DEFAULTS.confidence;
    const reasoning = [...MANUAL_PREDICTION_DEFAULTS.reasoning];
    validateAIPredictionPayload({
      exactScore: args.exactScore,
      confidence,
      reasoning,
    });

    await ctx.db.insert("aiPredictions", {
      matchId: args.matchId,
      prediction: args.prediction,
      exactScore: args.exactScore,
      confidence,
      reasoning,
      modelVersion: MANUAL_PREDICTION_DEFAULTS.modelVersion,
      generatedAt: Date.now(),
    });
  },
});

export const updateMatchScore = mutation({
  args: {
    matchId: v.id("worldCupMatches"),
    homeScore: v.number(),
    awayScore: v.number(),
    status: v.union(
      v.literal("scheduled"),
      v.literal("live"),
      v.literal("aet"),
      v.literal("penalties"),
      v.literal("finished"),
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, { matchId, homeScore, awayScore, status, reason }) => {
    const admin = await requireAdmin(ctx);
    return updateWorldCupMatchScore(ctx, {
      adminUserId: admin._id,
      matchId,
      homeScore,
      awayScore,
      status,
      reason,
    });
  },
});

// ============ TEAM MANAGEMENT (ADMIN) ============

export const listAvailableTeams = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const matches = await ctx.db.query("worldCupMatches").collect();
    const teamsMap = new Map<
      string,
      { code: string; name: string; flag: string }
    >();

    for (const match of matches) {
      if (!teamsMap.has(match.homeTeamCode)) {
        teamsMap.set(match.homeTeamCode, {
          code: match.homeTeamCode,
          name: match.homeTeamName,
          flag: match.homeTeamFlag,
        });
      }
      if (!teamsMap.has(match.awayTeamCode)) {
        teamsMap.set(match.awayTeamCode, {
          code: match.awayTeamCode,
          name: match.awayTeamName,
          flag: match.awayTeamFlag,
        });
      }
    }

    return [...teamsMap.values()].sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const updateMatchTeams = mutation({
  args: {
    matchId: v.id("worldCupMatches"),
    homeTeam: v.object({
      code: v.string(),
      name: v.string(),
      flag: v.string(),
    }),
    awayTeam: v.object({
      code: v.string(),
      name: v.string(),
      flag: v.string(),
    }),
  },
  handler: async (ctx, { matchId, homeTeam, awayTeam }) => {
    await requireAdmin(ctx);

    const match = await ctx.db.get(matchId);
    if (!match) {
      throw new ConvexError("Jogo não encontrado");
    }

    // Generate new slug
    const slugify = (name: string) =>
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/\s+/g, "-");
    const newSlug = `${slugify(homeTeam.name)}-vs-${slugify(awayTeam.name)}`;

    await ctx.db.patch(matchId, {
      homeTeamCode: homeTeam.code,
      homeTeamName: homeTeam.name,
      homeTeamFlag: homeTeam.flag,
      awayTeamCode: awayTeam.code,
      awayTeamName: awayTeam.name,
      awayTeamFlag: awayTeam.flag,
      slug: newSlug,
    });

    return { success: true };
  },
});

// ============ INTERNAL MUTATIONS ============

// Save AI prediction (upsert — one per match)
export const savePrediction = internalMutation({
  args: {
    matchId: v.id("worldCupMatches"),
    prediction: v.union(
      v.literal("home"),
      v.literal("draw"),
      v.literal("away"),
    ),
    exactScore: v.object({ home: v.number(), away: v.number() }),
    confidence: v.number(),
    reasoning: v.array(v.string()),
    trashTalk: v.optional(v.string()),
    modelVersion: v.string(),
  },
  handler: async (ctx, args) => {
    validateAIPredictionPayload({
      exactScore: args.exactScore,
      confidence: args.confidence,
      reasoning: args.reasoning,
    });

    const existing = await ctx.db
      .query("aiPredictions")
      .withIndex("by_match", (q) => q.eq("matchId", args.matchId))
      .unique();
    if (existing) await ctx.db.delete(existing._id);

    await ctx.db.insert("aiPredictions", {
      ...args,
      generatedAt: Date.now(),
    });
  },
});

export const deleteAIPrediction = internalMutation({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    const existing = await ctx.db
      .query("aiPredictions")
      .withIndex("by_match", (q) => q.eq("matchId", matchId))
      .unique();
    if (existing) await ctx.db.delete(existing._id);
  },
});

async function incrementUserAiStats(
  ctx: MutationCtx,
  userId: Id<"users">,
  outcome: AiOutcome,
) {
  const existing = await ctx.db
    .query("userAiStats")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  const now = Date.now();
  if (existing) {
    const updates: Partial<Doc<"userAiStats">> = {
      lastUpdated: now,
      totalMatches: existing.totalMatches + 1,
    };
    if (outcome === "win") updates.winCount = existing.winCount + 1;
    else if (outcome === "loss") updates.lossCount = existing.lossCount + 1;
    else updates.tieCount = existing.tieCount + 1;

    await ctx.db.patch(existing._id, updates);
  } else {
    await ctx.db.insert("userAiStats", {
      userId,
      winCount: outcome === "win" ? 1 : 0,
      lossCount: outcome === "loss" ? 1 : 0,
      tieCount: outcome === "tie" ? 1 : 0,
      totalMatches: 1,
      lastUpdated: now,
    });
  }
}

// Update user AI stats (denormalized)
export const updateUserAiStats = internalMutation({
  args: {
    userId: v.id("users"),
    outcome: v.union(v.literal("win"), v.literal("loss"), v.literal("tie")),
  },
  handler: async (ctx, { userId, outcome }) => {
    await incrementUserAiStats(ctx, userId, outcome);
  },
});

// Award badges - PAGINATED to avoid O(n) collect
export const awardBadgesForMatch = internalMutation({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    const match = await ctx.db.get(matchId);
    if (!match || match.status !== "finished") return;
    if (match.homeScore === undefined || match.awayScore === undefined) return;

    const aiPrediction = await ctx.db
      .query("aiPredictions")
      .withIndex("by_match", (q) => q.eq("matchId", matchId))
      .unique();
    if (!aiPrediction) return;

    const actualResult = getMatchResult(match.homeScore, match.awayScore);
    const gepetoCorrect = aiPrediction.prediction === actualResult;

    const existingBadges = await ctx.db
      .query("userAiBadges")
      .withIndex("by_match", (q) => q.eq("matchId", matchId))
      .collect();
    const existingBadgeUserIds = new Set(
      existingBadges.map((badge) => badge.userId),
    );

    const existingResults = await ctx.db
      .query("userAiMatchResults")
      .withIndex("by_match", (q) => q.eq("matchId", matchId))
      .collect();
    const processedUserIds = new Set(
      existingResults.map((result) => result.userId),
    );

    // Paginated processing - 100 at a time
    const BATCH_SIZE = 100;
    let cursor: string | null = null;
    let processed = 0;

    while (true) {
      const batch = await ctx.db
        .query("userPredictions")
        .withIndex("by_match", (q) => q.eq("matchId", matchId))
        .paginate({ numItems: BATCH_SIZE, cursor });

      for (const userPred of batch.page) {
        if (processedUserIds.has(userPred.userId)) {
          processed++;
          continue;
        }

        const userCorrect = userPred.prediction === actualResult;
        const userBeatAI = userCorrect && !gepetoCorrect;
        const outcome: AiOutcome = userBeatAI
          ? "win"
          : userCorrect && gepetoCorrect
            ? "tie"
            : "loss";
        const awardedBadge = outcome === "win";
        const now = Date.now();

        if (awardedBadge && !existingBadgeUserIds.has(userPred.userId)) {
          await ctx.db.insert("userAiBadges", {
            userId: userPred.userId,
            matchId,
            awardedAt: now,
          });
          existingBadgeUserIds.add(userPred.userId);
        }

        await ctx.db.insert("userAiMatchResults", {
          userId: userPred.userId,
          matchId,
          outcome,
          awardedBadge,
          createdAt: now,
        });
        processedUserIds.add(userPred.userId);
        await incrementUserAiStats(ctx, userPred.userId, outcome);
        processed++;
      }

      if (batch.isDone) break;
      cursor = batch.continueCursor;
    }

    console.log(`Processed ${processed} predictions for match ${matchId}`);
  },
});

// Save weekly narrative
export const saveWeeklyNarrative = internalMutation({
  args: {
    weekNumber: v.number(),
    year: v.number(),
    narrative: v.string(),
    gepetoScore: v.number(),
    communityScore: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("aiWeeklyNarratives", {
      ...args,
      generatedAt: Date.now(),
    });
  },
});

// ============ INTERNAL ACTIONS ============

type GeneratePredictionResult =
  | { skipped: true; reason: "already-exists" | "match-started" }
  | { skipped: false; prediction: Doc<"aiPredictions"> | null };

export const generateAIPrediction = internalAction({
  args: {
    matchId: v.id("worldCupMatches"),
    force: v.optional(v.boolean()),
    adminOverride: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { matchId, force, adminOverride },
  ): Promise<GeneratePredictionResult> => {
    const match = await ctx.runQuery(internal.gepeto.getMatchForPrediction, {
      matchId,
    });
    if (!match) throw new Error("Match not found");

    const existing = await ctx.runQuery(
      internal.gepeto.getAIPredictionInternal,
      {
        matchId,
      },
    );
    if (existing && !force) {
      return { skipped: true as const, reason: "already-exists" as const };
    }
    if (existing && force) {
      await ctx.runMutation(internal.gepeto.deleteAIPrediction, { matchId });
    }

    const matchStatus = match.status ?? "scheduled";
    if (
      !adminOverride &&
      (match.kickoffAt <= Date.now() || matchStatus !== "scheduled")
    ) {
      console.warn("Gepeto prediction skipped before OpenAI call", {
        matchId,
        kickoffAt: match.kickoffAt,
        status: matchStatus,
      });
      return { skipped: true as const, reason: "match-started" as const };
    }

    const prompt = buildPredictionPrompt(match);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    let lastError: Error | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetchWithTimeout(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [{ role: "user", content: prompt }],
              max_tokens: 500,
              response_format: {
                type: "json_schema",
                json_schema: {
                  name: "prediction",
                  strict: true,
                  schema: {
                    type: "object",
                    properties: {
                      prediction: {
                        type: "string",
                        enum: ["home", "draw", "away"],
                      },
                      exactScore: {
                        type: "object",
                        properties: {
                          home: { type: "integer", minimum: 0 },
                          away: { type: "integer", minimum: 0 },
                        },
                        required: ["home", "away"],
                        additionalProperties: false,
                      },
                      confidence: { type: "integer", minimum: 0, maximum: 100 },
                      reasoning: {
                        type: "array",
                        items: { type: "string", minLength: 1 },
                        minItems: 3,
                        maxItems: 3,
                      },
                      trashTalk: { type: "string" },
                    },
                    required: [
                      "prediction",
                      "exactScore",
                      "confidence",
                      "reasoning",
                      "trashTalk",
                    ],
                    additionalProperties: false,
                  },
                },
              },
            }),
          },
          15_000,
        );

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const parsed = parsePredictionResponse(data.choices[0].message.content);

        await ctx.runMutation(internal.gepeto.savePrediction, {
          matchId,
          ...parsed,
          modelVersion: "gpt-4o-mini",
        });

        const saved = await ctx.runQuery(
          internal.gepeto.getAIPredictionInternal,
          {
            matchId,
          },
        );
        return { skipped: false as const, prediction: saved };
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        lastError = error;
        console.warn("OpenAI prediction attempt failed", {
          matchId,
          attempt: attempt + 1,
          maxAttempts: 3,
          error: error.message,
        });
        if (attempt === 2) break;
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    throw lastError ?? new Error("OpenAI prediction failed");
  },
});

export const generateAIPredictionAdmin = action({
  args: {
    matchId: v.id("worldCupMatches"),
    force: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { matchId, force },
  ): Promise<GeneratePredictionResult> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Não autenticado");

    await ctx.runQuery(internal.gepeto.assertAdmin, {
      clerkId: identity.subject,
    });

    return ctx.runAction(internal.gepeto.generateAIPrediction, {
      matchId,
      force: force ?? false,
      adminOverride: true,
    });
  },
});

export const generateWeeklyNarrativeScheduled = internalAction({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const weekNumber = getISOWeekNumber(now);
    const year = now.getFullYear();

    // Check if already generated
    const existing = await ctx.runQuery(api.gepeto.getWeeklyNarrative, {
      weekNumber,
      year,
    });
    if (existing) return;

    // TODO: Implement weekly score calculation
    // For now, placeholder
    await ctx.runMutation(internal.gepeto.saveWeeklyNarrative, {
      weekNumber,
      year,
      narrative: `Semana ${weekNumber}: Gepeto vs Comunidade - resultados em breve!`,
      gepetoScore: 0,
      communityScore: 0,
    });
  },
});
