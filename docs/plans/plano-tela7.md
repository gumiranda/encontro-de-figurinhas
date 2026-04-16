# Tela 7 — Página do Ponto de Troca (Final v13)

## Context

Construir a página de detalhe do Ponto de Troca para usuário autenticado em `/points/[tradePointId]` (rota `(arena)`). Hoje o botão "Ver detalhes" do `trade-point-card.tsx:79` (Tela 6) só dispara `toast.info("Página do ponto em breve")` — esta é a entrega que destrava a navegação completa do mapa.

A tela é o "overview" autenticado do ponto (Tela 7 ≠ Tela 9 / admin lifecycle). Inclui:

- Hero (mapa + badge de verificação)
- Cabeçalho (nome, endereço, horários, score)
- Ações: Participar/Sair, "Estou aqui agora" (check-in), Compartilhar, WhatsApp
- Heatmap de horários movimentados (peakHours)
- Seção de matches (placeholder; dados reais fora de escopo)

### Decisões do usuário

1. **Schema completo PRD** — adicionar `isBanned`, `ageGroup`, `parentalConsentAt`, `guardianName`, `guardianEmail` em `users`.
2. **Check-in com auto-overwrite global** — novo check-in substitui silenciosamente o anterior em qualquer ponto (sem erro `already-checked-in-elsewhere`).

### Realidade do schema (descobertas na exploração)

Já existem e **não devem ser recriados**:

- `tradePoints`: `participantCount`, `activeCheckinsCount`, `peakHours`, `whatsappLink`, `whatsappLinkStatus`, `status` (`pending|approved|suspended|inactive`), `confidenceScore`, `confirmedTradesCount`, `lastActivityAt`
- `users`: `isShadowBanned`, `isPremium`, `hasCompletedOnboarding`, `birthDate`
- Tabelas `checkins` (com `countedInPublic`, todos índices) e `userTradePoints` (com `by_user_point`)
- Helpers em `lib/auth.ts`: `requireAuth`, `requireAuthMutation`, `getAuthenticatedUserWithBanCheck`, `requireApprovedPoint`, `requireAdmin`
- `lib/geo.ts`: `haversine`, `isInBrazil`, `BRAZIL_BOUNDS`
- `@workspace/ui` (shadcn) tem todos os componentes necessários (Card, Badge, Button, Typography). **Kibo UI não existe** no projeto — convenção é shadcn-only.

Bug existente a corrigir: `lib/auth.ts` referencia `user.isBanned` mas o campo não existe no schema (verificação silenciosamente passa para todos).

---

## Arquivos

### Backend

