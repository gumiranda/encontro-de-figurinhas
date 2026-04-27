import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query, type MutationCtx } from "./_generated/server";
import { requireAuth } from "./lib/auth";
import {
  arraysEqual,
  buildCheckinDenormFields,
  getActiveCheckin,
} from "./lib/checkinHelpers";
import { DEFAULT_TOTAL_STICKERS } from "./lib/constants";
import { rateLimiter } from "./lib/rateLimiter";
import { scheduleDebouncedMatchRecompute } from "./matches";
import { isValidAbsolute } from "./lib/stickerNumbering";
import { readSiteStatsOrNull } from "./siteStats";

const setsEqual = <T>(a: Set<T>, b: Set<T>): boolean =>
  a.size === b.size && [...a].every((x) => b.has(x));

/** Limite de elementos por array para evitar DoS (memória/CPU/billing). */
const MAX_STICKER_ARRAY_SIZE = 3000;

/** Mínimo entre salvamentos batch (recompute já é debounced em matches). */
const RATE_LIMIT_MS = 400;

type UserPatch = Partial<
  Pick<
    Doc<"users">,
    | "duplicates"
    | "missing"
    | "albumProgress"
    | "albumCompletionPct"
    | "totalStickersOwned"
    | "lastActiveAt"
    | "hasCompletedStickerSetup"
  >
>;

/**
 * Present-matches reads denormalized `duplicates` on check-ins; keep in sync when the user edits stickers.
 * Uses Promise.all for parallel patches, skips unchanged checkins to reduce writes.
 */
async function syncActiveCheckinsStickerSnapshot(
  ctx: MutationCtx,
  userId: Id<"users">,
  user: Doc<"users">,
  duplicates: number[]
) {
  const activeCheckin = await getActiveCheckin(ctx, userId);
  if (!activeCheckin) return;

  // Take up to 20 active checkins (edge case: user has multiple)
  const activeCheckins = await ctx.db
    .query("checkins")
    .withIndex("by_user_active", (q) =>
      q.eq("userId", userId).gt("expiresAt", Date.now())
    )
    .take(20);

  const denorm = buildCheckinDenormFields({ ...user, duplicates });

  // Skip patches for checkins where values haven't changed (reduces Convex writes)
  const needsPatch = activeCheckins.filter(
    (c) =>
      !arraysEqual(c.duplicates ?? [], duplicates) ||
      c.displayNickname !== denorm.displayNickname ||
      c.avatarSeed !== denorm.avatarSeed
  );

  if (needsPatch.length === 0) return;

  await Promise.all(needsPatch.map((c) => ctx.db.patch(c._id, denorm)));
}

type AlbumSection = Doc<"albumSections">;

/**
 * Seções legadas (ex.: adminSeed sem `relStart`) ainda têm `stickerDetails` com `rel` correto;
 * espelha a lógica de seedAlbumConfig/seedStickerDetails para a UI e o parser.
 */
function withResolvedRelStart(section: AlbumSection): AlbumSection {
  if (section.relStart != null) return section;
  return { ...section, relStart: 1 };
}

export const getUserStickers = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    const rawSections = await ctx.db.query("albumSections").collect();
    const stats = await readSiteStatsOrNull(ctx);
    return {
      duplicates: user.duplicates ?? [],
      missing: user.missing ?? [],
      sections: rawSections.map(withResolvedRelStart),
      totalStickers: stats?.totalStickers ?? DEFAULT_TOTAL_STICKERS,
    };
  },
});

