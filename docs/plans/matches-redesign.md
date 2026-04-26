# Matches Page Redesign - Plan v9

**Changelog v8 → v9:** EmptyFilterCard deduplicado, ListMyMatchRow type completo, pré-condições de indexes, stats isolado do tab filter, useMatchesFilters completo, Badge variant corrigido, counts/stats deps removidos.

---

## Context

Redesign da página `/matches` com base no mockup HTML de Claude Design. O usuário quer ver estatísticas agregadas, filtros (tabs + chip), cards aprimorados com gradientes e lanes de figurinhas, e um card "Melhor match" destacado. A implementação reutiliza dados existentes de `precomputedMatches` e projeta campos seguros para o frontend.

---

## Component Sourcing

**Tabs:** `@workspace/ui/components/tabs` (shadcn, instalado)
**Toggle:** `@workspace/ui/components/toggle` (shadcn, instalado)
**Skeleton:** `@workspace/ui/components/skeleton` (shadcn)
**Card, CardContent:** `@workspace/ui/components/card` (shadcn)
**Badge:** `@workspace/ui/components/badge` — usar `variant="secondary"` para featured (não `"premium"`)
**Tooltip do `~`:** atributo HTML `title`, não componente.

---

## Constantes

**Backend:** `packages/backend/convex/_helpers/matches.ts`

```typescript
export const NEARBY_KM_THRESHOLD = 5;
export const STATS_CAP = 5000;
export const HIDDEN_CAP = 2000;
export const MATCH_PAGE_SIZE = 50;

export function computeMatchScore(
  theyHaveINeed: number,
  iHaveTheyNeed: number,
  isBidirectional: boolean,
  distanceKm: number
): number {
  return (
    (isBidirectional ? 1000 : 0) +
    Math.min(theyHaveINeed, iHaveTheyNeed) * 2 +
    Math.max(theyHaveINeed, iHaveTheyNeed) -
    distanceKm
  );
}
```

**Frontend:** `apps/web/modules/matches/lib/constants.ts`

```typescript
export const NEARBY_KM_THRESHOLD = 5;
```

---

## Type Definitions

**ListMyMatchRow (completo):**

```typescript
export type ListMyMatchRow = {
  matchedUserId: Id<"users">;
  displayNickname: string;
  avatarSeed: string;
  theyHaveINeed: number[];
  iHaveTheyNeed: number[];
  isBidirectional: boolean;
  distanceKm: number;
  layer: 1 | 2;
  tradePointId: Id<"tradePoints">;
  tradePointSlug: string;
  tradePointName: string;
};
```

---

## Field Leak Audit

### Campos Expostos ao Frontend (whitelist)

`matchedUserId`, `displayNickname`, `avatarSeed`, `theyHaveINeed`, `iHaveTheyNeed`, `isBidirectional`, `distanceKm`, `layer`, `tradePointId`, `tradePointSlug`, `tradePointName`

### Campos Lidos Internamente (não expostos)

`isBanned`, `isShadowBanned` — lidos para filtrar, nunca retornados.

### Lista Negra (nunca ler)

`clerkId`, `reportCount`, `rejectionReason`, `whatsappLink`, `deletionPending`, `cleanupStatus`, `pendingSubmissionsCount`, `lastSubmissionAt`, `locationUpdateTimestamps`, `warningCount`, `premiumExpiresAt`, `boostExpiresAt`

### Invariante Shadow-ban

`precomputedMatches` exclui shadow-banned users via cron de recomputação. A filtragem no runtime é defense-in-depth.

**Chave de identidade:** `(matchedUserId, tradePointId)`, nunca só `matchedUserId`.

**Nota:** `pairKey` da memory é para trades bilaterais (2 users). A chave composta `${matchedUserId}_${tradePointId}` desta PR é para rows em `precomputedMatches` (1 user + 1 ponto).

---

## Pré-condições de Schema

**Antes de executar Steps 3-4, verificar que existem:**

