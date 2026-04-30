import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { isAdmin } from "./lib/auth";
import { seedBlogPostsHandler } from "./seedBlog";

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const results: Record<string, unknown> = {};

    // 1. Seed cities (inline)
    try {
      await ctx.runMutation(internal.seeds.seedCities.seedCities, {});
      results.cities = "done";
    } catch (e) {
      results.cities = { error: String(e) };
    }

    // 2. Seed trade points (inline)
    try {
      await ctx.runMutation(internal.seeds.seedTradePoints.seedTradePoints, {});
      results.tradePoints = "done";
    } catch (e) {
      results.tradePoints = { error: String(e) };
    }

    // 3. Seed album (inline, immediate)
    try {
      const existingSections = await ctx.db.query("albumSections").first();
      if (existingSections) {
        results.album = "already exists";
      } else {
        await ctx.runMutation(internal.seedAlbumRunner.doSeedAlbum, {});
        results.album = "done";
      }
    } catch (e) {
      results.album = { error: String(e) };
    }

    // 4. Seed boring game (inline)
    try {
      await ctx.runMutation(internal.seedBoringGame.seedBoringGame, {});
      results.boringGame = "done";
    } catch (e) {
      results.boringGame = { error: String(e) };
    }

    // 5. Seed blog posts (inline — lightweight)
    try {
      const blogResult = await seedBlogPostsHandler(ctx);
      results.blog = blogResult;
    } catch (e) {
      results.blog = { error: String(e) };
    }

    return { ok: true, results };
  },
});

export const seedBlog = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const result = await seedBlogPostsHandler(ctx);
    return { ok: true, result };
  },
});

export const seedCitiesExtra = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const result = await ctx.runMutation(
      internal.seeds.seedCitiesExtra.seedCitiesExtra,
      {}
    );
    return { ok: true, result };
  },
});
