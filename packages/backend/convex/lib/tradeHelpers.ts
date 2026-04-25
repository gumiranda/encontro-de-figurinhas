import type { QueryCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export async function getPendingTradesCount(
  ctx: { db: QueryCtx["db"] },
  userId: Id<"users">
): Promise<number> {
  const asInitiator = await ctx.db
    .query("trades")
    .withIndex("by_initiator_status", (q) =>
      q.eq("initiatorId", userId).eq("status", "pending_confirmation")
    )
    .collect();
  return asInitiator.length;
}

export async function getPendingProposalsForUserCount(
  ctx: { db: QueryCtx["db"] },
  userId: Id<"users">
): Promise<number> {
  const incoming = await ctx.db
    .query("trades")
    .withIndex("by_counterparty_status", (q) =>
      q.eq("counterpartyId", userId).eq("status", "pending_confirmation")
    )
    .collect();
  return incoming.length;
}
