# Plano — Atualização do PRD FigurinhaMatch v2 → v3

## Contexto

O PRD original foi escrito antes do código e hoje há divergências em schema, rotas, features e decisões técnicas. Este plano mapeia cada conflito com o código atual e registra a regra correta (decidida pelo usuário) para gerar o PRD v3 alinhado à realidade.

Nenhum código será editado. O produto final deste plano é o próprio PRD atualizado (substituto do v2).

## Fontes de verdade já exploradas

- `packages/backend/convex/schema.ts` (177 linhas)
- `packages/backend/convex/{users,cities,tradePoints,checkins,stickers,matches,userTradePoints,permissions,crons,seedAlbumConfig}.ts`
- `packages/backend/convex/_helpers/pagination.ts`
- `packages/backend/convex/auth.config.ts`
- `apps/web/app/**` (rotas), `apps/web/modules/**` (features), `apps/web/package.json`
- `packages/ui/src/components/**` (shadcn + kibo-ui)

---

## Conflitos identificados (para decisão)

### Bloco A — Schema `users`

| #   | Campo / regra          | PRD v2 diz                           | Código diz                                                | Status        | Decisão                                                           |
| --- | ---------------------- | ------------------------------------ | --------------------------------------------------------- | ------------- | ----------------------------------------------------------------- |
| A1  | Apelido público        | `name: string` (único)               | `name` + `nickname` + `displayNickname` (3 campos)        | divergente    | ✅ **3 campos (código)**                                          |
| A2  | Data de nascimento     | `birthDate: ISO string`              | `birthDate: number` (timestamp)                           | divergente    | ✅ **number (timestamp ms)**                                      |
| A3  | Expiração premium      | `premiumExpiresAt`, `boostExpiresAt` | só `isPremium` (bool)                                     | PRD a mais    | ✅ **manter os 3 como requisito** (incluir `warningCount` também) |
| A4  | Advertências           | `warningCount: number`               | não existe                                                | PRD a mais    | ✅ (ver A3)                                                       |
| A5  | Roles/sectores         | não existe no PRD                    | `role`, `sector` (SUPERADMIN/CEO/USER)                    | código a mais | ✅ **incorporar ao PRD v3**                                       |
| A6  | Soft-delete            | não existe no PRD                    | `deletionPending`, `cleanupStatus`, `cleanupInProgressAt` | código a mais | ✅ **incorporar ao PRD v3**                                       |
| A7  | Rate limit submissions | não existe no PRD                    | `pendingSubmissionsCount`, `lastSubmissionAt`             | código a mais | ✅ **incorporar ao PRD v3**                                       |
| A8  | Rate limit localização | não existe no PRD                    | `locationUpdatedAt`, `locationUpdateTimestamps[]`         | código a mais | ✅ **incorporar ao PRD v3**                                       |
| A9  | Flag de onboarding     | só `hasCompletedOnboarding`          | `hasCompletedOnboarding` **e** `hasCompletedStickerSetup` | código a mais | ✅ **manter 2 flags (onboarding em 2 etapas)**                    |

### Bloco B — Schema `tradePoints`, `checkins`, `albumConfig`

| #   | Ponto                   | PRD v2 diz                                                    | Código diz                                        | Status        | Decisão                                    |
| --- | ----------------------- | ------------------------------------------------------------- | ------------------------------------------------- | ------------- | ------------------------------------------ |
| B1  | Status do ponto         | pending/approved/suspended/inactive                           | + **expired** (30 dias pendente)                  | código a mais | ✅ **incorporar `expired`**                |
| B2  | Campo extra do ponto    | —                                                             | `slug`, `participantCount`, `activeCheckinsCount` | código a mais | ✅ **incorporar os 3**                     |
| B3  | Check-in público        | —                                                             | `countedInPublic` (filtra shadow-banned)          | código a mais | ✅ **incorporar** (fluxo de shadow-ban)    |
| B4  | Tabela auxiliar         | —                                                             | `scoreBumps` (cooldown de thumbs-up)              | código a mais | ✅ **incorporar** (cooldown anti-spam)     |
| B5  | albumConfig — base      | `totalBase` (base sem extras)                                 | não existe                                        | PRD a mais    | ✅ **manter no PRD + adicionar ao schema** |
| B6  | albumConfig — especiais | `specialNumbers[]` com categoria (metalizada/legend/paralela) | não existe                                        | PRD a mais    | ✅ **manter no PRD + adicionar ao schema** |
| B7  | albumConfig — FIFA      | —                                                             | `section.code` (BRA, ARG…)                        | código a mais | ✅ **incorporar ao PRD**                   |
| B8  | albumConfig — updatedAt | `updatedAt` obrigatório                                       | não existe                                        | PRD a mais    | ✅ **manter no PRD + adicionar ao schema** |

