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
    };
  },
});

export const getAllSlugs = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .collect();

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
  handler: async (ctx, { slug, limit }) => {
    const current = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!current) return [];

    const related = await ctx.db
      .query("blogPosts")
      .withIndex("by_category_status", (q) =>
        q.eq("category", current.category).eq("status", "published")
      )
      .order("desc")
      .take((limit ?? 3) + 1);

    return related
      .filter((p) => p.slug !== slug)
      .slice(0, limit ?? 3)
      .map((p) => ({
        _id: p._id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        readingTime: p.readingTime,
      }));
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .collect();

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
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
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

    const now = Date.now();
    const id = await ctx.db.insert("blogPosts", {
      ...args,
      readingTime,
      author: {
        name: user.name,
        avatar: user.avatarUrl,
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
  },
  handler: async (ctx, { id, ...updates }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const post = await ctx.db.get(id);
    if (!post) throw new Error("Post not found");

    const patch: Record<string, unknown> = { ...updates, updatedAt: Date.now() };

    if (updates.content) {
      const wordCount = updates.content.split(/\s+/).length;
      patch.readingTime = Math.ceil(wordCount / 200);
    }

    if (updates.status === "published" && post.status !== "published") {
      patch.publishedAt = Date.now();
    }

    await ctx.db.patch(id, patch);
  },
});