| Arquivo                                      | Ação   | Propósito                                                                                                                                                                                         |
| -------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/backend/convex/schema.ts`          | Edit   | Adicionar 5 campos a `users` + tabela `scoreBumps` (cap diário de score independente — crítica v11 #4)                                                                                            |
| `packages/backend/convex/lib/auth.ts`        | Edit   | `checkAuth` único + helper `assertAuthOk` retorna discriminated union (não throw — crítica v2 #1)                                                                                                 |
| `packages/backend/convex/lib/limits.ts`      | Create | Constantes de negócio (sem helpers de timezone — esses ficam em `lib/geo.ts`)                                                                                                                     |
| `packages/backend/convex/lib/geo.ts`         | Edit   | Adicionar `getBrazilHour(timestamp)` (já tem `BRAZIL_BOUNDS`, `haversine`, `isInBrazil`) — crítica v9 #4                                                                                          |
| `packages/backend/convex/lib/whatsapp.ts`    | Create | `evaluateWhatsappAccess(user, point)` retorna enum `WhatsappAccessState`                                                                                                                          |
| `packages/backend/convex/tradePoints.ts`     | Edit   | Adicionar `getById` (state machine completo). Sem `getMetadataPublic` (OG removido neste escopo — ver page.tsx).                                                                                  |
| `packages/backend/convex/userTradePoints.ts` | Create | Mutations `join` (com limite freemium) e `leave` (cleanup de checkins)                                                                                                                            |
| `packages/backend/convex/checkins.ts`        | Create | `create` (auto-overwrite), `cancelMine`, internals `expireCheckins`, `cleanupForShadowBannedUser` (limpa checkins **e** scoreBumps do user), `decayPeakHours`, `pruneScoreBumps` (crítica v10 #1) |
| `packages/backend/convex/crons.ts`           | Create | `expireCheckins` 30min; `decayPeakHours` semanal; `pruneScoreBumps` semanal                                                                                                                       |

### Frontend

| Arquivo                                                              | Ação           | Propósito                                                                                 |
| -------------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| `apps/web/app/(arena)/points/[tradePointId]/page.tsx`                | Create         | Server Component fino + `metadata` estático (title genérico — crítica v10 #3)             |
| `apps/web/app/robots.ts`                                             | Create or Edit | Adicionar `Disallow: /points/` para evitar indexação Google da rota auth (crítica v10 #4) |
| `apps/web/modules/trade-points/lib/use-trade-point.ts`               | Create         | Wrapper de `useQuery(api.tradePoints.getById)`                                            |
| `apps/web/modules/trade-points/lib/use-share.ts`                     | Create         | Web Share API com fallback de clipboard                                                   |
| `apps/web/modules/trade-points/lib/use-stable-value.ts`              | Create         | Hook genérico que estabiliza refs de array/objeto vindas de Convex (crítica v11 #3)       |
| `apps/web/modules/trade-points/ui/views/trade-point-detail-view.tsx` | Create         | View principal: state machine + composição                                                |
| `apps/web/modules/trade-points/ui/components/point-hero.tsx`         | Create         | Mapa preview (estático) + badge "Ponto Verificado"                                        |
| `apps/web/modules/trade-points/ui/components/point-header.tsx`       | Create         | Header com nome, endereço, horários, cidade (crítica v11 #2)                              |
| `apps/web/modules/trade-points/ui/components/point-actions.tsx`      | Create         | Botões Participar/Sair + Check-in com geolocation                                         |
| `apps/web/modules/trade-points/ui/components/whatsapp-button.tsx`    | Create         | Botão com tooltip contextual baseado em `whatsappState`                                   |
| `apps/web/modules/trade-points/ui/components/peak-hours-chart.tsx`   | Create         | Heatmap de 24h em barras (recharts já está em deps)                                       |
| `apps/web/modules/trade-points/ui/components/matches-section.tsx`    | Create         | Placeholder estilizado ("Em breve")                                                       |
| `apps/web/modules/trade-points/ui/components/banned-state.tsx`       | Create         | UI de estado banido (sem redirect loop)                                                   |
| `apps/web/modules/map/ui/components/trade-point-card.tsx`            | Edit           | Trocar `toast.info` por `<Link href={"/points/" + id}>`                                   |

**UI:** todos via `@workspace/ui/components/*`. Sem Kibo UI (não existe no projeto). Sem Tailwind puro (regra do `CLAUDE.md`).

---

## Schema — adições

### `users` (campos optional)

```ts
isBanned: v.optional(v.boolean()),
ageGroup: v.optional(v.union(
  v.literal("child"),   // <12
  v.literal("teen"),    // 12-15
  v.literal("young"),   // 16-17
  v.literal("adult")    // 18+
)),
parentalConsentAt: v.optional(v.number()),
guardianName: v.optional(v.string()),
guardianEmail: v.optional(v.string()),
```

Todos optionais para não quebrar usuários existentes. Backfill de `ageGroup` a partir de `birthDate` é trabalho de outra tela (PRD `arquitetura-tecnica.md:63-71`).

### `scoreBumps` — nova tabela (crítica v8 #5 + v9 #1 — daily score cap independente de membership)

```ts
scoreBumps: defineTable({
  userId: v.id("users"),
  tradePointId: v.id("tradePoints"),
  at: v.number(),
})
  .index("by_user_point_time", ["userId", "tradePointId", "at"]) // gating no checkin
  .index("by_at", ["at"]) // cleanup cron (crítica v10 #1)
  .index("by_user", ["userId"]), // limpeza no shadow ban (crítica v10 #2)
```

**Por que tabela separada (crítica v9 #1):** `lastScoreBumpAt` em `userTradePoints` é gamável: leave + join cria novo doc com `lastScoreBumpAt: undefined` → bump liberado. Tabela independente sobrevive ao churn de membership.

**Cleanup obrigatório (crítica v10 #1 — não deferir):** sem cleanup, 10k DAU × 3 pts × 5 meses ≈ 4.5M rows. Cron weekly `pruneScoreBumps` deleta rows com `at < now - 48h` (cobre cooldown 24h + folga). Cron `cleanupForShadowBannedUser` também limpa rows do user banido (crítica v10 #2 — evita órfãs apontando para `users._id` excluído).

### Índices que JÁ EXISTEM (confirmação — crítica v5 #4)

Verificado na exploração inicial. Não recriar:

- `checkins.by_user_active` ✓ (usado em `create` para auto-overwrite)
- `checkins.by_user_tradePoint_active` ✓ (usado em `create` para renewal e em `leave`)
- `checkins.by_tradePoint_active` ✓
- `checkins.by_expiresAt` ✓ (usado em `expireCheckins`)
- `checkins.by_user` ✓
- `tradePoints.by_status` ✓ (usado em `decayPeakHours`)
- `userTradePoints.by_user_point` ✓
- `userTradePoints.by_user` ✓

---

## `lib/auth.ts` — consolidação (sem throw para erros user-facing — crítica v2 #1)

**Decisão de design:** Throws só para invariantes de código (NaN, ID inválido, doc inexistente). Auth state é user-facing → discriminated union.

```ts
export type AuthState =
  | { state: "needs-auth"; user: null }
  | { state: "banned"; user: null }
  | { state: "needs-onboarding"; user: Doc<"users"> }
  | { state: "ok"; user: Doc<"users"> };

export async function checkAuth(ctx: QueryCtx | MutationCtx): Promise<AuthState> {
  const user = await getAuthenticatedUser(ctx);
  if (!user) return { state: "needs-auth", user: null };
  if (user.isBanned === true) return { state: "banned", user: null };
  if (!user.hasCompletedOnboarding) return { state: "needs-onboarding", user };
  return { state: "ok", user };
}

// Validators reutilizáveis para retornos de mutation
export const authErrorValidators = [
  v.object({ ok: v.literal(false), error: v.literal("needs-auth") }),
  v.object({ ok: v.literal(false), error: v.literal("banned") }),
  v.object({ ok: v.literal(false), error: v.literal("needs-onboarding") }),
] as const;

// Helper que converte AuthState → erro estruturado (ou null se ok)
export function authStateAsError(
  auth: AuthState
): { ok: false; error: "needs-auth" | "banned" | "needs-onboarding" } | null {
  if (auth.state === "ok") return null;
  return { ok: false, error: auth.state };
}
```

**Removido:** `requireAuthMutation` (não throw). Mutations chamam `checkAuth` direto e retornam `authStateAsError(auth)` quando não-ok. `requireAuth` (versão throw) **mantida apenas** para uso interno (ex: chamadas server-to-server / actions onde throw é apropriado). `requireApprovedPoint` mantida — `tradePointId` inválido é invariante de UI, throw é OK.

Também **removido:** `getAuthenticatedUserWithBanCheck` (substituído por `checkAuth` direto).

---

## `lib/limits.ts` (constantes de negócio apenas — crítica v9 #4)

```ts
export const FREE_USER_MAX_POINTS = 3; // PRD monetizacao.md:7
export const MAX_CHECKIN_DISTANCE_KM = 0.5; // PRD seguranca.md:19 (500m)
export const CHECKIN_DURATION_MS = 2 * 60 * 60 * 1000; // PRD seguranca.md:19
export const PEAK_HOURS_DECAY_FACTOR = 0.9; // semanal — crítica v5 #3
export const PEAK_HOURS_FLOOR_AFTER_ACTIVITY = 1;

// Crítica v8 #5 + v9 #1: cap diário via tabela scoreBumps independente.
export const SCORE_BUMP_AMOUNT = 0.2; // reduzido de 0.5 (v1)
export const SCORE_BUMP_COOLDOWN_MS = 24 * 60 * 60 * 1000;
```

## `lib/geo.ts` — adicionar (crítica v9 #4)

Helper de timezone vai junto com `BRAZIL_BOUNDS` e `isInBrazil` (mesma família — utilities geográficas brasileiras), não em `limits.ts`:

```ts
export const BRAZIL_UTC_OFFSET_HOURS = -3; // fixo desde fim do DST em 2019
export function getBrazilHour(timestamp: number): number {
  const utcHour = new Date(timestamp).getUTCHours();
  return (utcHour + 24 + BRAZIL_UTC_OFFSET_HOURS) % 24;
}
```

**Justificativa do `PEAK_HOURS_DECAY_FACTOR = 0.9` (crítica v5 #3):**

Produto é sazonal (Copa = 5 meses ≈ 22 semanas). Decay deve preservar sinal histórico ao longo da temporada inteira:

| Fator                   | 4 sem   | 12 sem  | 22 sem                                          |
| ----------------------- | ------- | ------- | ----------------------------------------------- |
| 0.8 (proposta original) | 41%     | 7%      | 0.7% — **vira ruído antes da Copa terminar**    |
| 0.85                    | 52%     | 14%     | 3%                                              |
| **0.9 (escolhido)**     | **66%** | **28%** | **10%** — pico do início ainda visível em julho |
| 0.95                    | 81%     | 54%     | 32% — pode mascarar mudanças reais de movimento |

Combinado com **floor pós-atividade** (`Math.max(decayed, 1)` se `original > 0`): horas que tiveram atividade mantêm valor mínimo 1 (sinal binário "tem movimento aqui"). Horas sem atividade nunca passam por decay (ficam em 0).

---

## `lib/whatsapp.ts` — enum em vez de boolean (crítica #6)

```ts
export type WhatsappAccessState =
  | { state: "ok"; link: string }
  | { state: "blocked-link-invalid" }
  | { state: "blocked-minor" };

export function evaluateWhatsappAccess(
  user: Doc<"users">,
  point: Doc<"tradePoints">
): WhatsappAccessState {
  if (point.whatsappLinkStatus !== "active" || !point.whatsappLink) {
    return { state: "blocked-link-invalid" };
  }
  if (user.ageGroup === "child" && !user.parentalConsentAt) {
    return { state: "blocked-minor" };
  }
  // Shadow-banned: NÃO bloqueia (PRD diz "usa app normalmente")
  return { state: "ok", link: point.whatsappLink };
}
```

Validador de retorno em `tradePoints.getById`:

```ts
const whatsappAccessValidator = v.union(
  v.object({ state: v.literal("ok"), link: v.string() }),
  v.object({ state: v.literal("blocked-link-invalid") }),
  v.object({ state: v.literal("blocked-minor") })
);
```

UI mascara ambos blocked com tooltip genérico ("Indisponível no momento") quando necessário, mas trata `blocked-minor` com mensagem específica para melhor UX.

---

## Threat model — enumeração (revisado em v9 — críticas v7 #1 + #2)

**Posição honesta adotada:** dados de `tradePoints` aprovados são tratados como **efetivamente públicos para usuários autenticados**. Justificativa:

1. PRD/`/cidade/[slug]` já expõe nome+endereço+lat/lng de todos os pontos aprovados a qualquer visitante (sem auth).
2. Sign-up é gratuito → barreira de auth não filtra ninguém minimamente determinado.
3. Bypass do gate (v6) é trivial: signup → join 1 ponto qualquer → enumerar livremente como "membro". Defesa de 40% de eficácia paga 100% de complexidade.
4. Custo da defesa não-trivial: tabela `pointViewLog` (~900k rows/mês com 10k DAU), índices compostos, cron de pruning, mutation companion, gate condicional, ThrottledState, useRef no client. Todo esse aparato apenas torna scraping ~3x mais lento — não impede.

**Decisão:**

- **Removido:** `tradePoints.touchPointView`, tabela `pointViewLog`, estado `needs-view-record`, gate em `getById`, componente `ThrottledState`, hook `firedRef`.
- **Removido:** query pública `tradePoints.getMetadataPublic` com gate (a query em si fica, sem rate limit — consistente com mapa público).
- **Adiada:** defesa real (rate limit por edge IP, captcha em sign-up, alerting de hot-users) → escopo de hardening separado, ativada **se e quando** evidência de scraping aparecer (logs/métricas).
- **Deferido:** revisitar quando: (a) PRD adicionar dados sensíveis a `tradePoints` (ex: telefone admin, métricas de receita); (b) suspeita de scraping concreta; (c) lançar plano premium baseado em "dados exclusivos".

Esta decisão é registrada explicitamente neste plano para que futuras telas que adicionarem dados sensíveis saibam que **a baseline atual não tem rate-limit anti-enumeração**.

---

## Query `tradePoints.getById`

```ts
export const getById = query({
  args: { id: v.id("tradePoints") },
  returns: v.union(
    v.object({ state: v.literal("needs-auth") }),
    v.object({ state: v.literal("banned") }),
    v.object({ state: v.literal("needs-onboarding") }),
    v.object({ state: v.literal("not-found") }),
    v.object({
      state: v.literal("ready"),
      point: v.object({
        _id: v.id("tradePoints"),
        name: v.string(),
        address: v.string(),
        lat: v.float64(),
        lng: v.float64(),
        suggestedHours: v.optional(v.string()),
        description: v.optional(v.string()),
        confidenceScore: v.float64(),
        lastActivityAt: v.number(),
        confirmedTradesCount: v.number(),
        peakHours: v.optional(v.array(v.number())),
      }),
      city: v.union(v.object({ name: v.string(), slug: v.string() }), v.null()),
      participantCount: v.number(),
      isParticipant: v.boolean(),
      activeCheckinsCount: v.number(),
      hasActiveCheckin: v.boolean(),
      whatsapp: whatsappAccessValidator,
    })
  ),
  handler: async (ctx, { id }) => {
    const auth = await checkAuth(ctx);
    if (auth.state === "needs-auth") return { state: "needs-auth" as const };
    if (auth.state === "banned") return { state: "banned" as const };
    if (auth.state === "needs-onboarding") return { state: "needs-onboarding" as const };

    const user = auth.user;
    const point = await ctx.db.get(id);
    if (!point || point.status !== "approved") return { state: "not-found" as const };

    const city = await ctx.db.get(point.cityId);
    const now = Date.now();

    const isParticipant = !!(await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) => q.eq("userId", user._id).eq("tradePointId", id))
      .unique());

    const hasActiveCheckin = !!(await ctx.db
      .query("checkins")
      .withIndex("by_user_tradePoint_active", (q) =>
        q.eq("userId", user._id).eq("tradePointId", id).gt("expiresAt", now)
      )
      .first());

    return {
      state: "ready" as const,
      point: {
        /* ... projeção dos campos do validator */
      },
      city: city ? { name: city.name, slug: city.slug } : null,
      participantCount: point.participantCount ?? 0,
      isParticipant,
      activeCheckinsCount: point.activeCheckinsCount ?? 0,
      hasActiveCheckin,
      whatsapp: evaluateWhatsappAccess(user, point),
    };
  },
});
```

Ambos os contadores vêm dos campos denormalizados (O(1)). Convex OCC trata escritas concorrentes — pattern read-modify-write é idiomático e não precisa de re-fetch (crítica #2/#10).

---

## Mutation `userTradePoints.join` / `leave`

`join` (crítica v1 #11/#12 + v2 #1 — auth como discriminated union):

```ts
import { FREE_USER_MAX_POINTS } from "./lib/limits";
import { checkAuth, authStateAsError, authErrorValidators } from "./lib/auth";

