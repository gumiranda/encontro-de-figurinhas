import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  type MutationCtx,
  query,
} from "./_generated/server";
import { rescheduleIfMore } from "./_helpers/pagination";
import { requireAdmin } from "./lib/auth";
import { validateCoverImageUrl } from "./lib/coverImageUrl";

function projectListPost<T extends {
  _id: Id<"blogPosts">;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt?: number;
  author: { name: string; avatar?: string; role?: string };
}>(p: T) {
  return {
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
  };
}

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
    return posts.map(projectListPost);
  },
});

export const getPublishedPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .paginate(paginationOpts);
    return {
      page: result.page.map(projectListPost),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

export const getByCategoryPaginated = query({
  args: {
    category: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { category, paginationOpts }) => {
    const result = await ctx.db
      .query("blogPosts")
      .withIndex("by_category_status", (q) =>
        q.eq("category", category).eq("status", "published")
      )
      .order("desc")
      .paginate(paginationOpts);
    return {
      page: result.page.map(projectListPost),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
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

    const metrics = await ctx.db
      .query("postMetrics")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .first();

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
      views: metrics?.views ?? post.views,
      isTrending: post.isTrending,
      titleHighlight: post.titleHighlight,
    };
  },
});

const VIEW_IDEMPOTENCY_WINDOW_MS = 60 * 60 * 1000;
const VIEW_IDEMPOTENCY_TTL_MS = 2 * 60 * 60 * 1000;
const PRUNE_IDEMPOTENCY_BATCH = 200;
const PRUNE_IDEMPOTENCY_MAX_CHUNKS = 100;
const TITLE_HIGHLIGHT_MAX = 50;
const AUTHOR_ROLE_MAX = 200;

// Public (unauthenticated) view counter. Rate-bounded by per-(postId,key) idempotency window.
// View counter lives on postMetrics (not blogPosts) to avoid write contention on the
// blogPosts row when many viewers hit the page concurrently.
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

    const metrics = await ctx.db
      .query("postMetrics")
      .withIndex("by_post", (q) => q.eq("postId", post._id))
      .first();
    if (metrics) {
      await ctx.db.patch(metrics._id, {
        views: (metrics.views ?? 0) + 1,
      });
    } else {
      await ctx.db.insert("postMetrics", {
        postId: post._id,
        likes: 0,
        saves: 0,
        comments: 0,
        views: 1,
      });
    }
  },
});

export const pruneViewIdempotency = internalMutation({
  args: { chunk: v.optional(v.number()) },
  handler: async (ctx, { chunk = 0 }) => {
    const cutoff = Date.now() - VIEW_IDEMPOTENCY_TTL_MS;
    const stale = await ctx.db
      .query("postViewIdempotency")
      .withIndex("by_at", (q) => q.lt("at", cutoff))
      .take(PRUNE_IDEMPOTENCY_BATCH);

    await Promise.all(stale.map((row) => ctx.db.delete(row._id)));

    const tail = await rescheduleIfMore(ctx, {
      self: internal.blog.pruneViewIdempotency,
      args: {},
      hasMore: stale.length === PRUNE_IDEMPOTENCY_BATCH,
      chunk,
      maxChunks: PRUNE_IDEMPOTENCY_MAX_CHUNKS,
      label: "pruneViewIdempotency",
    });

    return { deleted: stale.length, aborted: tail.aborted ?? false };
  },
});

export const getAllSlugs = query({
  args: { paginationOpts: v.optional(paginationOptsValidator) },
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .paginate(paginationOpts ?? { numItems: 1000, cursor: null });

    return {
      slugs: result.page.map((p) => p.slug),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
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

export const listForAdmin = query({
  args: {
    status: v.optional(
      v.union(v.literal("all"), v.literal("draft"), v.literal("published"))
    ),
    search: v.optional(v.string()),
  },
  handler: async (ctx, { status, search }) => {
    await requireAdmin(ctx);
    const filter = status ?? "all";

    const allPosts =
      filter === "all"
        ? await ctx.db.query("blogPosts").order("desc").take(500)
        : await ctx.db
            .query("blogPosts")
            .withIndex("by_status_publishedAt", (q) => q.eq("status", filter))
            .order("desc")
            .take(500);

    const term = search?.trim().toLowerCase();
    const filtered = term
      ? allPosts.filter(
          (p) =>
            p.title.toLowerCase().includes(term) ||
            p.slug.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        )
      : allPosts;

    const metrics = await Promise.all(
      filtered.map((p) =>
        ctx.db
          .query("postMetrics")
          .withIndex("by_post", (q) => q.eq("postId", p._id))
          .first()
      )
    );

    return filtered.map((p, i) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      status: p.status,
      author: p.author.name,
      coverImage: p.coverImage,
      publishedAt: p.publishedAt,
      updatedAt: p.updatedAt,
      createdAt: p.createdAt,
      readingTime: p.readingTime,
      views: metrics[i]?.views ?? p.views ?? 0,
      likes: metrics[i]?.likes ?? 0,
    }));
  },
});

export const getByIdForAdmin = query({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const post = await ctx.db.get(id);
    return post;
  },
});

