import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthenticatedUser } from "./lib/auth";

export const getPublished = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit }) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit ?? 50);

    return posts.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      category: p.category,
      tags: p.tags,
      readingTime: p.readingTime,
      publishedAt: p.publishedAt,
      author: p.author,
    }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!post || post.status !== "published") return null;

    return {
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      category: post.category,
      tags: post.tags,
      readingTime: post.readingTime,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      author: post.author,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      views: post.views,
      isTrending: post.isTrending,
      titleHighlight: post.titleHighlight,
    };
  },
});

const VIEW_IDEMPOTENCY_WINDOW_MS = 60 * 60 * 1000;
const TITLE_HIGHLIGHT_MAX = 50;
const AUTHOR_ROLE_MAX = 200;

// Public (unauthenticated) view counter. Rate-bounded by per-(postId,key) idempotency window.
// TODO: orphaned postViewIdempotency rows should be pruned by a cron (>1h old) — separate task.
// TODO: when post is hard-deleted, drop matching idempotency rows.
export const incrementView = mutation({
  args: {
    slug: v.string(),
    idempotencyKey: v.string(),
  },
  handler: async (ctx, { slug, idempotencyKey }) => {
    if (idempotencyKey.length < 8 || idempotencyKey.length > 64) return;

    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!post || post.status !== "published") return;

    const existing = await ctx.db
      .query("postViewIdempotency")
      .withIndex("by_post_key", (q) =>
        q.eq("postId", post._id).eq("key", idempotencyKey)
      )
      .first();

    const now = Date.now();
    if (existing && now - existing.at < VIEW_IDEMPOTENCY_WINDOW_MS) return;

    if (existing) {
      await ctx.db.patch(existing._id, { at: now });
    } else {
      await ctx.db.insert("postViewIdempotency", {
        postId: post._id,
        key: idempotencyKey,
        at: now,
      });
    }

    await ctx.db.patch(post._id, { views: (post.views ?? 0) + 1 });
  },
});

export const getAllSlugs = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .take(10000);

    return posts.map((p) => p.slug);
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, { category }) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_category_status", (q) =>
        q.eq("category", category).eq("status", "published")
      )
      .order("desc")
      .take(20);

    return posts.map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      coverImage: p.coverImage,
      category: p.category,
      tags: p.tags,
      readingTime: p.readingTime,
      publishedAt: p.publishedAt,
      author: p.author,
    }));
  },
});

export const getRelated = query({
  args: { slug: v.string(), limit: v.optional(v.number()) },
  returns: v.array(
    v.object({
      _id: v.id("blogPosts"),
      title: v.string(),
      slug: v.string(),
      excerpt: v.string(),
      coverImage: v.optional(v.string()),
      publishedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, { slug, limit }) => {
    const maxResults = limit ?? 3;
    const current = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!current || current.status !== "published") return [];

    const currentTags = new Set(current.tags.map((t) => t.toLowerCase().trim()));

    const candidates = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(50);

    const scored = candidates
      .filter((p) => p.slug !== slug)
      .map((p) => {
        const commonTags = p.tags.filter((t) =>
          currentTags.has(t.toLowerCase().trim())
        ).length;
        return { post: p, score: commonTags };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.post.publishedAt ?? 0) - (a.post.publishedAt ?? 0);
      })
      .slice(0, maxResults);

    return scored.map(({ post }) => ({
      _id: post._id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      publishedAt: post.publishedAt,
    }));
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .take(10000);

    return posts.map((p) => ({
      slug: p.slug,
      updatedAt: p.updatedAt ?? p.publishedAt,
    }));
  },
});