export const join = mutation({
  args: { tradePointId: v.id("tradePoints") },
  returns: v.union(
    v.object({ ok: v.literal(true) }),
    ...authErrorValidators,
    v.object({ ok: v.literal(false), error: v.literal("already-member") }),
    v.object({ ok: v.literal(false), error: v.literal("limit-reached") }),
    v.object({ ok: v.literal(false), error: v.literal("point-unavailable") })
  ),
  handler: async (ctx, { tradePointId }) => {
    const auth = await checkAuth(ctx);
    const authErr = authStateAsError(auth);
    if (authErr) return authErr;
    const user = auth.user;

    const point = await ctx.db.get(tradePointId);
    if (!point || point.status !== "approved") {
      return { ok: false as const, error: "point-unavailable" as const };
    }

    const existing = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", tradePointId)
      )
      .unique();
    if (existing) return { ok: false as const, error: "already-member" as const };

    if (!user.isPremium) {
      const sample = await ctx.db
        .query("userTradePoints")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .take(FREE_USER_MAX_POINTS + 1);
      if (sample.length >= FREE_USER_MAX_POINTS) {
        return { ok: false as const, error: "limit-reached" as const };
      }
    }

    await ctx.db.insert("userTradePoints", {
      userId: user._id,
      tradePointId,
      joinedAt: Date.now(),
    });
    await ctx.db.patch(tradePointId, {
      participantCount: (point.participantCount ?? 0) + 1,
    });
    return { ok: true as const };
  },
});
```

`leave` (crítica v2 #4 — ordering explícito para evitar double-decrement em race com cron):

```ts
export const leave = mutation({
  args: { tradePointId: v.id("tradePoints") },
  returns: v.union(
    v.object({ ok: v.literal(true) }),
    ...authErrorValidators,
    v.object({ ok: v.literal(false), error: v.literal("not-member") })
  ),
  handler: async (ctx, { tradePointId }) => {
    const auth = await checkAuth(ctx);
    const authErr = authStateAsError(auth);
    if (authErr) return authErr;
    const user = auth.user;

    const membership = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", tradePointId)
      )
      .unique();
    if (!membership) return { ok: false as const, error: "not-member" as const };

    // ORDEM IMPORTA — tudo na mesma tx (Convex OCC garante atomicidade).
    // INVARIANTE (auto-overwrite no create garante): no máximo 1 checkin ativo
    // global por usuário → no máximo 1 neste ponto também → .first() é exato (crítica v3 #3).
    const now = Date.now();
    const activeCheckin = await ctx.db
      .query("checkins")
      .withIndex("by_user_tradePoint_active", (q) =>
        q.eq("userId", user._id).eq("tradePointId", tradePointId).gt("expiresAt", now)
      )
      .first();

    // 1. Capturar countedInPublic ANTES de deletar (read-then-delete na mesma tx)
    let publicCheckinsToRemove = 0;
    if (activeCheckin) {
      if (activeCheckin.countedInPublic) publicCheckinsToRemove = 1;
      await ctx.db.delete(activeCheckin._id);
    }

    // 2. Deletar membership
    await ctx.db.delete(membership._id);

    // 3. Re-ler ponto AGORA (após deletes) e patch único atômico
    const point = await ctx.db.get(tradePointId);
    if (point) {
      await ctx.db.patch(tradePointId, {
        participantCount: Math.max(0, (point.participantCount ?? 0) - 1),
        activeCheckinsCount: Math.max(
          0,
          (point.activeCheckinsCount ?? 0) - publicCheckinsToRemove
        ),
      });
    }

    return { ok: true as const };
  },
});
```

**Por que essa ordem importa:** se o cron `expireCheckins` rodar concorrentemente, OCC detecta conflito de escrita no mesmo doc e re-roda a transação inteira. Como `publicCheckinsToRemove` é re-derivado da query no início da retry, o decremento sempre reflete o checkin que ESTA tx vê (sem double-counting). **Sem guard `stillExists`** (crítica v1 #4) e **sem `.collect()` desnecessário** (crítica v3 #3 — invariante de "1 global" torna `.first()` exato).

**Cooldown (crítica v1 #16):** deferido. O limite de 3 pontos free já controla abuso; cooldown vira justificável só após observação de abuso real em premium. Marcado como follow-up.

---

## Mutation `checkins.create` — auto-overwrite (crítica v1 #5) + renewal early-return (crítica v2 #3)

```ts
export const create = mutation({
  args: {
    tradePointId: v.id("tradePoints"),
    lat: v.float64(),
    lng: v.float64(),
  },
  returns: v.union(
    v.object({
      ok: v.literal(true),
      expiresAt: v.number(),
      replacedPrevious: v.boolean(),
      renewed: v.boolean(),
    }),
    ...authErrorValidators,
    v.object({
      ok: v.literal(false),
      error: v.literal("too-far"),
      distanceMeters: v.number(),
    }),
    v.object({ ok: v.literal(false), error: v.literal("not-member") }),
    v.object({ ok: v.literal(false), error: v.literal("point-unavailable") })
  ),
  handler: async (ctx, { tradePointId, lat, lng }) => {
    const auth = await checkAuth(ctx);
    const authErr = authStateAsError(auth);
    if (authErr) return authErr;
    const user = auth.user;

    // Invariantes — throw é apropriado (UI nunca envia isso)
    if (!Number.isFinite(lat) || !Number.isFinite(lng))
      throw new Error("Invalid location");
    if (!isInBrazil(lat, lng)) throw new Error("Invalid location");

    const point = await ctx.db.get(tradePointId);
    if (!point || point.status !== "approved") {
      return { ok: false as const, error: "point-unavailable" as const };
    }

    const isMember = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", tradePointId)
      )
      .unique();
    if (!isMember) return { ok: false as const, error: "not-member" as const };

    const distanceKm = haversine(lat, lng, point.lat, point.lng);
    if (distanceKm > MAX_CHECKIN_DISTANCE_KM) {
      return {
        ok: false as const,
        error: "too-far" as const,
        distanceMeters: Math.round(distanceKm * 1000),
      };
    }

    const now = Date.now();
    const expiresAt = now + CHECKIN_DURATION_MS;

    const previous = await ctx.db
      .query("checkins")
      .withIndex("by_user_active", (q) => q.eq("userId", user._id).gt("expiresAt", now))
      .first();

    // CRÍTICA v2 #3: renewal no MESMO ponto = só estende expiresAt
    // (sem flicker UI 5→4→5, sem bump duplo de confidenceScore)
    if (previous && previous.tradePointId === tradePointId) {
      await ctx.db.patch(previous._id, {
        expiresAt,
        lat,
        lng,
        distanceMeters: Math.round(distanceKm * 1000),
      });
      // Não toca em peakHours/confidenceScore/activeCheckinsCount
      return { ok: true as const, expiresAt, replacedPrevious: false, renewed: true };
    }

    // Auto-overwrite cross-point: deleta antigo, decrementa ponto antigo
    let replacedPrevious = false;
    if (previous) {
      replacedPrevious = true;
      if (previous.countedInPublic) {
        const oldPoint = await ctx.db.get(previous.tradePointId);
        if (oldPoint) {
          await ctx.db.patch(previous.tradePointId, {
            activeCheckinsCount: Math.max(0, (oldPoint.activeCheckinsCount ?? 0) - 1),
          });
        }
      }
      await ctx.db.delete(previous._id);
    }

    const countedInPublic = !user.isShadowBanned;

    await ctx.db.insert("checkins", {
      userId: user._id,
      tradePointId,
      lat,
      lng,
      distanceMeters: Math.round(distanceKm * 1000),
      expiresAt,
      createdAt: now,
      countedInPublic,
    });

    if (countedInPublic) {
      // CRÍTICA v8 #1: hora em BRT (não UTC) — heatmap precisa refletir movimento local
      const currentHour = getBrazilHour(now);
      const peakHours = (point.peakHours ?? Array(24).fill(0)).slice();
      peakHours[currentHour] = (peakHours[currentHour] ?? 0) + 1;

      // CRÍTICA v8 #5 + v9 #1: cap diário via tabela scoreBumps independente
      // (sobrevive a leave/join). Query: existe bump em (user, point) nas últimas 24h?
      const cooldownStart = now - SCORE_BUMP_COOLDOWN_MS;
      const recentBump = await ctx.db
        .query("scoreBumps")
        .withIndex("by_user_point_time", (q) =>
          q
            .eq("userId", user._id)
            .eq("tradePointId", tradePointId)
            .gt("at", cooldownStart)
        )
        .first();
      const shouldBumpScore = !recentBump;

      const patch: Partial<Doc<"tradePoints">> = {
        activeCheckinsCount: (point.activeCheckinsCount ?? 0) + 1,
        lastActivityAt: now,
        peakHours,
      };
      if (shouldBumpScore) {
        patch.confidenceScore = Math.min(10, point.confidenceScore + SCORE_BUMP_AMOUNT);
      }
      await ctx.db.patch(tradePointId, patch);

      if (shouldBumpScore) {
        await ctx.db.insert("scoreBumps", {
          userId: user._id,
          tradePointId,
          at: now,
        });
      }
    }

    return { ok: true as const, expiresAt, replacedPrevious, renewed: false };
  },
});
```

UI:

- `renewed: true` → toast silencioso ou "Check-in renovado por mais 2h"
- `replacedPrevious: true` → toast "Check-in movido para este ponto"
- ambos `false` → toast "Check-in confirmado"

`cancelMine` (mutation pública, idempotente): deleta checkin ativo do usuário em qualquer ponto, decrementa contagem se `countedInPublic`.

---

## Cron jobs (`crons.ts`)

```ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("expire checkins", { minutes: 30 }, internal.checkins.expireCheckins);
crons.weekly(
  "decay peakHours",
  { dayOfWeek: "monday", hourUTC: 3, minuteUTC: 0 },
  internal.checkins.decayPeakHours
);
// Crítica v10 #1: cleanup obrigatório — sem isso, scoreBumps cresce 4.5M rows em 5 meses.
crons.weekly(
  "prune scoreBumps",
  { dayOfWeek: "monday", hourUTC: 4, minuteUTC: 0 },
  internal.checkins.pruneScoreBumps
);

