# Implementation Plan: Enhanced Trade Point Page (07-ponto.html)

## Context

Enhance the public trade point page `/apps/web/app/(marketing)/ponto/[slug]/page.tsx` based on design `screens/07-ponto.html`.

---

## Phase 0: Pre-flight Checks (Read-only Verification)

### 0.1 Verify BRAND_GRADIENTS

**Action:** Check `packages/ui/src/lib/design-tokens.ts` for `BRAND_GRADIENTS`.

If missing, add to plan Phase 1 as pre-requisite:

```typescript
export const BRAND_GRADIENTS = {
  primary: "linear-gradient(135deg, #4ff325 0%, #10b981 100%)",
} as const;
```

### 0.2a Verify Index by_city_status

**Action:** Check `packages/backend/convex/schema.ts`:

- Confirm index `by_city_status: ["cityId", "status"]` on `tradePoints`

If index missing:

```typescript
.index("by_city_status", ["cityId", "status"])
```

### 0.2b Add stateSlug Migration

**Action:** Add `stateSlug: v.string()` to `cities` schema.

**Migration spec:**

- File: `packages/backend/convex/migrations/addStateSlugToCities.ts`
- Type: `internalMutation`
- Idempotent: `.filter(q => q.eq(q.field("stateSlug"), undefined))` before patch
- If `city.state` is falsy, skip (log warning)
- Batch: paginate with cursor, 500 docs per batch, return `hasMore`
- Trigger: `npx convex run migrations:addStateSlugToCities`
- **Note:** `stateSlug` is NOT unique. Multiple cities in same state share the value. Any future index `by_stateSlug` must be non-unique (Convex default).

### 0.3 Verify slugify Helper Location

**Action:** Grep `packages/backend/convex/_helpers/` for `slugify` export.

Document the exact path. Expected: `packages/backend/convex/_helpers/slug.ts`.

### 0.4 Verify fetchQuery in Edge Runtime

**Action:** After deploy, test with `curl` that OG endpoint works.

If fails, change `export const runtime = "edge"` to `"nodejs"` in OG handler.

### 0.5 Audit Kibo PillIndicator API

**Action:** Check `packages/ui/src/components/kibo-ui/pill.tsx` for:

- `PillIndicator` component
- All 4 variants used: `"success"`, `"warning"`, `"info"`, `"default"`
- Props: `pulse?: boolean`

**Fallback mapping for missing variants:**

- `"warning"` absent → use `"default"` for `"moderado"`
- `"info"` absent → use `"default"` for `"novo"`
- `"success"` absent → **blocker**: switch to shadcn Badge instead

**Block Phase 3 until confirmed.**

### 0.6 Verify SEO Helper Functions and JsonLd Component

**Action:** Grep `apps/web/lib/seo.ts` for:

- `generateCombinedSchema`
- `generateLocalBusinessSchema`
- `generateBreadcrumbSchema`
- `BASE_URL` constant

Also verify `apps/web/components/json-ld.tsx` exists with `JsonLd` component export.

For any missing, add spec with exact signature to Phase 1.

### 0.7 Verify Edge Bundle Size + design-tokens Edge Safety

**Action 1:** Check `packages/ui/src/lib/design-tokens.ts` only exports pure constants (strings, serializable objects). If contains any `import` of React, DOM, or Node, extract `BRAND_GRADIENTS` to `packages/ui/src/lib/tokens-edge.ts`.

**Action 2:** After build, check `.next/server/app/api/og/ponto/[slug]/route.js` size. If > 1MB, change runtime to `"nodejs"`.

### 0.8 Verify Convex lib/ Folder Codegen

**Action:** Check `packages/backend/convex/convex.json`:

- Field `functions.ignore` does not contain `"lib/**"`
- If `convex.json` does not exist, Convex uses defaults — `lib/` is autogerado normalmente
- Confirm with `npx convex dev` after creating stub file: `internal.lib.revalidate.*` should appear in autocomplete

If `lib/` is in ignore list, rename to `libs/` or adjust plan imports.

**Blocks Phase 1.5.**

### 0.9 Verify NEXT_PUBLIC_CONVEX_URL

**Action:** Confirm `NEXT_PUBLIC_CONVEX_URL` is set in Vercel Production and Preview environments.

If absent, `generateStaticParams` and `sitemap.ts` fail at build time. No fallback possible.

**Blocks deploy.**

### 0.10 Verify /api/revalidate Endpoint Exists and Signature

**Action:** Check `apps/web/app/api/revalidate/route.ts` for exact signature:

