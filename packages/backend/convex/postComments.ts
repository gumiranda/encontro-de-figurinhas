import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, getAuthenticatedUser } from "./lib/auth";
import { rateLimiter } from "./lib/rateLimiter";
import { sanitizeUserInput } from "./lib/sanitize";

export const listComments = query({
  args: {
    postId: v.id("communityPosts"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { postId, paginationOpts }) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const result = await ctx.db
      .query("postComments")
      .withIndex("by_post_created", (q) => q.eq("postId", postId))
      .order("desc")
      .paginate(paginationOpts);

    const post = await ctx.db.get(postId);
    const postAuthor = post ? await ctx.db.get(post.userId) : null;
    const postAuthorNeeds = postAuthor?.missing ?? [];

    const userIds = [...new Set(result.page.map((c) => c.userId))];
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
    const userById = new Map(
      users.filter((u): u is NonNullable<typeof u> => u !== null).map((u) => [u._id, u])
    );

    return {
      page: result.page.map((c) => {
        const author = userById.get(c.userId);
        const commenterDupes = author?.duplicates ?? [];
        const hasMatch = post?.type === "need" && commenterDupes.some((d) => postAuthorNeeds.includes(d));

        return {
          _id: c._id,
          message: c.message,
          createdAt: c.createdAt,
          isMe: currentUser?._id === c.userId,
          hasMatch: hasMatch ?? false,
          author: author
            ? {
                _id: author._id,
                nickname: author.displayNickname ?? author.nickname ?? author.name,
                avatarSeed: author.avatarUrl ?? author.nickname ?? author.name,
                rating: author.ratingAvg ?? 0,
              }
            : null,
        };
      }),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

export const addComment = mutation({
  args: {
    postId: v.id("communityPosts"),
    message: v.string(),
  },
  handler: async (ctx, { postId, message }) => {
    const user = await requireAuth(ctx);

    const status = await rateLimiter.check(ctx, "communityComments", { key: user._id });
    if (!status.ok) throw new Error("Muitos comentários. Aguarde um momento.");

    const trimmed = message.trim();
    if (trimmed.length === 0) throw new Error("Comentário vazio");
    if (trimmed.length > 300) throw new Error("Comentário muito longo (máx 300 caracteres)");

    const sanitized = sanitizeUserInput(trimmed);

    const commentId = await ctx.db.insert("postComments", {
      postId,
      userId: user._id,
      message: sanitized,
      createdAt: Date.now(),
    });

    return commentId;
  },
});

export const deleteComment = mutation({
  args: { commentId: v.id("postComments") },
  handler: async (ctx, { commentId }) => {
    const user = await requireAuth(ctx);
    const comment = await ctx.db.get(commentId);

    if (!comment || comment.userId !== user._id) {
      throw new Error("Não autorizado");
    }

    await ctx.db.delete(commentId);
  },
});
