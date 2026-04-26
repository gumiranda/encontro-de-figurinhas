import { v, ConvexError } from "convex/values";
import {
  mutation,
  query,
  internalMutation,
  type MutationCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { getAuthenticatedUser } from "./lib/auth";
import { getActiveCheckin } from "./lib/checkinHelpers";
import { DEFAULT_TOTAL_STICKERS } from "./lib/constants";
import { getPendingTradesCount } from "./lib/tradeHelpers";
import { rateLimiter } from "./lib/rateLimiter";

const MAX_PENDING_TRADES = 5;
const TRADE_EXPIRATION_MS = 72 * 60 * 60 * 1000;
const HISTORY_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const LIST_MY_TRADES_CAP = 300;

function computeLiveOverlap(
  user: Doc<"users">,
  counterparty: Doc<"users">
): { theyHaveINeed: number[]; iHaveTheyNeed: number[] } {
  const theirDup = new Set(counterparty.duplicates ?? []);
  const theirMiss = new Set(counterparty.missing ?? []);

  const theyHaveINeed: number[] = [];
  for (const n of user.missing ?? []) {
    if (theirDup.has(n)) theyHaveINeed.push(n);
  }
  theyHaveINeed.sort((a, b) => a - b);

  const iHaveTheyNeed: number[] = [];
  for (const n of user.duplicates ?? []) {
    if (theirMiss.has(n)) iHaveTheyNeed.push(n);
  }
  iHaveTheyNeed.sort((a, b) => a - b);

  return { theyHaveINeed, iHaveTheyNeed };
}

async function assertBothPublicCheckinAtPoint(
  ctx: MutationCtx,
  userId: Id<"users">,
  counterpartyId: Id<"users">,
  tradePointId: Id<"tradePoints">
): Promise<void> {
  // Parallel queries for both users' active checkins
  const [a, b] = await Promise.all([
    getActiveCheckin(ctx, userId),
    getActiveCheckin(ctx, counterpartyId),
  ]);

  if (
    !a ||
    a.tradePointId !== tradePointId ||
    a.countedInPublic !== true
  ) {
    throw new ConvexError("NO_MATCH");
  }
  if (
    !b ||
    b.tradePointId !== tradePointId ||
    b.countedInPublic !== true
  ) {
    throw new ConvexError("NO_MATCH");
  }
}

export const initiate = mutation({
  args: {
    matchedUserId: v.id("users"),
    stickersIGive: v.array(v.number()),
    stickersIReceive: v.array(v.number()),
    /** Required when no `precomputedMatches` row exists (e.g. live "present at point" cards). */
    tradePointId: v.optional(v.id("tradePoints")),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError("AUTH_REQUIRED");

    if (user.isBanned || user.isShadowBanned) {
      throw new ConvexError("USER_BANNED");
    }

    if (!user.hasCompletedStickerSetup) {
      throw new ConvexError("STICKER_SETUP_REQUIRED");
    }

    const pendingCount = await getPendingTradesCount(ctx, user._id);
    if (pendingCount >= MAX_PENDING_TRADES) {
      throw new ConvexError("TOO_MANY_PENDING");
    }

    await rateLimiter.limit(ctx, "tradeInitiate", { key: user._id, throws: true });

    const counterparty = await ctx.db.get(args.matchedUserId);
    if (
      !counterparty ||
      counterparty.isBanned ||
      counterparty.isShadowBanned === true
    ) {
      throw new ConvexError("USER_NOT_FOUND");
    }

    if (args.stickersIGive.length === 0 || args.stickersIReceive.length === 0) {
      throw new ConvexError("EMPTY_STICKERS");
    }

    const precomputed = await ctx.db
      .query("precomputedMatches")
      .withIndex("by_user_matched_point", (q) =>
        q.eq("userId", user._id).eq("matchedUserId", args.matchedUserId)
      )
      .first();

    let resolvedTradePointId: Id<"tradePoints">;
    let theyHaveINeed: number[];
    let iHaveTheyNeed: number[];

    if (precomputed) {
      resolvedTradePointId = precomputed.tradePointId;
      theyHaveINeed = precomputed.theyHaveINeed;
      iHaveTheyNeed = precomputed.iHaveTheyNeed;
    } else {
      if (!args.tradePointId) {
        throw new ConvexError("NO_MATCH");
      }
      if (!counterparty.hasCompletedStickerSetup) {
        throw new ConvexError("NO_MATCH");
      }
      await assertBothPublicCheckinAtPoint(
        ctx,
        user._id,
        args.matchedUserId,
        args.tradePointId
      );
      const live = computeLiveOverlap(user, counterparty);
      if (live.theyHaveINeed.length === 0 || live.iHaveTheyNeed.length === 0) {
        throw new ConvexError("NO_MATCH");
      }
      resolvedTradePointId = args.tradePointId;
      theyHaveINeed = live.theyHaveINeed;
      iHaveTheyNeed = live.iHaveTheyNeed;
    }

    const userDuplicates = user.duplicates ?? [];
    const counterpartyDuplicates = counterparty.duplicates ?? [];

    for (const s of args.stickersIGive) {
      if (!userDuplicates.includes(s)) throw new ConvexError("INVALID_STICKER");
      if (!iHaveTheyNeed.includes(s)) throw new ConvexError("INVALID_STICKER");
    }
    for (const s of args.stickersIReceive) {
      if (!counterpartyDuplicates.includes(s)) throw new ConvexError("INVALID_STICKER");
      if (!theyHaveINeed.includes(s)) throw new ConvexError("INVALID_STICKER");
    }

    const pairKey = [user._id, args.matchedUserId].sort().join("_");

    const sanitizedMessage = args.message?.trim();
    if (sanitizedMessage && sanitizedMessage.length > 200) {
      throw new ConvexError("MESSAGE_TOO_LONG");
    }

    const existing = await ctx.db
      .query("trades")
      .withIndex("by_pairKey_status_created", (q) =>
        q.eq("pairKey", pairKey).eq("status", "pending_confirmation")
      )
      .first();
    if (existing) throw new ConvexError("ALREADY_PENDING");

    const tradePoint = await ctx.db.get(resolvedTradePointId);

    const tradeId = await ctx.db.insert("trades", {
      pairKey,
      initiatorId: user._id,
      counterpartyId: args.matchedUserId,
      tradePointId: resolvedTradePointId,
      stickersInitiatorGave: args.stickersIGive,
      stickersInitiatorReceived: args.stickersIReceive,
      status: "pending_confirmation",
      createdAt: Date.now(),
      initiatorMessage: sanitizedMessage || undefined,
      initiatorDisplayNickname:
        user.displayNickname ?? user.nickname ?? user.name,
      initiatorAvatarUrl: user.avatarUrl,
      initiatorTotalTrades: user.totalTrades ?? 0,
      initiatorReliabilityScore: user.reliabilityScore,
      counterpartyDisplayNickname:
        counterparty.displayNickname ?? counterparty.nickname ?? counterparty.name,
      counterpartyAvatarUrl: counterparty.avatarUrl,
      counterpartyTotalTrades: counterparty.totalTrades ?? 0,
      counterpartyReliabilityScore: counterparty.reliabilityScore,
      tradePointName: tradePoint?.name,
      tradePointAddress: tradePoint?.address,
    });

    await ctx.scheduler.runAfter(TRADE_EXPIRATION_MS, internal.trades.expireTrade, {
      tradeId,
    });

    return { tradeId };
  },
});

export const confirm = mutation({
  args: {
    tradeId: v.id("trades"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError("AUTH_REQUIRED");

    const trade = await ctx.db.get(args.tradeId);
    if (!trade) throw new ConvexError("NOT_FOUND");

    if (trade.counterpartyId !== user._id) throw new ConvexError("FORBIDDEN");
    if (trade.status !== "pending_confirmation") throw new ConvexError("STATE_CHANGED");

    if (user.isBanned) throw new ConvexError("USER_BANNED");

    const initiator = await ctx.db.get(trade.initiatorId);
    if (!initiator || initiator.isBanned) throw new ConvexError("USER_BANNED");

    const initiatorDuplicates = initiator.duplicates ?? [];
    const counterpartyDuplicates = user.duplicates ?? [];

    for (const s of trade.stickersInitiatorGave) {
      if (!initiatorDuplicates.includes(s)) throw new ConvexError("STICKERS_CHANGED");
    }
    for (const s of trade.stickersInitiatorReceived) {
      if (!counterpartyDuplicates.includes(s)) throw new ConvexError("STICKERS_CHANGED");
    }

    const initiatorMissing = initiator.missing ?? [];
    const counterpartyMissing = user.missing ?? [];

    const updatedInitiatorDuplicates = initiatorDuplicates.filter(
      (n) => !trade.stickersInitiatorGave.includes(n)
    );
    const stickersInitiatorReceives = trade.stickersInitiatorReceived;
    for (const s of stickersInitiatorReceives) {
      if (!updatedInitiatorDuplicates.includes(s)) {
        updatedInitiatorDuplicates.push(s);
      }
    }
    const updatedInitiatorMissing = initiatorMissing.filter(
      (n) => !stickersInitiatorReceives.includes(n)
    );

    const updatedCounterpartyDuplicates = counterpartyDuplicates.filter(
      (n) => !trade.stickersInitiatorReceived.includes(n)
    );
    const stickersCounterpartyReceives = trade.stickersInitiatorGave;
    for (const s of stickersCounterpartyReceives) {
      if (!updatedCounterpartyDuplicates.includes(s)) {
        updatedCounterpartyDuplicates.push(s);
      }
    }
    const updatedCounterpartyMissing = counterpartyMissing.filter(
      (n) => !stickersCounterpartyReceives.includes(n)
    );

    const albumConfig = await ctx.db.query("albumConfig").first();
    const totalStickers = albumConfig?.totalStickers ?? DEFAULT_TOTAL_STICKERS;

    const initiatorAlbumCompletionPct =
      totalStickers === 0
        ? 0
        : Math.round(
            ((totalStickers - updatedInitiatorMissing.length) / totalStickers) * 100
          );
    const counterpartyAlbumCompletionPct =
      totalStickers === 0
        ? 0
        : Math.round(
            ((totalStickers - updatedCounterpartyMissing.length) / totalStickers) * 100
          );

    await ctx.db.patch(trade.initiatorId, {
      duplicates: updatedInitiatorDuplicates.sort((a, b) => a - b),
      missing: updatedInitiatorMissing.sort((a, b) => a - b),
      totalTrades: (initiator.totalTrades ?? 0) + 1,
      albumCompletionPct: initiatorAlbumCompletionPct,
      totalStickersOwned: totalStickers - updatedInitiatorMissing.length,
      albumProgress: initiatorAlbumCompletionPct,
    });

    await ctx.db.patch(trade.counterpartyId, {
      duplicates: updatedCounterpartyDuplicates.sort((a, b) => a - b),
      missing: updatedCounterpartyMissing.sort((a, b) => a - b),
      totalTrades: (user.totalTrades ?? 0) + 1,
      albumCompletionPct: counterpartyAlbumCompletionPct,
      totalStickersOwned: totalStickers - updatedCounterpartyMissing.length,
      albumProgress: counterpartyAlbumCompletionPct,
    });

    await ctx.db.patch(args.tradeId, {
      status: "confirmed",
      confirmedAt: Date.now(),
      initiatorTotalTrades: (initiator.totalTrades ?? 0) + 1,
      counterpartyTotalTrades: (user.totalTrades ?? 0) + 1,
    });

    return { status: "confirmed" as const };
  },
});

export const cancel = mutation({
  args: {
    tradeId: v.id("trades"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError("AUTH_REQUIRED");

    const trade = await ctx.db.get(args.tradeId);
    if (!trade) throw new ConvexError("NOT_FOUND");

    if (trade.initiatorId !== user._id) throw new ConvexError("FORBIDDEN");
    if (trade.status !== "pending_confirmation") throw new ConvexError("STATE_CHANGED");

    await ctx.db.patch(args.tradeId, {
      status: "cancelled",
    });

    return { status: "cancelled" as const };
  },
});

export const dispute = mutation({
  args: {
    tradeId: v.id("trades"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError("AUTH_REQUIRED");

    const trade = await ctx.db.get(args.tradeId);
    if (!trade) throw new ConvexError("NOT_FOUND");

    if (trade.counterpartyId !== user._id) throw new ConvexError("FORBIDDEN");
    if (trade.status !== "pending_confirmation") throw new ConvexError("STATE_CHANGED");

    await ctx.db.patch(args.tradeId, {
      status: "disputed",
      disputedAt: Date.now(),
      disputeReason: args.reason,
    });

    return { status: "disputed" as const };
  },
});

export const decline = mutation({
  args: {
    tradeId: v.id("trades"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError("AUTH_REQUIRED");

    const trade = await ctx.db.get(args.tradeId);
    if (!trade) throw new ConvexError("NOT_FOUND");

    if (trade.counterpartyId !== user._id) throw new ConvexError("FORBIDDEN");
    if (trade.status !== "pending_confirmation") throw new ConvexError("STATE_CHANGED");

    const sanitizedReason = args.reason?.trim();
    if (sanitizedReason && sanitizedReason.length > 200) {
      throw new ConvexError("REASON_TOO_LONG");
    }

    await ctx.db.patch(args.tradeId, {
      status: "declined",
      declinedAt: Date.now(),
      declineReason: sanitizedReason || undefined,
    });

    return { status: "declined" as const };
  },
});

export const expireTrade = internalMutation({
  args: {
    tradeId: v.id("trades"),
  },
  handler: async (ctx, { tradeId }) => {
    const trade = await ctx.db.get(tradeId);
    if (!trade) return;
    if (trade.status !== "pending_confirmation") return;

    await ctx.db.patch(tradeId, {
      status: "expired",
      expiredAt: Date.now(),
    });
  },
});

export type ListMyTradeRow = {
  _id: Id<"trades">;
  status: Doc<"trades">["status"];
  role: "incoming" | "outgoing";
  createdAt: number;
  expiresAt: number;
  confirmedAt: number | null;
  initiatorMessage: string | null;
  stickersIGive: number[];
  stickersIReceive: number[];
  matchPct: number | null;
  counterparty: {
    _id: Id<"users">;
    name: string;
    nickname: string | null;
    avatarUrl: string | null;
    totalTrades: number;
    reliabilityScore: number;
  };
  tradePoint: {
    _id: Id<"tradePoints">;
    name: string;
    address: string;
  } | null;
};

export const listMyTrades = query({
  args: {},
  handler: async (ctx): Promise<ListMyTradeRow[]> => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    const now = Date.now();
    const cutoff = now - HISTORY_WINDOW_MS;

    const [asInitiator, asCounterparty] = await Promise.all([
      ctx.db
        .query("trades")
        .withIndex("by_initiator_status", (q) => q.eq("initiatorId", user._id))
        .order("desc")
        .take(LIST_MY_TRADES_CAP),
      ctx.db
        .query("trades")
        .withIndex("by_counterparty_status", (q) =>
          q.eq("counterpartyId", user._id)
        )
        .order("desc")
        .take(LIST_MY_TRADES_CAP),
    ]);

    const trades: { trade: Doc<"trades">; role: "incoming" | "outgoing" }[] = [];
    for (const t of asInitiator) trades.push({ trade: t, role: "outgoing" });
    for (const t of asCounterparty) trades.push({ trade: t, role: "incoming" });

    const filtered = trades.filter(({ trade }) => {
      if (
        trade.status === "pending_confirmation" ||
        trade.status === "confirmed"
      ) {
        return true;
      }
      return trade.createdAt >= cutoff;
    });

    const userMissingCount = (user.missing ?? []).length;

    const rows: ListMyTradeRow[] = filtered.map(({ trade, role }) =>
      buildTradeRow(trade, role, userMissingCount)
    );

    rows.sort((a, b) => b.createdAt - a.createdAt);
    return rows;
  },
});

function buildTradeRow(
  trade: Doc<"trades">,
  role: "incoming" | "outgoing",
  userMissingCount: number
): ListMyTradeRow {
  const otherId = role === "incoming" ? trade.initiatorId : trade.counterpartyId;

  const stickersIGive =
    role === "outgoing"
      ? trade.stickersInitiatorGave
      : trade.stickersInitiatorReceived;
  const stickersIReceive =
    role === "outgoing"
      ? trade.stickersInitiatorReceived
      : trade.stickersInitiatorGave;

  const matchPct =
    userMissingCount > 0
      ? Math.min(
          100,
          Math.round((stickersIReceive.length / userMissingCount) * 100)
        )
      : null;

  const otherNickname =
    role === "incoming"
      ? trade.initiatorDisplayNickname
      : trade.counterpartyDisplayNickname;
  const otherAvatar =
    role === "incoming"
      ? trade.initiatorAvatarUrl
      : trade.counterpartyAvatarUrl;
  const otherTotalTrades =
    role === "incoming"
      ? trade.initiatorTotalTrades
      : trade.counterpartyTotalTrades;
  const otherReliability =
    role === "incoming"
      ? trade.initiatorReliabilityScore
      : trade.counterpartyReliabilityScore;

  return {
    _id: trade._id,
    status: trade.status,
    role,
    createdAt: trade.createdAt,
    expiresAt: trade.createdAt + TRADE_EXPIRATION_MS,
    confirmedAt: trade.confirmedAt ?? null,
    initiatorMessage: trade.initiatorMessage ?? null,
    stickersIGive,
    stickersIReceive,
    matchPct,
    counterparty: {
      _id: otherId,
      name: otherNickname ?? "Colecionador",
      nickname: otherNickname ?? null,
      avatarUrl: otherAvatar ?? null,
      totalTrades: otherTotalTrades ?? 0,
      reliabilityScore: otherReliability ?? 0,
    },
    tradePoint: trade.tradePointName
      ? {
          _id: trade.tradePointId,
          name: trade.tradePointName,
          address: trade.tradePointAddress ?? "",
        }
      : null,
  };
}

export const getTradeById = query({
  args: { tradeId: v.id("trades") },
  handler: async (ctx, { tradeId }): Promise<ListMyTradeRow | null> => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;

    const trade = await ctx.db.get(tradeId);
    if (!trade) return null;

    if (trade.initiatorId !== user._id && trade.counterpartyId !== user._id) {
      return null;
    }

    const role: "incoming" | "outgoing" =
      trade.initiatorId === user._id ? "outgoing" : "incoming";

    const row = buildTradeRow(trade, role, (user.missing ?? []).length);
    if (role === "outgoing") {
      row.initiatorMessage = null;
    }
    return row;
  },
});
