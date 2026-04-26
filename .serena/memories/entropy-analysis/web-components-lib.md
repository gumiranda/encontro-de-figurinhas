# Entropy Analysis: apps/web/components & apps/web/lib

## CRITICAL FINDINGS - Dead Code

### Unused Library Files (0 references - DELETE)
1. **`apps/web/lib/memo-patterns.ts`** (138 lines, 3.4KB)
   - 8 memoization utility functions - NEVER USED
   - Verdict: DELETE

2. **`apps/web/lib/lazy-load-patterns.tsx`** (168 lines, 4.4KB)
   - 7 lazy-loading utilities - NEVER USED
   - Verdict: DELETE

3. **`apps/web/lib/states.ts`** (40 lines, 871b)
   - 1 reference only (likely smoke test)
   - Review before deletion

### Unused Components (0 imports - DELETE)
- `hub-search.tsx` - 0 references
- `overdrive/confetti-burst.tsx` - 0 references
- `related-points.tsx` - 0 references

Total: 3 components + 2 lib files = ~400 lines of dead code

---

## High-Impact Consolidation: PROVIDERS DUPLICATION

### Current State
Two identical provider files with duplicate convex initialization:

**providers.tsx** (42 lines):
- Used in: (arena), (auth), (dashboard) layouts
- Content: Clerk + ConvexProviderWithClerk + custom ConvexClerkBridge
- Convex init: 8 identical lines

**public-providers.tsx** (19 lines):
- Used in: (marketing) layout
- Content: ConvexProvider only (no Clerk)
- Convex init: 8 identical lines (DUPLICATE)

### Problems
1. Code duplication (convex initialization in both)
2. Cognitive friction: "which provider do I import?"
3. Maintenance risk: convex config changes require 2 edits
4. Could consolidate to ~35 lines vs current 61

### Solution
Merge into single `providers.tsx` with conditional logic:
- Keep deprecated `PublicProviders` export for compatibility
- Single convex client initialization
- Save 26 lines + eliminate confusion

---

## Single-Use Components (11 total)

Components used only 1x - candidates for module-level colocating:

**Delight suite (5):**
- celebrate-toast, confetti, delightful-empty-state, loading-messages, success-checkmark
- Mostly internal dependencies (index.ts re-exports)
- Exception: celebrate-toast used in trade-points module

**Overdrive suite (1):**
- arena-particles (used 1x in landing/arena-visual-client)

**Root-level (5):**
- cities-hub-client, cities-map, related-stickers, stickers-hub-client
- Each used exactly 1x
- Consider moving to their consuming modules

---

## Healthy Components (properly shared)
✓ JsonLd (20 imports) - SEO across pages
✓ FullPageLoader (6 imports) - Loading state shared
✓ Providers (3 imports) - Layout wrapper
✓ Breadcrumbs (3 imports) - Navigation shared

**Status:** No modules/shared/ui/components found - no overlap detected

---

## Entropy Reduction Summary
- Remove: 2 unused lib files (8.8KB)
- Remove: 3 unused components (~400 lines)
- Consolidate: 2 provider files → 1 file (-26 lines)
- Review: 11 single-use components for relocation
- **Total: ~9.2KB removed, 1 file eliminated, cognitive load reduced**

Priority: 🔴 Delete memo-patterns.ts, lazy-load-patterns.tsx
Priority: 🟡 Merge providers, audit single-use components