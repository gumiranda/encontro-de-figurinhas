import type { MutationCtx } from "../_generated/server";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function generateTradePointSlug(
  ctx: MutationCtx,
  name: string,
  citySlug: string
): Promise<string> {
  const entropy = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
  const base = `${slugify(name)}-${citySlug}-${entropy}`;
  let candidate = base;
  let suffix = 2;
  while (
    await ctx.db
      .query("tradePoints")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .unique()
  ) {
    candidate = `${base}-${suffix++}`;
    if (suffix > 50) throw new Error("slug-collision-overflow");
  }
  return candidate;
}
