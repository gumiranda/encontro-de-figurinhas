import { ConvexError, v } from "convex/values";
import {
  httpAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { boringReason } from "./schema";
import { rateLimiter } from "./lib/rateLimiter";
import { getAuthenticatedUser, requireAdmin } from "./lib/auth";

const REASON_KEYS = [
  "sem_chances",
  "jogo_truncado",
  "sem_estrelas",
  "placar_morno",
  "narrador_dormindo",
  "meme_potencial",
] as const;
type ReasonKey = (typeof REASON_KEYS)[number];

function applyDelta(
  counts: Record<ReasonKey, number>,
  reasons: ReasonKey[],
  delta: 1 | -1,
): Record<ReasonKey, number> {
  const next = { ...counts };
  for (const r of reasons) next[r] = Math.max(0, (next[r] ?? 0) + delta);
  return next;
}

export const getActiveRound = query({
  args: {},
  handler: async (ctx) => {
    // Filtro duplo: isActive flag + endDate ainda não passou. Protege contra
    // admin esquecer de virar isActive=false quando a rodada acaba.
    const now = Date.now();
    const candidates = await ctx.db
      .query("worldCupRounds")
      .withIndex("by_isActive_order", (q) => q.eq("isActive", true))
      .order("desc")
      .collect();
    return candidates.find((r) => r.endDate >= now) ?? null;
  },
});

export const getRoundBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const round = await ctx.db
      .query("worldCupRounds")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!round || !round.isActive) return null;
    // isFinished derivado server-side — usado em /resultado pra gating noindex
    // sem precisar de Date.now() no Server Component (Next 16 cacheComponents
    // proíbe). Server-side Date.now() é OK porque é inside Convex query.
    return { ...round, isFinished: round.endDate < Date.now() };
  },
});

export const listRounds = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("worldCupRounds")
      .withIndex("by_isActive_order", (q) => q.eq("isActive", true))
      .order("asc")
      .take(64);
  },
});

export const listRoundsForAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const rounds = await ctx.db
      .query("worldCupRounds")
      .withIndex("by_order")
      .order("asc")
      .take(64);
    const matches = await ctx.db.query("worldCupMatches").take(1000);
    const matchesByRound = new Map<string, Doc<"worldCupMatches">[]>();

    for (const match of matches) {
      const key = String(match.roundId);
      const group = matchesByRound.get(key) ?? [];
      group.push(match);
      matchesByRound.set(key, group);
    }

    return rounds.map((round) => ({
      ...round,
      matches: (matchesByRound.get(String(round._id)) ?? []).sort(
        (a, b) => a.kickoffAt - b.kickoffAt,
      ),
    }));
  },
});

export const setRoundActive = mutation({
  args: { roundId: v.id("worldCupRounds"), isActive: v.boolean() },
  handler: async (ctx, { roundId, isActive }) => {
    await requireAdmin(ctx);

    const round = await ctx.db.get(roundId);
    if (!round) throw new ConvexError("Round not found");

    await ctx.db.patch(roundId, { isActive });

    return { _id: roundId, slug: round.slug, isActive };
  },
});

export const setMatchScore = mutation({
  args: {
    matchId: v.id("worldCupMatches"),
    homeScore: v.number(),
    awayScore: v.number(),
  },
  handler: async (ctx, { matchId, homeScore, awayScore }) => {
    await requireAdmin(ctx);

    if (
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore) ||
      homeScore < 0 ||
      awayScore < 0
    ) {
      throw new ConvexError("Score must be non-negative integers");
    }

    const match = await ctx.db.get(matchId);
    if (!match) throw new ConvexError("Match not found");

    await ctx.db.patch(matchId, { homeScore, awayScore });

    return { _id: matchId, homeScore, awayScore };
  },
});

