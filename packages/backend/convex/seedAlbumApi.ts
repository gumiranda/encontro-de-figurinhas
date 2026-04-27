import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { isAdmin } from "./lib/auth";

export const seedAlbum = mutation({
  args: {},
  handler: async (ctx): Promise<{ ok: boolean; action: string; totalStickers: number; version: number }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const result: { action: string; totalStickers: number; version: number } =
      await ctx.runMutation(internal.seedAlbumRunner.doSeedAlbum, {});
    return { ok: true, ...result };
  },
});
