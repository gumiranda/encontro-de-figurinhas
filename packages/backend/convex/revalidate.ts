import { v } from "convex/values";
import { internalAction, type ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 60_000;

export const notifyBatch = internalAction({
  args: {
    tags: v.array(v.string()),
    retry: v.optional(v.number()),
  },
  handler: async (ctx, { tags, retry }) => {
    if (tags.length === 0) return { ok: true, skipped: "empty" };

    const siteUrl = process.env.NEXT_SITE_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (!siteUrl || !secret) {
      console.warn("notifyBatch: missing NEXT_SITE_URL or REVALIDATE_SECRET");
      return { ok: false, reason: "missing-env" };
    }

    const url = `${siteUrl.replace(/\/$/, "")}/api/revalidate?v=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const attempt = retry ?? 0;

    try {
      const res = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags }),
      });

      if (!res.ok) {
        console.warn("notifyBatch: non-ok response", {
          tagCount: tags.length,
          status: res.status,
          attempt,
        });
        await scheduleRetryIfEligible(ctx, tags, attempt);
        return { ok: false, status: res.status };
      }

      return { ok: true, count: tags.length };
    } catch (err) {
      console.warn("notifyBatch: fetch failed", {
        tagCount: tags.length,
        err: String(err),
        attempt,
      });
      await scheduleRetryIfEligible(ctx, tags, attempt);
      return { ok: false, reason: "fetch-error" };
    } finally {
      clearTimeout(timeout);
    }
  },
});

async function scheduleRetryIfEligible(
  ctx: ActionCtx,
  tags: string[],
  attempt: number
) {
  if (attempt + 1 >= MAX_RETRIES) return;
  await ctx.scheduler.runAfter(RETRY_DELAY_MS, internal.revalidate.notifyBatch, {
    tags,
    retry: attempt + 1,
  });
}
