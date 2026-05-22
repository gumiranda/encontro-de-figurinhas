import { ConvexError, v } from "convex/values";
import xss from "xss";
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
  query,
} from "./_generated/server";
import { getAuthenticatedUser, requireAdmin, requireAuth } from "./lib/auth";
import { rateLimiter } from "./lib/rateLimiter";
import { Role } from "./lib/types";

// ============ HELPERS ============

function getMatchResult(
  homeScore: number,
  awayScore: number,
): "home" | "draw" | "away" {
  if (homeScore > awayScore) return "home";
  if (awayScore > homeScore) return "away";
  return "draw";
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

    const isRevealed = match.kickoffAt <= Date.now();
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
    if (match.kickoffAt <= Date.now()) {
      throw new ConvexError("Jogo já começou. Palpites fechados.");
    }

    // Validate exactScore bounds
    if (exactScore) {
      if (exactScore.home < 0 || exactScore.away < 0) {
        throw new ConvexError("Placar não pode ser negativo");
      }
    }

    await rateLimiter.limit(ctx, "gepetoPrediction", {
      key: user._id,
      throws: true,
    });

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
    const match = await ctx.db.get(matchId);
    if (!match) throw new ConvexError("Jogo não encontrado");

    if (
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore) ||
      homeScore < 0 ||
      awayScore < 0
    ) {
      throw new ConvexError("Placar deve ser inteiro e não negativo");
    }

    const sanitizedReason = sanitizeReason(reason);
    if (match.status === "finished" && !sanitizedReason) {
      throw new ConvexError("Jogo já finalizado. Informe motivo da correção.");
    }

    await rateLimiter.limit(ctx, "gepetoScoreUpdate", {
      key: admin._id,
      throws: true,
    });

    const now = Date.now();

    await ctx.db.insert("scoreAuditLog", {
      matchId,
      adminUserId: admin._id,
      previousScore:
        match.homeScore !== undefined && match.awayScore !== undefined
          ? { home: match.homeScore, away: match.awayScore }
          : undefined,
      newScore: { home: homeScore, away: awayScore },
      previousStatus: match.status,
      newStatus: status,
      changedAt: now,
      reason: sanitizedReason,
    });

    await ctx.db.patch(matchId, {
      homeScore,
      awayScore,
      status,
      finishedAt: status === "finished" ? now : undefined,
    });

    if (status === "finished") {
      await ctx.scheduler.runAfter(0, internal.gepeto.awardBadgesForMatch, {
        matchId,
      });
    }
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
      throw new Error("Invalid AI prediction payload");
    }

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
  handler: async (ctx, { matchId, force, adminOverride }): Promise<GeneratePredictionResult> => {
    const match = await ctx.runQuery(internal.gepeto.getMatchForPrediction, {
      matchId,
    });
    if (!match) throw new Error("Match not found");

    const existing = await ctx.runQuery(
      internal.gepeto.getAIPredictionInternal,
      { matchId },
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
          { matchId },
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
  handler: async (ctx, { matchId, force }): Promise<GeneratePredictionResult> => {
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