### Bloco C — Tabelas faltantes no código

| #   | Tabela               | PRD v2                          | Código                                       | Decisão                             |
| --- | -------------------- | ------------------------------- | -------------------------------------------- | ----------------------------------- |
| C1  | `precomputedMatches` | tabela principal do matching    | não existe; `matches.ts` só loga             | ✅ **criar tabela + cron (PRD v2)** |
| C2  | `trades`             | confirmação bilateral (F17)     | não existe                                   | ✅ **MVP**                          |
| C3  | `reports`            | denúncias com categorias (§2.5) | não existe (só `reportCount` em tradePoints) | ✅ **MVP**                          |

### Bloco D — Rotas

| #   | PRD v2                                                                           | Código                                                                                                                                                                                                      | Decisão                                                                                                                           |
| --- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| D1  | `/ponto/[id]` (único)                                                            | `/ponto/[slug]` (público) **+** `/points/[tradePointId]` (auth)                                                                                                                                             | ✅ **manter as duas** (pública para SEO, privada para matches/check-in)                                                           |
| D2  | `/matches`                                                                       | não existe (só placeholder dentro de `/points/[id]`)                                                                                                                                                        | ✅ **criar rota global** (+ seção dentro do ponto)                                                                                |
| D3  | `/perfil`, `/perfil/[name]`                                                      | não existem                                                                                                                                                                                                 | ✅ **MVP** — usar `/perfil/[nickname]`                                                                                            |
| D4  | `/ranking/[slug]`                                                                | não existe                                                                                                                                                                                                  | ✅ **MVP**                                                                                                                        |
| D5  | `/premium`                                                                       | não existe                                                                                                                                                                                                  | ✅ **MVP**                                                                                                                        |
| D6  | `/admin`, `/admin/pontos`, `/admin/denuncias`, `/admin/album`, `/admin/usuarios` | só `/admin/users`                                                                                                                                                                                           | ✅ **Admin em inglês** (`/admin`, `/admin/users`, `/admin/points`, `/admin/reports`, `/admin/album`); rotas públicas em português |
| D7  | —                                                                                | `/dashboard`, `/como-funciona`, `/sobre`, `/termos`, `/privacidade`, `/contato`, `/album-copa-do-mundo-2026`, `/cadastrar-figurinhas`, `/selecionar-localizacao`, `/bootstrap`, `/complete-profile`, `/map` | — (decidir a seguir)                                                                                                              |

### Bloco E — Features e decisões técnicas