- Method: POST
- Body: JSON `{ tags: string[] }`
- Auth: header `Authorization: Bearer <secret>`
- Return: 200 `{ ok: true }` or 401/400

If absent, proceed to Phase 1.5b. If signature diverges: either (a) adapt `triggerRevalidation` in Phase 1.5 to match existing endpoint, or (b) replace endpoint via Phase 1.5b. Decision deferred until 0.10 runs.

### 0.11 Verify Next.js Version for next/og

**Action:** Check `apps/web/package.json` for Next.js version.

`next/og` available since Next 13.3. If project is on Next < 13.3, use `@vercel/og` instead. Next 15 is OK.

### 0.12 Verify tsconfig Path Alias

**Action:** Check `apps/web/tsconfig.json` has `"paths": { "@/*": ["./*"] }` or equivalent.

Without this, imports like `@/lib/convex-fetch` fail. If absent, use relative paths or adjust config.

---

## Phase 1: Backend Updates

### 1.1 Enhance `getBySlug` Query

**File:** `packages/backend/convex/tradePoints.ts:517-541`

**Import:** `import { slugify } from "./_helpers/slug";` (path verified in Phase 0.3)

**Note:** Use pre-computed `stateSlug` from cities schema (Phase 0.2b migration), not runtime slugify.

```typescript
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const point = await ctx.db
      .query("tradePoints")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!point || point.status !== "approved") return null;
    const city = await ctx.db.get(point.cityId);

    return {
      _id: point._id,
      name: point.name,
      slug: point.slug,
      address: point.address,
      lat: point.lat,
      lng: point.lng,
      confirmedTradesCount: point.confirmedTradesCount,
      participantCount: point.participantCount ?? 0,
      activeCheckinsCount: point.activeCheckinsCount ?? 0,
      suggestedHours: point.suggestedHours ?? null,
      description: point.description ?? null,
      lastActivityAt: point.lastActivityAt,
      city: city
        ? {
            name: city.name,
            state: city.state,
            slug: city.slug,
            stateSlug: city.stateSlug,
          }
        : null,
    };
  },
});
```

### 1.2 Update `listTopForSSG` Query

**File:** `packages/backend/convex/tradePoints.ts`

**Note:** `.order("desc")` orders by `_creationTime`. Intentional: SSG pool favors recently created points with high adoption. Old popular points (created before item 5000) use ISR. Tech debt #2 resolves with index `by_status_participantCount` when `approved > 5000`.

**Note:** `MAX_SSG_POOL` and `TOP_SSG_COUNT` intentionally NOT exported — YAGNI. Testing `generateStaticParams` is integration-level, not unit. Do not export "just in case".

```typescript
const MAX_SSG_POOL = 5000;
const TOP_SSG_COUNT = 200;

export const listTopForSSG = query({
  args: {},
  handler: async (ctx) => {
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .take(MAX_SSG_POOL);

    return points
      .sort((a, b) => (b.participantCount ?? 0) - (a.participantCount ?? 0))
      .slice(0, TOP_SSG_COUNT)
      .map((p) => p.slug);
  },
});
```

### 1.3 Add `listRecentByCity` Query

**File:** `packages/backend/convex/tradePoints.ts`

**Note:** Also filters by `description` to avoid linking to noindex pages.

**Limitation:** `take(limit + 5)` is buffer for post-filter cases where `excludeSlug` or short description fails. With `limit = 5`, fetches 10 points and filters. If > 5 points in the city lack valid description (>=20 chars), UI may render fewer than `limit` items. Acceptable — cities with few valid points don't deserve artificial fill.

```typescript
export const listRecentByCity = query({
  args: {
    citySlug: v.string(),
    excludeSlug: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { citySlug, excludeSlug, limit = 5 }) => {
    const city = await ctx.db
      .query("cities")
      .withIndex("by_slug", (q) => q.eq("slug", citySlug))
      .unique();
    if (!city) return [];

    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_city_status", (q) =>
        q.eq("cityId", city._id).eq("status", "approved")
      )
      .order("desc")
      .take(limit + 5);

    return points
      .filter(
        (p) =>
          p.slug !== excludeSlug && p.description && p.description.trim().length >= 20
      )
      .slice(0, limit)
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        address: p.address,
      }));
  },
});
```

### 1.4 Add `listAllApprovedSlugs` Query (for Sitemap)

**File:** `packages/backend/convex/tradePoints.ts`

**Note:** Also validates description minimum length (20 chars) to exclude thin content.