1. `precomputedMatches` schema DEVE ter:
   - `tradePointSlug: v.string()` e `tradePointName: v.string()` denormalizados
   - Index `by_user_layer`: `["userId", "layer"]`
   - Index `by_user_layer_bidirectional`: `["userId", "layer", "isBidirectional"]`

2. `userMatchInteractions` schema DEVE ter:
   - Campo `tradePointId: v.id("tradePoints")`
   - Index `by_user_hidden`: `["userId", "isHidden"]`

Se faltam, adicionar ao schema ANTES de executar os steps.

---

## Limitações Conhecidas

1. **Featured deriva da primeira página; não é "melhor match global".** Aceitável enquanto `isTruncated === false` for dominante.
2. **Stats skeleton + grid renderizada é aceito.** Usuário vê matches imediatamente.
3. **hasSpecial ordering não implementado.** Campo não existe.
4. **WhatsApp telemetry não auditado.**
5. **Auth check via `useConvexAuth` nativo do Convex.** Zero query custom.
6. **InsightBox pode ser testado A/B pós-launch.**
7. **`hideMatch` é mutation existente em `packages/backend/convex/matches.ts`**. Se não existe, criar não é escopo desta PR.
8. **Hidden set truncado:** Se usuário tem >2000 matches ocultos, `HIDDEN_CAP` trunca e matches ocultos podem reaparecer. Risco aceito por ser caso raro. Se necessário, aumentar cap ou adicionar flag `isHiddenSetTruncated`.

---

## Estados de Renderização

```
listMatchesResult === undefined (loading inicial)
  → Skeleton inline:
    - Stats row: 4 skeleton cards (h-20)
    - Filter bar skeleton
    - Grid: 6 card skeletons (h-48)

listMatchesResult !== undefined && matches.length === 0 && tab === "all" && !nearbyOnly
  → CTA: "Você ainda não tem matches..."

listMatchesResult !== undefined && matches.length > 0 && filteredMatches.length === 0
  → EmptyFilterCard (escolhe copy por tab + nearbyOnly)
  → Botão "Limpar filtros"

filteredMatches.length > 0 && stats === null
  → Stats skeleton + Grid normal
  → NÃO renderiza insight box

filteredMatches.length > 0 && stats !== null
  → Stats completo + Grid normal
  → Insight box no fim
```

---

## Files (4 new, 4 modified)

| Action | Path                                                           |
| ------ | -------------------------------------------------------------- |
| CREATE | `packages/backend/convex/_helpers/matches.ts`                  |
| CREATE | `apps/web/modules/matches/lib/constants.ts`                    |
| CREATE | `apps/web/modules/matches/lib/hash.ts`                         |
| CREATE | `apps/web/modules/matches/ui/components/matches-stats-row.tsx` |
| MODIFY | `packages/backend/convex/matches.ts`                           |
| MODIFY | `apps/web/modules/matches/hooks/use-matches-filters.ts`        |
| MODIFY | `apps/web/modules/matches/ui/components/match-card.tsx`        |
| MODIFY | `apps/web/modules/matches/ui/views/matches-page-view.tsx`      |

---

## Step 1: \_helpers/matches.ts (backend)

```typescript
export const NEARBY_KM_THRESHOLD = 5;
export const STATS_CAP = 5000;
export const HIDDEN_CAP = 2000;
export const MATCH_PAGE_SIZE = 50;

export function computeMatchScore(
  theyHaveINeed: number,
  iHaveTheyNeed: number,
  isBidirectional: boolean,
  distanceKm: number
): number {
  return (
    (isBidirectional ? 1000 : 0) +
    Math.min(theyHaveINeed, iHaveTheyNeed) * 2 +
    Math.max(theyHaveINeed, iHaveTheyNeed) -
    distanceKm
  );
}
```

---

## Step 2: lib/hash.ts + lib/constants.ts (frontend)

**hash.ts:**

```typescript
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}
```

