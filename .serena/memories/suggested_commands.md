---
name: Suggested Commands
description: Essential commands for developing code in this project
type: project
---

## Development Setup

```bash
# Install dependencies
pnpm install

# Verify environment and setup Convex backend
cd packages/backend
pnpm setup  # Creates deployment and .env.local

# Copy appropriate environment config
pnpm env:dev    # DEV environment
pnpm env:prod   # PROD environment
```

## Running the Project

```bash
# Full monorepo in dev mode
pnpm dev

# Full monorepo with specific environment
pnpm dev:local  # Uses DEV environment
pnpm dev:prod   # Uses PROD environment

# Individual packages
pnpm -F web dev         # Frontend only
pnpm -F web build       # Frontend production build
pnpm -F web typecheck   # Type checking
pnpm -F backend dev     # Backend only (Convex)
```

## Code Quality

```bash
# Linting
pnpm lint           # Check ESLint across workspace
pnpm -F web lint:fix # Fix ESLint issues in frontend

# Formatting
pnpm format         # Format all files with Prettier

# Type checking
pnpm -F web typecheck  # Check TypeScript errors
```

## Database & Backend

```bash
# From packages/backend directory
pnpm setup                          # Initial setup
npx convex dev --env-file .env.dev  # DEV environment
npx convex dev --env-file .env.prod # PROD environment
npx convex run seedAlbumConfig:seedAlbumConfig  # Seed initial data (countries)
npx convex deploy                   # Deploy to production
```

## Building for Production

```bash
# Build all packages
pnpm build

# Build specific package
pnpm -F web build
pnpm -F backend build
```

## Environment Switching

```bash
# These copy .env.dev or .env.prod to .env.local
pnpm env:dev   # Prepare for DEV environment
pnpm env:prod  # Prepare for PROD environment

# Then start development
pnpm dev
```

## Useful Shortcuts

```bash
# Reset and clean everything
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Kill all running processes on port 3002 (frontend)
lsof -i :3002 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

## Git Workflow

```bash
# View recent commits
git log --oneline -10

# Check status before committing
git status

# Create new branch
git checkout -b feat/description

# Lint and format before commit
pnpm lint
pnpm format
```
