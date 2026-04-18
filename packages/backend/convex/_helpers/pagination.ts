import type { FunctionReference } from "convex/server";
import type { MutationCtx } from "../_generated/server";

export async function rescheduleIfMore(
  ctx: MutationCtx,
  params: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    self: FunctionReference<"mutation", "internal", any, any>;
    args: Record<string, unknown>;
    hasMore: boolean;
    chunk: number;
    maxChunks: number;
    label?: string;
  },
): Promise<{ rescheduled: boolean; aborted?: boolean }> {
  if (!params.hasMore) return { rescheduled: false };
  const nextChunk = params.chunk + 1;
  if (nextChunk >= params.maxChunks) {
    console.error("rescheduleIfMore: hit MAX_CHUNKS", {
      label: params.label,
      chunk: nextChunk,
    });
    return { rescheduled: false, aborted: true };
  }
  await ctx.scheduler.runAfter(0, params.self, {
    ...params.args,
    chunk: nextChunk,
  });
  return { rescheduled: true };
}
