import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// Stub - sera implementado na feature de matches
// IMPORTANTE: usar internalAction (timeout 10min), nao internalMutation (timeout 1s)
// O PRD define recomputeMatches como action com batch processing
export const recomputeMatches = internalAction({
  args: { userId: v.id("users") },
  handler: async (_ctx, args) => {
    // TODO: implementar recomputacao de matches (paginada, batch)
    console.log(`[stub] recomputeMatches called for user ${args.userId}`);
  },
});
