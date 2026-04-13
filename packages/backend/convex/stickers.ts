import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./lib/auth";

/** Limite de elementos por array para evitar DoS (memória/CPU/billing). */
const MAX_STICKER_ARRAY_SIZE = 1000;

// Query - busca figurinhas e albumConfig juntos
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
      totalStickers: albumConfig?.totalStickers ?? 980,
    };
  },
});

// Mutation UNICA - atualiza ambos atomicamente + agenda recompute
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

    // Buscar config do DB (nao hardcoded)
    const config = await ctx.db.query("albumConfig").first();
    const maxSticker = config?.totalStickers ?? 980;

    // 1. Validacao: arrays disjuntos
    const dupSet = new Set(args.duplicates);
    const intersection = args.missing.filter((n) => dupSet.has(n));
    if (intersection.length > 0) {
      throw new Error(
        `Numeros nao podem estar em ambas listas: ${intersection.join(", ")}`
      );
    }

    // 2. Validacao: inteiros no range (1-maxSticker, dinamico do DB)
    const allNumbers = [...args.duplicates, ...args.missing];
    const invalid = allNumbers.filter(
      (n) => !Number.isInteger(n) || n < 1 || n > maxSticker
    );
    if (invalid.length > 0) {
      throw new Error(`Numeros invalidos (1-${maxSticker}): ${invalid.join(", ")}`);
    }

    // 3. Skip se arrays iguais (rate limiting server-side)
    const currentDup = new Set<number>(user.duplicates ?? []);
    const currentMiss = new Set<number>(user.missing ?? []);
    const newDup = new Set<number>(args.duplicates);
    const newMiss = new Set<number>(args.missing);

    const setsEqual = (a: Set<number>, b: Set<number>) =>
      a.size === b.size && [...a].every((x) => b.has(x));

    if (
      setsEqual(currentDup, newDup) &&
      setsEqual(currentMiss, newMiss) &&
      !args.finalize
    ) {
      return; // Nada mudou e nao eh finalizacao, skip
    }

    // 4. Validar preenchimento minimo (so em finalize)
    if (
      args.finalize &&
      (args.duplicates.length === 0 || args.missing.length === 0)
    ) {
      throw new Error(
        "Preencha figurinhas repetidas E faltantes antes de continuar"
      );
    }

    // 5. Calcular contadores PRD F11 (usando maxSticker do DB)
    const totalStickersOwned = maxSticker - args.missing.length;
    const albumProgress = Math.round((totalStickersOwned / maxSticker) * 100);

    // 6. Patch atomico - hasCompletedStickerSetup SO se finalize=true
    const patch: Record<string, unknown> = {
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

    // 7. Agendar recomputacao de matches (action com timeout 10min)
    await ctx.scheduler.runAfter(0, internal.matches.recomputeMatches, {
      userId: user._id,
    });
  },
});
