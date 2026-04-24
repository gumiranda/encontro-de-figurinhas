## Approach

- Think before acting. Read existing files before writing code.
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
