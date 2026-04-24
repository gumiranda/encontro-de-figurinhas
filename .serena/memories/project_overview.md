---
name: Project Overview
description: High-level understanding of Encontro de Figurinhas project
type: project
---

## Project Purpose

**Encontro de Figurinhas** is a full-stack SaaS web application for trading World Cup collectible cards (figurinhas). It's a platform that helps users find and trade collectible cards, manage their collections, and locate trade points (physical locations where trading happens).

## Tech Stack

### Frontend (apps/web)
- **Framework:** Next.js 16.2.4 with App Router
- **Language:** TypeScript 5.9
- **Styling:** Tailwind CSS 4.1 + shadcn/ui (51+ components)
- **Auth:** Clerk v7.2.3
- **State Management:** Jotai v2.13.1
- **Forms:** React Hook Form + Zod validation
- **Backend Communication:** Convex Client
- **Geolocation:** Leaflet + react-leaflet with marker clustering
- **UI Utilities:** Lucide React icons, Sonner toasts, date-fns
- **Avatar Generation:** @dicebear/core

### Backend (packages/backend)
- **Runtime:** Convex (serverless backend + real-time DB)
- **Auth:** Clerk Backend SDK v2.10.1
- **Validation:** Zod v3.25.76
- **Rate Limiting:** @convex-dev/rate-limiter
- **Utilities:** convex-helpers

### Monorepo Tools
- **Package Manager:** pnpm 10.17.0
- **Monorepo Build:** Turborepo 2.5.5
- **Code Quality:** ESLint 9.32.0, Prettier 3.6.2
- **Config Sharing:** workspace packages for eslint-config and typescript-config

### Shared UI (packages/ui)
- 51+ shadcn/ui components
- Shared hooks and utilities

## Code Organization

```
encontro-de-figurinhas/
├── apps/
│   └── web/                          # Next.js frontend
│       ├── app/
│       │   ├── (app)/               # Main app routes
│       │   ├── (marketing)/         # Landing/marketing pages
│       │   ├── (arena)/             # Trade/swap features
│       │   ├── (auth)/              # Auth flows
│       │   ├── (dashboard)/         # Admin/user dashboard
│       │   └── api/                 # API routes (IP location, icons, etc)
│       ├── components/              # App-specific components
│       ├── modules/                 # Feature modules
│       ├── hooks/                   # Custom hooks
│       └── lib/                     # Utilities
│
├── packages/
│   ├── backend/                     # Convex backend
│   │   └── convex/
│   │       ├── schema.ts            # DB schema
│   │       ├── lib/                 # Shared backend utilities
│   │       └── *.ts                 # Query/mutation functions
│   ├── ui/                          # Shared shadcn components
│   ├── eslint-config/               # Shared ESLint rules
│   └── typescript-config/           # Shared TypeScript config
│
├── docs/                            # Project documentation
└── skills/                          # Custom AI skills
```

## Key Features

1. **User Authentication** - Clerk-based sign-up/sign-in with social login
2. **User Approval System** - New users pending approval from superadmin
3. **Role-Based Access** - SUPERADMIN, CEO, USER roles with granular permissions
4. **Card/Figurinha Management** - Users can register their collection
5. **Trading System** - Find matches and manage trades/swaps
6. **Trade Points** - Map-based interface to find physical trading locations
7. **Location Services** - IP-based location detection, geolocation queries
8. **Landing Pages** - Marketing pages for countries, cities, figurinhas
9. **Blog System** - Educational content about the World Cup

## Data Model

- **users** table: User profiles, roles, approval status
- Additional tables likely for: figurinhas (cards), trades, trade points, albums, etc.

## Node Version
- Minimum: Node 20
- Recommended: Latest LTS

## Important Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Production build all packages |
| `pnpm lint` | Run ESLint across workspace |
| `pnpm format` | Format with Prettier |
| `pnpm env:dev` / `pnpm env:prod` | Switch environments |
| `pnpm -F web dev` | Run frontend only |