export default crons;
```

`pruneScoreBumps` (crítica v10 #1 + v11 #1 — guard contra loop em cold start com backlog):

```ts
const SCOREBUMP_RETENTION_MS = SCORE_BUMP_COOLDOWN_MS + 24 * 60 * 60 * 1000; // 48h (24h cap + 24h folga)
const PRUNE_BATCH = 100;
const PRUNE_MAX_CHUNKS = 100; // crítica v11 #1 — máx 10k rows/run; resto na próxima semana

export const pruneScoreBumps = internalMutation({
  args: { chunk: v.optional(v.number()) },
  returns: v.object({ deleted: v.number(), aborted: v.optional(v.boolean()) }),
  handler: async (ctx, { chunk }) => {
    const cutoff = Date.now() - SCOREBUMP_RETENTION_MS;
    const expired = await ctx.db
      .query("scoreBumps")
      .withIndex("by_at", (q) => q.lt("at", cutoff))
      .take(PRUNE_BATCH);

    for (const row of expired) {
      await ctx.db.delete(row._id);
    }

    if (expired.length === PRUNE_BATCH) {
      const nextChunk = (chunk ?? 0) + 1;
      if (nextChunk >= PRUNE_MAX_CHUNKS) {
        // Backlog enorme — para por hoje, próximo cron weekly continua.
        console.error("pruneScoreBumps: hit MAX_CHUNKS guard", { chunk: nextChunk });
        return { deleted: expired.length, aborted: true };
      }
      await ctx.scheduler.runAfter(0, internal.checkins.pruneScoreBumps, {
        chunk: nextChunk,
      });
    }
    return { deleted: expired.length };
  },
});
```

`expireCheckins` (crítica v1 #4 — sem `stillExists` redundante; BATCH_SIZE=50 com re-schedule se cheio).

`decayPeakHours` (crítica v8 #6 — simplificação radical): para o tamanho atual (<8k pontos aprovados), `.collect()` em uma única execução resolve. Sem cursor, sem cronState, sem MAX_RESCHEDULES.

```ts
const DECAY_RESCALE_THRESHOLD = 3000; // Convex hard limit ~4096 writes/tx — folga conservadora (crítica v9 #3)