```typescript
export const listAllApprovedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .take(10000);

    return points
      .filter((p) => p.description && p.description.trim().length >= 20)
      .map((p) => ({
        slug: p.slug,
        updatedAt: p.lastActivityAt ?? p._creationTime,
      }));
  },
});
```

### 1.5 Add Revalidation Action

**File (NEW):** `packages/backend/convex/lib/revalidate.ts`

```typescript
import { internalAction } from "../_generated/server";
import { v } from "convex/values";

export const triggerRevalidation = internalAction({
  args: { tags: v.array(v.string()) },
  handler: async (_ctx, { tags }) => {
    const endpoint = process.env.SITE_BASE_URL;
    const secret = process.env.REVALIDATE_SECRET;
    if (!endpoint || !secret) {
      console.warn(
        "Revalidation not configured - missing SITE_BASE_URL or REVALIDATE_SECRET"
      );
      return;
    }

    try {
      const res = await fetch(`${endpoint}/api/revalidate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({ tags }),
      });
      if (!res.ok) console.error("revalidate failed:", await res.text());
    } catch (e) {
      console.error("revalidate error:", e);
    }
  },
});
```

**Pre-requisite:** Set Convex env vars:

```bash
npx convex env set SITE_BASE_URL https://figurinhafacil.com.br
npx convex env set REVALIDATE_SECRET <valor>
```

### 1.5b Create /api/revalidate Endpoint (if 0.10 confirms absent)

**File (NEW):** `apps/web/app/api/revalidate/route.ts`

```typescript
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) {
    return new Response("unauthorized", { status: 401 });
  }
  const { tags } = (await req.json()) as { tags: string[] };
  if (!Array.isArray(tags)) {
    return new Response("invalid body", { status: 400 });
  }
  for (const tag of tags) {
    if (/^(ponto|cidade|sitemap)(:|$)/.test(tag)) {
      revalidateTag(tag);
    }
  }
  return new Response(JSON.stringify({ ok: true, count: tags.length }));
}
```

Whitelist of prefixes (`ponto:`, `cidade:`, `sitemap`) prevents arbitrary tag revalidation if secret leaks.

### 1.6 Update Mutations with Revalidation

**File:** `packages/backend/convex/tradePoints.ts`

**Required imports (add at top of file):**

```typescript
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
```

**Common pattern (define once):**

Note: `cityId` is required in schema (every point has a city).

```typescript
async function scheduleRevalidation(
  ctx: MutationCtx,
  point: { slug: string; cityId: Id<"cities"> },
  includeSitemap: boolean
) {
  const city = await ctx.db.get(point.cityId);
  const tags = [`ponto:${point.slug}`];
  if (city) tags.push(`cidade:${city.slug}`);
  if (includeSitemap) tags.push("sitemap");

  await ctx.scheduler.runAfter(0, internal.lib.revalidate.triggerRevalidation, { tags });
}
```

**approveTradePoint:**

```typescript
await scheduleRevalidation(ctx, point, true);
```

**suspendTradePoint:**

```typescript
await scheduleRevalidation(ctx, point, true);
```

**rejectTradePoint:**

```typescript
await ctx.scheduler.runAfter(0, internal.lib.revalidate.triggerRevalidation, {
  tags: ["sitemap"],
});
```

**editTradePoint (conditional on SEO fields):**

Spec: Capture `before = await ctx.db.get(pointId)` before patch, `updates` is the input argument. Compare field-by-field only for fields present in `updates`.

```typescript
const before = await ctx.db.get(pointId);
if (!before) return;

await ctx.db.patch(pointId, updates);

