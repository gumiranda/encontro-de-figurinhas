## Approach

- Think before acting. Read existing files before writing code.
- NEVER CREATE BACKFILLS, THIS APP IS PRE-PROD
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- NEVER COMMIT THE FILES.
- Do not re-read files you have already read unless the file may have changed.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct.
- User instructions always override this file.
- Jamais usar tailwind puro. usar sempre shadcn ui

## Bundle Analysis

To measure bundle size impact of optimizations:

```bash
# Install analyzer
npm install --save-dev @next/bundle-analyzer --workspace=web

# Run analysis on web build
ANALYZE=true npm run build --workspace=web

# Browser opens with interactive report showing:
# - Chart with largest bundles
# - Click to expand and see module breakdown
# - Identify heavy dependencies (Leaflet, dicebear, etc.)
```

Key libraries to watch:

- **Leaflet**: 500KB+ (lazy-load via dynamic() for /arena, /map routes)
- **dicebear**: 50KB (lazy-load for avatar pages only)
- **react-leaflet-cluster**: 30KB (part of map bundle)
- **Convex**: 100KB (core, must be in main bundle)
- **React**: bundled with Next.js

# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
