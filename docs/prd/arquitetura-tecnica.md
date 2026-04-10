# Arquitetura Técnica

**Stack:** Next.js 15.4 (App Router) + Convex + Clerk + TypeScript + Leaflet/OpenStreetMap + Turborepo + pnpm. PWA.

**Monorepo:** `apps/web` (Next.js), `packages/backend` (Convex). Features organizadas como `modules/[feature]/ui/components/`.

### 5.1 Schema Convex

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cities: defineTable({
    name: v.string(),
    state: v.string(),
    slug: v.string(),
    lat: v.float64(),
    lng: v.float64(),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_state", ["state"])
    .searchIndex("search_name", { searchField: "name" }),

  tradePoints: defineTable({
    name: v.string(),
    address: v.string(),
    cityId: v.id("cities"),
    lat: v.float64(),
    lng: v.float64(),
    whatsappLink: v.optional(v.string()),
    whatsappLinkStatus: v.union(
      v.literal("active"),
      v.literal("reported"),
      v.literal("invalid")
    ),
    suggestedHours: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("suspended"),
      v.literal("inactive")
    ),
    rejectionReason: v.optional(v.string()),
    requestedBy: v.id("users"),
    confidenceScore: v.float64(), // 0-10, decai -1/24h sem atividade
    lastActivityAt: v.number(), // timestamp do último check-in
    peakHours: v.optional(v.array(v.number())), // horas mais movimentadas (0-23)
    confirmedTradesCount: v.number(),
    reportCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_city_status", ["cityId", "status"])
    .index("by_status", ["status"])
    .index("by_requestedBy", ["requestedBy"]),

  users: defineTable({
    clerkId: v.string(),
    name: v.string(), // apelido público, único
    birthDate: v.string(), // ISO date
    ageGroup: v.union(
      v.literal("child"), // <12
      v.literal("teen"), // 12-15
      v.literal("young"), // 16-17
      v.literal("adult") // 18+
    ),
    guardianName: v.optional(v.string()),
    guardianEmail: v.optional(v.string()),
    parentalConsentAt: v.optional(v.number()), // timestamp
    cityId: v.id("cities"),
    lat: v.optional(v.float64()),
    lng: v.optional(v.float64()),
    locationSource: v.optional(
      v.union(v.literal("gps"), v.literal("manual"), v.literal("ip"))
    ),
    // Álbum — arrays numéricos, NÃO documentos separados
    duplicates: v.array(v.number()), // números que tenho repetidas
    missing: v.array(v.number()), // números que preciso
    albumProgress: v.number(), // % calculado
    totalStickersOwned: v.number(), // total coladas
    // Gamificação e reputação
    totalTrades: v.number(),
    reliabilityScore: v.float64(), // 0-10
    isShadowBanned: v.boolean(),
    isBanned: v.boolean(),
    warningCount: v.number(),
    // Monetização
    isPremium: v.boolean(),
    premiumExpiresAt: v.optional(v.number()),
    boostExpiresAt: v.optional(v.number()),
    // Meta
    lastActiveAt: v.number(),
    pushSubscription: v.optional(v.string()), // JSON do PushSubscription
    hasSeenSafetyTips: v.boolean(),
    hasCompletedOnboarding: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_city", ["cityId"])
    .index("by_name", ["name"]),

  userTradePoints: defineTable({
    userId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    joinedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tradePoint", ["tradePointId"])
    .index("by_user_point", ["userId", "tradePointId"]),

  checkins: defineTable({
    userId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    lat: v.float64(),
    lng: v.float64(),
    distanceMeters: v.number(), // distância do ponto no momento do check-in
    expiresAt: v.number(), // +2 horas
    createdAt: v.number(),
  })
    .index("by_tradePoint_active", ["tradePointId", "expiresAt"])
    .index("by_user", ["userId"]),

  precomputedMatches: defineTable({
    userId: v.id("users"),
    matchedUserId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    theyHaveINeed: v.array(v.number()),
    iHaveTheyNeed: v.array(v.number()),
    isBidirectional: v.boolean(),
    distanceKm: v.float64(),
    layer: v.union(v.literal(1), v.literal(2), v.literal(3)),
    computedAt: v.number(),
  })
    .index("by_user_layer", ["userId", "layer"])
    .index("by_user_point", ["userId", "tradePointId"])
    .index("by_matchedUser", ["matchedUserId"]),

  trades: defineTable({
    userA: v.id("users"),
    userB: v.id("users"),
    tradePointId: v.id("tradePoints"),
    stickersAGave: v.array(v.number()),
    stickersBGave: v.array(v.number()),
    status: v.union(
      v.literal("pending_confirmation"),
      v.literal("confirmed"),
      v.literal("cancelled")
    ),
    confirmedByA: v.boolean(),
    confirmedByB: v.boolean(),
    createdAt: v.number(),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_userA", ["userA"])
    .index("by_userB", ["userB"])
    .index("by_tradePoint", ["tradePointId"])
    .index("by_status", ["status"]),

  reports: defineTable({
    reporterId: v.id("users"),
    targetUserId: v.optional(v.id("users")),
    tradePointId: v.optional(v.id("tradePoints")),
    category: v.union(
      v.literal("suspicious_behavior"),
      v.literal("private_contact_attempt"),
      v.literal("minor_approach"),
      v.literal("inappropriate_content"),
      v.literal("broken_whatsapp_link"),
      v.literal("inactive_point"),
      v.literal("other")
    ),
    description: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("reviewing"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    adminNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_tradePoint", ["tradePointId"])
    .index("by_targetUser", ["targetUserId"]),

  albumConfig: defineTable({
    totalStickers: v.number(), // 980
    totalBase: v.number(), // ex: 887 (base sem extras)
    sections: v.array(
      v.object({
        name: v.string(),
        startNumber: v.number(),
        endNumber: v.number(),
        isExtra: v.boolean(), // true para "Extra Stickers"
      })
    ),
    specialNumbers: v.array(
      v.object({
        number: v.number(),
        category: v.union(
          v.literal("metalizada"),
          v.literal("legend"),
          v.literal("paralela_bronze"),
          v.literal("paralela_prata"),
          v.literal("paralela_ouro")
        ),
      })
    ),
    version: v.number(), // incrementável
    year: v.number(),
    updatedAt: v.number(),
  }),
});
```

### 5.2 Limites do Convex a respeitar

| Limite                          | Valor                             | Impacto                                          |
| ------------------------------- | --------------------------------- | ------------------------------------------------ |
| Documentos escaneados/transação | 32.000                            | Matching pré-computado evita estouro             |
| Ranges de índice/transação      | 4.096                             | Batch de 100 membros por iteração                |
| Timeout query/mutation          | 1 segundo                         | Leitura de matches pré-computados é O(1)         |
| Timeout action                  | 10 minutos                        | Recomputação de matches cabe aqui                |
| Tamanho do documento            | 1 MiB                             | Arrays de 980 ints = ~8 KB, OK                   |
| Índices por tabela              | 32                                | Schema atual usa ≤5 por tabela, OK               |
| Free tier                       | 500 MiB storage, 1M calls/mês     | Suficiente para ~5k usuários                     |
| Starter                         | Pay-as-you-go                     | Custo incremental com escala                     |
| Pro                             | $25/membro/mês, 50 GiB, 25M calls | Aplicar ao Convex Startup Program (1 ano grátis) |

### 5.3 Cron jobs

```typescript
// convex/crons.ts
import { cronJobs } from "convex/server";

const crons = cronJobs();

// Decaimento do Confidence Score: -1 para pontos sem atividade nas últimas 24h
crons.interval("decayConfidenceScores", { hours: 1 }, "internal:decayScores");

// Expirar check-ins antigos (>2h)
crons.interval("expireCheckins", { minutes: 30 }, "internal:expireCheckins");

// Recomputar matches de usuários ativos (lastActiveAt < 6h) em batches
crons.interval("batchRecomputeMatches", { hours: 6 }, "internal:batchRecompute");

// Marcar pontos com confidenceScore 0 por 7 dias como "inactive"
crons.daily(
  "deactivateStalePoints",
  { hourUTC: 3, minuteUTC: 0 },
  "internal:deactivateStale"
);

// Health check de links WhatsApp (HEAD request)
crons.daily(
  "checkWhatsAppLinks",
  { hourUTC: 4, minuteUTC: 0 },
  "internal:healthCheckLinks"
);

// Expirar premiums/boosts vencidos
crons.interval("expirePremiums", { hours: 1 }, "internal:expirePremiums");

export default crons;
```

### 5.4 Páginas

```
/                           — Landing + busca cidade (pública)
/cidade/[slug]              — Mapa de pontos + stats (pública)
/ponto/[id]                 — Página do ponto + matches + link WhatsApp (pública, compartilhável)
/ponto/solicitar            — Form solicitar ponto (auth)
/album                      — Grid de figurinhas (auth)
/matches                    — Matches pré-computados com filtros e camadas (auth)
/perfil                     — Meu perfil + histórico (auth)
/perfil/[name]              — Perfil público de outro usuário (pública)
/ranking/[slug]             — Leaderboard cidade (pública)
/premium                    — Planos e upgrade (auth)
/admin                      — Dashboard (auth + role admin)
/admin/pontos               — Aprovação de pontos
/admin/denuncias            — Moderação
/admin/album                — Config álbum
/admin/usuarios             — Gestão de usuários
```

### 5.5 Mapa — Leaflet + OpenStreetMap

Usar `react-leaflet` (não react-map-gl/Mapbox). Zero custo de tile rendering. Tiles via `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`. Para OG meta tags de compartilhamento (WhatsApp previews), usar Leaflet Static Images via puppeteer em build-time ou OpenStreetMap Static Maps API (gratuito). Cluster de markers via `react-leaflet-cluster`. Geocoding (endereço → lat/lng) via Nominatim (API grátis do OpenStreetMap, rate limit 1 req/s — suficiente para criação de pontos).

### 5.6 PWA

Service Worker com Workbox (via next-pwa ou @serwist/next). Manifest com `display: "standalone"`, ícones, theme_color verde. Estratégia de cache: App Shell (stale-while-revalidate para assets estáticos), Network-first para dados do Convex.

**Push notifications:** Web Push API com VAPID keys. Server-side: salvar `pushSubscription` no user doc. Trigger: durante recomputação de matches, comparar novos vs. anteriores → se há novos matches relevantes → enviar push via Convex action (fetch para web-push endpoint).

**Instalação — Android:** capturar `beforeinstallprompt`, deferir, mostrar prompt customizado após primeiro valor (cadastro de figurinhas ou visualização de matches). Máximo 2-3 vezes, pausar 30 dias após recusas.

**Instalação — iOS:** não existe `beforeinstallprompt`. Detectar iOS via user-agent. Se não instalado (detectar via `display-mode: browser` media query), mostrar banner educativo customizado com screenshots do processo "Compartilhar → Adicionar à Tela de Início". Push notifications no iOS funcionam APENAS com PWA instalado na Home Screen.

---

## 10. Decisões técnicas inegociáveis (antes de codar)

1. **Leaflet/OSM no lugar de Mapbox.** Economia de ~R$18k/mês a 100k usuários. Para MVP com pins em mapa, funcionalidade é equivalente.

2. **Figurinhas como arrays no user doc, não como documentos separados.** 980 ints × 8 bytes = ~8 KB. Elimina tabela `stickers` (que teria 980 × 100k = 98 milhões de documentos). Set intersection em memória é O(n) com n=980, instantâneo.

3. **Matches pré-computados via scheduled functions.** A query `findMatches` do PRD v1 é inviável — estoura limites de 32k docs escaneados e 4.096 ranges por transação. Recomputação assíncrona via actions (timeout 10 min) + tabela `precomputedMatches` + leitura O(1) no frontend.

4. **Ads como receita primária.** Premium sozinho não cobre custos nem no cenário base. Ads para base gratuita (98% dos usuários) geram 3-5x mais receita.

5. **Compliance LGPD/menores desde o dia 1.** Não é retrofitável. Gate de idade, consentimento parental, badges de menores, restrições de funcionalidade — tudo no Sprint 1.
