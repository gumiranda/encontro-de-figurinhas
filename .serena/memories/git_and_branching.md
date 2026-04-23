---
name: Git & Branching Guidelines
description: Git workflow, commit conventions, and branching strategy
type: project
---

## Current State

- **Main branch:** `main`
- **Current branch:** `aula7` (feature/development branch)
- **Recent work:** Landing page enhancements, component styling, new features

## Commit Message Format

Follow conventional commits:

```
type(scope): short description

Optional body with more details

Optional footer (e.g., Fixes #123)
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style/formatting (no logic change)
- `refactor` - Code restructuring without feature change
- `test` - Test additions/changes
- `chore` - Build, dependencies, tooling

### Examples
```
feat(landing): add new hero section with animations
fix(auth): resolve Clerk token validation issue
docs(backend): update Convex schema documentation
refactor(components): simplify Card component styling
```

## Branching Strategy

Feature branches from `main`:
- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

Example: `feat/landing-page-redesign`

## Workflow

1. Create branch: `git checkout -b feat/your-feature`
2. Make changes
3. Run checks:
   ```bash
   pnpm lint
   pnpm format
   ```
4. Commit: `git commit -m "feat(scope): description"`
5. Push: `git push origin feat/your-feature`
6. Create Pull Request to `main`

## Important Notes

- **Never commit .env.local files** - These contain secrets
- **Run linting before commit** - Project enforces code quality
- **Push frequently** - Avoid large isolated branches
- **Small PRs preferred** - Easier to review and merge