| #   | Ponto                          | PRD v2                              | Código                       | Decisão                                                             |
| --- | ------------------------------ | ----------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| E1  | Matching                       | pré-computado via cron + tabela     | on-demand, log-only          | ✅ **pré-computado (MVP)**                                          |
| E2  | Camadas 1/2/3                  | por distância entre pontos          | só bilateral em `matches.ts` | ✅ **2 camadas**: Layer 1 mesmo ponto, Layer 2 qualquer ponto ≤50km |
| E3  | Premium (gate)                 | Camada 2 limite, Camada 3 exclusiva | nenhum gate                  | ✅ **tudo livre no MVP**; premium funcional é pós-MVP               |
| E4  | Virtualização do grid (F09)    | obrigatório                         | grid CSS sem virtualização   | ✅ **pós-MVP** (aceito como débito técnico)                         |
| E5  | isSpecial / categorias         | badge dourado                       | não implementado             | ✅ **pós-MVP**                                                      |
| E6  | Push notifications (F15)       | Web Push + VAPID                    | só schema field              | ✅ **pós-MVP**                                                      |
| E7  | Confirmação bilateral (F17)    | obrigatória                         | não existe                   | ✅ **MVP**                                                          |
| E8  | Tela segurança (F18)           | bloqueante 1x                       | só schema field              | ✅ **pós-MVP**                                                      |
| E9  | Ranking (F19/F20)              | por ponto e cidade                  | não existe                   | ✅ **pós-MVP**                                                      |
| E10 | Perfil público (F21)           | page compartilhável                 | não existe                   | ✅ **MVP** (página existe; agregações sociais depois)               |
| E11 | Celebração álbum (F23)         | full-screen + OG image              | não existe                   | ✅ **MVP**                                                          |
| E12 | Admin — aprovação pontos (F24) | UI obrigatória                      | não existe                   | ✅ **MVP**                                                          |
| E13 | Admin — dashboard (F25)        | métricas                            | não existe                   | ✅ **pós-MVP**                                                      |
| E14 | Admin — denúncias (F14)        | UI obrigatória                      | não existe                   | ✅ **pós-MVP** (moderação via Convex dashboard no MVP)              |
| E15 | Admin — ban/shadow-ban (F27)   | UI                                  | só edição de roles           | ✅ **pós-MVP**                                                      |
| E16 | Progresso coletivo (F22)       | barra por ponto/cidade              | não existe                   | ✅ **pós-MVP**                                                      |

### Bloco F — Crons

| #   | PRD v2                           | Código                                                                                 | Decisão                           |
| --- | -------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------- |
| F1  | `decayConfidenceScores` (-1/24h) | **não existe**                                                                         | ✅ **MVP**                        |
| F2  | `expireCheckins` (30min)         | existe                                                                                 | ✅ mantém                         |
| F3  | `batchRecomputeMatches` (6h)     | não existe                                                                             | ✅ **MVP**                        |
| F4  | `deactivateStalePoints` (diária) | **não existe**                                                                         | ✅ **MVP**                        |
| F5  | `checkWhatsAppLinks` (diária)    | **não existe**                                                                         | ✅ **pós-MVP**                    |
| F6  | `expirePremiums` (1h)            | **não existe**                                                                         | ✅ **pós-MVP** (acompanha Stripe) |
| F7  | —                                | `decayPeakHours` (semanal), `pruneScoreBumps` (semanal), `expireStalePending` (diária) | ✅ **documentar no PRD v3**       |

### Bloco G — Monetização

| #   | Ponto                  | PRD v2                          | Código       | Decisão                                                                            |
| --- | ---------------------- | ------------------------------- | ------------ | ---------------------------------------------------------------------------------- |
| G1  | Stripe + PIX           | obrigatório MVP                 | não existe   | ✅ **Sprint 2 pós-MVP**                                                            |
| G2  | AdSense/AdMob          | obrigatório MVP                 | não existe   | ✅ **fora do escopo v3**                                                           |
| G3  | Boost (R$4,90/24h)     | schema `boostExpiresAt`         | não existe   | ✅ **pós-MVP** (depende de Stripe)                                                 |
| G4  | Preço premium          | R$9,90/mês ou R$19,90/temporada | —            | ✅ **manter referência**, valor confirmado no lançamento da cobrança               |
| G5  | /premium no MVP        | —                               | não existe   | ✅ **landing + waitlist** (coleta email)                                           |
| G6  | Moderação de reports   | UI admin                        | —            | ✅ **MVP via Convex dashboard** (manual)                                           |
| G7  | Menores <12            | fluxo parental obrigatório      | não existe   | ✅ **não bloquear** — coletar birthDate, calcular ageGroup, fluxo parental pós-MVP |
| G8  | /termos e /privacidade | compliance                      | rotas vazias | ✅ **MVP publicar textos**                                                         |

---

---

# PRD v3 — FigurinhaMatch (alinhado ao código em abr/2026)

**Produto:** PWA de troca de figurinhas do álbum da Copa do Mundo 2026, organizada por Pontos de Troca com matching pré-computado, verificação comunitária modelo Waze e modelo de segurança anti-contato direto.

**Status atual:** stack base em produção (Next.js 15 + Convex + Clerk + Leaflet/OSM), 45-50% das features do PRD v2 implementadas. Este PRD v3 redefine o escopo MVP considerando o que já existe.