// Admin mutations
export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    status: v.union(v.literal("draft"), v.literal("published")),
    titleHighlight: v.optional(v.string()),
    isTrending: v.optional(v.boolean()),
    authorRole: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    if (
      args.titleHighlight !== undefined &&
      args.titleHighlight.length > TITLE_HIGHLIGHT_MAX
    ) {
      throw new Error(`titleHighlight max ${TITLE_HIGHLIGHT_MAX} chars`);
    }
    if (args.authorRole !== undefined && args.authorRole.length > AUTHOR_ROLE_MAX) {
      throw new Error(`author.role max ${AUTHOR_ROLE_MAX} chars`);
    }

    const existing = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (existing) {
      throw new Error("Slug already exists");
    }

    const wordCount = args.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    const normalizedTags = args.tags.map((t) => t.trim().toLowerCase());

    const { authorRole, ...rest } = args;
    const now = Date.now();
    const id = await ctx.db.insert("blogPosts", {
      ...rest,
      tags: normalizedTags,
      readingTime,
      author: {
        name: user.name,
        avatar: user.avatarUrl,
        role: authorRole,
      },
      publishedAt: args.status === "published" ? now : undefined,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("blogPosts"),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    titleHighlight: v.optional(v.string()),
    isTrending: v.optional(v.boolean()),
    authorRole: v.optional(v.string()),
  },
  handler: async (ctx, { id, authorRole, ...updates }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    if (
      updates.titleHighlight !== undefined &&
      updates.titleHighlight.length > TITLE_HIGHLIGHT_MAX
    ) {
      throw new Error(`titleHighlight max ${TITLE_HIGHLIGHT_MAX} chars`);
    }
    if (authorRole !== undefined && authorRole.length > AUTHOR_ROLE_MAX) {
      throw new Error(`author.role max ${AUTHOR_ROLE_MAX} chars`);
    }

    const post = await ctx.db.get(id);
    if (!post) throw new Error("Post not found");

    const patch: Record<string, unknown> = { ...updates, updatedAt: Date.now() };

    if (updates.tags) {
      patch.tags = updates.tags.map((t) => t.trim().toLowerCase());
    }

    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      patch.readingTime = Math.ceil(wordCount / 200);
    }

    if (updates.status === "published" && post.status !== "published") {
      patch.publishedAt = Date.now();
    }

    if (authorRole !== undefined) {
      patch.author = { ...post.author, role: authorRole };
    }

    await ctx.db.patch(id, patch);
  },
});

// Post metrics for share rail
export const getMetrics = query({
  args: { postId: v.id("blogPosts"), visitorId: v.optional(v.string()) },
  handler: async (ctx, { postId, visitorId }) => {
    const metrics = await ctx.db
      .query("postMetrics")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .first();

    let userInteraction = null;
    if (visitorId) {
      userInteraction = await ctx.db
        .query("postUserInteractions")
        .withIndex("by_post_visitor", (q) =>
          q.eq("postId", postId).eq("visitorId", visitorId)
        )
        .first();
    }

    return {
      likes: metrics?.likes ?? 0,
      saves: metrics?.saves ?? 0,
      comments: metrics?.comments ?? 0,
      userLiked: userInteraction?.liked ?? false,
      userSaved: userInteraction?.saved ?? false,
    };
  },
});

export const toggleMetric = mutation({
  args: {
    postId: v.id("blogPosts"),
    visitorId: v.string(),
    metric: v.union(v.literal("likes"), v.literal("saves")),
  },
  handler: async (ctx, { postId, visitorId, metric }) => {
    const interactionField = metric === "likes" ? "liked" : "saved";

    // Check existing interaction
    const interaction = await ctx.db
      .query("postUserInteractions")
      .withIndex("by_post_visitor", (q) =>
        q.eq("postId", postId).eq("visitorId", visitorId)
      )
      .first();

    const wasActive = interaction?.[interactionField] ?? false;
    const delta = wasActive ? -1 : 1;

    // Update or create interaction record
    if (interaction) {
      await ctx.db.patch(interaction._id, {
        [interactionField]: !wasActive,
      });
    } else {
      await ctx.db.insert("postUserInteractions", {
        postId,
        visitorId,
        liked: metric === "likes",
        saved: metric === "saves",
      });
    }

    // Update metrics count
    const metrics = await ctx.db
      .query("postMetrics")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .first();

    if (metrics) {
      await ctx.db.patch(metrics._id, {
        [metric]: Math.max(0, metrics[metric] + delta),
      });
    } else {
      await ctx.db.insert("postMetrics", {
        postId,
        likes: metric === "likes" && delta > 0 ? 1 : 0,
        saves: metric === "saves" && delta > 0 ? 1 : 0,
        comments: 0,
      });
    }

    return { active: !wasActive };
  },
});