**constants.ts:**

```typescript
export const NEARBY_KM_THRESHOLD = 5;
```

---

## Step 3: getMatchStats Query

Stats são SEMPRE sobre TODOS os matches do usuário, independente do tab ativo. Isso evita inconsistência visual.

```typescript
import { NEARBY_KM_THRESHOLD, STATS_CAP } from "./_helpers/matches";

export const getMatchStats = query({
  args: {},
  returns: v.object({
    total: v.number(),
    bidirectionalCount: v.number(),
    nearbyCount: v.number(),
    avgDistanceKm: v.number(),
    isApproximate: v.boolean(),
  }),
  handler: async (ctx) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      throw new ConvexError({ code: "ERR_UNAUTHORIZED" });
    }

    const userId = auth.user._id;
    const rows = await ctx.db
      .query("precomputedMatches")
      .withIndex("by_user_layer", (q) => q.eq("userId", userId))
      .take(STATS_CAP);

    const isApproximate = rows.length === STATS_CAP;
    const total = rows.length;
    const bidirectionalCount = rows.filter((r) => r.isBidirectional).length;
    const nearbyCount = rows.filter((r) => r.distanceKm <= NEARBY_KM_THRESHOLD).length;
    const avgDistanceKm =
      total === 0
        ? 0
        : Math.round((rows.reduce((s, r) => s + r.distanceKm, 0) / total) * 10) / 10;

    return { total, bidirectionalCount, nearbyCount, avgDistanceKm, isApproximate };
  },
});
```

---

## Step 4: listMyMatches Modifications

```typescript
import { MATCH_PAGE_SIZE, HIDDEN_CAP, computeMatchScore } from "./_helpers/matches";

export const listMyMatches = query({
  args: {
    layer: v.optional(v.union(v.literal(1), v.literal(2))),
    bidirectionalOnly: v.optional(v.boolean()),
  },
  returns: v.object({
    matches: v.array(
      v.object({
        matchedUserId: v.id("users"),
        displayNickname: v.string(),
        avatarSeed: v.string(),
        theyHaveINeed: v.array(v.number()),
        iHaveTheyNeed: v.array(v.number()),
        isBidirectional: v.boolean(),
        distanceKm: v.number(),
        layer: v.union(v.literal(1), v.literal(2)),
        tradePointId: v.id("tradePoints"),
        tradePointSlug: v.string(),
        tradePointName: v.string(),
      })
    ),
    isTruncated: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      throw new ConvexError({ code: "ERR_UNAUTHORIZED" });
    }

    const userId = auth.user._id;
    const layers: (1 | 2)[] = args.layer === undefined ? [1, 2] : [args.layer];
    const bidirectionalOnly = args.bidirectionalOnly ?? false;

    // 1. take(N+1) com cap GLOBAL
    const rows: Doc<"precomputedMatches">[] = [];
    for (const lyr of layers) {
      if (rows.length > MATCH_PAGE_SIZE) break;
      const remaining = MATCH_PAGE_SIZE + 1 - rows.length;
      const chunk = bidirectionalOnly
        ? await ctx.db
            .query("precomputedMatches")
            .withIndex("by_user_layer_bidirectional", (q) =>
              q.eq("userId", userId).eq("layer", lyr).eq("isBidirectional", true)
            )
            .take(remaining)
        : await ctx.db
            .query("precomputedMatches")
            .withIndex("by_user_layer", (q) => q.eq("userId", userId).eq("layer", lyr))
            .take(remaining);
      rows.push(...chunk);
    }

    // 2. hidden filter server-side
    const hiddenInteractions = await ctx.db
      .query("userMatchInteractions")
      .withIndex("by_user_hidden", (q) => q.eq("userId", userId).eq("isHidden", true))
      .take(HIDDEN_CAP);
    const hiddenSet = new Set(
      hiddenInteractions.map((h) => `${h.matchedUserId}_${h.tradePointId}`)
    );

    const visibleRows = rows.filter(
      (r) => !hiddenSet.has(`${r.matchedUserId}_${r.tradePointId}`)
    );

    // 3. sort usando computeMatchScore
    visibleRows.sort((a, b) => {
      const aScore = computeMatchScore(
        a.theyHaveINeed.length,
        a.iHaveTheyNeed.length,
        a.isBidirectional,
        a.distanceKm
      );
      const bScore = computeMatchScore(
        b.theyHaveINeed.length,
        b.iHaveTheyNeed.length,
        b.isBidirectional,
        b.distanceKm
      );
      if (bScore !== aScore) return bScore - aScore;
      return b.computedAt - a.computedAt;
    });

    // 4. isTruncated
    const isTruncated = visibleRows.length > MATCH_PAGE_SIZE;
    const pageRows = isTruncated ? visibleRows.slice(0, MATCH_PAGE_SIZE) : visibleRows;

    // 5. user lookup + projection
    const matchedIds = [...new Set(pageRows.map((r) => r.matchedUserId))];
    const others = await Promise.all(matchedIds.map((id) => ctx.db.get(id)));
    const otherById = new Map(
      others.filter((u): u is Doc<"users"> => u !== null).map((u) => [u._id, u])
    );

    const matches: ListMyMatchRow[] = [];
    for (const r of pageRows) {
      const other = otherById.get(r.matchedUserId);
      if (!other) continue;
      if (other.isBanned === true || other.isShadowBanned === true) continue;

      matches.push({
        matchedUserId: r.matchedUserId,
        displayNickname:
          other.displayNickname ?? other.nickname ?? other.name ?? "Anônimo",
        avatarSeed: r.matchedUserId,
        theyHaveINeed: r.theyHaveINeed.slice(0, 5),
        iHaveTheyNeed: r.iHaveTheyNeed.slice(0, 5),
        isBidirectional: r.isBidirectional,
        distanceKm: Math.round(r.distanceKm * 10) / 10,
        layer: r.layer,
        tradePointId: r.tradePointId,
        tradePointSlug: r.tradePointSlug,
        tradePointName: r.tradePointName,
      });
    }

    return { matches, isTruncated };
  },
});
```