**Visão, princípios, personas, janela de mercado e álbum:** mantidos do PRD v2 (§ visão, princípio inegociável, público, janela, álbum Copa 2026, diferencial competitivo) — sem alterações.

---

## 1. Escopo MVP (v3) — resumo executivo

**MVP entrega:**

- Onboarding completo (idade, cidade, localização, figurinhas) — já funciona no código.
- Mapa Leaflet/OSM com pontos de troca — já funciona.
- Album, check-in, participação em pontos — já funciona.
- **Novos para MVP:** matching pré-computado (2 camadas), confirmação bilateral de troca, denúncias via tabela (moderação manual), admin de aprovação de pontos, `/matches` global, `/perfil/[nickname]`, `/ranking/[slug]`, `/premium` landing+waitlist, celebração álbum completo.
- Compliance textual: `/termos` e `/privacidade` publicados.

**Fora do MVP (pós-lançamento):**

- Monetização paga: Stripe, PIX, boost, premium funcional.
- Ads: **fora do escopo v3** inteiramente.
- Gamificação social: rankings, progresso coletivo, badges agregados.
- Push notifications.
- Virtualização do grid (débito técnico aceito).
- Tela de segurança pré-encontro bloqueante.
- Fluxo de consentimento parental <12 anos (coleta birthDate, calcula ageGroup; sem email do responsável no MVP).
- Figurinhas especiais (badge metalizada/legend/paralela).
- Admin UI para denúncias, dashboard, ban/shadow-ban (moderação via Convex dashboard no MVP).

---

## 2. Segurança — ajustes sobre v2

§2.1 **princípios** e §2.2 **ponto de troca**: mantidos do v2.

§2.3 **Verificação comunitária (Waze):**

- `confidenceScore` no tradePoint (já existe).
- `reliabilityScore` no user (já existe, inicializado em 3).
- Check-in com validação GPS ≤500m, expira em 2h (já existe).
- **Novo:** tabela auxiliar `scoreBumps` garante cooldown entre thumbs-up do mesmo user no mesmo ponto.
- **Novo:** campo `countedInPublic: boolean` no checkin filtra usuários shadow-banned das métricas públicas.
- **Cron `decayConfidenceScores`**: MVP (novo).
- **Cron `deactivateStalePoints`**: MVP (confidence 0 por 7 dias → `inactive`).

§2.4 **Proteção de menores:**

- MVP: coletar `birthDate` (timestamp) + calcular `ageGroup` (child/teen/young/adult). Sem fluxo parental bloqueante, sem badges "menor acompanhado".
- Texto em `/termos` e `/privacidade` com avisos.
- Campos `guardianName`, `guardianEmail`, `parentalConsentAt` existem no schema mas só são preenchidos pós-MVP (fluxo parental completo + badges).

§2.5 **Denúncia e moderação:**

- Tabela `reports` criada (MVP).
- Botão de denúncia na página do ponto e no card de match (MVP).
- Categorias mantidas do v2.
- Auto-ação: 3+ reports em 7 dias → suspensão automática do ponto.
- Admin **resolve reports via Convex dashboard** no MVP. UI dedicada `/admin/reports` é pós-MVP.

§2.6 **Encontros presenciais:**

- Tela bloqueante F18: **pós-MVP** (flag `hasSeenSafetyTips` já existe; UI depois).
- Botão "Compartilhar minha ida": **pós-MVP**.
- Avaliação pós-encontro: **pós-MVP**.

---

## 3. Autenticação — Clerk

Mantido do v2. Confirmado no código (`auth.config.ts`, `ClerkProvider`, middleware, `by_clerk_id` no schema).

**Novidade documentada:**

- Schema tem 3 campos de identidade: `name` (Clerk interno), `nickname` (normalizado único, indexado) e `displayNickname` (visível no UI).
- Bootstrap: primeira conta criada vira SUPERADMIN via mutation `bootstrapSuperadmin` (idempotente). Rota `/bootstrap` dedicada.

**Clerk custo** e **WhatsApp zero-integração**: mantidos do v2.

---

## 4. Funcionalidades MVP v3

