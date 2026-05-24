import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, getAuthenticatedUser } from "./lib/auth";
import { rateLimiter } from "./lib/rateLimiter";
import { Id } from "./_generated/dataModel";

async function getReactionCounts(
  ctx: { db: any },
  postIds: Id<"communityPosts">[],
): Promise<Map<string, { love: number; fire: number; hand: number }>> {
  if (postIds.length === 0) return new Map();

  const reactions = await ctx.db
    .query("postReactions")
    .filter((q: any) =>
      q.or(
        ...postIds.map((id: Id<"communityPosts">) =>
          q.eq(q.field("postId"), id),
        ),
      ),
    )
    .collect();

  const counts = new Map<
    string,
    { love: number; fire: number; hand: number }
  >();
  for (const postId of postIds) {
    counts.set(postId, { love: 0, fire: 0, hand: 0 });
  }

  for (const r of reactions) {
    const c = counts.get(r.postId);
    const t = r.type as "love" | "fire" | "hand";
    if (c && (t === "love" || t === "fire" || t === "hand")) {
      c[t]++;
    }
  }

  return counts;
}

async function enrichPosts(
  ctx: { db: any },
  posts: any[],
  currentUserId: Id<"users">,
) {
  const userIds = [...new Set(posts.map((p) => p.userId))] as Id<"users">[];
  const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
  const userById = new Map(
    users
      .filter((u): u is NonNullable<typeof u> => u !== null)
      .map((u) => [u._id, u]),
  );

  const cityIds = [...new Set(posts.map((p) => p.cityId))] as Id<"cities">[];
  const cities = await Promise.all(cityIds.map((id) => ctx.db.get(id)));
  const cityById = new Map(
    cities
      .filter((c): c is NonNullable<typeof c> => c !== null)
      .map((c) => [c._id, c]),
  );

  const stickerNums = [
    ...new Set(posts.flatMap((p) => p.stickers as number[])),
  ];
  const stickerDetails =
    stickerNums.length > 0
      ? await ctx.db
          .query("stickerDetail")
          .filter((q: any) =>
            q.or(
              ...stickerNums.map((num) => q.eq(q.field("absoluteNum"), num)),
            ),
          )
          .collect()
      : [];
  const stickerByNum = new Map<number, any>(
    stickerDetails.map((s: any) => [s.absoluteNum, s]),
  );

  const postIds = posts.map((p) => p._id) as Id<"communityPosts">[];
  const reactionCounts = await getReactionCounts(ctx, postIds);

  return posts.map((post) => {
    const author = userById.get(post.userId);
    const city = cityById.get(post.cityId);
    const reactions = reactionCounts.get(post._id) ?? {
      love: 0,
      fire: 0,
      hand: 0,
    };
    const uniqueStickers = [...new Set(post.stickers as number[])];

    return {
      _id: post._id,
      type: post.type,
      message: post.message,
      createdAt: post.createdAt,
      isFeatured: post.isFeatured ?? false,
      acceptsMail: post.acceptsMail ?? false,
      eventDate: post.eventDate,
      eventLocation: post.eventLocation,
      authorCity: city ? `${city.name}, ${city.state}` : null,
      reactions,
      stickers: uniqueStickers.map((num) => {
        const detail = stickerByNum.get(num);
        return {
          absoluteNum: num,
          displayCode: detail?.displayCode ?? `#${num}`,
          flagEmoji: detail?.flagEmoji ?? "🏳️",
          name: detail?.name ?? "",
          rare: detail?.isGolden ?? false,
        };
      }),
      author: author
        ? {
            _id: author._id,
            nickname: author.nickname ?? author.name,
            displayNickname:
              author.displayNickname ?? author.nickname ?? author.name,
            avatarSeed: author.avatarUrl ?? author.nickname ?? author.name,
            rating: author.ratingAvg ?? 0,
          }
        : null,
      isOwn: post.userId === currentUserId,
    };
  });
}

