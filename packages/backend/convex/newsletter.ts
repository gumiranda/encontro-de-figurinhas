import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { rateLimiter } from "./lib/rateLimiter";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      if (existing.status === "unsubscribed") {
        await ctx.db.patch(existing._id, {
          status: "active",
          unsubscribedAt: undefined,
        });
        return { ok: true, alreadySubscribed: false };
      }
      return { ok: true, alreadySubscribed: true };
    }

    await ctx.db.insert("newsletterSubscriptions", {
      email: trimmed,
      status: "active",
      source: cleanSource,
      createdAt: Date.now(),
    });

    return { ok: true, alreadySubscribed: false };
  },
});
