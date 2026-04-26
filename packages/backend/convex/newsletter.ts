import { ConvexError, v } from "convex/values";
import { mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { rateLimiter } from "./lib/rateLimiter";
import { rescheduleIfMore } from "./_helpers/pagination";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_EMAIL_LEN = 200;
const MAX_SOURCE_LEN = 100;

export const subscribe = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  returns: v.object({
    ok: v.boolean(),
    alreadySubscribed: v.boolean(),
  }),
  handler: async (ctx, { email, source }) => {
    const rl = await rateLimiter.limit(ctx, "newsletterSubscribe", {
      key: "global",
    });
    if (!rl.ok) {
      throw new ConvexError("RATE_LIMITED");
    }

    const trimmed = email.trim().toLowerCase();
    if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LEN) {
      throw new ConvexError("INVALID_EMAIL");
    }
    if (!EMAIL_RE.test(trimmed)) {
      throw new ConvexError("INVALID_EMAIL");
    }

    const cleanSource = source?.trim().slice(0, MAX_SOURCE_LEN);

    const existing = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_email", (q) => q.eq("email", trimmed))
      .first();

    if (existing) {
      // Backfill token for legacy rows that pre-dated the unsubscribeToken field.
      const tokenPatch =
        existing.unsubscribeToken === undefined
          ? { unsubscribeToken: crypto.randomUUID() }
          : {};
      if (existing.status === "unsubscribed") {
        // Reuse existing token so previously-emailed unsubscribe links still work.
        await ctx.db.patch(existing._id, {
          status: "active",
          unsubscribedAt: undefined,
          ...tokenPatch,
        });
        return { ok: true, alreadySubscribed: false };
      }
      if (Object.keys(tokenPatch).length > 0) {
        await ctx.db.patch(existing._id, tokenPatch);
      }
      return { ok: true, alreadySubscribed: true };
    }

    await ctx.db.insert("newsletterSubscriptions", {
      email: trimmed,
      status: "active",
      source: cleanSource,
      createdAt: Date.now(),
      unsubscribeToken: crypto.randomUUID(),
    });

    return { ok: true, alreadySubscribed: false };
  },
});

/**
 * Public unsubscribe mutation. Always returns `{ ok: true }` regardless of
 * input — bad-token, missing-token, and rate-limited cases are byte-identical
 * to the success case so an attacker cannot probe for valid tokens. Bad
 * tokens are logged with a token-prefix for ops visibility only.
 *
 * `clientKey` is extracted by the route handler from `x-forwarded-for`; the
 * route is the trust boundary for that header. Per-token rate limit also
 * applies as a cheap brute-force ceiling.
 */
export const unsubscribe = mutation({
  args: {
    token: v.string(),
    clientKey: v.string(),
  },
  returns: v.object({ ok: v.boolean() }),
  handler: async (ctx, { token, clientKey }) => {
    // Per-IP rate limit. Throttled requests still return ok:true (no enumeration).
    const ipRl = await rateLimiter.limit(ctx, "newsletterUnsubscribe", {
      key: clientKey || "anon",
    });
    if (!ipRl.ok) {
      return { ok: true };
    }

    // UUIDv4 = 36 chars (8-4-4-4-12 hex with hyphens). Strict format check
    // rejects truncated/padded tokens, control chars, and stray whitespace
    // before the index lookup. Email clients can append &utm_* params after
    // the URL but those go to other query keys — they don't affect ?token=.
    if (!UUID_V4_RE.test(token)) {
      return { ok: true };
    }

    // Per-token cap blocks misbehaving email clients (5 attempts / 10 min).
    const tokenRl = await rateLimiter.limit(ctx, "newsletterUnsubscribeToken", {
      key: token,
    });
    if (!tokenRl.ok) {
      return { ok: true };
    }

    const sub = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_token", (q) => q.eq("unsubscribeToken", token))
      .first();

    if (!sub) {
      console.warn("newsletter.unsubscribe: bad token", {
        prefix: token.slice(0, 8),
      });
      return { ok: true };
    }

    if (sub.status !== "unsubscribed") {
      await ctx.db.patch(sub._id, {
        status: "unsubscribed",
        unsubscribedAt: Date.now(),
      });
    }

    return { ok: true };
  },
});

const PRUNE_UNSUB_BATCH = 100;
const PRUNE_UNSUB_MAX_CHUNKS = 50;
const UNSUB_RETENTION_MS = 180 * 24 * 60 * 60 * 1000; // 180 days

export const pruneUnsubscribed = internalMutation({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, chunk = 0 }) => {
    // All timestamps are UTC milliseconds since epoch. Date.now() and the
    // `unsubscribedAt` field share the same origin, so the comparison is DST-
    // and timezone-agnostic. Convex stores numbers, not Date objects.
    const cutoff = Date.now() - UNSUB_RETENTION_MS;

    const page = await ctx.db
      .query("newsletterSubscriptions")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "unsubscribed"))
      .paginate({ numItems: PRUNE_UNSUB_BATCH, cursor: cursor ?? null });

    let deleted = 0;
    for (const sub of page.page) {
      if (sub.unsubscribedAt && sub.unsubscribedAt < cutoff) {
        await ctx.db.delete(sub._id);
        deleted++;
      }
    }

    const tail = await rescheduleIfMore(ctx, {
      self: internal.newsletter.pruneUnsubscribed,
      args: { cursor: page.continueCursor },
      hasMore: !page.isDone,
      chunk,
      maxChunks: PRUNE_UNSUB_MAX_CHUNKS,
      label: "pruneUnsubscribed",
    });

    // Observability: every chunk emits a structured log line so cron health
    // can be tracked. `aborted` means the run hit the chunk cap before
    // exhausting unsubscribed rows; if that fires repeatedly across days,
    // unsubscribe rate has overrun the prune window — bump batch size or
    // shorten retention.
    if (tail.aborted) {
      console.error("pruneUnsubscribed: hit MAX_CHUNKS cap", {
        chunk,
        scanned: page.page.length,
        deleted,
      });
    } else {
      console.log("pruneUnsubscribed: chunk done", {
        chunk,
        scanned: page.page.length,
        deleted,
        rescheduled: tail.rescheduled,
      });
    }

    return { deleted, aborted: tail.aborted ?? false };
  },
});
