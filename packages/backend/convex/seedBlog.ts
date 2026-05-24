import { internalMutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import blogPosts from "../data/blog-posts.json";

type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
};

const BLOG_POSTS: BlogPost[] = blogPosts as BlogPost[];

export async function seedBlogPostsHandler(ctx: MutationCtx) {
  const existing = await ctx.db.query("blogPosts").first();
  if (existing) {
    return { skipped: true, message: "Blog posts already exist" };
  }

  const now = Date.now();
  const inserted: string[] = [];

  for (let i = 0; i < BLOG_POSTS.length; i++) {
    const post = BLOG_POSTS[i]!;
    const wordCount = post.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    await ctx.db.insert("blogPosts", {
      ...post,
      readingTime,
      status: "published",
      author: {
        name: "Equipe Figurinha Fácil",
      },
      publishedAt: now - i * 86400000,
      createdAt: now - i * 86400000,
      updatedAt: now - i * 86400000,
    });

    inserted.push(post.slug);
  }

  return { inserted, count: inserted.length };
}

export const seedBlogPosts = internalMutation({
  args: {},
  handler: seedBlogPostsHandler,
});