export const decayPeakHours = internalMutation({
  args: {},
  returns: v.object({ processed: v.number(), warning: v.optional(v.string()) }),
  handler: async (ctx) => {
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    // CRÍTICA v9 #3: throw em vez de warn — ninguém lê logs do Convex.
    // Throw faz a cron falhar visivelmente no dashboard, forçando ação.
    // Threshold conservador (3000) dá folga para reagir antes do limit ~4096 do Convex.
    if (points.length >= DECAY_RESCALE_THRESHOLD) {
      throw new Error(
        `decayPeakHours: ${points.length} approved points >= threshold ${DECAY_RESCALE_THRESHOLD}. ` +
          `Re-introduzir paginação (ver git history dessa função antes do v11).`
      );
    }

    let processed = 0;
    for (const point of points) {
      if (!point.peakHours || point.peakHours.length === 0) continue;
      // Floor pós-atividade (crítica v5 #3)
      const decayed = point.peakHours.map((h) => {
        const original = h ?? 0;
        if (original === 0) return 0;
        const next = Math.floor(original * PEAK_HOURS_DECAY_FACTOR);
        return Math.max(next, PEAK_HOURS_FLOOR_AFTER_ACTIVITY);
      });
      await ctx.db.patch(point._id, { peakHours: decayed });
      processed++;
    }

    return { processed };
  },
});
```

**Justificativa da simplificação (v8 #6):**

- Cron semanal feature inteiramente offline; complexidade de cursor é overkill enquanto cabe em uma tx.
- Convex limit ~4096 writes/tx → threshold 3000 (crítica v9 #3) com throw forçando ação visível no dashboard.
- Quando throw dispara, paginação retorna (implementação anterior fica em git history). Pagar complexidade por escala existente, não hipotética.
- Net win: ~80 linhas removidas, zero tabela `cronState`, zero argumento `chunk`, zero `MAX_RESCHEDULES`.

`cleanupForShadowBannedUser(userId)` — internal mutation. Deleta todos checkins ativos + decrementa `activeCheckinsCount` dos pontos correspondentes (mesmo padrão de ordering do `leave`). **Também deleta rows do user em `scoreBumps`** via índice `by_user` (crítica v10 #2 — evita órfãs).

**Escopo (crítica v5 #5):** esta tela **não invoca** essa mutation. Ela é exposta como API pública interna para a tela de moderação/admin (a fora deste escopo) que setará `users.isShadowBanned = true`. Documentado no JSDoc da função para futura referência. Sem callsite neste plano = scaffolding intencional, não dead code. Se a entrega de moderação for adiada por > 1 sprint, considerar remover daqui e adicionar junto com a feature de admin (lazy implementation).

---

## Frontend

### `app/(arena)/points/[tradePointId]/page.tsx`

Server Component fino. **Sem `generateMetadata` async** (auth-gated, crawler nunca vê) mas com `metadata` estático mínimo (crítica v10 #3 — clients que usam credentials do user logado tipo Slack/Discord):

```tsx
import type { Metadata } from "next";
import { Id } from "@workspace/backend/_generated/dataModel";
import { TradePointDetailView } from "@/modules/trade-points/ui/views/trade-point-detail-view";

// Estático: 3 linhas, zero query Convex, zero cache, zero async.
export const metadata: Metadata = {
  title: "Ponto de Troca — Figurinha Fácil",
};

type Props = { params: Promise<{ tradePointId: string }> };

export default async function TradePointPage({ params }: Props) {
  const { tradePointId } = await params;
  return <TradePointDetailView tradePointId={tradePointId as Id<"tradePoints">} />;
}
```

**Por que removi `generateMetadata` (revisão honesta v11):**

1. Rota `(arena)/points/[tradePointId]` é **auth-gated pelo `middleware.ts`** (`auth.protect()`). Crawler de OG (WhatsApp, Twitter, Instagram) chega sem cookies → middleware redireciona para `/sign-in` antes de `generateMetadata` rodar. **Crawler nunca vê o metadata gerado.**
2. Adicionar UA-sniffing pra deixar bots passarem é vulnerável a spoofing e contradiz o modelo de auth.
3. `revalidate = 3600` no page.tsx mente sobre reatividade da UI client (Next 15 cacheia o shell HTML inicial; useQuery refetch hidrata, mas primeiro paint fica stale).
4. `canonical` para slug que ainda não existe é código morto.
5. Twitter "summary" sem imagem dinâmica fica feio do mesmo jeito.

**Decisão:**

- Rich preview/OG/SEO é **responsabilidade da rota pública `/ponto/[slug]`** (marketing) — escopo separado.
- `use-share` continua compartilhando `window.location.href` (`/points/[id]`); receptor não-logado é redirecionado pra `/sign-in`. Aceitável para MVP (compartilhamento real de troca acontece via WhatsApp dos grupos, não via link da página de detalhe).
- Quando marketing slug for entregue: `use-share` passa a montar `https://.../ponto/[slug]` em vez de URL atual; metadata rica vive lá.

**Cancelado neste plano:**

- `generateMetadata` async em `page.tsx` (substituído por `metadata` estático)
- `revalidate` export
- Query `tradePoints.getMetadataPublic`
- Vercel OG image dinâmico (`opengraph-image.tsx`)
- `<link rel="canonical">`

### `app/robots.ts` (crítica v10 #4)

Bloqueio em `robots.txt` é mais robusto que meta tag para evitar Google indexar a rota auth (mesmo redirecionada):

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/points/" }, // rota auth-only
    ],
    sitemap: "https://figurinhafacil.com.br/sitemap.xml",
  };
}
```

Se já existir `app/robots.ts`, adicionar a regra `disallow: "/points/"` mantendo o resto.

### `trade-point-detail-view.tsx` (client component)

```tsx
"use client";
const data = useQuery(api.tradePoints.getById, { id: tradePointId });

// Estados de loading/auth (crítica v1 #13 — useEffect, não no render)
useEffect(() => {
  if (data?.state === "needs-auth") router.replace("/sign-in");
  else if (data?.state === "needs-onboarding") router.replace("/complete-profile");
}, [data?.state, router]);

if (!data) return <FullPageLoader />;
if (data.state === "needs-auth" || data.state === "needs-onboarding") return null;
if (data.state === "banned") return <BannedState />;
if (data.state === "not-found") notFound();

const {
  point,
  city,
  participantCount,
  isParticipant,
  activeCheckinsCount,
  hasActiveCheckin,
  whatsapp,
} = data;

// CRÍTICA v4 #2: passar APENAS os primitivos que cada filho precisa
// (não passar o objeto data inteiro). Combinado com React.memo nos filhos,
// re-renders só disparam quando o campo específico muda.
return (
  <>
    <PointHero
      name={point.name}
      lat={point.lat}
      lng={point.lng}
      confidenceScore={point.confidenceScore}
    />
    <PointHeader
      name={point.name}
      address={point.address}
      suggestedHours={point.suggestedHours}
      cityName={city?.name ?? null}
    />
    <WhatsappButton whatsapp={whatsapp} />
    <PointActions
      tradePointId={point._id}
      isParticipant={isParticipant}
      hasActiveCheckin={hasActiveCheckin}
      activeCheckinsCount={activeCheckinsCount}
      participantCount={participantCount}
      pointLat={point.lat}
      pointLng={point.lng}
    />
    <PeakHoursChart peakHours={point.peakHours} />
    <MatchesSection tradePointId={point._id} />
  </>
);
```

### Componentes (todos via `@workspace/ui`, todos com `React.memo`)

Todos exportam via `React.memo(...)` — props são primitivos/arrays simples, então shallow-compare default basta. Convex push reativo (ex: outro usuário faz check-in → `activeCheckinsCount` muda) só dispara re-render dos componentes que recebem aquele prop específico:

- `point-hero.tsx` — props: `name`, `lat`, `lng`, `confidenceScore`. `<Card>` com mapa estático + `<Badge>` "Ponto Verificado". Re-render só se mudarem.
- `point-header.tsx` — props: `name`, `address`, `suggestedHours`, `cityName`. Quase nunca re-renderiza.
- `whatsapp-button.tsx` — prop: `whatsapp` (discriminated union). Re-render só quando link/state muda.
- `point-actions.tsx` — props completos para gerenciar mutations. Re-renderiza quando counts mudam (esperado — UI reflete contagem). **Botão "Sair" abre `<AlertDialog>` quando `hasActiveCheckin === true`** (crítica v8 #3): "Você tem um check-in ativo aqui. Sair vai cancelar. Continuar?" Confirma → leave; cancela → fecha modal. Sem checkin ativo → leave direto sem confirmação.
- `peak-hours-chart.tsx` — prop: `peakHours: number[] | undefined`. **Recebe via `useStableValue` na view** (crítica v7 #7 + v8 #7) — Convex retorna nova ref de array a cada query result. Hook genérico estabiliza a ref quando o conteúdo não muda, permitindo `React.memo` padrão funcionar.
- `matches-section.tsx` — prop: `tradePointId`. Estável → quase nunca re-renderiza. **PRD F14** prevê `matches.forTradePoint({ tradePointId })` aqui (crítica v8 #4). Placeholder até a tela de matches (escopo separado, próxima entrega) implementar a query. Marcar `// TODO(matches): wire api.matches.forTradePoint` no componente.
- `banned-state.tsx` — sem props. Estático.