---

## Step 5: matches-stats-row.tsx

```typescript
import { Skeleton } from "@workspace/ui/components/skeleton";

type MatchesStatsRowProps = {
  stats: {
    total: number;
    bidirectional: number;
    nearby: number;
    avgDistance: string;
    isApproximate: boolean;
  } | null;
};

const STAT_LABELS = {
  total: "Matches ativos",
  bidirectional: "Mão dupla",
  nearby: "Próximos 5km",
  avg: "Distância média",
} as const;

export function MatchesStatsRow({ stats }: MatchesStatsRowProps) {
  if (stats === null) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[0,1,2,3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
    );
  }

  const items = [
    { label: STAT_LABELS.total, value: stats.total },
    { label: STAT_LABELS.bidirectional, value: stats.bidirectional },
    { label: STAT_LABELS.nearby, value: stats.nearby },
    { label: STAT_LABELS.avg, value: `${stats.avgDistance} km` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-2xl border border-outline-variant/40 bg-surface-container p-4"
          title={stats.isApproximate ? "Aproximado: você tem mais de 5 mil matches." : undefined}
        >
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-headline text-[26px] font-black tabular-nums">
            {stats.isApproximate ? "~" : ""}{value}
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

## Step 6: use-matches-filters.ts (completo)

```typescript
import { useQueryStates, parseAsStringLiteral, parseAsBoolean } from "nuqs";

const tabParser = parseAsStringLiteral(["all", "bidirectional"] as const).withDefault(
  "all"
);
const nearbyParser = parseAsBoolean.withDefault(false);

