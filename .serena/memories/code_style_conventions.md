---
name: Code Style & Conventions
description: Coding standards, patterns, and conventions used in the project
type: feedback
---

## TypeScript Configuration

- **strict mode:** Enabled
- **target:** ES2020+
- **module:** ESNext
- **types:** Include Node types for backend

## Component Structure

### Frontend Components (React)
- Functional components with hooks (no class components)
- Use TypeScript interfaces for props
- Follow Next.js App Router conventions
- Use shadcn/ui components as primary UI library
- Apply Tailwind CSS utilities (not pure Tailwind - use shadcn)
- Use `cn()` utility from `@workspace/ui/lib/utils` for conditional classes

### Backend Functions (Convex)
- Export queries and mutations as default exports
- Use Zod for schema validation
- Leverage Convex's built-in auth with Clerk JWT integration
- Use convex-helpers for common patterns

## File Naming

- Components: `CamelCase` (e.g., `UserCard.tsx`)
- Hooks: `camelCase` starting with `use` (e.g., `useUserProfile.ts`)
- Utilities: `camelCase` (e.g., `formatDate.ts`)
- Pages: Match URL structure (dynamic routes use `[param]`)
- Directories: `kebab-case` for route groups, feature folders

## Formatting

- **Prettier:** Automatic formatting on save/commit
- **Line Length:** Prettier default (80 chars)
- **Quotes:** Double quotes (Prettier default)
- **Semicolons:** Always present
- **Trailing Commas:** ES5 style (Prettier default)

## Linting Rules

- ESLint config from `@workspace/eslint-config`
- Next.js specific rules via `eslint-config-next`
- Must pass: `pnpm lint` before committing

## Import Organization

- External packages first (React, Next, third-party libs)
- Workspace packages (`@workspace/...`)
- Relative imports last (components, utils, types)

## No Unnecessary Abstractions

Per CLAUDE.md guidance:
- Keep code simple and direct
- Don't abstract until there's actual duplication (3+ similar lines)
- Don't add error handling for impossible scenarios
- Trust framework guarantees
- Only validate at system boundaries (user input, external APIs)

## Comments Policy

- Default to no comments
- Only add when WHY is non-obvious (hidden constraints, workarounds, invariants)
- Don't document WHAT (good naming handles this)
- Don't reference current task or issue numbers
