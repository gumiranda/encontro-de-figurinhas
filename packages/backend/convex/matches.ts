import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const BATCH_SIZE = 100;

type MatchCandidate = {
  _id: Id<"users">;
  displayNickname: string | undefined;
  duplicates: number[];
  missing: number[];
  cityId: Id<"cities"> | undefined;
};

type PaginatedResult = {
  page: MatchCandidate[];
  isDone: boolean;
  continueCursor: string;
};

/**
 * Computes potential trade matches for a user.
 * Uses internalAction (10min timeout) for batch processing.
 *
 * A match occurs when:
 * - User A has a duplicate that User B is missing, AND
 * - User B has a duplicate that User A is missing
 */
export const recomputeMatches = internalAction({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.getById, {
      userId: args.userId,
    });

    if (!user) {
      console.log(`[recomputeMatches] User ${args.userId} not found`);
      return;
    }

    // Skip if user hasn't completed sticker setup
    if (!user.hasCompletedStickerSetup) {
      console.log(`[recomputeMatches] User ${args.userId} hasn't completed sticker setup`);
      return;
    }

    const userDuplicates = new Set<number>(user.duplicates ?? []);
    const userMissing = new Set<number>(user.missing ?? []);

    // Skip if user has no duplicates or missing (no trades possible)
    if (userDuplicates.size === 0 || userMissing.size === 0) {
      console.log(`[recomputeMatches] User ${args.userId} has no trade potential`);
      return;
    }

    let cursor: string | null = null;
    let totalMatches = 0;
    let processedUsers = 0;

    // Paginated batch processing
    do {
      const batch: PaginatedResult = await ctx.runQuery(internal.users.getPotentialMatchCandidates, {
        excludeUserId: args.userId,
        cityId: user.cityId, // Prioritize local matches
        paginationOpts: {
          numItems: BATCH_SIZE,
          cursor,
        },
      });

      for (const candidate of batch.page) {
        const candidateDuplicates = new Set<number>(candidate.duplicates);
        const candidateMissing = new Set<number>(candidate.missing);

        // Find stickers user can give (user has duplicate, candidate missing)
        const userCanGive: number[] = [];
        for (const sticker of userDuplicates) {
          if (candidateMissing.has(sticker)) {
            userCanGive.push(sticker);
          }
        }

        // Find stickers user can receive (candidate has duplicate, user missing)
        const userCanReceive: number[] = [];
        for (const sticker of candidateDuplicates) {
          if (userMissing.has(sticker)) {
            userCanReceive.push(sticker);
          }
        }

        // Bilateral match: both users can trade
        if (userCanGive.length > 0 && userCanReceive.length > 0) {
          totalMatches++;
          // TODO: Store match in matches table when schema is added
          // For now, just log the match
          console.log(
            `[recomputeMatches] Match found: ${args.userId} <-> ${candidate._id}`,
            `(give: ${userCanGive.length}, receive: ${userCanReceive.length})`
          );
        }
      }

      processedUsers += batch.page.length;
      cursor = batch.isDone ? null : batch.continueCursor;
    } while (cursor);

    console.log(
      `[recomputeMatches] Completed for user ${args.userId}:`,
      `${totalMatches} matches found, ${processedUsers} users processed`
    );
  },
});