export const listMatchesByRound = query({
  args: { roundId: v.id("worldCupRounds") },
  handler: async (ctx, { roundId }) => {
    const round = await ctx.db.get(roundId);
    if (!round?.isActive) return [];

    return await ctx.db
      .query("worldCupMatches")
      .withIndex("by_round_kickoff", (q) => q.eq("roundId", roundId))
      .collect();
  },
});

export const getMatchBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const match = await ctx.db
      .query("worldCupMatches")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!match) return null;
    const round = await ctx.db.get(match.roundId);
    if (!round) throw new ConvexError("Round not found");
    if (!round.isActive) return null;
    return { match, round };
  },
});

export const getMatch = query({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    return ctx.db.get(matchId);
  },
});

export const getRoundResult = query({
  args: { roundId: v.id("worldCupRounds") },
  handler: async (ctx, { roundId }) => {
    const round = await ctx.db.get(roundId);
    if (!round?.isActive) return [];

    const matches = await ctx.db
      .query("worldCupMatches")
      .withIndex("by_round_totalVotes", (q) => q.eq("roundId", roundId))
      .order("desc")
      .collect();
    return matches.sort((a, b) => {
      if (b.totalVotes !== a.totalVotes) return b.totalVotes - a.totalVotes;
      return (b.lastVoteAt ?? 0) - (a.lastVoteAt ?? 0);
    });
  },
});

export const getAllTimeRanking = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const max = limit ?? 10;
    const matches = await ctx.db
      .query("worldCupMatches")
      .withIndex("by_totalVotes")
      .order("desc")
      .take(1000);
    const roundIds = [...new Set(matches.map((m) => m.roundId))];
    const rounds = await Promise.all(roundIds.map((id) => ctx.db.get(id)));
    const roundMap = new Map(
      rounds
        .filter((r): r is NonNullable<typeof r> => r !== null && r.isActive)
        .map((r) => [r._id as string, r]),
    );
    const ordered = matches
      .filter((m) => roundMap.has(m.roundId as string))
      .sort((a, b) => {
        if (b.totalVotes !== a.totalVotes) return b.totalVotes - a.totalVotes;
        return (b.lastVoteAt ?? 0) - (a.lastVoteAt ?? 0);
      })
      .slice(0, max);
    return ordered.map((m) => ({
      ...m,
      round: roundMap.get(m.roundId as string) ?? null,
    }));
  },
});

export const getUserVoteForMatch = query({
  args: { matchId: v.id("worldCupMatches") },
  handler: async (ctx, { matchId }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;
    const vote = await ctx.db
      .query("boringGameVotes")
      .withIndex("by_match_user", (q) =>
        q.eq("matchId", matchId).eq("userId", user._id),
      )
      .unique();
    return vote ? { reasons: vote.reasons } : null;
  },
});

export const listRoundsForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const rounds = await ctx.db
      .query("worldCupRounds")
      .withIndex("by_isActive_order", (q) => q.eq("isActive", true))
      .take(64);
    // Single fetch for all matches to avoid N+1 per round.
    const allMatches = await ctx.db.query("worldCupMatches").take(1000);
    const matchesByRound = new Map<string, typeof allMatches>();
    for (const m of allMatches) {
      const arr = matchesByRound.get(m.roundId) ?? [];
      arr.push(m);
      matchesByRound.set(m.roundId, arr);
    }
    const result: Array<{
      slug: string;
      endDate: number;
      isActive: boolean;
      lastModified: number;
    }> = [];
    for (const r of rounds) {
      const matches = matchesByRound.get(r._id) ?? [];
      const maxVote = matches.reduce(
        (acc, m) => Math.max(acc, m.lastVoteAt ?? 0),
        0,
      );
      result.push({
        slug: r.slug,
        endDate: r.endDate,
        isActive: r.isActive,
        lastModified: maxVote || r._creationTime,
      });
    }
    return result;
  },
});