export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const posts = await ctx.db.query("blogPosts").take(1000);
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status === "draft").length;

    const metrics = await Promise.all(
      posts.map((p) =>
        ctx.db
          .query("postMetrics")
          .withIndex("by_post", (q) => q.eq("postId", p._id))
          .first()
      )
    );
    let totalViews = 0;
    let totalLikes = 0;
    for (const m of metrics) {
      totalViews += m?.views ?? 0;
      totalLikes += m?.likes ?? 0;
    }
    return {
      total: posts.length,
      published,
      drafts,
      totalViews,
      totalLikes,
    };
  },
});

export const remove = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx);
    const post = await ctx.db.get(id);
    if (!post) throw new Error("Post not found");
    await ctx.db.delete(id);
  },
});

export const getActiveSeries = query({
  args: {},
  handler: async (ctx) => {
    const series = await ctx.db
      .query("blogSeries")
      .withIndex("by_isActive_createdAt", (q) => q.eq("isActive", true))
      .order("desc")
      .first();
    if (!series) return null;

    const episodes = await ctx.db
      .query("blogPosts")
      .withIndex("by_series_episode", (q) => q.eq("seriesId", series._id))
      .take(series.totalPlanned);

    episodes.sort(
      (a, b) => (a.seriesEpisodeNumber ?? 0) - (b.seriesEpisodeNumber ?? 0)
    );

    return {
      _id: series._id,
      title: series.title,
      slug: series.slug,
      description: series.description,
      totalPlanned: series.totalPlanned,
      episodes: episodes.map((p) => ({
        _id: p._id,
        title: p.title,
        slug: p.slug,
        episodeNumber: p.seriesEpisodeNumber ?? 0,
        readingTime: p.readingTime,
        author: p.author.name,
        status: p.status,
        publishedAt: p.publishedAt,
      })),
    };
  },
});

export const getTrending = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const max = Math.min(Math.max(limit ?? 5, 1), 20);
    const topMetrics = await ctx.db
      .query("postMetrics")
      .withIndex("by_views")
      .order("desc")
      .take(max * 2);

    const posts = await Promise.all(
      topMetrics.map((m) => ctx.db.get(m.postId))
    );
    const viewsByPost = new Map(
      topMetrics.map((m) => [m.postId, m.views ?? 0])
    );

    const rows: Array<{
      _id: typeof topMetrics[number]["postId"];
      title: string;
      slug: string;
      category: string;
      views: number;
    }> = [];
    for (const p of posts) {
      if (!p || p.status !== "published") continue;
      rows.push({
        _id: p._id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        views: viewsByPost.get(p._id) ?? 0,
      });
      if (rows.length >= max) break;
    }
    return rows;
  },
});