export function useMatchesFilters() {
  const [{ tab, nearbyOnly }, setFilters] = useQueryStates({
    tab: tabParser,
    nearbyOnly: nearbyParser,
  });

  const setTab = (value: "all" | "bidirectional") => {
    setFilters({ tab: value });
  };

  const setNearbyOnly = (value: boolean) => {
    setFilters({ nearbyOnly: value });
  };

  const clearFilters = () => {
    setFilters({ tab: "all", nearbyOnly: false });
  };

  return { tab, setTab, nearbyOnly, setNearbyOnly, clearFilters };
}
```

---

## Step 7: match-card.tsx (modifications)

### Imports:

```typescript
import { hashString } from "../../lib/hash";
import { NEARBY_KM_THRESHOLD } from "../../lib/constants";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
```

### Remover:

- Imports e usos de `albumCompletionPct` e `confirmedTradesCount`

### Avatar gradient:

```typescript
const AVATAR_GRADIENTS = [
  "from-primary/80 to-secondary/80",
  "from-secondary/80 to-tertiary/80",
  "from-tertiary/80 to-primary/80",
  "from-primary/60 to-tertiary/60",
  "from-secondary/60 to-primary/60",
];

function getAvatarGradient(seed: string): string {
  return (
    AVATAR_GRADIENTS[hashString(seed) % AVATAR_GRADIENTS.length] ?? AVATAR_GRADIENTS[0]
  );
}
```

### StickerLane inline:

```typescript
const MAX_STICKERS_DISPLAY = 8;

function StickerLane({ stickers, label }: { stickers: number[]; label: string }) {
  const sorted = stickers.slice().sort((a, b) => a - b);
  const display = sorted.slice(0, MAX_STICKERS_DISPLAY);
  const overflow = sorted.length - MAX_STICKERS_DISPLAY;

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {display.map((n) => (
          <span key={n} className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            {n}
          </span>
        ))}
        {overflow > 0 && (
          <span className="text-xs text-muted-foreground">+{overflow}</span>
        )}
      </div>
    </div>
  );
}
```

### Link para trade point:

```tsx
<Link href={`/ponto/${match.tradePointSlug}`} prefetch={false}>
  {match.tradePointName}
</Link>
```

### MatchCardActions hide:

```typescript
const hideMatchMutation = useMutation(api.matches.hideMatch);

const onHide = async () => {
  await hideMatchMutation({
    matchedUserId: match.matchedUserId,
    tradePointId: match.tradePointId,
  });
};
```

### Badge "Bem perto":

```tsx
{
  match.distanceKm <= NEARBY_KM_THRESHOLD && <Badge variant="secondary">Bem perto</Badge>;
}
```

---

## Step 8: matches-page-view.tsx

### Imports:

```typescript
import { useMemo } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Toggle } from "@workspace/ui/components/toggle";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import { hashString } from "../../lib/hash";
import { NEARBY_KM_THRESHOLD } from "../../lib/constants";
import { useMatchesFilters } from "../../hooks/use-matches-filters";
import { MatchesStatsRow } from "../components/matches-stats-row";
import { MatchCard } from "../components/match-card";
import type { ListMyMatchRow } from "../../types";
```

### Hook invocation (topo do componente):

```typescript
const { tab, setTab, nearbyOnly, setNearbyOnly, clearFilters } = useMatchesFilters();
```

### Auth check:

```typescript
const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
const canLoadMatches = isAuthenticated && !isAuthLoading;
```

### Queries:

```typescript
const listMatchesResult = useQuery(
  api.matches.listMyMatches,
  canLoadMatches ? (tab === "bidirectional" ? { bidirectionalOnly: true } : {}) : "skip"
);

const matches = listMatchesResult?.matches ?? [];
const isTruncated = listMatchesResult?.isTruncated ?? false;

// Stats são calculados sobre TODOS os matches (independente do tab)
// para evitar números inconsistentes na UI
const matchStats = useQuery(api.matches.getMatchStats, canLoadMatches ? {} : "skip");
```

### Memoization:

```typescript
const TODAY = useMemo(() => new Date().toDateString(), []);

