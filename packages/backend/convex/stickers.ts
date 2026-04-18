import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./lib/auth";
import { DEFAULT_TOTAL_STICKERS } from "./lib/constants";
import { setsEqual } from "./lib/utils";

/** Limite de elementos por array para evitar DoS (memória/CPU/billing). */
const MAX_STICKER_ARRAY_SIZE = 1000;

/** Mínimo entre atualizações que alteram dados (mitiga alternância A↔B + recompute). */
const RATE_LIMIT_MS = 5000;

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

// Query
export const getUserStickers = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthorized");

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
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Unauthorized");

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
      return;
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
  },
});
