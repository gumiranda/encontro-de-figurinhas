# Code Repetition Patterns Analysis: Convex Backend

## 1. Query Patterns (.withIndex().filter() Analysis)

### Findings
**NO `.withIndex().filter()` pattern found.** The codebase uses `.withIndex()` with a callback that calls `q.eq()`, `q.gt()`, etc., NOT a separate `.filter()` chain.

**Pattern Used Instead:**
```typescript
// Standard pattern (NOT using filter)
.withIndex("by_user_active", (q) => q.eq("userId", userId).gt("expiresAt", Date.now()))
```

**Assessment:** No abstraction opportunity here; pattern is already clean and idiomatic for Convex.

---

## 2. Take Limits Analysis

### Hardcoded .take() Values Found (30+ instances)

**CRITICAL FINDING: Inconsistent limits with NO consolidation.**

Most common hardcoded values:
- **5000** appears 6+ times (cities.ts, states.ts)
- **500** appears 4 times (matches.ts:156,161,244; userMatchInteractions.ts)
- **20** appears 3 times (blog.ts:185, checkins.ts:51, stickers.ts:57)
- **50** appears multiple times (blog.ts:17,50; cities.ts; tradePoints.ts)
- **11** in trades.ts with NO semantic name

### Critical Issues
1. `.take(5000)` — cities.ts:170,191; states.ts:57,147,191 — used 6x, NOT in constants
2. `.take(500)` — matches.ts:156,161,244; userMatchInteractions.ts — used 4x, NO constant
3. `.take(20)` — blog.ts:185, checkins.ts:51, stickers.ts:57 — DUPLICATED (same limit, 3 places)
4. `.take(100)` — checkins.ts:50, tradePoints.ts:618 — orphan hardcodes
5. `.take(11)` — trades.ts — unique value with NO semantic constant name

### Recommended Constants (lib/limits.ts)
```typescript
// Add to lib/limits.ts
export const SEARCH_RESULTS_LIMIT = 15;           // cities search
export const SMALL_BATCH_SIZE = 20;               // active checkins, recent items
export const MEDIUM_BATCH_SIZE = 50;              // featured, cities list
export const MATCHES_BATCH_SIZE = 500;            // precomputed matches, interactions
export const LARGE_BATCH_SIZE = 5000;             // batch exports, state sync
export const EXPORT_BATCH_SIZE = 1000;            // user export subset
export const TRADE_PREVIEW_LIMIT = 11;            // trades list preview
```

### File:Line References (Hardcoded .take values)
```
blog.ts:17                  .take(limit ?? 50)
blog.ts:185                 .take(20)
blog.ts:~50                 .take(50)
checkins.ts:50              .take(100)
checkins.ts:51              .take(20)
cities.ts:15                .take(15)
cities.ts:50                .take(50)
cities.ts:170               .take(5000)
cities.ts:176               .take(1000)
cities.ts:~180              .take(10000)
cities.ts:~200              .take(500)
matches.ts:156              .take(500)
matches.ts:161              .take(500)
matches.ts:244              .take(500)
states.ts:57                .take(5000)
states.ts:147               .take(CAP_TRADE_POINTS_PER_CITY) ✓
states.ts:191               .take(5000)
stickers.ts:57              .take(20)
tradePoints.ts:618          .take(100)
trades.ts:~200              .take(11)
userMatchInteractions.ts    .take(500)
userTradePoints.ts:~150     .take(CHECKINS_FETCH_CAP) ✓
```

---

## 3. Denorm Sync Patterns

### Pattern Identified: "Reactive Denormalization"

Only **1 main sync function** identified:

**`syncActiveCheckinsStickerSnapshot()`** (stickers.ts:40-71)
- Called from: stickers.ts:184, stickers.ts:254
- Purpose: Update denormalized fields on active checkins when user profile changes
- Fields updated: `displayNickname`, `avatarSeed`, `duplicates`

Code snippet:
```typescript
async function syncActiveCheckinsStickerSnapshot(
  ctx: MutationCtx,
  userId: Id<"users">,
  user: Doc<"users">,
  duplicates: number[]
) {
  const activeCheckin = await getActiveCheckin(ctx, userId);
  if (!activeCheckin) return;

  const activeCheckins = await ctx.db
    .query("checkins")
    .withIndex("by_user_active", (q) =>
      q.eq("userId", userId).gt("expiresAt", Date.now())
    )
    .take(20);  // <-- HARDCODED, DUPLICATED (also checkins.ts:51)

  const denorm = buildCheckinDenormFields({ ...user, duplicates });

  const needsPatch = activeCheckins.filter(
    (c) =>
      !arraysEqual(c.duplicates ?? [], duplicates) ||
      c.displayNickname !== denorm.displayNickname ||
      c.avatarSeed !== denorm.avatarSeed
  );

  if (needsPatch.length === 0) return;

  await Promise.all(
    needsPatch.map((c) => ctx.db.patch(c._id, denorm))
  );
}
```

### Related: Backfill Pattern (checkins.ts:561-596)
```typescript
export const backfillCheckinDenormFields = internalMutation({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, { cursor }) => {
    const page = await ctx.db
      .query("checkins")
      .withIndex("by_expiresAt", (q) => q.gt("expiresAt", now))
      .paginate({ numItems: BACKFILL_BATCH, cursor: cursor ?? null });

    const needsBackfill = page.page.filter(
      (c) =>
        c.displayNickname === undefined ||
        c.avatarSeed === undefined ||
        c.duplicates === undefined
    );

    // ... patch logic, then reschedule if !page.isDone
  },
});
```