// Stats vem de getMatchStats (totais globais) ou é null enquanto carrega
const stats = useMemo(() => {
  if (matchStats === undefined) return null;
  return {
    total: matchStats.total,
    bidirectional: matchStats.bidirectionalCount,
    nearby: matchStats.nearbyCount,
    avgDistance: matchStats.total === 0 ? "—" : `${matchStats.avgDistanceKm}`,
    isApproximate: matchStats.isApproximate,
  };
}, [matchStats]);

const filteredMatches = useMemo(() => {
  return nearbyOnly
    ? matches.filter((m) => m.distanceKm <= NEARBY_KM_THRESHOLD)
    : matches;
}, [matches, nearbyOnly]);

// bestMatch não depende de stats — só de matches/tab/nearbyOnly
const bestMatch = useMemo(() => {
  if (tab !== "all") return null;
  if (nearbyOnly) return null;
  if (matches.length < 3) return null;
  return getBestMatch(matches, TODAY);
}, [matches, tab, nearbyOnly, TODAY]);
```

### getBestMatch:

```typescript
function getBestMatch(matches: ListMyMatchRow[], today: string): ListMyMatchRow | null {
  if (matches.length < 3) return null;
  const topCandidates = matches.slice(0, 3);
  const withTieBreaker = topCandidates.map((m) => ({
    match: m,
    tieBreaker: hashString(`${m.matchedUserId}_${m.tradePointId}_${today}`) % 997,
  }));
  withTieBreaker.sort((a, b) => a.tieBreaker - b.tieBreaker);
  return withTieBreaker[0]?.match ?? null;
}
```

### Copy:

```typescript
const COPY = {
  empty: {
    noMatches:
      "Você ainda não tem matches. Cadastre suas repetidas e faltantes pra começar a encontrar trocas na sua região.",
    noBidirectional: "Nenhum match mão dupla encontrado.",
    noNearby: "Nenhum match próximo encontrado.",
    noFilter: "Nenhum match com esses filtros.",
    clear: "Limpar filtros",
  },
} as const;
```

### MatchesPageSkeleton (top-level):

```tsx
function MatchesPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-48 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
```

### EmptyFilterCard (top-level):

```tsx
function EmptyFilterCard({
  tab,
  nearbyOnly,
  onClear,
}: {
  tab: "all" | "bidirectional";
  nearbyOnly: boolean;
  onClear: () => void;
}) {
  const message =
    tab === "bidirectional"
      ? COPY.empty.noBidirectional
      : nearbyOnly
        ? COPY.empty.noNearby
        : COPY.empty.noFilter;

  return (
    <Card className="p-6 text-center">
      <p className="text-muted-foreground">{message}</p>
      <Button variant="link" onClick={onClear}>
        {COPY.empty.clear}
      </Button>
    </Card>
  );
}
```

### FeaturedMatchFrame (top-level):

```tsx
function FeaturedMatchFrame({
  children,
  displayNickname,
  distanceKm,
}: {
  children: React.ReactNode;
  displayNickname: string;
  distanceKm: number;
}) {
  return (
    <div
      className="relative"
      aria-label={`Melhor match do dia: ${displayNickname}, ${distanceKm}km`}
    >
      <Badge variant="secondary" className="absolute -top-3 left-4 z-10">
        Melhor match
      </Badge>
      <div className="rounded-2xl bg-gradient-to-br from-secondary/20 via-card to-primary/10 p-px">
        <div className="rounded-[calc(1rem-1px)] bg-card">{children}</div>
      </div>
    </div>
  );
}
```

### MatchesInsightBox (top-level):

```tsx
function MatchesInsightBox() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Lightbulb className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Quer mais matches?</p>
          <p className="text-sm text-muted-foreground">
            Cadastre mais figurinhas repetidas e faltantes.
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/cadastrar-figurinhas/quick">Cadastrar</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Layout:

```tsx
{
  /* Loading inicial */
}
{
  listMatchesResult === undefined && <MatchesPageSkeleton />;
}

{
  /* Zero matches absoluto */
}
{
  listMatchesResult !== undefined &&
    matches.length === 0 &&
    tab === "all" &&
    !nearbyOnly && (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">{COPY.empty.noMatches}</p>
        <Button asChild className="mt-4">
          <Link href="/cadastrar-figurinhas/quick">Cadastrar figurinhas</Link>
        </Button>
      </Card>
    );
}

{
  /* Matches existem */
}
{
  listMatchesResult !== undefined && matches.length > 0 && (
    <>
      <MatchesStatsRow stats={stats} />

      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "all" | "bidirectional")}>
          <TabsList>
            <TabsTrigger value="all">Todos {stats && `(${stats.total})`}</TabsTrigger>
            <TabsTrigger value="bidirectional">
              Mão dupla {stats && `(${stats.bidirectional})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <Toggle pressed={nearbyOnly} onPressedChange={setNearbyOnly}>
          Próximos {NEARBY_KM_THRESHOLD}km {stats && `(${stats.nearby})`}
        </Toggle>
      </div>

      {bestMatch && (
        <FeaturedMatchFrame
          displayNickname={bestMatch.displayNickname}
          distanceKm={bestMatch.distanceKm}
        >
          <MatchCard
            key={`${bestMatch.matchedUserId}-${bestMatch.tradePointId}`}
            match={bestMatch}
          />
        </FeaturedMatchFrame>
      )}

      {filteredMatches.length === 0 && (
        <EmptyFilterCard tab={tab} nearbyOnly={nearbyOnly} onClear={clearFilters} />
      )}

      {filteredMatches.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMatches
            .filter(
              (m) =>
                !(
                  bestMatch &&
                  m.matchedUserId === bestMatch.matchedUserId &&
                  m.tradePointId === bestMatch.tradePointId
                )
            )
            .map((match) => (
              <MatchCard
                key={`${match.matchedUserId}-${match.tradePointId}`}
                match={match}
              />
            ))}
        </div>
      )}

      {filteredMatches.length > 0 && stats !== null && <MatchesInsightBox />}
    </>
  );
}

{
  /* Zero matches filtrado (fora do bloco matches > 0) */
}
{
  listMatchesResult !== undefined &&
    matches.length === 0 &&
    (tab !== "all" || nearbyOnly) && (
      <EmptyFilterCard tab={tab} nearbyOnly={nearbyOnly} onClear={clearFilters} />
    );
}
```

---

## Verification

1. `pnpm --filter web type-check`
2. `pnpm --filter backend convex dev`
3. Navigate `/matches` logged in
4. **Loading inicial:** Skeleton inline
5. Stats: 4 cards, "~" + `title` tooltip if isApproximate
6. **Stats consistente entre tabs:** Número total de matches é SEMPRE o mesmo, independente de estar em tab "Todos" ou "Mão dupla"
7. **Network tab:**
   - (a) conta com <50 matches → 1 request `getMatchStats`, 0 request quando toggle tab (stats já carregado)
   - (b) conta com >50 matches → 1 request `getMatchStats`
8. Tab "Mão dupla": URL → `?tab=bidirectional`, refaz query `listMyMatches` com `bidirectionalOnly: true`
9. Toggle "Próximos 5km" com count dinâmico
10. F5 com URL params: state restored
11. Featured: tab=all, nearby=false, >=3 matches
12. Hide match: grid revalida automaticamente
13. **Zero absoluto vs filtrado:**
    - tab=all + nearbyOnly=false + 0 matches → CTA
    - tab=bidirectional + 0 matches → EmptyFilterCard
14. Grep blacklist: zero matches em código
15. **Dedup featured:** match A featured, match B no grid
16. **displayNickname fallback:** "Anônimo"
17. **Unit sanity:** `computeMatchScore(5, 5, true, 2)` === `1013`
