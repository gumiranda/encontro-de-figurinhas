import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v } from "convex/values";
import { requireAuth } from "./lib/auth";
import { DEFAULT_TOTAL_STICKERS } from "./lib/constants";
import { setsEqual } from "./lib/utils";
import { scheduleDebouncedMatchRecompute } from "./matches";

/** Limite de elementos por array para evitar DoS (memória/CPU/billing). */
const MAX_STICKER_ARRAY_SIZE = 1000;

/** Mínimo entre atualizações batch (mitiga alternância A↔B + recompute). */
const RATE_LIMIT_MS = 5000;

/** Mínimo entre toggles individuais (previne spam de scheduler jobs). */
const TOGGLE_RATE_LIMIT_MS = 1000;

type UserPatch = Partial<
  Pick<
    Doc<"users">,
    | "duplicates"
    | "missing"
    | "albumProgress"
    | "totalStickersOwned"
    | "lastActiveAt"
    | "hasCompletedStickerSetup"
  >
>;

export const getUserStickers = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    const albumConfig = await ctx.db.query("albumConfig").first();
    return {
      duplicates: user.duplicates ?? [],
      missing: user.missing ?? [],
      sections: albumConfig?.sections ?? [],
      totalStickers: albumConfig?.totalStickers ?? DEFAULT_TOTAL_STICKERS,
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

    const config = await ctx.db.query("albumConfig").first();
    const maxSticker = config?.totalStickers ?? DEFAULT_TOTAL_STICKERS;

    const newDup = new Set<number>(args.duplicates);
    const newMiss = new Set<number>(args.missing);

    // 1. Arrays disjuntos
    const intersection = args.missing.filter((n) => newDup.has(n));
    if (intersection.length > 0) {
      throw new Error(
        `Numeros nao podem estar em ambas listas: ${intersection.join(", ")}`
      );
    }

    // 2. Range 1..maxSticker
    const allNumbers = [...args.duplicates, ...args.missing];
    const invalid = allNumbers.filter(
      (n) =>
        !Number.isInteger(n) ||
        !Number.isFinite(n) ||
        n < 1 ||
        n > maxSticker
    );
    if (invalid.length > 0) {
      throw new Error(`Numeros invalidos (1-${maxSticker}): ${invalid.join(", ")}`);
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
    if (
      args.finalize &&
      args.duplicates.length === 0 &&
      args.missing.length === 0
    ) {
      throw new Error(
        "Preencha figurinhas repetidas ou faltantes antes de continuar"
      );
    }

    // 5. Contadores
    const totalStickersOwned = maxSticker - args.missing.length;
    const albumProgress = Math.round((totalStickersOwned / maxSticker) * 100);

    // 6. Patch
    const patch: UserPatch = {
      duplicates: args.duplicates,
      missing: args.missing,
      albumProgress,
      totalStickersOwned,
      lastActiveAt: Date.now(),
    };

    if (args.finalize) {
      patch.hasCompletedStickerSetup = true;
    }

    await ctx.db.patch(user._id, patch);

    await scheduleDebouncedMatchRecompute(ctx, user._id);

    return null;
  },
});

export const toggleSticker = mutation({
  args: {
    number: v.number(),
    target: v.union(
      v.literal("missing"),
      v.literal("duplicate"),
      v.literal("clear")
    ),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    const timeSinceLastUpdate = Date.now() - (user.lastActiveAt ?? 0);
    if (timeSinceLastUpdate < TOGGLE_RATE_LIMIT_MS) {
      throw new Error("Aguarde um momento antes de continuar");
    }

    const config = await ctx.db.query("albumConfig").first();
    const maxSticker = config?.totalStickers ?? DEFAULT_TOTAL_STICKERS;

    const n = args.number;
    if (!Number.isInteger(n) || n < 1 || n > maxSticker) {
      throw new Error(`Número inválido (1-${maxSticker})`);
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

    const totalStickersOwned = maxSticker - nextMiss.length;
    const albumProgress = Math.round((totalStickersOwned / maxSticker) * 100);

    await ctx.db.patch(user._id, {
      duplicates: nextDup,
      missing: nextMiss,
      albumProgress,
      totalStickersOwned,
      lastActiveAt: Date.now(),
    });

    await scheduleDebouncedMatchRecompute(ctx, user._id);

    return { duplicates: nextDup, missing: nextMiss };
  },
});