// Mutation
export const updateStickerList = mutation({
  args: {
    duplicates: v.array(v.number()),
    missing: v.array(v.number()),
    finalize: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    if (
      args.duplicates.length > MAX_STICKER_ARRAY_SIZE ||
      args.missing.length > MAX_STICKER_ARRAY_SIZE
    ) {
      throw new Error(
        `Cada lista pode ter no máximo ${MAX_STICKER_ARRAY_SIZE} figurinhas`
      );
    }

    const stats = await readSiteStatsOrNull(ctx);
    const totalCount = stats?.totalStickers ?? DEFAULT_TOTAL_STICKERS;

    const newDup = new Set<number>(args.duplicates);
    const newMiss = new Set<number>(args.missing);

    // 1. Arrays disjuntos
    const intersection = args.missing.filter((n) => newDup.has(n));
    if (intersection.length > 0) {
      throw new Error(
        `Numeros nao podem estar em ambas listas: ${intersection.join(", ")}`
      );
    }

    // 2. Números absolutos: 0 .. totalCount - 1
    const allNumbers = [...args.duplicates, ...args.missing];
    const invalid = allNumbers.filter((n) => !isValidAbsolute(n, totalCount));
    if (invalid.length > 0) {
      const maxAbs = totalCount - 1;
      throw new Error(`Numeros invalidos (0-${maxAbs}): ${invalid.join(", ")}`);
    }

    // 3. Skip se iguais
    const currentDup = new Set<number>(user.duplicates ?? []);
    const currentMiss = new Set<number>(user.missing ?? []);

    if (
      setsEqual(currentDup, newDup) &&
      setsEqual(currentMiss, newMiss) &&
      !args.finalize
    ) {
      return null;
    }

    const timeSinceLastUpdate = Date.now() - (user.lastActiveAt ?? 0);
    if (timeSinceLastUpdate < RATE_LIMIT_MS && !args.finalize) {
      throw new Error("Aguarde alguns segundos antes de atualizar novamente");
    }

    // 4. Finalize: pelo menos uma lista não vazia
    if (args.finalize && args.duplicates.length === 0 && args.missing.length === 0) {
      throw new Error("Preencha figurinhas repetidas ou faltantes antes de continuar");
    }

    // 5. Contadores
    const totalStickersOwned = totalCount - args.missing.length;
    const albumProgress = Math.round((totalStickersOwned / totalCount) * 100);

    // 6. Patch
    const patch: UserPatch = {
      duplicates: args.duplicates,
      missing: args.missing,
      albumProgress,
      albumCompletionPct: albumProgress,
      totalStickersOwned,
      lastActiveAt: Date.now(),
    };

    if (args.finalize) {
      patch.hasCompletedStickerSetup = true;
    }

    await ctx.db.patch(user._id, patch);

    const mergedUser = { ...user, ...patch };
    await syncActiveCheckinsStickerSnapshot(ctx, user._id, mergedUser, args.duplicates);

    await scheduleDebouncedMatchRecompute(ctx, user._id);

    return null;
  },
});

export const toggleSticker = mutation({
  args: {
    number: v.number(),
    target: v.union(v.literal("missing"), v.literal("duplicate"), v.literal("clear")),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    await rateLimiter.limit(ctx, "toggleSticker", { key: user._id, throws: true });

    const stats = await readSiteStatsOrNull(ctx);
    const totalCount = stats?.totalStickers ?? DEFAULT_TOTAL_STICKERS;

    const n = args.number;
    if (!isValidAbsolute(n, totalCount)) {
      const maxAbs = totalCount - 1;
      throw new Error(`Número inválido (0-${maxAbs})`);
    }

    const currentDup = new Set<number>(user.duplicates ?? []);
    const currentMiss = new Set<number>(user.missing ?? []);

    if (args.target === "clear") {
      currentDup.delete(n);
      currentMiss.delete(n);
    } else if (args.target === "duplicate") {
      currentMiss.delete(n);
      currentDup.add(n);
    } else {
      currentDup.delete(n);
      currentMiss.add(n);
    }

    const nextDup = [...currentDup].sort((a, b) => a - b);
    const nextMiss = [...currentMiss].sort((a, b) => a - b);

    const totalStickersOwned = totalCount - nextMiss.length;
    const albumProgress = Math.round((totalStickersOwned / totalCount) * 100);

    const userPatch: UserPatch = {
      duplicates: nextDup,
      missing: nextMiss,
      albumProgress,
      albumCompletionPct: albumProgress,
      totalStickersOwned,
      lastActiveAt: Date.now(),
    };

    await ctx.db.patch(user._id, userPatch);

    const mergedUser = { ...user, ...userPatch };
    await syncActiveCheckinsStickerSnapshot(ctx, user._id, mergedUser, nextDup);

    await scheduleDebouncedMatchRecompute(ctx, user._id);

    return { duplicates: nextDup, missing: nextMiss };
  },
});