### buildCheckinDenormFields() (lib/checkinHelpers.ts)
```typescript
export function buildCheckinDenormFields(user: Doc<"users">) {
  return {
    displayNickname:
      user.displayNickname ?? user.nickname ?? user.name ?? "Colecionador",
    avatarSeed: user.nickname ?? user._id,
    duplicates: user.duplicates ?? [],
    userMissing: user.missing ?? [],
    albumCompletionPct: user.albumCompletionPct ?? 0,
    totalTrades: user.totalTrades ?? 0,
    isPremium: user.isPremium ?? false,
    isVerified: user.isVerified ?? false,
  };
}
```

### Abstraction Opportunity
Could extract generic pattern to lib/denormHelpers.ts — but only 1 active usage (stickers.ts). Low ROI now, but SHOULD be created for future denorm syncs when user profile edits cascade.

---

## 4. Existing Helper/Lib Files

### Current Structure
```
packages/backend/convex/
  _helpers/
    └── pagination.ts         # rescheduleIfMore() for chunked async ops

  lib/
    ├── checkinHelpers.ts     # buildCheckinDenormFields(), readNormalizer()
    ├── constants.ts          # DEFAULT_TOTAL_STICKERS
    ├── limits.ts             # User point caps (FREE_USER_MAX_POINTS, PREMIUM_USER_MAX_POINTS)
    ├── tradeHelpers.ts       # Trade-specific logic
    ├── utils.ts              # Generic utilities
    ├── types.ts              # Type definitions
    ├── auth.ts               # Auth helpers
    ├── geo.ts                # Geographic helpers
    ├── rateLimit.ts          # Rate limiting
    └── [10 other specialized helpers]
```

### Key Observations

1. **limits.ts exists but is INCOMPLETE**
   - Contains only user point caps, NOT batch sizes
   - Should be expanded to include all .take() limits

2. **No centralized batch size constants**
   - 30+ hardcoded .take() values scattered across 12+ files
   - Makes changes non-local (e.g., tuning batch size requires N file edits)

3. **No denormalization helpers**
   - syncActiveCheckinsStickerSnapshot() in stickers.ts is standalone
   - buildCheckinDenormFields() in checkinHelpers.ts
   - Could be unified in lib/denormHelpers.ts

4. **pagination.ts is minimal**
   - Only has rescheduleIfMore() helper
   - Convex SDK has .paginate(), so this is adequate but could be extended

### Missing/Weak Areas

| Needed | Current Status | Gap Level |
|--------|---|---|
| Batch size constants | Hardcoded across 15 files | **HIGH** |
| Denorm sync pattern | 1 impl in stickers.ts | **MEDIUM** |
| Pagination helpers | Only rescheduleIfMore() | **LOW** |
| Query builder patterns | None | **MEDIUM** |

---

## 5. Refactoring Recommendations (Priority Order)

### IMMEDIATE (High ROI)
1. **Extract batch size constants to lib/limits.ts** (15-20 min)
   - Add: `SEARCH_RESULTS_LIMIT`, `SMALL_BATCH_SIZE`, `MEDIUM_BATCH_SIZE`, `MATCHES_BATCH_SIZE`, `LARGE_BATCH_SIZE`, etc.
   - Replace 30+ hardcoded .take() values
   - Files affected: blog.ts, checkins.ts, cities.ts, matches.ts, states.ts, stickers.ts, tradePoints.ts, trades.ts, userMatchInteractions.ts, userTradePoints.ts, reports.ts

2. **Create lib/queryHelpers.ts** (optional, nice-to-have)
   - Add `withLimitedTake(limit: number)` wrapper if pattern re-appears
   - Currently not needed — Convex pattern is clean

### NEAR-TERM (Medium ROI)
3. **Create lib/denormHelpers.ts** (future-proofing)
   - Move `buildCheckinDenormFields()` import from checkinHelpers
   - Add generic `syncDenormFields()` abstraction for reuse
   - Call from stickers.ts sync functions

4. **Unify pagination pattern** (optional)
   - backfillCheckinDenormFields and backfillTradePointType share same structure
   - Could extract to `paginatedBatchMutation()` in _helpers/pagination.ts
   - Saves ~15 lines duplication

### DEFER (Nice to have)
5. **Query index pattern documentation**
   - No .withIndex().filter() pattern found — pattern is already clean
   - Could document standard pattern in lib comments for future devs

---

## Summary Table

| Pattern | Count | Abstraction Exists? | Priority | Recommendation |
|---------|-------|-------------------|----------|-----------------|
| Hardcoded .take() limits | 30+ | NO | IMMEDIATE | Create lib/limits.ts constants |
| Denorm sync on parent change | 1 active + backfills | PARTIAL | NEAR-TERM | Add lib/denormHelpers.ts |
| Paginated batch mutations | 2 (matches.ts, checkins.ts) | NO | DEFER | Extract to _helpers/pagination.ts |
| .withIndex() queries | 50+ | NO (pattern clean) | DEFER | Document, don't abstract |

---

## Files to Create/Modify

1. **lib/limits.ts** — MODIFY: Add batch constants (20+ new exports)
2. **lib/denormHelpers.ts** — NEW: Denorm sync abstraction (future use)
3. **lib/queryHelpers.ts** — OPTIONAL: Query helpers (not urgent)
4. **_helpers/pagination.ts** — OPTIONAL EXTEND: Batch mutation wrapper
5. **12+ files** — UPDATE: Replace hardcoded .take() with constants

### Estimated Impact
- **Lines saved:** 30-50 lines (less duplication)
- **Maintenance:** Batch sizes change in 1 place, not 12
- **Future-proof:** Next denorm cascade reuses lib/denormHelpers.ts