export const listMatchesForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const matches = await ctx.db.query("worldCupMatches").take(1000);
    const roundIds = [...new Set(matches.map((m) => m.roundId))];
    const rounds = await Promise.all(roundIds.map((id) => ctx.db.get(id)));
    const roundMap = new Map(
      rounds
        .filter((r): r is NonNullable<typeof r> => r !== null && r.isActive)
        .map((r) => [r._id as string, r.slug]),
    );
    return matches
      .map((m) => ({
        roundSlug: roundMap.get(m.roundId as string) ?? "",
        matchSlug: m.slug,
        lastModified: m.lastVoteAt ?? m._creationTime,
      }))
      .filter((x) => x.roundSlug !== "");
  },
});

// Helper test-only — flip isActive de uma round (uso: validar gating noindex
// em /resultado, ou simular fim de rodada em staging).
// Uso: `npx convex run boringGame:_setRoundActive '{"slug":"...","isActive":false}'`
export const _setRoundActive = internalMutation({
  args: { slug: v.string(), isActive: v.boolean() },
  handler: async (ctx, { slug, isActive }) => {
    const round = await ctx.db
      .query("worldCupRounds")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!round) throw new ConvexError("Round not found");
    await ctx.db.patch(round._id, { isActive });
    return { _id: round._id, slug, isActive };
  },
});

// User lookup acontece DENTRO da mutation (uma transação Convex) — elimina
// race entre query separada e write. Caller passa só clerkId (Clerk JWT subject).
export const castVoteInternal = internalMutation({
  args: {
    matchId: v.id("worldCupMatches"),
    reasons: v.array(boringReason),
    clerkId: v.string(),
    ip: v.string(),
  },
  handler: async (ctx, { matchId, reasons, clerkId, ip }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();
    if (!user) throw new ConvexError("user-not-found");
    const userId = user._id;

    // Validações cheap PRIMEIRO — não queimam rate-limit token em request inválido
    const dedup = Array.from(new Set(reasons)) as ReasonKey[];
    if (dedup.length < 1 || dedup.length > 6) {
      throw new ConvexError("Reasons must be between 1 and 6");
    }
    const match = await ctx.db.get(matchId);
    if (!match) throw new ConvexError("Match not found");
    const round = await ctx.db.get(match.roundId);
    if (!round?.isActive) throw new ConvexError("Round inactive");
    if (match.homeScore === undefined || match.awayScore === undefined) {
      throw new ConvexError("Score not defined");
    }

    // Rate-limit DEPOIS de validar matchId/reasons — user não perde tentativa
    // por payload inválido. Token só é consumido em vote real.
    await rateLimiter.limit(ctx, "boringGameVoteUser", {
      key: userId,
      throws: true,
    });
    await rateLimiter.limit(ctx, "boringGameVoteIp", {
      key: ip,
      throws: true,
    });

    const existing = await ctx.db
      .query("boringGameVotes")
      .withIndex("by_match_user", (q) =>
        q.eq("matchId", matchId).eq("userId", userId),
      )
      .unique();

    const now = Date.now();

    const roundSlug = round?.slug;

    let totalVotes = match.totalVotes;
    if (!existing) {
      await ctx.db.insert("boringGameVotes", {
        matchId,
        userId,
        roundId: match.roundId,
        reasons: dedup,
      });
      const newCounts = applyDelta(match.reasonCounts, dedup, 1);
      totalVotes = match.totalVotes + 1;
      await ctx.db.patch(matchId, {
        totalVotes,
        reasonCounts: newCounts,
        lastVoteAt: now,
      });
    } else {
      const oldSet = new Set(existing.reasons as ReasonKey[]);
      const newSet = new Set(dedup);
      const removed = [...oldSet].filter((r) => !newSet.has(r));
      const added = [...newSet].filter((r) => !oldSet.has(r));

      let counts = applyDelta(match.reasonCounts, removed, -1);
      counts = applyDelta(counts, added, 1);

      await ctx.db.patch(existing._id, { reasons: dedup });
      await ctx.db.patch(matchId, { reasonCounts: counts, lastVoteAt: now });
    }

    return { totalVotes, reasons: dedup };
  },
});