**Estabilidade de referência via hook genérico (crítica v8 #7):**

Em vez de comparador custom por componente, criar `apps/web/modules/trade-points/lib/use-stable-value.ts`:

```ts
import { useRef } from "react";

// Retorna referência estável enquanto JSON.stringify(value) não mudar.
// Use em props de array/objeto vindas de Convex queries para que React.memo
// padrão funcione no consumidor (Convex retorna nova ref a cada query result
// mesmo com valores idênticos).
//
// Trade-off: JSON.stringify roda a cada render. OK para arrays/objetos
// pequenos (<100 itens). Para estruturas grandes, use comparador custom.
export function useStableValue<T>(value: T): T {
  const ref = useRef<{ key: string; value: T }>({ key: "", value });
  const newKey = JSON.stringify(value);
  if (newKey !== ref.current.key) {
    ref.current = { key: newKey, value };
  }
  return ref.current.value;
}
```

Uso na view:

```tsx
const stablePeakHours = useStableValue(point.peakHours);
<PeakHoursChart peakHours={stablePeakHours} />;
```

`PeakHoursChart` exporta com `React.memo` padrão (sem comparador custom). Mesma técnica vale para qualquer prop futura de array/objeto vinda de Convex.

Verificação obrigatória no smoke test (React DevTools Profiler).

### Hooks

- `use-trade-point.ts` — `useQuery(api.tradePoints.getById, { id })`
- `use-share.ts` — `navigator.share` com tratamento explícito de `AbortError` (crítica v2 #5):

```ts
export function useShare() {
  return async ({ title, text, url }: ShareData) => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return { ok: true, method: "native" as const };
      } catch (err) {
        // Usuário cancelou o share nativo — NÃO cair no fallback
        if (err instanceof Error && err.name === "AbortError") {
          return { ok: false, reason: "cancelled" as const };
        }
        // Outras falhas (NotAllowedError, SecurityError) → fallback
      }
    }
    // Fallback explícito (sem ambiguidade com AbortError)
    try {
      await navigator.clipboard.writeText(url ?? "");
      toast.success("Link copiado");
      return { ok: true, method: "clipboard" as const };
    } catch {
      toast.error("Não foi possível compartilhar");
      return { ok: false, reason: "failed" as const };
    }
  };
}
```

### Update existente

`apps/web/modules/map/ui/components/trade-point-card.tsx:79-89` — substituir o `onClick` que dispara `toast.info("Página do ponto em breve")` por `<Link href={`/points/${point.\_id}`}>` envolvendo o `<Button>` "Ver detalhes".

---

## Mapeamento crítica → fix

### Críticas v1 (16)

| #   | Crítica                        | Resolução                                                                 |
| --- | ------------------------------ | ------------------------------------------------------------------------- |
| 1   | peakHours sem decay            | Cron semanal `decayPeakHours` \* 0.8 (paginado — ver v2 #2)               |
| 2   | Race condition contadores      | OCC do Convex trata; pattern read-modify-write é idiomático. Sem mudança. |
| 3   | Auth duplication               | `checkAuth` único; helpers compartilhados                                 |
| 4   | Cron stillExists redundante    | Removido (Convex tx atômica)                                              |
| 5   | Global rate limit UX           | **Auto-overwrite** (decisão do usuário) + renewal early-return (v2 #3)    |
| 6   | whatsappBlocked boolean        | Enum `WhatsappAccessState` em `lib/whatsapp.ts`                           |
| 7   | Falta needs-onboarding         | Adicionado ao `checkAuth` e ao retorno de `getById`                       |
| 8   | SEO slug URL                   | Out of scope (rota `(marketing)/ponto/[slug]` já existe separada)         |
| 9   | countedInPublic stale          | Mantido; `cleanupForShadowBannedUser` cobre janela curta                  |
| 10  | peakHours race                 | Mesma de #2 (OCC)                                                         |
| 11  | FREE_USER_MAX_POINTS hardcoded | Movido para `lib/limits.ts`                                               |
| 12  | .collect() para contar         | `.take(LIMIT + 1)` early-exit                                             |
| 13  | router.replace no render       | `useEffect`                                                               |
| 14  | Kibo UI ausente                | N/A — Kibo não está no projeto; `@workspace/ui` (shadcn) é a convenção    |
| 15  | Enumeração via getById         | Aceito para MVP (auth-only mitiga; `not-found` ≠ probing massivo)         |
| 16  | Cooldown join/leave            | Deferido — limite 3 pontos free é controle suficiente                     |

### Críticas v2 (5)

| #   | Crítica                                                                          | Resolução                                                                                                                                                                                          |
| --- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `requireAuthMutation` throw quebra contrato                                      | Removido. Mutations chamam `checkAuth` direto e retornam `authStateAsError(auth)` (discriminated union). Throw fica só para invariantes (NaN, lat/lng inválido).                                   |
| 2   | `decayPeakHours` sem paginação                                                   | Implementado com `.paginate()` + cursor persistido em nova tabela `cronState`. Auto-reschedule via `ctx.scheduler.runAfter(0, ...)` se `!page.isDone`. Nunca usa `.collect()` em tabela escalável. |
| 3   | Auto-overwrite no mesmo ponto = wasted writes + flicker UI + bump duplo de score | Early-return: se `previous.tradePointId === tradePointId`, só `patch(expiresAt)`. Retorna `{ renewed: true }`. Sem mexer em peakHours/score/contador.                                              |
| 4   | `leave` + cron race → double-decrement                                           | Ordering explícito: read checkin → capturar `countedInPublic` → delete checkin → delete membership → re-ler ponto → patch único com ambos contadores. OCC retry re-deriva tudo (sem stale state).  |
| 5   | `use-share.ts` sem AbortError → clipboard sem permissão                          | Catch específico para `err.name === "AbortError"` retorna early; fallback de clipboard só em outras falhas.                                                                                        |

### Críticas v3 (3)

| #   | Crítica                                                                                 | Resolução                                                                                                                                                                                                              |
| --- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Cursor de `.paginate()` não estável entre deploys → cronState pode pular docs ou erroar | (a) Reset defensivo se `Date.now() - lastRunAt > 8 dias` (cron é semanal, gap maior = deploy); (b) `try/catch` ao redor do `paginate` que zera cursor + retorna `aborted: true` para próximo tick continuar do início. |
| 2   | Auto-reschedule pode driftar/loopar competindo com tráfego                              | `MAX_RESCHEDULES = 500` (suporta ~25k pontos/semana). Excedido → para de re-agendar e loga; cursor salvo, próximo cron semanal retoma. Arg `chunk` carrega o contador entre re-agendamentos.                           |
| 3   | `leave` usa `.collect()` quando invariante "1 ativo global" garante `.first()`          | Trocado para `.first()` + variável escalar. Documenta o invariante no comentário. Remove loop, simplifica leitura.                                                                                                     |

### Críticas v4 (2)

| #   | Crítica                                                                                           | Resolução                                                                                                                                                                                                                                 |
| --- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `cronState .unique()` quebra se race causar dois inserts (Convex sem unique constraint)           | **REVISADO em v5 #2:** `.collect()` + dedupe defensivo + delete extras na mesma tx. `.first()` foi insuficiente.                                                                                                                          |
| 2   | View passa `data.point` inteiro → todos children re-renderizam em qualquer push reativo do Convex | Desestruturação na view + props primitivos por filho + `React.memo` em todos os componentes. Re-render só dispara para o filho cujo prop específico mudou (ex: counter muda → só `point-actions` re-renderiza, não o hero/chart/matches). |

### Críticas v5 (6)

| #   | Crítica                                                               | Resolução                                                                                                                                                                                                                                                                                             |
| --- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Auth-only não mitiga enumeração de pontos (~30min de scrape)          | **REVISADO em v7 #1:** posição honesta — dados de pontos aprovados são tratados como públicos (mesma exposição do `/cidade/[slug]`). Defesa anti-scraping (rate limit por edge IP, captcha) deferida para hardening separado, ativada se evidência aparecer. Threat model documentado explicitamente. |
| 2   | `cronState .first()` é bug disfarçado (cursores divergentes)          | **REVISADO em v7 #6:** revertido para `.first()` simples. Race só pode acontecer no primeiro insert; cron weekly + auto-reschedule sequencial garante zero concorrência depois disso. Doc órfão em race rara é inerte.                                                                                |
| 3   | `decay 0.8` aniquila peakHours antes do fim da Copa (5 meses)         | Mudado para **0.9** (10% retenção em 22 sem). Adicionado **floor pós-atividade** (`Math.max(decayed, 1)` se `original > 0`) — preserva sinal binário "tem movimento aqui" mesmo com decay. Tabela comparativa documenta a escolha.                                                                    |
| 4   | Plano não confirma `by_user_active` no schema                         | Confirmado via exploração: índice **já existe**. Adicionada seção "Índices que JÁ EXISTEM" no schema docs para evitar suposições.                                                                                                                                                                     |
| 5   | `cleanupForShadowBannedUser` sem caller no plano                      | Documentado como **scaffolding intencional** para tela de admin/moderação (fora deste escopo). JSDoc explícito; se admin demorar > 1 sprint, mover para junto com a feature de moderação.                                                                                                             |
| 6   | URL opaca + Web Share sem OG → preview quebrado em WhatsApp/Instagram | Server component ganha `generateMetadata` (agora tem propósito real). Nova query pública `tradePoints.getMetadataPublic` (sem auth, retorna `{ name, cityName }` — mesma info já no `/cidade/[slug]`). OG/Twitter card "summary" no v1; per-point OG image dinâmica deferida.                         |

### Críticas v6 (2) — REVISADAS em v7/v9

| #   | Crítica original                      | Status final                                             |
| --- | ------------------------------------- | -------------------------------------------------------- |
| 1   | `touchView` re-render loop            | **Obsoleto.** v7 #1 + #3 → `touchView` removido inteiro. |
| 2   | Janela de 5min do `needs-view-record` | **Obsoleto.** v7 #1 → gate inteiro removido.             |

### Críticas v7 (7) — REVISADAS em v10

| #   | Crítica                                                                         | Resolução                                                                                                                                                            |
| --- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Gate de `needs-view-record` é trivialmente bypassável                           | **Removido inteiro.** Posição honesta: dados de pontos aprovados são públicos para autenticados (mesma exposição do mapa).                                           |
| 2   | `getMetadataPublic` sem rate limit é o vetor primário ignorado                  | **Removido o rate limit em todos os pontos** (consistência). `getMetadataPublic` permanece pública sem gate.                                                         |
| 3   | `useRef + eslint-disable` é patch contra preocupação não-verificada             | **Obsoleto** com remoção do `touchView`. Useffect/useRef inteiro deletado da view.                                                                                   |
| 4   | `VIEW_RECORD_WINDOW_MS = CHECKIN_DURATION_MS` acopla conceitos não-relacionados | **Obsoleto** — constante deletada com remoção do gate.                                                                                                               |
| 5   | `pointViewLog` cresceria 900k rows/mês — pruning não pode ser deferido          | **Resolvido** removendo a tabela.                                                                                                                                    |
| 6   | `cronState` dedupe ainda tem TOCTOU                                             | **REVISADO em v8 #6:** cronState INTEIRO removido. `decayPeakHours` agora usa `.collect()` simples. ~80 linhas removidas.                                            |
| 7   | `peak-hours-chart` React.memo default falha                                     | **REVISADO em v8 #7:** comparador customizado substituído por hook genérico `useStableValue<T>(value)` reutilizável para qualquer prop array/objeto vinda de Convex. |

### Críticas v8 (9) — REVISADAS em v11

| #   | Crítica                                                                  | Resolução                                                                                                                                          |
| --- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `peakHours` usa `getUTCHours()` → heatmap deslocado 3h para users em BRT | `getBrazilHour(timestamp)` em `lib/geo.ts` (crítica v9 #4 corrigiu localização). Brasil fixo UTC-3 sem DST desde 2019. Server salva em hora local. |
| 2   | `generateMetadata` sem cache                                             | **Obsoleto** — `generateMetadata` removido inteiro (crítica v9 conjuntas).                                                                         |
| 3   | `leave` cancela check-in silenciosamente                                 | `<AlertDialog>` quando `hasActiveCheckin === true`.                                                                                                |
| 4   | `MatchesSection` sem dono claro                                          | Documentado: F14 → tela de Matches (escopo separado). TODO marcado.                                                                                |
| 5   | `confidenceScore +0.5` sem cap → gaming via leave/re-join                | **REVISADO em v9 #1:** tabela `scoreBumps(userId, tradePointId, at)` independente de membership. Sobrevive a leave/join. `+0.2` com cap 24h.       |
| 6   | `cronState + MAX_RESCHEDULES + stale cursor` overkill                    | Removido tudo. `decayPeakHours` faz `.collect()`. Threshold conservador 3000 (crítica v9 #3).                                                      |
| 7   | `arePeakHoursEqual` é caso particular de padrão geral                    | Hook `useStableValue<T>(value)` reutilizável (8 linhas).                                                                                           |
| 8   | OG "summary" sem imagem fica feio também                                 | **Obsoleto** — `generateMetadata` removido inteiro.                                                                                                |
| 9   | `generateMetadata` sem canonical                                         | **Obsoleto** — `generateMetadata` removido inteiro.                                                                                                |

### Críticas v9 (8) — REVISADAS em v10/v12

| #   | Crítica                                   | Resolução                                                                                                                                    |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `lastScoreBumpAt` gamável                 | Tabela `scoreBumps` independente. **REVISADO em v10 #1+#2:** índice `by_at` para cleanup cron + índice `by_user` para limpeza no shadow ban. |
| 2   | OG "summary" sem imagem                   | Resolvido removendo OG (auth-gated).                                                                                                         |
| 3   | `console.warn` em decayPeakHours dead obs | `throw` em vez de warn; threshold 3000.                                                                                                      |
| 4   | `getBrazilHour` em lib errado             | Movido para `lib/geo.ts`.                                                                                                                    |
| 5   | `revalidate = 3600` mente                 | **REVISADO em v10 #3:** `metadata` estático mínimo (3 linhas, sem cache, sem fetch) substitui `generateMetadata` removido.                   |
| 6   | `canonical` para slug inexistente         | Obsoleto (canonical removido).                                                                                                               |
| 7   | OG description genérico desperdiça AEO    | Obsoleto (OG removido).                                                                                                                      |
| 8   | Sem `robots: noindex` em rota auth        | **REVISADO em v10 #4:** `app/robots.ts` com `Disallow: /points/`. Mais robusto que meta tag.                                                 |

### Críticas v10 (4)

| #   | Crítica                                               | Resolução                                                                                                                                                                  |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `scoreBumps` cresce 4.5M rows em 5 meses sem cleanup  | Cron weekly `pruneScoreBumps` deleta rows com `at < now - 48h`. Índice novo `by_at` em scoreBumps. **REVISADO em v11 #1:** + `MAX_CHUNKS` guard contra loop em cold start. |
| 2   | `scoreBumps` não limpa em shadow ban / delete account | `cleanupForShadowBannedUser` limpa via índice `by_user`. Documentado no JSDoc para futura tela de delete-account.                                                          |
| 3   | Removendo OG perde fallback para Slack/Discord        | `metadata` estático mínimo (3 linhas).                                                                                                                                     |
| 4   | Auth-redirect não impede Google indexar URL canônica  | `app/robots.ts` com `Disallow: /points/`.                                                                                                                                  |

### Críticas v11 (4)

| #   | Crítica                                                                     | Resolução                                                                                                                                                                           |
| --- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `pruneScoreBumps` pode loopar em cold start (50k backlog → 500 reschedules) | `PRUNE_MAX_CHUNKS = 100` (≈10k rows/run). Excedido → para e loga; backlog restante drena no próximo cron weekly. Mesmo padrão do `MAX_RESCHEDULES` que a v3 usou no decay original. |
| 2   | `point-header.tsx` ausente da tabela de Arquivos                            | Adicionado: `apps/web/modules/trade-points/ui/components/point-header.tsx`.                                                                                                         |
| 3   | `use-stable-value.ts` ausente da tabela                                     | Adicionado: `apps/web/modules/trade-points/lib/use-stable-value.ts`.                                                                                                                |
| 4   | Descrição de `schema.ts` ainda menciona `cronState` (já removida em v8)     | Corrigido: agora descreve adições reais (5 campos `users` + tabela `scoreBumps`).                                                                                                   |

---

## Verificação

### Backend (typecheck + Convex codegen)

```bash
cd packages/backend && pnpm convex codegen && pnpm tsc --noEmit
```

- Schema migra sem erro (todos campos novos optional)
- `api.tradePoints.getById` aparece em `_generated/api.d.ts`
- `crons.ts` é reconhecido pelo Convex (`pnpm convex dev` mostra os jobs)

### Frontend (typecheck + lint + build)

```bash
cd apps/web && pnpm tsc --noEmit && pnpm lint && pnpm build
```

### Smoke test E2E (manual)

1. `pnpm dev` na raiz; logar como usuário com onboarding completo.
2. Navegar para `/map`, clicar em um ponto, clicar "Ver detalhes" → deve carregar `/points/[id]`. **DevTools network**: ver `getById` query rendendo dados.
3. **Auth gate em crawler (crítica v9 #5/#8):** `curl -A "WhatsApp/2.0" -i http://localhost:3000/points/[id]` → resposta HTTP `307` ou `302` redirect para `/sign-in` (middleware `auth.protect()`). Sem metadata gerada — confirma que OG na rota auth é teatro.
   3a. **Robots disallow (crítica v10 #4):** `curl http://localhost:3000/robots.txt` → resposta inclui `Disallow: /points/`.
   3b. **Static metadata fallback (crítica v10 #3):** logado, abrir DevTools → ver `<title>Ponto de Troca — Figurinha Fácil</title>` no `<head>` (sem fetch Convex; vem do export `metadata`).
4. **Re-render via useStableValue (crítica v7 #7 + v8 #7):** instalar React DevTools Profiler. Abrir página, ativar profile. Ter outro usuário (ou Convex dashboard) fazer check-in → `activeCheckinsCount` muda na UI. Verificar profile: `point-actions` re-renderizou (esperado), mas `peak-hours-chart` **NÃO** re-renderizou (`useStableValue` manteve ref estável apesar de Convex retornar novo array).
5. Clicar "Participar" → contagem incrementa (verificar reatividade na Tela 6 também).
6. Clicar "Estou aqui agora" → permitir GPS → check-in cria; contagem ativos incrementa.
7. **Renewal (crítica v2 #3):** Clicar "Estou aqui agora" novamente NO MESMO ponto → contador ativos NÃO oscila (sem 5→4→5); `confidenceScore` NÃO aumenta de novo; toast "Check-in renovado por mais 2h".
8. Em segundo ponto, repetir check-in → primeiro deve sumir, segundo aparece (auto-overwrite); toast confirma "Check-in movido".
9. Clicar "Sair" → `participantCount` -1 e `activeCheckinsCount` -1 (atomicamente, mesma tx).
10. Compartilhar → no mobile com `navigator.share`, cancelar a sheet nativa → **NÃO** copiar pra clipboard; toast não aparece (crítica v2 #5).
11. Compartilhar de novo, completar share → toast "Compartilhado".
12. Em desktop sem `navigator.share`, clicar Compartilhar → fallback clipboard + toast "Link copiado".
13. Mudar `users.ageGroup` para `"child"` no DB e remover `parentalConsentAt` → botão WhatsApp deve mostrar tooltip "Aguardando consentimento parental".
14. Setar `tradePoints.whatsappLinkStatus: "invalid"` → tooltip muda para "Link sendo verificado".
15. Setar `users.isBanned: true` → recarregar página → ver `<BannedState>` sem redirect loop. **Tentar `join` mutation pelo Convex dashboard** → deve retornar `{ ok: false, error: "banned" }` (não throw — crítica v2 #1).
16. Setar `users.hasCompletedOnboarding: false` → query `getById` retorna `state: "needs-onboarding"`; mutation `join` retorna `{ ok: false, error: "needs-onboarding" }`.

### Cron sanity

- Triggar `internal.checkins.expireCheckins` manualmente via Convex dashboard → ver `activeCheckinsCount` decrementar.
- Triggar `internal.checkins.decayPeakHours` manualmente:
  - Com seed de N pontos approved → retorno `{ processed: N }`. Verificar que `peakHours` de cada ponto reduziu ~10% (multiplicado por 0.9 — crítica v5 #3); horas que tinham valor ≥1 e que `Math.floor(v * 0.9) === 0` ficam fixadas em 1 (floor pós-atividade).
  - **Threshold throw (crítica v9 #3):** seedar >3000 pontos approved e triggar → mutation **falha visivelmente** com `Error: decayPeakHours: 3000 approved points >= threshold 3000. Re-introduzir paginação...`. Convex dashboard registra erro. Cron stops, force action.
- **Race test (crítica v2 #4):** abrir 2 abas, simular `leave` em uma e `expireCheckins` na outra simultaneamente para mesmo userId/tradePointId → `activeCheckinsCount` final deve refletir o estado correto (sem double-decrement). OCC retry deve aparecer nos logs.
- **Score cap (crítica v8 #5 + v9 #1):** fazer check-in num ponto → `confidenceScore` sobe +0.2 e nova row em `scoreBumps`. Mover-se 600m+ pra fora, voltar, novo check-in → score **NÃO** sobe (cooldown 24h). **Crítico:** fazer `leave` + `join` no mesmo ponto, depois novo check-in → score **NÃO** sobe (tabela scoreBumps é independente de membership — não é gamável). Após 24h, novo check-in volta a bumpar.
- **scoreBumps cleanup cron (crítica v10 #1):** seedar 100 rows com `at < now - 48h`; triggar `internal.checkins.pruneScoreBumps` → todas devem ser deletadas; rows mais novas continuam.
- **MAX_CHUNKS guard (crítica v11 #1):** seedar 15.000 rows velhas; triggar `pruneScoreBumps` → após ≈100 reschedules deve retornar `{ aborted: true }`. Próximo cron weekly drena o resto.
- **scoreBumps no shadow ban (crítica v10 #2):** seedar 5 rows do userId X; chamar `internal.checkins.cleanupForShadowBannedUser({ userId: X })` → todas as rows do X em scoreBumps + checkins ativos somem.
- **Timezone (crítica v8 #1):** fazer check-in às 14h horário Brasília no dashboard. Inspecionar `tradePoints.peakHours` no DB → posição `[14]` deve incrementar (não `[17]`).