export const getRelated = query({
  args: {
    slug: v.string(),
    category: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    limit: v.optional(v.number()),
  },
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
  handler: async (ctx, { slug, category, tags, limit }) => {
    const maxResults = Math.min(limit ?? 3, 6);
    let currentCategory = category;
    let currentTags = new Set((tags ?? []).map((t) => t.toLowerCase().trim()));

    if (!currentCategory) {
      const current = await ctx.db
        .query("blogPosts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();

      if (!current || current.status !== "published") return [];

      currentCategory = current.category;
      currentTags = new Set(current.tags.map((t) => t.toLowerCase().trim()));
    }

    const candidates = await ctx.db
      .query("blogPosts")
      .withIndex("by_category_status_publishedAt", (q) =>
        q.eq("category", currentCategory).eq("status", "published")
      )
      .order("desc")
      .take(maxResults + 1);

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
  args: { paginationOpts: v.optional(paginationOptsValidator) },
  returns: v.object({
    page: v.array(
      v.object({
        slug: v.string(),
        updatedAt: v.optional(v.number()),
      })
    ),
    continueCursor: v.string(),
    isDone: v.boolean(),
  }),
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .paginate(paginationOpts ?? { numItems: 1000, cursor: null });

    return {
      page: result.page.map((p) => ({
        slug: p.slug,
        updatedAt: p.updatedAt ?? p.publishedAt,
      })),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

async function assertCoverImage(coverImage: string | undefined): Promise<void> {
  if (!coverImage) return;
  const v = validateCoverImageUrl(coverImage);
  if (!v.ok) {
    throw new ConvexError(`INVALID_COVER_URL:${v.reason}`);
  }
}

async function assertSeriesAssignment(
  ctx: MutationCtx,
  seriesId: Id<"blogSeries"> | undefined,
  seriesEpisodeNumber: number | undefined,
  excludePostId?: Id<"blogPosts">
): Promise<void> {
  if (seriesId === undefined && seriesEpisodeNumber === undefined) return;
  if (seriesId === undefined) {
    throw new ConvexError("MISSING_SERIES_ID");
  }
  if (seriesEpisodeNumber === undefined) {
    throw new ConvexError("MISSING_EPISODE_NUMBER");
  }
  if (
    !Number.isInteger(seriesEpisodeNumber) ||
    seriesEpisodeNumber < 1
  ) {
    throw new ConvexError("INVALID_EPISODE_NUMBER");
  }
  const series = await ctx.db.get(seriesId);
  if (!series) {
    throw new ConvexError("SERIES_NOT_FOUND");
  }
  const conflict = await ctx.db
    .query("blogPosts")
    .withIndex("by_series_episode", (q) =>
      q.eq("seriesId", seriesId).eq("seriesEpisodeNumber", seriesEpisodeNumber)
    )
    .first();
  if (conflict && conflict._id !== excludePostId) {
    throw new ConvexError("DUPLICATE_EPISODE");
  }
}

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
    seriesId: v.optional(v.id("blogSeries")),
    seriesEpisodeNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);

    if (
      args.titleHighlight !== undefined &&
      args.titleHighlight.length > TITLE_HIGHLIGHT_MAX
    ) {
      throw new Error(`titleHighlight max ${TITLE_HIGHLIGHT_MAX} chars`);
    }
    if (args.authorRole !== undefined && args.authorRole.length > AUTHOR_ROLE_MAX) {
      throw new Error(`author.role max ${AUTHOR_ROLE_MAX} chars`);
    }

    await assertCoverImage(args.coverImage);
    await assertSeriesAssignment(
      ctx,
      args.seriesId,
      args.seriesEpisodeNumber
    );

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
    seriesId: v.optional(v.id("blogSeries")),
    seriesEpisodeNumber: v.optional(v.number()),
  },
  handler: async (ctx, { id, authorRole, ...updates }) => {
    await requireAdmin(ctx);

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

    if (updates.coverImage !== undefined) {
      await assertCoverImage(updates.coverImage);
    }

    // Series assignment uses post's existing values when one side is omitted.
    const nextSeriesId =
      updates.seriesId !== undefined ? updates.seriesId : post.seriesId;
    const nextEpisode =
      updates.seriesEpisodeNumber !== undefined
        ? updates.seriesEpisodeNumber
        : post.seriesEpisodeNumber;
    if (
      updates.seriesId !== undefined ||
      updates.seriesEpisodeNumber !== undefined
    ) {
      await assertSeriesAssignment(ctx, nextSeriesId, nextEpisode, id);
    }

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
      views: metrics?.views ?? 0,
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

const PRUNE_BATCH = 100;
const PRUNE_MAX_CHUNKS = 50;

export const pruneOrphanPostInteractions = internalMutation({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, chunk = 0 }) => {
    const page = await ctx.db
      .query("postUserInteractions")
      .paginate({ numItems: PRUNE_BATCH, cursor: cursor ?? null });

    // Batch fetch all postIds at once to avoid N+1
    const postIds = [...new Set(page.page.map((i) => i.postId))];
    const posts = await Promise.all(postIds.map((id) => ctx.db.get(id)));
    const existingPostIds = new Set(
      posts.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => p._id)
    );

    let deleted = 0;
    for (const interaction of page.page) {
      if (!existingPostIds.has(interaction.postId)) {
        await ctx.db.delete(interaction._id);
        deleted++;
      }
    }

    await rescheduleIfMore(ctx, {
      self: internal.blog.pruneOrphanPostInteractions,
      args: { cursor: page.continueCursor },
      hasMore: !page.isDone,
      chunk,
      maxChunks: PRUNE_MAX_CHUNKS,
      label: "pruneOrphanPostInteractions",
    });

    return { deleted };
  },
});

export const pruneOrphanPostMetrics = internalMutation({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, chunk = 0 }) => {
    const page = await ctx.db
      .query("postMetrics")
      .paginate({ numItems: PRUNE_BATCH, cursor: cursor ?? null });

    const postIds = [...new Set(page.page.map((m) => m.postId))];
    const posts = await Promise.all(postIds.map((id) => ctx.db.get(id)));
    const existingPostIds = new Set(
      posts.filter((p): p is NonNullable<typeof p> => p !== null).map((p) => p._id)
    );

    let deleted = 0;
    for (const metric of page.page) {
      if (!existingPostIds.has(metric.postId)) {
        await ctx.db.delete(metric._id);
        deleted++;
      }
    }

    await rescheduleIfMore(ctx, {
      self: internal.blog.pruneOrphanPostMetrics,
      args: { cursor: page.continueCursor },
      hasMore: !page.isDone,
      chunk,
      maxChunks: PRUNE_MAX_CHUNKS,
      label: "pruneOrphanPostMetrics",
    });

    return { deleted };
  },
});