// Origin allowlist — restringe CORS + bloqueia CSRF cross-site
// Inclui prod, www, dev local e qualquer preview *.vercel.app do projeto.
const STATIC_ALLOWED_ORIGINS = [
  "https://figurinhafacil.com.br",
  "https://www.figurinhafacil.com.br",
  "http://localhost:3002",
  "http://localhost:3000",
];

// Padrão Vercel: <branch>-<project>-<team>.vercel.app
// Sufixo `-figurinhafacil-` é OBRIGATÓRIO — bloqueia *.vercel.app arbitrários
// (ex: evil-attack.vercel.app, figurinhafacil-evil.vercel.app).
const VERCEL_PREVIEW_PATTERN =
  /^https:\/\/[a-z0-9-]+-figurinhafacil-[a-z0-9-]+\.vercel\.app$/;

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (STATIC_ALLOWED_ORIGINS.includes(origin)) return true;
  if (VERCEL_PREVIEW_PATTERN.test(origin)) return true;
  return false;
}

function corsHeadersFor(origin: string | null): Record<string, string> {
  const allow = isAllowedOrigin(origin)
    ? origin
    : "https://figurinhafacil.com.br";
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Digest, X-Requested-With",
    Vary: "Origin",
  };
}

export const castVoteHttp = httpAction(async (ctx, request) => {
  const origin = request.headers.get("origin");
  const headers = corsHeadersFor(origin);

  // CSRF guard — bloqueia POST de origin não-allowlisted
  if (!isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers,
    });
  }

  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return new Response(JSON.stringify({ error: "needs-auth" }), {
      status: 401,
      headers,
    });
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  let body: { matchId?: string; reasons?: string[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers,
    });
  }

  if (!body.matchId || !Array.isArray(body.reasons)) {
    return new Response(
      JSON.stringify({ error: "Missing matchId or reasons" }),
      {
        status: 400,
        headers,
      },
    );
  }

  try {
    const result = await ctx.runMutation(internal.boringGame.castVoteInternal, {
      matchId: body.matchId as Id<"worldCupMatches">,
      reasons: body.reasons as Array<
        | "sem_chances"
        | "jogo_truncado"
        | "sem_estrelas"
        | "placar_morno"
        | "narrador_dormindo"
        | "meme_potencial"
      >,
      clerkId: identity.subject,
      ip,
    });
    return new Response(JSON.stringify(result), {
      status: 200,
      headers,
    });
  } catch (err) {
    const msg =
      err instanceof ConvexError
        ? typeof err.data === "string"
          ? err.data
          : "error"
        : (err as Error).message;
    // Status mapping semântico:
    // - 401: auth issues (cliente precisa logar)
    // - 404: recurso não-existe (matchId inválido)
    // - 429: rate limit (cliente espera + retry)
    // - 400: erros validação client (reasons malformadas, body inválido) — NÃO retry
    // - 500: erros não-categorizados (DB issues, network, unexpected) — retry com backoff
    const knownClientErrors = [
      "Reasons must be between 1 and 6",
      "Invalid JSON",
      "Missing matchId or reasons",
      "Origin not allowed",
      "Round inactive",
      "Score not defined",
    ];
    const status =
      msg === "user-not-found" || msg === "needs-auth"
        ? 401
        : msg.includes("RateLimit")
          ? 429
          : msg === "Match not found"
            ? 404
            : knownClientErrors.includes(msg)
              ? 400
              : 500;
    return new Response(JSON.stringify({ error: msg }), {
      status,
      headers,
    });
  }
});

export const castVoteOptions = httpAction(async (_ctx, request) => {
  const origin = request.headers.get("origin");
  return new Response(null, { status: 204, headers: corsHeadersFor(origin) });
});