### 4.1 Onboarding (F01-F04) — ✅ já implementado

Fluxo encadeado: Clerk sign-up → `/bootstrap` → `/complete-profile` (nickname, birthDate, cidade) → `/cadastrar-figurinhas` (quick input) → `/selecionar-localizacao` (GPS ou manual) → `/dashboard`.

Ajustes sobre v2:

- `birthDate` persistido como **number (timestamp ms)**, não string ISO.
- Duas flags de onboarding: `hasCompletedOnboarding` (perfil pronto) e `hasCompletedStickerSetup` (figurinhas cadastradas).
- Rate limit de atualização de localização via `locationUpdatedAt` + `locationUpdateTimestamps[]`.

### 4.2 Pontos de Troca (F05-F08)

- **F05 Mapa:** ✅ já implementado (Leaflet + OSM + cluster).
- **F06 Página do ponto:** **duas rotas** — `/ponto/[slug]` pública (SEO, compartilhável) + `/points/[tradePointId]` autenticada (matches, check-in, WhatsApp).
- **F07 Solicitar ponto:** ✅ já implementado com rate limit (`pendingSubmissionsCount`).
- **F08 Ciclo de vida:** status inclui `expired` (pendente >30 dias → expira automaticamente via cron `expireStalePending`).
- **Novo:** campos denormalizados `participantCount` e `activeCheckinsCount` no tradePoint (mantidos por mutations, evitam recontagem).

### 4.3 Álbum (F09-F13)

- **F09 Virtualização do grid: pós-MVP.** Grid CSS renderiza 980 itens no MVP (débito técnico aceito).
- **F10 Entrada rápida:** ✅ já implementado (`sticker-quick-input`).
- **F11 Contadores:** MVP com barra de progresso visual.
- **F12 Figurinhas especiais (isSpecial, categorias):** **pós-MVP.**
- **F13 Filtros básicos:** MVP (tabs faltantes/repetidas + busca por número). Filtro de especiais é pós-MVP.

### 4.4 Matching — Duas Camadas, Pré-Computado

Recompute continua via scheduled action + tabela persistente **mas simplificado para 2 camadas**:

- **Camada 1 — Mesmo ponto (0km):** cruzar figurinhas com outros participantes dos meus pontos.
- **Camada 2 — Qualquer ponto ≤50km:** busca em pontos até 50km do meu mais próximo (haversine). Substitui as antigas camadas 2 e 3 do v2.

**Trigger:** `updateStickerList` → `scheduler.runAfter(0, "matches.recomputeForUser")`.
**Cron:** `batchRecomputeMatches` a cada 6h para usuários com `lastActiveAt < 6h`.

**Tabela `precomputedMatches` (nova, MVP):**

```ts
precomputedMatches: defineTable({
  userId: v.id("users"),
  matchedUserId: v.id("users"),
  tradePointId: v.id("tradePoints"),
  theyHaveINeed: v.array(v.number()),
  iHaveTheyNeed: v.array(v.number()),
  isBidirectional: v.boolean(),
  distanceKm: v.float64(),
  layer: v.union(v.literal(1), v.literal(2)),
  computedAt: v.number(),
})
  .index("by_user_layer", ["userId", "layer"])
  .index("by_user_point", ["userId", "tradePointId"])
  .index("by_matchedUser", ["matchedUserId"]);
```

**F14 Tela de matches (MVP):**

- Rota global `/matches` com filtros (ponto, distância, figurinha, apenas bidirecionais).
- Seção matches dentro de `/points/[tradePointId]`.
- **Gate freemium: nenhum no MVP.** Tudo livre.

**F15 Push (pós-MVP):** schema `pushSubscription` existe mas Web Push/VAPID não integrado no MVP.

### 4.5 Fluxo de Troca

- **F16 Combinar no grupo:** mantido (WhatsApp link).
- **F17 Confirmação bilateral (MVP):** nova tabela `trades` conforme schema do PRD v2. Quando ambos confirmam, atualiza álbuns, incrementa `totalTrades` e `confirmedTradesCount`.
- **F18 Tela segurança pré-encontro: pós-MVP.**

### 4.6 Social — MVP mínimo

