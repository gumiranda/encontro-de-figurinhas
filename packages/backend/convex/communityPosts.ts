import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, getAuthenticatedUser } from "./lib/auth";

export const listByCityPaginated = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, { paginationOpts }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user?.cityId) {
      return { page: [], continueCursor: "", isDone: true };
    }

    const result = await ctx.db
      .query("communityPosts")
      .withIndex("by_city_created", (q) => q.eq("cityId", user.cityId!))
      .order("desc")
      .paginate(paginationOpts);

    const userIds = [...new Set(result.page.map((p) => p.userId))];
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
    const userById = new Map(
      users.filter((u): u is NonNullable<typeof u> => u !== null).map((u) => [u._id, u])
    );

    const stickerNums = [...new Set(result.page.flatMap((p) => p.stickers))];
    const stickerDetails = await ctx.db
      .query("stickerDetail")
      .filter((q) =>
        q.or(...stickerNums.map((num) => q.eq(q.field("absoluteNum"), num)))
      )
      .collect();
    const stickerByNum = new Map(stickerDetails.map((s) => [s.absoluteNum, s]));

    const page = result.page.map((post) => {
      const author = userById.get(post.userId);
      return {
        _id: post._id,
        type: post.type,
        message: post.message,
        createdAt: post.createdAt,
        stickers: post.stickers.map((num) => {
          const detail = stickerByNum.get(num);
          return {
            absoluteNum: num,
            displayCode: detail?.displayCode ?? `#${num}`,
            flagEmoji: detail?.flagEmoji ?? "🏳️",
            name: detail?.name ?? "",
          };
        }),
        author: author
          ? {
              _id: author._id,
              nickname: author.nickname ?? author.name,
              displayNickname: author.displayNickname ?? author.nickname ?? author.name,
              avatarSeed: author.avatarUrl ?? author.nickname ?? author.name,
            }
          : null,
        isOwn: post.userId === user._id,
      };
    });

    return {
      page,
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

export const create = mutation({
  args: {
    type: v.union(v.literal("need"), v.literal("have")),
    stickers: v.array(v.number()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, { type, stickers, message }) => {
    const user = await requireAuth(ctx);
    if (!user.cityId) {
      throw new Error("Selecione uma cidade antes de postar");
    }

    if (stickers.length === 0) {
      throw new Error("Selecione pelo menos uma figurinha");
    }

    if (stickers.length > 20) {
      throw new Error("Máximo de 20 figurinhas por post");
    }

    const postId = await ctx.db.insert("communityPosts", {
      userId: user._id,
      cityId: user.cityId,
      type,
      stickers,
      message: message?.trim() || undefined,
      createdAt: Date.now(),
    });

    return postId;
  },
});

export const remove = mutation({
  args: {
    postId: v.id("communityPosts"),
  },
  handler: async (ctx, { postId }) => {
    const user = await requireAuth(ctx);
    const post = await ctx.db.get(postId);

    if (!post) {
      throw new Error("Post não encontrado");
    }

    if (post.userId !== user._id) {
      throw new Error("Você só pode deletar seus próprios posts");
    }

    await ctx.db.delete(postId);
  },
});

export const listMyPosts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    const posts = await ctx.db
      .query("communityPosts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(20);

    return posts;
  },
});