export const listFeed = query({
  args: {
    cityId: v.union(v.literal("all"), v.id("cities")),
    type: v.optional(v.union(v.literal("need"), v.literal("have"))),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { cityId, type, paginationOpts }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user?.cityId) {
      return { page: [], continueCursor: "", isDone: true };
    }

    const status = await rateLimiter.check(ctx, "communityFeed", {
      key: user._id,
    });
    if (!status.ok) {
      return { page: [], continueCursor: "", isDone: true };
    }

    let result;
    if (cityId === "all" && type) {
      result = await ctx.db
        .query("communityPosts")
        .withIndex("by_type_created", (q) => q.eq("type", type))
        .order("desc")
        .paginate(paginationOpts);
    } else if (cityId === "all") {
      result = await ctx.db
        .query("communityPosts")
        .withIndex("by_created")
        .order("desc")
        .paginate(paginationOpts);
    } else if (type) {
      result = await ctx.db
        .query("communityPosts")
        .withIndex("by_city_type_created", (q) =>
          q.eq("cityId", cityId).eq("type", type),
        )
        .order("desc")
        .paginate(paginationOpts);
    } else {
      result = await ctx.db
        .query("communityPosts")
        .withIndex("by_city_created", (q) => q.eq("cityId", cityId))
        .order("desc")
        .paginate(paginationOpts);
    }

    return {
      page: await enrichPosts(ctx, result.page, user._id),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

export const listByCityPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user?.cityId) {
      return { page: [], cityName: null, continueCursor: "", isDone: true };
    }

    const status = await rateLimiter.check(ctx, "communityFeed", {
      key: user._id,
    });
    if (!status.ok) {
      return { page: [], cityName: null, continueCursor: "", isDone: true };
    }

    const result = await ctx.db
      .query("communityPosts")
      .withIndex("by_city_created", (q) => q.eq("cityId", user.cityId!))
      .order("desc")
      .paginate(paginationOpts);

    return {
      page: await enrichPosts(ctx, result.page, user._id),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

export const create = mutation({
  args: {
    type: v.union(v.literal("need"), v.literal("have"), v.literal("event")),
    stickers: v.array(v.number()),
    message: v.optional(v.string()),
    acceptsMail: v.optional(v.boolean()),
    eventDate: v.optional(v.number()),
    eventLocation: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { type, stickers, message, acceptsMail, eventDate, eventLocation },
  ) => {
    const user = await requireAuth(ctx);
    if (!user.cityId) {
      throw new Error("Selecione uma cidade antes de postar");
    }

    if (type !== "event" && stickers.length === 0) {
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
      acceptsMail: acceptsMail ?? false,
      eventDate: type === "event" ? eventDate : undefined,
      eventLocation: type === "event" ? eventLocation?.trim() : undefined,
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

export const getTradeIntelligence = query({
  args: {
    postId: v.id("communityPosts"),
  },
  handler: async (ctx, { postId }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return { myDupesTheyNeed: [], theirDupesINeed: [] };

    const post = await ctx.db.get(postId);
    if (!post) return { myDupesTheyNeed: [], theirDupesINeed: [] };

    const postAuthor = await ctx.db.get(post.userId);
    if (!postAuthor) return { myDupesTheyNeed: [], theirDupesINeed: [] };

    const myDupes = user.duplicates ?? [];
    const myMissing = user.missing ?? [];
    const theirDupes = postAuthor.duplicates ?? [];
    const theirMissing = postAuthor.missing ?? [];

    const myDupesTheyNeedNums = [
      ...new Set(myDupes.filter((n) => theirMissing.includes(n))),
    ];
    const theirDupesINeedNums = [
      ...new Set(theirDupes.filter((n) => myMissing.includes(n))),
    ];

    const allNums = [...myDupesTheyNeedNums, ...theirDupesINeedNums];
    const stickerDetails =
      allNums.length > 0
        ? await ctx.db
            .query("stickerDetail")
            .filter((q) =>
              q.or(...allNums.map((n) => q.eq(q.field("absoluteNum"), n))),
            )
            .collect()
        : [];
    const detailByNum = new Map(stickerDetails.map((s) => [s.absoluteNum, s]));

    const mapStickers = (nums: number[]) =>
      nums.map((num) => {
        const d = detailByNum.get(num);
        return {
          absoluteNum: num,
          displayCode: d?.displayCode ?? `#${num}`,
          flagEmoji: d?.flagEmoji ?? "🏳️",
          name: d?.name ?? "",
          isGolden: d?.isGolden ?? false,
        };
      });

    return {
      myDupesTheyNeed: mapStickers(myDupesTheyNeedNums),
      theirDupesINeed: mapStickers(theirDupesINeedNums),
    };
  },
});

export const getCityFilterCounts = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user?.cityId) return [];

    const status = await rateLimiter.check(ctx, "communityFeed", {
      key: user._id,
    });
    if (!status.ok) return [];

    const userCity = await ctx.db.get(user.cityId);
    if (!userCity) return [];

    const allCities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(50);

    const cityIds = allCities.map((c) => c._id);

    const posts = await ctx.db
      .query("communityPosts")
      .filter((q) => q.or(...cityIds.map((id) => q.eq(q.field("cityId"), id))))
      .collect();

    const countByCity = new Map<string, number>();
    let totalCount = 0;
    for (const post of posts) {
      const current = countByCity.get(post.cityId) ?? 0;
      countByCity.set(post.cityId, current + 1);
      totalCount++;
    }

    const result = [
      { id: "all", label: "Todas as cidades", count: totalCount },
    ];

    if (user.cityId && countByCity.has(user.cityId)) {
      result.push({
        id: user.cityId,
        label: `${userCity.name}, ${userCity.state}`,
        count: countByCity.get(user.cityId) ?? 0,
      });
    }

    for (const city of allCities) {
      if (city._id === user.cityId) continue;
      const count = countByCity.get(city._id);
      if (count && count > 0) {
        result.push({
          id: city._id,
          label: `${city.name}, ${city.state}`,
          count,
        });
      }
    }

    return result.slice(0, 10);
  },
});