const seoFields = [
  "name",
  "address",
  "lat",
  "lng",
  "suggestedHours",
  "description",
] as const;
const changed = seoFields.some((f) => {
  if (!(f in updates)) return false;
  const oldVal = before[f as keyof typeof before];
  const newVal = (updates as Record<string, unknown>)[f];
  return oldVal !== newVal;
});
if (changed) {
  await scheduleRevalidation(ctx, { slug: before.slug, cityId: before.cityId }, false);
}
```

**confirmTrade:**

Note: Convex OCC guarantees that two mutations reading `count === 9` don't both succeed — one retries. No race protection needed beyond OCC.

```typescript
const next = (point.confirmedTradesCount ?? 0) + 1;
await ctx.db.patch(pointId, { confirmedTradesCount: next });
if (next === 1 || next % 10 === 0) {
  await ctx.scheduler.runAfter(0, internal.lib.revalidate.triggerRevalidation, {
    tags: [`ponto:${point.slug}`],
  });
}
```

**expireStalePending cron (coalesced, single call at end):**

Note: Verify cron type in `crons.ts`. If `internalAction`, use `ctx.runAction`. If `internalMutation`, use scheduler.

```typescript
const expired = await expirePoints(...);
if (expired.length > 0) {
  await ctx.scheduler.runAfter(0, internal.lib.revalidate.triggerRevalidation, {
    tags: ["sitemap"],
  });
}
```

---

## Phase 2: Page Structure & Metadata

### 2.0 Create fetchQueryWithTags Helper

**File (NEW):** `apps/web/lib/convex-fetch.ts`

Centralizes the `as never` cast to one location, with full type safety using Convex's `FunctionReference` types.

```typescript
import { fetchQuery } from "convex/nextjs";
import type { FunctionReference, FunctionArgs, FunctionReturnType } from "convex/server";

export function fetchQueryWithTags<Query extends FunctionReference<"query">>(
  query: Query,
  args: FunctionArgs<Query>,
  tags: string[]
): Promise<FunctionReturnType<Query>> {
  return fetchQuery(query, args, { next: { tags } } as never);
}
```

**Critical:** Without proper typing, `loadTradePoint` returns `Promise<unknown>` and `point.city.stateSlug` in `generateMetadata` fails typecheck (TS2339).

### 2.1 Page Exports

**File:** `apps/web/app/(marketing)/ponto/[slug]/page.tsx`

Note: On Convex failure in build-time, pages cached from previous deploy remain served via ISR until next rebuild. Log in Sentry required.

```typescript
export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const slugs = await fetchQuery(api.tradePoints.listTopForSSG, {});
    return slugs.map((slug) => ({ slug }));
  } catch (e) {
    console.error("generateStaticParams failed:", e);
    return [];
  }
}
```

### 2.1b Define `loadTradePoint` Helper

**File:** `apps/web/app/(marketing)/ponto/[slug]/page.tsx`

**Note:** Depends on Phase 2.0 typed `fetchQueryWithTags`. Return type is inferred from `api.tradePoints.getBySlug`.

```typescript
import { cache } from "react";
import { fetchQueryWithTags } from "@/lib/convex-fetch";
import { api } from "@workspace/backend/_generated/api";
import { BASE_URL } from "@/lib/seo";

const loadTradePoint = cache(async (slug: string) =>
  fetchQueryWithTags(api.tradePoints.getBySlug, { slug }, [`ponto:${slug}`])
);