- **F19 Ranking por ponto: pós-MVP.**
- **F20 Ranking cidade: pós-MVP.** Rota `/ranking/[slug]` existe como shell, mas agregações vêm depois.
- **F21 Perfil público (MVP):** `/perfil/[nickname]` — apelido, % álbum, trocas confirmadas, pontos, reliability score, `/perfil` próprio com mesmas informações + ajustes. Sem badges agregados no MVP.
- **F22 Progresso coletivo: pós-MVP.**
- **F23 Celebração álbum completo (MVP):** full-screen com confetes + card compartilhável (OG image).

### 4.7 Admin

- **F24 Aprovação de pontos (MVP):** fila `pending` → aprovar (com link WhatsApp obrigatório) ou recusar (com motivo). Rota `/admin/points`.
- **F25 Dashboard de métricas: pós-MVP.**
- **F26 CRUD de pontos: pós-MVP** (edição via Convex dashboard).
- **F27 Ban/shadow-ban UI: pós-MVP** (já tem `isBanned`, `isShadowBanned`, mas sem UI — operado via Convex).
- **F28 Config do álbum:** ✅ já implementado via `seedAlbumConfig.ts`.
- **F29 Seed IBGE:** ✅ já implementado.
- **Novo — gestão de usuários (já existe):** `/admin/users` com edição de `role` (SUPERADMIN pode) e `sector` (SUPERADMIN/CEO podem). Próprio user não pode ser editado.

**Convenção de URL do admin:** rotas em **inglês** (`/admin`, `/admin/users`, `/admin/points`, `/admin/reports`, `/admin/album`). Rotas públicas permanecem em português (`/ponto/[slug]`, `/cidade/[slug]`).

---

## 5. Arquitetura Técnica

**Stack confirmado no código:** Next.js 15.4.10 + React 19.1 + Convex 1.25.4 + Clerk 6.36 + TypeScript + Leaflet 1.9.4 + react-leaflet 5.0 + Turborepo + pnpm. PWA (manifest básico; sem service worker ainda — aceito).

**UI:** shadcn-ui + kibo-ui (`packages/ui/src/components/` + `packages/ui/src/components/kibo-ui/`). **Usar kibo-ui primeiro quando houver componente; shadcn puro só como fallback.**

**Monorepo:** `apps/web` + `packages/backend` + `packages/ui`. Features em `apps/web/modules/[feature]/{ui,lib}/`.

### 5.1 Schema Convex v3 (reflete decisões)

Diferenças críticas sobre o schema do PRD v2 (as tabelas não-alteradas ficam iguais):

**users** — adicionar sobre o código atual:

- `premiumExpiresAt: v.optional(v.number())` — pós-MVP mas reservar no schema.
- `boostExpiresAt: v.optional(v.number())` — pós-MVP.
- `warningCount: v.optional(v.number())` — pós-MVP.

Campos já existentes no código que o PRD v2 não previa (agora documentados):

- `name`, `nickname`, `displayNickname` — trio de identidade.
- `role: v.optional(v.string())`, `sector: v.optional(v.string())` — SUPERADMIN/CEO/USER + setor.
- `deletionPending`, `cleanupStatus`, `cleanupInProgressAt` — soft-delete assíncrono (LGPD direito ao esquecimento).
- `pendingSubmissionsCount`, `lastSubmissionAt` — rate limit anti-abuso.
- `locationUpdatedAt`, `locationUpdateTimestamps: number[]` — rate limit de location updates.
- `hasCompletedOnboarding` + `hasCompletedStickerSetup` — onboarding em 2 etapas.

**tradePoints** — confirmar:

- `status` com 5 estados: `pending | approved | suspended | inactive | expired`.
- `slug: v.string()` (URL amigável).
- `participantCount`, `activeCheckinsCount` — counts denormalizados.

**checkins** — confirmar `countedInPublic: v.boolean()` (filtro anti-shadow-ban).

**scoreBumps** (tabela nova v2→v3, já existe no código) — cooldown de thumbs-up.

**albumConfig** — versão final v3 combinando v2 + código:

```ts
albumConfig: defineTable({
  totalStickers: v.number(),
  totalBase: v.number(),              // base sem extras
  sections: v.array(v.object({
    name: v.string(),
    code: v.string(),                  // código FIFA (BRA, ARG, ENG…)
    startNumber: v.number(),
    endNumber: v.number(),
    isExtra: v.optional(v.boolean()),  // Extra Stickers pós-lançamento
  })),
  specialNumbers: v.array(v.object({   // adicionar
    number: v.number(),
    category: v.union(
      v.literal("metalizada"),
      v.literal("legend"),
      v.literal("paralela_bronze"),
      v.literal("paralela_prata"),
      v.literal("paralela_ouro"),
    ),
  })),
  version: v.number(),
  year: v.number(),
  updatedAt: v.number(),               // adicionar
}),
```

**Tabelas novas MVP (não existem no código):**

- `precomputedMatches` (schema definido em §4.4).
- `trades` (idêntica ao PRD v2 — §5.1 original).
- `reports` (idêntica ao PRD v2).

### 5.2 Limites do Convex, 5.3 Cron jobs, 5.4 Páginas, 5.5 Mapa, 5.6 PWA

**Crons MVP v3:**

- `expireCheckins` (30min) — ✅ existe.
- `decayConfidenceScores` (1h) — **novo MVP.**
- `batchRecomputeMatches` (6h) — **novo MVP.**
- `deactivateStalePoints` (diária) — **novo MVP.**
- `decayPeakHours` (semanal) — ✅ existe, manter.
- `pruneScoreBumps` (semanal) — ✅ existe, manter.
- `expireStalePending` (diária) — ✅ existe, cobre tradePoints pending→expired.

**Crons pós-MVP:** `checkWhatsAppLinks` (diária), `expirePremiums` (1h).

**Páginas MVP v3 (lista completa):**
Públicas (pt):

- `/`, `/cidade/[slug]`, `/ponto/[slug]`
- `/perfil/[nickname]` (público)
- `/ranking/[slug]` (shell — agregações pós-MVP)
- `/premium` (landing + waitlist — sem checkout)
- `/como-funciona`, `/sobre`, `/privacidade`, `/termos`, `/contato`, `/album-copa-do-mundo-2026` — já existem no código.

Auth (pt):

- `/dashboard`, `/album`, `/cadastrar-figurinhas`, `/selecionar-localizacao`
- `/complete-profile`, `/bootstrap`
- `/map`, `/points/[tradePointId]`, `/ponto/solicitar`
- `/matches` (**nova MVP**)
- `/perfil` (**nova MVP** — próprio)

Admin (en):

- `/admin` (landing) — pós-MVP
- `/admin/users` — ✅ existe
- `/admin/points` (aprovação) — **nova MVP**
- `/admin/reports` — pós-MVP
- `/admin/album` — pós-MVP

**Mapa:** mantido (Leaflet + OSM).
**PWA:** manifest existe. Service worker + Web Push = pós-MVP.
**Instalação:** prompt customizado Android/iOS = pós-MVP.

---

## 6. Monetização v3

- **Ads (AdSense/AdMob): fora do escopo v3.** Removido por completo.
- **Premium pago: pós-MVP.** Sprint 2 após lançamento.
- **`/premium` no MVP: landing + waitlist** (coleta email para aviso de lançamento).
- **Stripe + PIX: pós-MVP** (Sprint 2).
- **Boost: pós-MVP.**
- **Free/Premium no MVP: sem distinção funcional.** Tudo gratuito. Gates voltam com o Stripe.

**Pagamento (quando entrar):** Stripe Brasil com PIX como método primário.

**Projeção financeira:** recalcular após definir benefícios do premium no Sprint 2 (sem ads, a base muda significativamente).

---

## 7. Cronograma v3

**Sprint 0 — já entregue (no código):** schema base, Clerk, cities seed, landing, onboarding completo, mapa, trade points submission + aprovação pelo backend, grid de figurinhas, check-in, gestão de usuários.

**Sprint MVP 1 (2 sem):** tabelas `precomputedMatches` + `trades` + `reports`; `matches.ts` persistindo resultados; crons de decay + recompute + deactivate; rota `/matches` global.

**Sprint MVP 2 (1 sem):** confirmação bilateral de troca (F17); `/perfil` + `/perfil/[nickname]`; denúncia via UI nos cards.

**Sprint MVP 3 (1 sem):** `/admin/points` (aprovação); celebração álbum completo (F23); `/premium` landing+waitlist; textos `/termos` e `/privacidade`.

**Sprint MVP 4 (1 sem):** QA, performance, SEO das páginas públicas, deploy.

**Pós-MVP (em ordem de prioridade):**

1. Stripe + PIX + premium funcional (Sprint 5-6).
2. Push notifications (F15).
3. Admin UI de denúncias (`/admin/reports`) e ban/shadow-ban (F14, F27).
4. Dashboard de métricas (F25).
5. Rankings e progresso coletivo (F19, F20, F22).
6. Tela de segurança F18, badges menor acompanhado, fluxo parental <12.
7. Virtualização do grid (F09).
8. Figurinhas especiais (F12).
9. Boost, `checkWhatsAppLinks`, `expirePremiums`.

---

## 8. Métricas

Mantidas do v2 com ajustes:

- **North Star:** trocas confirmadas por semana — depende de `trades` MVP.
- **Aquisição/Retenção/Engajamento:** mantidos.
- **Receita:** somente ARPU de premium (ads saíram). Revisar modelo no Sprint 5.

---

## 9. Riscos e Mitigações — deltas sobre v2

- **Galinha/ovo:** mantido.
- **Panini altera álbum:** schema `albumConfig` v3 agora tem `updatedAt` + `specialNumbers[]` versionados.
- **LGPD <12:** **novo risco aceito no MVP** — cadastro aberto sem consentimento parental. Mitigação: priorizar fluxo parental como primeiro pós-MVP; `/termos` e `/privacidade` documentam o gap.
- **Sustentabilidade sem ads:** o v2 dependia de ads como receita primária. V3 remove ads e adia premium → MVP não gera receita. **Runway deve cobrir Sprint 5 (Stripe + premium) com folga.**
- **Performance do grid:** 980 itens sem virtualização pode travar mobile baixo. Aceito como débito; monitorar feedback.

---

## 10. Decisões técnicas inegociáveis v3

1. **Leaflet/OSM** — mantido.
2. **Figurinhas como arrays no user doc** — mantido (`duplicates: number[]`, `missing: number[]`).
3. **Matching pré-computado (MVP)** — tabela `precomputedMatches` + cron 6h. 2 camadas (≤50km) em vez de 3.
4. **Sem ads no v3.** Monetização é premium pós-MVP.
5. **LGPD/menores adiado para pós-MVP** — schema coleta `birthDate` e calcula `ageGroup`, mas sem bloqueios no fluxo. Documentar risco em `/privacidade`.
6. **Admin em inglês, público em português.**
7. **kibo-ui primeiro, shadcn puro só como fallback.**
8. **Nunca Tailwind puro.** Sempre componente shadcn/kibo.

---

## Verificação do PRD v3

Quando este PRD for implementado, validar:

1. **Schema:** `packages/backend/convex/schema.ts` contém tabelas `precomputedMatches`, `trades`, `reports` + campos `premiumExpiresAt`, `boostExpiresAt`, `warningCount` em users + `totalBase`, `specialNumbers[]`, `updatedAt` em albumConfig.
2. **Crons:** `packages/backend/convex/crons.ts` tem `decayConfidenceScores`, `batchRecomputeMatches`, `deactivateStalePoints` (além dos já existentes).
3. **Rotas MVP:** `apps/web/app/**` contém `/matches`, `/perfil`, `/perfil/[nickname]`, `/premium`, `/admin/points`; `/termos` e `/privacidade` com texto real.
4. **F17:** fluxo de troca testado (dois usuários confirmam em sessões separadas, álbuns atualizam).
5. **F23:** usuário completa álbum (999 figurinhas) e vê celebração + OG card.
6. **Matching:** criar 3 users em pontos distintos (0km, 20km, 60km); verificar que layers 1 e 2 aparecem e o de 60km não.
7. **Admin:** SUPERADMIN aprova ponto pendente em `/admin/points` com link WhatsApp.
8. **Compliance:** `/termos` e `/privacidade` publicados e linkados no footer da landing.