// Derive Point type from query return for helper functions
type Point = NonNullable<Awaited<ReturnType<typeof loadTradePoint>>>;
```

### 2.2 Enhanced Metadata with noindex for thin content

**Import:** `import { BASE_URL } from "@/lib/seo";`

```typescript
export async function generateMetadata({ params }: PontoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const point = await loadTradePoint(slug);

  if (!point || !point.city) {
    return { title: "Ponto não encontrado" };
  }

  const title = `${point.name} — Figurinhas Copa 2026 em ${point.city.name}`;

  const tradesText =
    point.confirmedTradesCount > 50
      ? `Mais de ${Math.floor(point.confirmedTradesCount / 10) * 10} trocas confirmadas.`
      : point.confirmedTradesCount > 0
        ? `${point.confirmedTradesCount} trocas confirmadas.`
        : "Participe das trocas.";

  const description = `Ponto de troca "${point.name}" em ${point.city.name}, ${point.city.state}. ${tradesText} Veja localização e como participar.`;

  return {
    title,
    description,
    robots: point.description ? undefined : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/ponto/${slug}`,
      type: "website",
      images: [`${BASE_URL}/api/og/ponto/${slug}`],
    },
    twitter: { title, description, card: "summary_large_image" },
    alternates: {
      canonical: `${BASE_URL}/ponto/${slug}`,
    },
  };
}
```

### 2.3 JSON-LD with Breadcrumb + LocalBusiness

**Import:** `import { BASE_URL, generateCombinedSchema, generateLocalBusinessSchema, generateBreadcrumbSchema } from "@/lib/seo";`

```typescript
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: point.city.state, url: `${BASE_URL}/estado/${point.city.stateSlug}` },
  { name: point.city.name, url: `${BASE_URL}/cidade/${point.city.slug}` },
  { name: point.name },
]);

const localBusinessSchema = generateLocalBusinessSchema({
  name: point.name,
  slug,
  address: point.address,
  city: point.city.name,
  state: point.city.state,
  lat: point.lat,
  lng: point.lng,
  suggestedHours: point.suggestedHours ?? undefined,
  description: point.description ?? undefined,
  participantCount: point.participantCount >= 3 ? point.participantCount : undefined,
});

const combinedSchema = generateCombinedSchema([breadcrumbSchema, localBusinessSchema]);
```

**Render in page JSX:**

```tsx
import { JsonLd } from "@/components/json-ld";

// Within page component return:
<JsonLd data={combinedSchema} />;
```

### 2.5 Add notFound() Check for Orphan Points

**File:** `apps/web/app/(marketing)/ponto/[slug]/page.tsx`

At the top of the page component, before any render:

```typescript
import { notFound } from "next/navigation";

export default async function PontoPage({ params }: PontoPageProps) {
  const { slug } = await params;
  const point = await loadTradePoint(slug);

  if (!point || !point.city) {
    notFound();
  }

  // ... rest of component
}
```

**Why:** `getBySlug` returns `city: null` if `ctx.db.get(point.cityId)` fails (orphan point). Without this check, accessing `point.city.name` crashes.

### 2.4 OG Image Endpoint

**File (NEW):** `apps/web/app/api/og/ponto/[slug]/route.tsx`

Note: `revalidateTag` on fetchQuery does NOT propagate to ImageResponse cache. Use reduced `s-maxage=600`.

```typescript
import { ImageResponse } from "next/og";
import { fetchQueryWithTags } from "@/lib/convex-fetch";
import { api } from "@workspace/backend/_generated/api";
import { BRAND_GRADIENTS } from "@workspace/ui/lib/design-tokens";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const point = await fetchQueryWithTags(
    api.tradePoints.getBySlug,
    { slug },
    [`ponto:${slug}`]
  );

  if (!point || !point.city) {
    return new ImageResponse(
      (
        <div style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_GRADIENTS.primary,
          fontFamily: "system-ui, sans-serif",
        }}>
          <h1 style={{ fontSize: 48, color: "white" }}>
            Ponto não disponível
          </h1>
          <p style={{ fontSize: 24, color: "rgba(255,255,255,0.7)" }}>
            figurinhafacil.com.br
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  }

  const nameFontSize = point.name.length > 30 ? 48 : 64;

  return new ImageResponse(
    (
      <div style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 60,
        background: BRAND_GRADIENTS.primary,
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: "8px 16px",
            borderRadius: 9999,
            color: "white",
            fontSize: 18,
          }}>
            📍 {point.city.name}, {point.city.state}
          </div>
        </div>
        <h1 style={{
          fontSize: nameFontSize,
          fontWeight: 700,
          color: "white",
          margin: 0,
          lineHeight: 1.1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}>
          {point.name}
        </h1>
        <p style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.85)",
          marginTop: 24,
        }}>
          {point.address}
        </p>
        {point.confirmedTradesCount > 0 && (
          <div style={{ marginTop: "auto", display: "flex", gap: 24 }}>
            <div style={{
              background: "rgba(79,243,37,0.2)",
              border: "1px solid rgba(79,243,37,0.4)",
              padding: "12px 24px",
              borderRadius: 12,
              color: "#4ff325",
              fontSize: 20,
              fontWeight: 700,
            }}>
              {point.confirmedTradesCount} trocas confirmadas
            </div>
          </div>
        )}
        <p style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          fontSize: 20,
          color: "rgba(255,255,255,0.6)",
        }}>
          figurinhafacil.com.br
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=86400",
      },
    }
  );
}
```

---

## Phase 3: Visual Design (RSC First)

### 3.1 Activity Level Derivation (Server-Side)

Note: Mapping conditional on Phase 0.5 audit. If variant absent, use fallback.

```typescript
function deriveActivityLevel(
  lastActivityAt: number,
  activeCheckinsCount: number
): "ao-vivo" | "ativo" | "moderado" | "novo" {
  const now = Date.now();
  const hoursSince = (now - lastActivityAt) / (1000 * 60 * 60);

  if (activeCheckinsCount > 0 || hoursSince < 24) return "ao-vivo";
  if (hoursSince < 24 * 7) return "ativo";
  if (hoursSince < 24 * 30) return "moderado";
  return "novo";
}

const activityConfig = {
  "ao-vivo": { label: "Ao vivo", variant: "success" as const, pulse: true },
  ativo: { label: "Ativo", variant: "success" as const, pulse: false },
  moderado: { label: "Moderado", variant: "default" as const, pulse: false },
  novo: { label: "Novo", variant: "default" as const, pulse: false },
} as const;
```

### 3.2 AEO Paragraph with Variations

**Note:** `Point` type defined in Phase 2.1b as `NonNullable<Awaited<ReturnType<typeof loadTradePoint>>>`.

```typescript
function generateAEOParagraph(point: Point): string | null {
  if (!point.description) return null;

  const tradeText =
    point.confirmedTradesCount > 100
      ? `já realizou mais de ${Math.floor(point.confirmedTradesCount / 50) * 50} trocas`
      : point.confirmedTradesCount > 10
        ? `tem ${point.confirmedTradesCount} trocas confirmadas`
        : point.confirmedTradesCount > 0
          ? `está começando com ${point.confirmedTradesCount} trocas`
          : "é um ponto novo para trocas";

  return `${point.name} ${tradeText} de figurinhas da Copa 2026 em ${point.city.name}, ${point.city.state}. ${point.description}`;
}
```

### 3.3 Participant Count Privacy

Decision (LGPD): Admin sees exact count; public sees range for `< 3` to prevent identification via address + count.

```typescript
function formatParticipantCount(count: number): string {
  if (count < 0) {
    console.error("invalid participantCount:", count);
    return "Poucos participantes";
  }
  if (count >= 3) return `${count} participantes`;
  if (count > 0) return "Poucos participantes";
  return "Seja um dos primeiros";
}
```

### 3.4 Stats Row (2 Stats Only)

1. **Trocas confirmadas** (green)
2. **Nível de atividade** - derived label with `Pill + PillIndicator`

```tsx
<Pill>
  <PillIndicator
    variant={activityConfig[level].variant}
    pulse={activityConfig[level].pulse}
  />
  {activityConfig[level].label}
</Pill>
```

### 3.5 Static Map Decision

**Cut from MVP.** Tech debt: Mapbox Static Images post-MVP.

### 3.6 Hours Display

Plain `<p>` text. Tech debt: "schema migration — structured hours".

---

## Phase 4: Layout & CTA

### 4.1 Two-Column Desktop Layout

- Main: hero, stats, info, AEO content
- Sidebar: address card, recent points (no map)

### 4.2 Hub-and-Spoke Links

```tsx
<section>
  <h2>Outros pontos em {point.city.name}</h2>
  <nav aria-label="Pontos relacionados">
    <ul>
      {recentPoints.map((p) => (
        <li key={p.slug}>
          <Link href={`/ponto/${p.slug}`}>{p.name}</Link>
        </li>
      ))}
    </ul>
  </nav>
  <div className="flex gap-4 mt-4">
    <Link href={`/cidade/${point.city.slug}`}>Ver todos em {point.city.name}</Link>
    <Link href={`/estado/${point.city.stateSlug}`}>Mais em {point.city.state}</Link>
    <Link href="/selecoes">Seleções Copa 2026</Link>
  </div>
</section>
```

### 4.3 Mobile CTA Bar (Separate Client Component)

**File (NEW):** `apps/web/modules/trade-points/ui/mobile-cta-bar.tsx`

```typescript
"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { MapPin } from "lucide-react";
import type { Id } from "@workspace/backend/_generated/dataModel";

interface MobileCTABarProps {
  pointId: Id<"tradePoints">;
  lat: number;
  lng: number;
}

export function MobileCTABar({ pointId, lat, lng }: MobileCTABarProps) {
  const mapsUrl = Number.isFinite(lat) && Number.isFinite(lng)
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : null;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t p-4 pb-safe flex gap-3 md:hidden z-50">
      <SignedOut>
        <Button size="lg" className="flex-1" asChild>
          <Link href={`/sign-up?redirect_url=${encodeURIComponent(`/points/${pointId}`)}`}>
            Participar das trocas
          </Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <Button size="lg" className="flex-1" asChild>
          <Link href={`/points/${pointId}`} prefetch={false}>
            Ver detalhes
          </Link>
        </Button>
      </SignedIn>
      {mapsUrl && (
        <Button size="lg" variant="outline" asChild>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="mr-2 h-4 w-4" />
            Como chegar
          </a>
        </Button>
      )}
    </div>
  );
}
```

---

## Phase 5: Sitemap Update

### 5.1 Update Sitemap to Use Query

**File:** `apps/web/app/sitemap.ts`

Note: `revalidateTag("sitemap")` does NOT trigger instant rebuild. ISR baseline 1h latency.

```typescript
import type { MetadataRoute } from "next";
import { fetchQueryWithTags } from "@/lib/convex-fetch";
import { api } from "@workspace/backend/_generated/api";
import { BASE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let points: { slug: string; updatedAt: number }[] = [];
  try {
    points = await fetchQueryWithTags(api.tradePoints.listAllApprovedSlugs, {}, [
      "sitemap",
    ]);
  } catch (e) {
    console.error("sitemap Convex fetch failed, serving static only:", e);
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cidades`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/estados`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/selecoes`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/figurinhas`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    },
    ...points.map((p) => ({
      url: `${BASE_URL}/ponto/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
```

---

## Phase 6: Test Cases

### Unit Tests

| Type     | Scenario                                       | Expected                                     |
| -------- | ---------------------------------------------- | -------------------------------------------- |
| `[Unit]` | `deriveActivityLevel(now - 12h, 0)`            | Returns `"ao-vivo"`                          |
| `[Unit]` | `deriveActivityLevel(now - 25h, 0)`            | Returns `"ativo"`                            |
| `[Unit]` | `deriveActivityLevel(now - 8days, 0)`          | Returns `"moderado"`                         |
| `[Unit]` | `formatParticipantCount(-1)`                   | Logs error, returns `"Poucos participantes"` |
| `[Unit]` | `formatParticipantCount(0)`                    | Returns `"Seja um dos primeiros"`            |
| `[Unit]` | `formatParticipantCount(2)`                    | Returns `"Poucos participantes"`             |
| `[Unit]` | `formatParticipantCount(5)`                    | Returns `"5 participantes"`                  |
| `[Unit]` | `generateAEOParagraph({...description: null})` | Returns `null`                               |

### Integration Tests (vitest + vi.fn() for fetch mock)

| Type            | Scenario                                          | Expected                                                                 |
| --------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| `[Integration]` | `triggerRevalidation` with `SITE_BASE_URL` absent | `console.warn` called, `fetch` not called                                |
| `[Integration]` | `triggerRevalidation` with fetch 200              | `fetch` called with `Bearer ${secret}` and body `{"tags":["ponto:abc"]}` |
| `[Integration]` | `/ponto/{approved-slug}`                          | 200 with page content                                                    |
| `[Integration]` | `/ponto/{pending-slug}`                           | 404 page                                                                 |
| `[Integration]` | `/ponto/{suspended-slug}`                         | 404 page                                                                 |
| `[Integration]` | `/ponto/non-existent`                             | 404 page                                                                 |
| `[Integration]` | `lat/lng` invalid (NaN)                           | "Como chegar" button hidden                                              |
| `[Integration]` | `suggestedHours === null`                         | Hours section hidden                                                     |
| `[Integration]` | `city === null` (orphan)                          | 404 page                                                                 |

### E2E Tests

| Type    | Scenario                                     | Expected                              |
| ------- | -------------------------------------------- | ------------------------------------- |
| `[E2E]` | User logged out, mobile                      | CTA shows "Participar das trocas"     |
| `[E2E]` | User logged in, mobile                       | CTA shows "Ver detalhes"              |
| `[E2E]` | `REVALIDATE_SECRET` missing in Convex        | Mutation completes, logs warning      |
| `[E2E]` | `/api/revalidate` returns 401 (wrong secret) | Logs error, mutation completes        |
| `[E2E]` | `/api/revalidate` times out                  | Logs error, mutation completes        |
| `[E2E]` | `approveTradePoint` in staging               | POST to `/api/revalidate` returns 200 |

### SEO Tests

| Type       | Scenario                                  | Expected                                                                                               |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `[Manual]` | View source `/ponto/{slug}`               | Contains `<script type="application/ld+json">` with `@type: BreadcrumbList` and `@type: LocalBusiness` |
| `[Manual]` | `/ponto/{slug}` with `description` null   | `<meta name="robots" content="noindex,follow">` present                                                |
| `[Manual]` | `/ponto/{slug}` with `description` filled | No meta `robots` (indexable)                                                                           |
| `[Manual]` | `og:image` in `<head>`                    | URL is `${BASE_URL}/api/og/ponto/${slug}`                                                              |
| `[Manual]` | Breadcrumb JSON-LD                        | Item 2 links `/estado/${stateSlug}` populated                                                          |
| `[Manual]` | Google Rich Results Test                  | Zero errors, `LocalBusiness` recognized                                                                |
| `[Manual]` | `curl /sitemap.xml`                       | Contains URL of point with description, does NOT contain point without description                     |
| `[Manual]` | Request `/ponto/{slug}` in dev            | Convex dashboard shows **1 invocation** of `getBySlug` (not 3) — confirms `React.cache` deduplication  |

### OG Image Tests

| Type       | Scenario                  | Expected                              |
| ---------- | ------------------------- | ------------------------------------- |
| `[Manual]` | OG with non-existent slug | Returns inline fallback PNG (not 302) |
| `[Manual]` | Slug with 60+ chars       | Title truncates with ellipsis         |

```bash
curl -o /tmp/og-test.png "http://localhost:3000/api/og/ponto/{slug}"
file /tmp/og-test.png  # Expect: PNG image data, 1200x630
# Open (cross-platform):
open /tmp/og-test.png 2>/dev/null || xdg-open /tmp/og-test.png 2>/dev/null || echo "Open manually: /tmp/og-test.png"
# Verify: gradient background, point name, address, figurinhafacil.com.br footer
```

Post-deploy: `https://developers.facebook.com/tools/debug/?q=...`

---

## Tech Debt Registry

| #   | Item                                                    | Trigger                                                                   |
| --- | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | Schema migration — structured hours                     | When adding hours grid UI                                                 |
| 2   | Index `by_status_participantCount`                      | When `approved > 5000`                                                    |
| 3   | Mapbox Static Images                                    | Post-MVP visual polish                                                    |
| 4   | OG image — embedded fonts (Inter)                       | UX consistency audit                                                      |
| 5   | OG `s-maxage=600` limitation                            | App Router improves tag propagation                                       |
| 6   | Sitemap latency 1h (ISR not instant)                    | When real-time freshness needed                                           |
| 7   | Sitemap index pattern (`sp-1.xml`)                      | When `approved > 8000`                                                    |
| 8   | `stateSlug` computed in runtime                         | If Phase 0.2b migration deferred                                          |
| 9   | Cron batch revalidation coalescing                      | When batch sizes > 100                                                    |
| 10  | formatParticipantCount LGPD rationale                   | For privacy audit documentation                                           |
| 11  | `generateStaticParams` retry + backoff                  | If Convex downtime becomes recurrent                                      |
| 12  | Admin badge for no-description points                   | Visual indicator that point is noindex + not in sitemap                   |
| 13  | AEO paragraph templating                                | Monitor Search Console for thin content signals after 3 months            |
| 14  | `description` minimum length threshold (20 chars)       | If Search Console shows "low content value" pages with short descriptions |
| 15  | `editTradePoint` args typed as schema-derived `Partial` | When mutations grow — proper type narrowing instead of cast               |
| 16  | `listRecentByCity` paginated filter with `.paginate()`  | If cities with many invalid-description points become common              |

---

## Execution Order

1. Phase 0.1 → 0.2a → 0.2b → 0.3 → 0.4 → 0.5 → 0.6 → 0.7 → 0.8 → 0.9 → 0.10 → 0.11 → 0.12
2. Phase 1.5b (if 0.10 confirms endpoint absent or signature divergent)
3. Phase 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6
4. Phase 2.0 → 2.1 → 2.1b → 2.2 → 2.3 → 2.4 → 2.5
5. Phase 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6
6. Phase 4.1 → 4.2 → 4.3
7. Phase 5.1
8. Phase 6 (tests)
9. Verification

---

## Verification

```bash
# 1. Set Convex env vars
npx convex env set SITE_BASE_URL https://figurinhafacil.com.br
npx convex env set REVALIDATE_SECRET <valor>

# 2. Run dev server
npm run dev --workspace=web

# 3. Test cases (manual per Phase 6)

# 4. Validate JSON-LD
# Paste source into https://search.google.com/test/rich-results

# 5. OG image test
curl -o /tmp/og-test.png "http://localhost:3000/api/og/ponto/{slug}"
file /tmp/og-test.png  # Expect: PNG image data, 1200x630
# Open (cross-platform):
open /tmp/og-test.png 2>/dev/null || xdg-open /tmp/og-test.png 2>/dev/null || echo "Open manually: /tmp/og-test.png"
# Verify: gradient background, point name, address, figurinhafacil.com.br footer

# 6. Build check
npm run build --workspace=web

# 7. Revalidation test (staging)
# In Convex Dashboard > Functions, run tradePoints:approveTradePoint with real pointId
# In another terminal:
vercel logs --follow | grep "/api/revalidate"
# Or via Vercel dashboard: Observability → Logs → filter `path: /api/revalidate`
# Wait for line with 200 + tag ponto:{slug}
```
