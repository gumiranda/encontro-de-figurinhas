# Plano — Tela 8 · Sugerir Arena (add-ponto)

## Contexto

Rota `/ponto/solicitar` + view `RequestTradePointView` já existem e funcionam (RHF+Zod, `submitRequest`, geolocalização, Sonner). Duas lacunas:

1. **Gate PRD §2.3** "Rate limit: 2 por usuário com Reliability Score < 5, ilimitado acima" — **não existe** no backend (`packages/backend/convex/tradePoints.ts:147-227`). Sem ele, card de quota na UI seria decorativo.
2. **UI diverge do design** (`docs/design/8-add-ponto/add-ponto.html`): faltam hero, safety card, quota card e legenda 24–48h.

Verificações realizadas:

- `users.reliabilityScore` existe como `v.optional(v.number())`.
- Índice `by_requestedBy` existe — **mas filter pós-withIndex faz scan dos pontos do user**. Criar índice composto.
- **Há dois `db.insert("users", ...)`** sem `reliabilityScore`: `users.ts:40` (bootstrapSuperadmin) e `users.ts:69` (createUser). Tornar o campo non-optional sem seed nesses dois inserts = `ArgumentValidationError` no primeiro signup pós-drop.
- Hook `useGeolocation` existe em `apps/web/modules/location/lib/use-geolocation.ts` com API: `status: "idle"|"checking"|"prompting"|"granted"|"denied"|"unavailable"|"timeout"`, `coords: {lat,lng}|null`, `requestPermission()`, `checkPermission()`.
- `robots: { index: false, follow: false }` em `page.tsx:11`. Sem `middleware.ts` específico pra essa rota.
- **Kibo-ui** (https://www.kibo-ui.com/) é registry compatível com shadcn/ui — mesma stack (React + TS + Tailwind + Radix + Lucide). Instala via `npx kibo-ui add <component>` e convive nativamente com os componentes shadcn já em `packages/ui/src/components/` (accordion, badge, button, card, form, input, textarea, typography…). Preferência do projeto: **kibo-ui primeiro** para componentes novos; shadcn só como fallback se kibo não tiver.
- Moderação (approve/reject) ainda não existe — informa a decisão TOCTOU.

## Fase 1 — Backend

### 1.1 Schema

`packages/backend/convex/schema.ts`:

- **Substituir** `.index("by_requestedBy", ["requestedBy"])` por `.index("by_requestedBy_status", ["requestedBy", "status"])`. Grep de segurança antes de remover (§Verificação §2).
- **`users.reliabilityScore: v.number()`** (remover `v.optional`).
- **`users.pendingSubmissionsCount: v.number()`** — contador com significado de negócio. Incrementado em `submitRequest`, decrementado pelo cron de expiração (§1.4) **e obrigatoriamente pela futura mutation de moderação** (approve/reject). Gap documentado no PR description como contrato pendente — sem ele, usuários com 2 aprovações legítimas ficam bloqueados pra sempre (cron só cobre expiração 30d). Ver §1.7.
- **`users.lastSubmissionAt: v.optional(v.number())`** — telemetria leve para o Banner mostrar "Última sugestão há X" via `<RelativeTime>`. Não é hack-OCC; é feature.
- Verificar se `users.isShadowBanned: v.optional(v.boolean())` já existe — se não, adicionar.
- **`tradePoints.slug: v.string()`** — slug SEO-friendly único, formato `<nome-ponto>-<city-slug>-<6hex>` (ex: `banca-do-juca-uberlandia-a3f2e1`). Sufixo hex de 6 chars **sempre presente** (não só em colisão) para prevenir TOCTOU — ver §1.6. Adicionar `.index("by_slug", ["slug"])`.
- Adicionar `"expired"` ao union `tradePoints.status` e índice `by_status_createdAt: ["status", "createdAt"]` (para o cron §1.4).
- Verificar se `tradePoints.lastActivityAt: v.number()` já existe no schema (confirmado em `tradePoints.ts:204-223` no insert com `Date.now()`; se schema não declara, adicionar). Lido pela página pública `/ponto/[slug]` (§3.1) via `<Status>` e `<RelativeTime>`.
- Verificar `tradePoints.confirmedTradesCount: v.number()` — já aparece no insert e em `getById` (`tradePoints.ts:140`) e é retornado pela página pública. Se o schema não declara explicitamente, adicionar.
- `users.isShadowBanned`: mantém `v.optional(v.boolean())` — **não precisa seed** nos dois inserts do §1.2 (undefined é válido; default implícito é "não banido"). Documentar pra não virar pergunta no review.

### 1.2 Seed dos campos novos em TODOS os inserts de user

`packages/backend/convex/users.ts`:

- `users.ts:40` (`bootstrapSuperadmin`) — adicionar `reliabilityScore: 3, pendingSubmissionsCount: 0`.
- `users.ts:69` (`createUser`) — adicionar `reliabilityScore: 3, pendingSubmissionsCount: 0`.
  Sem isso, tornar os campos non-optional quebra o primeiro signup pós-drop com `ArgumentValidationError`.

### 1.3 `tradePoints.ts` — constantes, shadow ban, gate, contador

Constantes no topo:

```ts
const RELIABILITY_UNLIMITED_THRESHOLD = 5;
const MAX_PENDING_SUBMISSIONS = 2;
```

Em `submitRequest`, depois de `checkAuth`:

```ts
if (user.isShadowBanned) {
  return { ok: true as const, tradePointId: null };
}

if (
  user.reliabilityScore < RELIABILITY_UNLIMITED_THRESHOLD &&
  user.pendingSubmissionsCount >= MAX_PENDING_SUBMISSIONS
) {
  return { ok: false as const, error: "rate-limited" as const };
}
```

**Shadow ban silencioso**: `v.id("tradePoints")` faz runtime-validation do formato base32 — retornar string fake (`shadow_<uuid>`) quebra a mutation em produção. Solução: branch de retorno tem `tradePointId: null`, validator expandido (ver bloco abaixo). Frontend trata `tradePointId: null && ok: true` como sucesso silencioso (mesmo toast, mesmo redirect). A fila de moderação não polui, o shadow-banned não sabe que foi filtrado.

**Gate por contador**: lê `user.pendingSubmissionsCount` (campo com significado) em vez de scan do índice. `submitRequest` depois faz:

```ts
await ctx.db.patch(user._id, {
  pendingSubmissionsCount: user.pendingSubmissionsCount + 1,
});
```

Também setar `lastSubmissionAt: Date.now()` no mesmo patch (feature, não hack — alimenta o `<RelativeTime>` do Banner).

**Inserir com `slug`**: antes do `ctx.db.insert("tradePoints", { ... })`, gerar slug via `generateTradePointSlug(ctx, name, city.slug)` (helper §1.6 — assinatura **sempre** `(ctx, name, citySlug)` nessa ordem). Insert passa a ter `slug: generatedSlug` ao lado dos campos atuais.

O patch no user doc dentro da mutation força OCC naturalmente — dois submits concorrentes colidem no mesmo doc e o Convex aborta/retry uma delas, que na segunda leitura vê o contador incrementado e bloqueia.

### 1.4 Cron de expiração — defende fila de moderação

Sem cap global e sem expiração, 100k × 2 pendentes = 200k rows pra admin. Adicionar em `packages/backend/convex/crons.ts` (existe) um job diário:

```ts
crons.daily(
  "expire-pending-trade-points",
  { hourUTC: 6, minuteUTC: 0 },
  internal.tradePoints.expireStalePending
);
```

E a internal mutation em `tradePoints.ts`:

```ts
export const expireStalePending = internalMutation({
  args: {},
  handler: async (ctx) => {
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const stale = await ctx.db
      .query("tradePoints")
      .withIndex("by_status_createdAt", (q) =>
        q.eq("status", "pending").lt("createdAt", cutoff)
      )
      .take(500);
    for (const p of stale) {
      await ctx.db.patch(p._id, { status: "expired" });
      const requester = await ctx.db.get(p.requestedBy);
      if (requester && requester.pendingSubmissionsCount > 0) {
        await ctx.db.patch(requester._id, {
          pendingSubmissionsCount: requester.pendingSubmissionsCount - 1,
        });
      }
    }
  },
});
```

**Schema**: adicionar `"expired"` ao union de `tradePoints.status` (`schema.ts`). Adicionar índice `by_status_createdAt: ["status", "createdAt"]` pro cron ser eficiente.

**Validator `returns` completo** (`tradePoints.ts:158-164` hoje):

```ts
returns: v.union(
  v.object({ ok: v.literal(true), tradePointId: v.id("tradePoints") }),
  v.object({ ok: v.literal(true), tradePointId: v.null() }), // shadow ban silent success
  ...authErrorValidators,
  v.object({ ok: v.literal(false), error: v.literal("city-mismatch") }),
  v.object({ ok: v.literal(false), error: v.literal("invalid-coordinates") }),
  v.object({ ok: v.literal(false), error: v.literal("invalid-fields") }),
  v.object({ ok: v.literal(false), error: v.literal("rate-limited") })
),
```

Dois branches `ok: true` discriminados pelo shape de `tradePointId`. Revisar diff do validator antes do merge.

### 1.6 Slug helper + query pública `getBySlug`

`packages/backend/convex/lib/slug.ts` (novo):

```ts
import type { MutationCtx } from "../_generated/server";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function generateTradePointSlug(
  ctx: MutationCtx,
  name: string,
  citySlug: string
): Promise<string> {
  const entropy = crypto.randomUUID().replace(/-/g, "").slice(0, 6);
  const base = `${slugify(name)}-${citySlug}-${entropy}`;
  let candidate = base;
  let suffix = 2;
  while (
    await ctx.db
      .query("tradePoints")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .unique()
  ) {
    candidate = `${base}-${suffix++}`;
    if (suffix > 50) throw new Error("slug-collision-overflow");
  }
  return candidate;
}
```

**Por que os 6 chars hex incondicionais**: Convex não tem unique index enforcement a nível de DB — `by_slug` é índice comum. Dois `submitRequest` concorrentes com mesmo nome+cidade passam ambos no `.unique()` check (TOCTOU clássico) e inserem. Depois, `getBySlug.unique()` arremessa "Query returned multiple results" em produção. Sufixo aleatório reduz colisão real pra ~1 em 10⁹; o loop vira safety net pós-colisão, não caminho normal. URL perde 7 chars de legibilidade mas ganha correção. Import explícito de `MutationCtx` evita typecheck break (não é auto-importado).

**Query pública** em `tradePoints.ts`:

```ts
export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      name: v.string(),
      address: v.string(),
      lat: v.float64(),
      lng: v.float64(),
      confirmedTradesCount: v.number(),
      suggestedHours: v.union(v.string(), v.null()),
      description: v.union(v.string(), v.null()),
      lastActivityAt: v.number(),
      city: v.union(
        v.null(),
        v.object({ name: v.string(), state: v.string(), slug: v.string() })
      ),
    })
  ),
  handler: async (ctx, { slug }) => {
    const point = await ctx.db
      .query("tradePoints")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!point || point.status !== "approved") return null;
    const city = await ctx.db.get(point.cityId);
    return {
      name: point.name,
      address: point.address,
      lat: point.lat,
      lng: point.lng,
      confirmedTradesCount: point.confirmedTradesCount,
      suggestedHours: point.suggestedHours ?? null,
      description: point.description ?? null,
      lastActivityAt: point.lastActivityAt,
      city: city ? { name: city.name, state: city.state, slug: city.slug } : null,
    };
  },
});
```

Pending/expired/shadow-banned não vazam pra página pública (só `approved`).

### 1.7 Contrato de decremento — stub internal mutation

Pra fechar o gap de decremento (C2 do review), criar **agora** a internal mutation `decrementPendingOnModeration(userId, delta)` em `tradePoints.ts`, mesmo sem call-site:

```ts
export const decrementPendingOnModeration = internalMutation({
  args: { userId: v.id("users") },
  returns: v.null(),
  handler: async (ctx, { userId }) => {
    const u = await ctx.db.get(userId);
    if (!u || u.pendingSubmissionsCount <= 0) return null;
    await ctx.db.patch(userId, {
      pendingSubmissionsCount: u.pendingSubmissionsCount - 1,
    });
    return null;
  },
});
```

Já usada pelo cron §1.4 (inline hoje, extraída pra essa mutation). Quando a mutation de moderação for escopada, ela chama `ctx.scheduler.runAfter(0, internal.tradePoints.decrementPendingOnModeration, { userId })` — contrato existe, decremento tem lar, sem dead code.

### 1.5 Query `getSubmissionQuota` — retorna `null` para não-autenticado

`throw` em query gera loop de refetch durante hidratação do Clerk (SSR → client → hook React roda antes do identity propagar). Retornar `null` é seguro — `useQuery` espera esse shape e não dispara erro:

```ts
export const getSubmissionQuota = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({
      remaining: v.number(),
      limit: v.number(),
      unlimited: v.boolean(),
      lastSubmissionAt: v.union(v.number(), v.null()),
    })
  ),
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;
    const unlimited = user.reliabilityScore >= RELIABILITY_UNLIMITED_THRESHOLD;
    return {
      remaining: unlimited
        ? MAX_PENDING_SUBMISSIONS
        : Math.max(0, MAX_PENDING_SUBMISSIONS - user.pendingSubmissionsCount),
      limit: MAX_PENDING_SUBMISSIONS,
      unlimited,
      lastSubmissionAt: user.lastSubmissionAt ?? null,
    };
  },
});
```

`v.optional` em returns gera headaches com Convex (prefere undefined vs null de forma inconsistente). `v.union(v.number(), v.null())` + `?? null` é explícito. Frontend renderiza `<RelativeTime>` condicional: `{quota.lastSubmissionAt !== null && <RelativeTime date={quota.lastSubmissionAt} />}`.

Agora lê direto do contador no `user` — sem scan do índice. `lastSubmissionAt` vai junto (útil para o `<RelativeTime>` no Banner). Esse campo não é o hack-OCC de antes; é só telemetria leve setada no `submitRequest`.

Adicionar `lastSubmissionAt: v.optional(v.number())` em `users` no schema (§1.1) — mas como campo opcional, não-obscuro.

## Fase 2 — UI

### 2.1 Adoção mínima de 7 componentes kibo-ui

Catálogo kibo-ui não tem `Progress` dedicado — então o progresso da quota vira derivado de outros primitives. Abaixo, **sete componentes kibo-ui** instalados e com uso concreto nesta tela e fluxos imediatos:

| #   | Componente        | Onde é usado                                                                                                                                                    | Substitui                                     |
| --- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 1   | **Announcement**  | Safety Card ("ORIENTAÇÃO DE SEGURANÇA") no topo do form                                                                                                         | Card shadcn customizado com borda lateral     |
| 2   | **Banner**        | Faixa top-of-page dinâmica mostrando quota em tempo real ("Você tem 1 sugestão pendente" / "Limite atingido")                                                   | Nada — é feature nova de atenção contextual   |
| 3   | **Spinner**       | Loading state do botão Crosshair de geolocalização e do CTA "Enviar sugestão" durante `isSubmitting`                                                            | `Loader2 className="animate-spin"` de lucide  |
| 4   | **Pill**          | Badge "Ilimitado" e "{remaining}/{limit}" no QuotaCard                                                                                                          | shadcn `Badge`                                |
| 5   | **Status**        | Indicador visual "idle/busy/offline" no QuotaCard refletindo `remaining`                                                                                        | Barra de progresso custom / inferência visual |
| 6   | **Relative Time** | "Última sugestão há X min" dentro do Banner, lendo `quota.lastSubmissionAt`                                                                                     | `new Date().toLocaleString()` manual          |
| 7   | **Choicebox**     | Campo `suggestedHours`: escolhas estruturadas ("Manhãs", "Tardes", "Noites", "Fins de semana") em vez de texto livre. Backend segue aceitando string — é só UX. | `<Input>` de texto livre                      |

Instalação: `npx kibo-ui add announcement banner spinner pill status relative-time choicebox` em `packages/ui` (confirmar `components.json`; se não aponta, rodar em `apps/web`).

Artefatos esperados em `packages/ui/src/components/`: `announcement.tsx`, `banner.tsx`, `spinner.tsx`, `pill.tsx`, `status.tsx`, `relative-time.tsx`, `choicebox.tsx`.

Extras da página pública `/ponto/[slug]` (§3.1) — mais 3 componentes kibo-ui: `typography.tsx` (prose wrapper para `description`), `qr-code.tsx` (compartilhar o ponto) e `glimpse.tsx` (preview opcional). Total de componentes novos: **10**.

### 2.1a Auditoria kibo-ui — decisões explícitas (tabela pra PR description)

Catálogo kibo-ui (fetch em 2026-04-17 de https://www.kibo-ui.com/components): Collaboration {Avatar Stack, Cursor}, Project Management {Calendar, Gantt, Kanban, List, Table}, Code {Code Block, Contribution Graph, Sandbox, Snippet}, Forms {Choicebox, Combobox, Dropzone, Mini Calendar, Tags}, Images {Image Crop, Image Zoom}, Finance {Credit Card, Ticker}, Social {Stories, Reel, Video Player}, Callouts {Announcement, Banner}, Styling {Typography}, Other {Color Picker, Comparison, Deck, Dialog Stack, Editor, Glimpse, Marquee, Pill, QR Code, Rating, Relative Time, Spinner, Status, Theme Switcher, Tree}. **41 componentes no total.**

| #   | Superfície                        | Decisão                                                                                                                                                                                                                                                                                                                                                                            | Motivo                                                                                                                                                     |
| --- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | CTA "ENVIAR SUGESTÃO" com loading | **shadcn `Button` + kibo `Spinner`**                                                                                                                                                                                                                                                                                                                                               | Kibo-ui não tem async/loading-button nativo no catálogo. Compor é o padrão.                                                                                |
| 2   | Skeleton do QuotaCard             | **shadcn `Skeleton`**                                                                                                                                                                                                                                                                                                                                                              | Kibo-ui não expõe Skeleton no registry. Shadcn é fallback.                                                                                                 |
| 3   | Toast pós-submit/erro             | **Sonner (mantido)**                                                                                                                                                                                                                                                                                                                                                               | Kibo-ui não tem toast; Sonner já padronizado globalmente (CLAUDE.md implicita, `@workspace/ui/components/sonner`).                                         |
| 4   | Campo `whatsappLink`              | **shadcn `Input`**                                                                                                                                                                                                                                                                                                                                                                 | Kibo-ui Forms = {Choicebox, Combobox, Dropzone, Mini Calendar, Tags}. Sem input-with-prefix / url-input / phone-input. Manter Input com `inputMode="url"`. |
| 5   | Address + Crosshair acoplado      | **Compose manual (wrapper `relative` + Input + button)**                                                                                                                                                                                                                                                                                                                           | Sem `input-group` no registry. Composição manual ~6 linhas; não vale abstrair agora.                                                                       |
| 6   | Hero / heading                    | **`<h1>` nu com tokens**                                                                                                                                                                                                                                                                                                                                                           | Typography kibo-ui é **prose wrapper** (veja fetch do componente) — não substitui heading atômico. Usa no `/ponto/[slug]` description.                     |
| 7   | FormDescription                   | **shadcn `FormDescription`**                                                                                                                                                                                                                                                                                                                                                       | Sem variante kibo-ui; integra com Form+RHF shadcn já usado.                                                                                                |
| 8   | Página pública `/ponto/[slug]`    | **Reuso + novos**: `Announcement` (safety notice re-contextualizada ao visitante), `Pill` (contador trocas), `Status` (ativo/inativo por `lastActivityAt`), `RelativeTime` ("último trade há X"), **`Typography`** (prose wrapper do `description`), **`QrCode`** (compartilhar link do ponto), **`Glimpse`** (preview opcional no hover do endereço pra mostrar Street View/mapa) | Página pública é showcase natural. 3 componentes novos entram (`typography`, `qr-code`, `glimpse`).                                                        |

Instalação consolidada:

```
npx kibo-ui add announcement banner spinner pill status relative-time choicebox typography qr-code glimpse
```

### 2.2 `QuotaCard` — auto-suficiente com `useQuery` interno

Novo `apps/web/modules/trade-points/ui/components/quota-card.tsx`. **`useQuery` dentro do componente** (não lifted pro parent) — assim só o QuotaCard re-renderiza a cada tick de quota; hero, safety card, form e Combobox ficam estáveis. Parent fica limpo.

O parent precisa saber quando o CTA deve bloquear. Em vez de passar `quota` pra cima (re-acopla), expor o `isBlocked` via `useQuotaStatus()` — hook thin que roda `useQuery` e retorna `{ isBlocked, isLoading, unlimited, limit }`. O `QuotaCard` e o botão de submit chamam o mesmo hook (Convex React cacheia a query, então é uma chamada de rede).

Hook em `apps/web/modules/trade-points/lib/use-quota-status.ts`:

```ts
export function useQuotaStatus() {
  const quota = useQuery(api.tradePoints.getSubmissionQuota);
  return useMemo(
    () => ({
      quota,
      isLoading: quota === undefined,
      isBlocked: quota != null && !quota.unlimited && quota.remaining === 0,
    }),
    [quota]
  );
}
```

`useMemo` mantém referência estável entre renders quando `quota` não muda — consumers que usam `useEffect(() => ..., [status])` ou memoizam derivados não quebram.

Props do QuotaCard: nenhuma (`quota` vem do hook interno).

Render (usa kibo-ui `Pill` + `Status`, sem Progress):

- `undefined` (apenas mount inicial — Convex mantém stale-while-revalidate em refetches): Skeleton.
- `unlimited`: ícone `ShieldCheck`, título "Reliability Score", `<Pill variant="success">Ilimitado</Pill>`, copy "Suas sugestões vão direto para a fila."
- `unlimited === false`: ícone + título + `<Status status={remaining > 0 ? "online" : "offline"} />` (ou variante equivalente do kibo-ui Status) + `<Pill>{remaining}/{limit}</Pill>` + copy "{remaining} de {limit} sugestões restantes." Se o kibo-ui Status expõe cores mais granulares (ex: `"idle"|"busy"|"offline"`), mapear: `remaining === limit → "idle"`, `remaining > 0 → "busy"`, `remaining === 0 → "offline"`.

### 2.3 `request-trade-point-view.tsx` — reorganização

**Hierarquia semântica**: `<h1>` = conteúdo protagonista no hero. Header sem heading.

Estrutura (lógica de `onSubmit`/`formSchema` preservada):

- **Banner** (kibo-ui, topo absoluto da página, acima do header): componente `<QuotaBanner />` **consome o mesmo `useQuotaStatus()`** que o resto da view. Duas queries pro mesmo user doc re-renderizam juntas de qualquer forma (ambas subscribem à mesma mutação do user) — o isolamento real vem de `React.memo(QuotaBanner)` + `React.memo(QuotaCard)` com dependência estável via `useMemo` no hook. Uma query, duas surfaces memoizadas.
  - `isLoading` ou `quota === null` ou `quota.unlimited` ou `remaining === limit`: não renderiza.
  - `remaining > 0 && remaining < limit`: "Você tem {limit - remaining} sugestão(ões) pendente(s){quota.lastSubmissionAt !== null && <> · última <RelativeTime date={quota.lastSubmissionAt} /></>}."
  - `remaining === 0`: "Limite atingido — aguarde a revisão." (warning)
    Dismissable se kibo-ui Banner suportar (persistir em `sessionStorage`).
- **Header**: só botão `Voltar`. Remover avatar `MapPinPlus` e o subtítulo `cityLabel`.
- **Hero**: `<h1>` "Amplie o Campo de Jogo." (tokens `text-primary`) + `<p>` muted "Ajude a comunidade em {cityLabel}."
- **Safety Card** → `<Announcement>` (kibo-ui): ícone `TriangleAlert` (lucide, Announcement aceita ícone custom), variante `warning` ou `secondary`, título caps "ORIENTAÇÃO DE SEGURANÇA", body copy do design. Remove o Card customizado com `border-l-4` — o kibo-ui Announcement já tem esse shape visual.
- **Form**:
  - Campos: `name`, `address`, `suggestedHours` (via `Choicebox`), `description`, `whatsappLink`.
  - **Address**: `<Input autoComplete="street-address">` puro — user já tem `cityId` fixado no onboarding (Tela 5), então autocomplete de cidades BR aqui é confusão de domínio. Geocoding server-side via Nominatim (PRD §5.5) entra em escopo futuro.
  - **`suggestedHours` com Choicebox** (kibo-ui): escolhas estruturadas ("Manhãs", "Tardes", "Noites", "Fins de semana"), multi-select. Kibo-ui documenta como "Card-style radio and checkbox options" — suporta ambos. **Decisão selada** (não defer): usar variante **checkbox** (multi-select) com estado `string[]` no RHF; schema Zod vira `z.array(z.string()).max(4)` e `onSubmit` concatena: `submitRequest({ ..., suggestedHours: data.suggestedHours.length > 0 ? data.suggestedHours.join(", ") : undefined })`. Primeira ação da implementação é `npx kibo-ui add choicebox` + ler o componente pra validar que a API bate — se bater, segue; se divergir (ex: componente retorna `{ value: string }[]`), abrir um mini-PR de ajuste do schema antes de continuar.
  - **Geolocalização — um entry point**: `<button type="button" aria-label="Usar minha localização atual" aria-busy={isChecking} disabled={isChecking} onClick={requestPermission}>` irmão do `<Input>` de endereço em wrapper relativo. **Importante**: usar `requestPermission()` (prompta o browser) e não `checkPermission()` (só lê estado). Ícone `Crosshair`, ou `<Spinner />` quando `isChecking`. Foco via token.
  - Abaixo do input: `FormDescription` com coordenadas formatadas: `Coordenadas: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}` — evita 14+ casas decimais cruas.
  - **Substituir** `useState({coords, geoLoading}) + useCallback useMyLocation` pelo `useGeolocation()` existente. **Mapeamento correto dos 7 estados**: `isChecking = status === "checking" || status === "prompting"` ("prompting" é quando o browser mostrou o popup de permissão e o user ainda não clicou — botão precisa ficar disabled + spinner visível pra evitar re-click). Estado "idle" é o único clicável. `coords` do hook com fallback para `{defaultLat, defaultLng}` quando `coords === null`. Toasts de erro derivam de `status === "denied" | "unavailable" | "timeout"`.
  - **Remover bloco "Pin no mapa"** + imports órfãos (`MapPin`, helpers só usados ali).
- **QuotaCard**: renderizado como componente auto-suficiente (usa `useQuotaStatus` internamente).
- **CTA**:
  - Parent também chama `useQuotaStatus()` para obter `isBlocked` e `isLoading` — Convex React cacheia, uma só chamada de rede.
  - Se `isBlocked`: `<Text variant="muted">` "Você atingiu o limite de sugestões pendentes. Aguarde a revisão."
  - `<Button disabled={form.formState.isSubmitting || isBlocked || isLoading}>` "ENVIAR SUGESTÃO" — quando `isSubmitting`, conteúdo vira `<Spinner /> Enviando…` (kibo-ui Spinner).
  - Abaixo: `<Text variant="muted">` "TEMPO ESTIMADO DE ANÁLISE: 24H – 48H" (tracking wider via token).

### 2.4 `onSubmit` — re-enable só após resolução

`form.formState.isSubmitting` fica `true` até o `return` do handler. Todos os branches atuais já retornam (confirmado lendo `request-trade-point-view.tsx:108-153`); manter esse padrão — nada de `finally` que reabilite antes do toast resolver.

### 2.5 Erro `rate-limited` em `onSubmit`

```ts
if (result.error === "rate-limited") {
  toast.error("Limite de sugestões pendentes atingido.");
  return;
}
```

Caminho de exceção (race / quota stale); CTA normalmente já estaria `disabled` via `isBlocked`.

### 2.6 Sucesso → toast + router.push (sem confirmation state)

`onSubmit` trata os dois branches de `ok: true`:

```ts
if (result.ok) {
  toast.success("Sugestão enviada — análise em 24–48h.");
  router.push("/map");
  return;
}
```

O discriminador `result.tradePointId === null` (shadow ban) é **opaco pro frontend** — mesmo toast, mesmo redirect. O shadow-banned não percebe. Confirmation state inline com `useEffect(setTimeout)` / race de quota refetch é complexidade pra tela que duraria 6s. `Status` e `RelativeTime` têm outro lar (QuotaCard e QuotaBanner).

### 2.7 Defesa em profundidade `noindex` via `next.config` — **somente** `/ponto/solicitar`

Rota `/ponto/solicitar` é form autenticado (noindex). Mas `/ponto/[slug]` é a **página pública SEO** do ponto aprovado — deve ser indexada. Matcher exato, não wildcard:

```ts
async headers() {
  return [
    {
      source: "/ponto/solicitar{/}?",
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
    },
  ];
}
```

`{/}?` (path-to-regexp) captura com e sem trailing slash — `/ponto/solicitar` e `/ponto/solicitar/` ambos emitem o header. Wildcard `"/ponto/:path*"` quebraria a indexação de `/ponto/banca-do-juca-uberlandia`. Zero custo runtime.

## Fase 3 — Landing / SEO / AEO

### 3.1 `/ponto/[slug]/page.tsx` — Convex query + kibo-ui na UI pública

`apps/web/app/(marketing)/ponto/[slug]/page.tsx:27` tem `getTradePoint(slug)` com mock + comentário `// TODO`. Substituir por `fetchQuery(api.tradePoints.getBySlug, { slug })` (sem token — rota pública). `null` → `notFound()`.

**Deduplicação SSR**: `generateMetadata` e o page component chamam a mesma query. Next.js **não deduplica** por default — são 2 round-trips por render. Wrap com `React.cache` **em module scope** (fora de `generateMetadata` ou do componente — senão cada chamada cria um cache novo e a dedup vira noop):

```ts
import { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

const loadTradePoint = cache((slug: string) =>
  fetchQuery(api.tradePoints.getBySlug, { slug })
);
```

Declarado no topo do arquivo. Invocar `loadTradePoint(slug)` em `generateMetadata` e no page component. Cache vive por render; não persiste entre requests (OK — SSR dedupe é o objetivo).

Manter `generateTradePointMetadata`, `generateBreadcrumbSchema`, `generatePlaceSchema`.

**Cascade**: `generateMetadata` já usa o retorno de `getTradePoint`. Passa a ler do Convex; `canonical`, `og:title`, `og:description` derivam de `name + city.name + city.state` automaticamente.

**Componentes kibo-ui introduzidos na página pública**:

- `<Announcement variant="info">` no topo: "Este é um ponto público de troca — vá acompanhado(a) e leve apenas figurinhas." (reuso da mensagem de segurança, re-contextualizada pro visitante).
- `<Pill>{confirmedTradesCount} trocas confirmadas</Pill>` ao lado do nome.
- `<Status status={lastActivityAtWithin7d ? "online" : "offline"} />` com label "Ativo nesta semana" / "Sem atividade recente" — derivado de `lastActivityAt`.
- `<RelativeTime date={lastActivityAt} />` no bloco "Última movimentação".
- `<div className="typography"><p>{description}</p></div>` (kibo-ui Typography wrapper) pro bloco de `description` — prose styling rico.
- `<QrCode value={`${BASE_URL}/ponto/${slug}`} />` no rodapé do card — "Compartilhe este ponto". Caso de uso real: user mostra QR pro amigo escanear na rua.
- `<Glimpse />` (opcional) no hover do endereço — preview do mapa ou Street View inline. Degrada pra noop se `image/map` não disponível.

### 3.2 CTA keyword-rich na landing

`apps/web/modules/landing/ui/components/final-cta-section.tsx` (ou onde estiver o CTA final): adicionar anchor visível antes do footer, com href pra `/ponto/solicitar`:

```tsx
<Link href="/ponto/solicitar" className="...">
  Sugerir novo ponto de troca de figurinhas{" "}
  {cityName ? `em ${cityName}` : "perto de você"}
</Link>
```

`cityName` vem do IP geo-lookup no server component (headers `x-vercel-ip-city`). **Anti content-thrash**: detectar bot via `isbot` (npm) a partir do `User-Agent` — **bots sempre veem "perto de você"** (versão estática, canônica). Humanos veem versão personalizada com cidade. Isso evita Google indexar N variantes da mesma página com CTAs diferentes.

```ts
// apps/web/app/(marketing)/page.tsx (server component)
import { isbot } from "isbot";
import { headers } from "next/headers";

const h = await headers();
const ua = h.get("user-agent") ?? "";
const ipCity = h.get("x-vercel-ip-city");
const cityName = isbot(ua) ? null : ipCity ? decodeURIComponent(ipCity) : null;
```

Passa `cityName` como prop pro `<FinalCTASection cityName={cityName} />`. Anchor text "Sugerir novo ponto de troca de figurinhas em {cityName ?? 'perto de você'}" transfere autoridade de `/` para a rota da Tela 8.

`isbot` é dependência pequena (~2kb); se o projeto já usa, reusar. Senão `pnpm add isbot` no `apps/web`.

### 3.3 FAQ schema.org estendido na landing

`apps/web/app/(marketing)/page.tsx:34` tem `FAQ_DATA`. Adicionar três Q&A novos cobrindo o fluxo da Tela 8, para alimentar o `generateFAQSchema` (já usado na página):

```ts
{
  question: "Quanto tempo leva para analisar uma sugestão de ponto de troca?",
  answer: "A análise leva de 24 a 48 horas. Nossa equipe verifica segurança do local, movimento e adequação antes de aprovar.",
},
{
  question: "Posso sugerir qualquer local como ponto de troca?",
  answer: "Priorize locais públicos e movimentados como shoppings, praças de alimentação e parques. Evitamos pontos em residências, ruas isoladas ou estabelecimentos privados sem acesso livre.",
},
{
  question: "Quantas sugestões posso enviar?",
  answer: "Usuários com Reliability Score abaixo de 5 podem ter até 2 sugestões pendentes simultaneamente. Contribuições aprovadas aumentam seu score e liberam envios ilimitados.",
},
```

Esses Q&A viram candidatos diretos a resposta em Perplexity / Google SGE / ChatGPT via `FAQPage` JSON-LD já emitido pela landing (`generateFAQSchema(FAQ_DATA)` → `<JsonLd />`).

**Confirmado via grep (2026-04-17)**: `FAQSection` em `apps/web/modules/landing/ui/components/faq-section.tsx` recebe `faqs` como prop e itera com `faqs.map()` — não tem itens hardcoded. `page.tsx:116` passa `<FAQSection faqs={FAQ_DATA} />`. Adicionar ao array alimenta **tanto** o JSON-LD quanto a UI visível numa só edição.

## Restrições (CLAUDE.md)

- Jamais tailwind puro — só tokens shadcn.
- Copy pt-BR consistente.
- Zero inline comments (racional de decisões vai no PR description).
- Não commitar.

## Arquivos alterados

1. `packages/backend/convex/schema.ts` — índice `by_requestedBy_status` (remove antigo), `by_status_createdAt`, `by_slug` (único) em `tradePoints`, `tradePoints.slug: v.string()`, status `"expired"`, `users.reliabilityScore` non-optional, `pendingSubmissionsCount`, `lastSubmissionAt`, `isShadowBanned`.
2. `packages/backend/convex/users.ts` — seed `reliabilityScore: 3, pendingSubmissionsCount: 0` nos dois `db.insert("users", ...)`.
3. `packages/backend/convex/lib/slug.ts` — novo, com `slugify()` + `generateTradePointSlug()`.
4. `packages/backend/convex/tradePoints.ts` — constantes, shadow-ban return (`tradePointId: null`), gate por contador + patch atômico em `submitRequest`, slug no insert, erro `rate-limited`, query `getSubmissionQuota` (null-safe), query pública `getBySlug`, internalMutations `expireStalePending` e `decrementPendingOnModeration` (stub).
5. `packages/backend/convex/crons.ts` — job diário `expire-pending-trade-points`.
6. `packages/ui/src/components/` — **dez componentes kibo-ui novos** via `npx kibo-ui add announcement banner spinner pill status relative-time choicebox typography qr-code glimpse`.
7. `apps/web/modules/trade-points/lib/use-quota-status.ts` — hook novo.
8. `apps/web/modules/trade-points/ui/components/quota-card.tsx` — novo, auto-suficiente.
9. `apps/web/modules/trade-points/ui/views/request-trade-point-view.tsx` — reorganização (hero, Announcement, Banner, Spinner, Choicebox), `useGeolocation`, `useQuotaStatus`.
10. `apps/web/app/(marketing)/ponto/[slug]/page.tsx` — trocar mock por `fetchQuery(api.tradePoints.getBySlug)`.
11. `apps/web/modules/landing/ui/components/final-cta-section.tsx` — anchor keyword-rich "Sugerir novo ponto de troca de figurinhas em {cidade}".
12. `apps/web/app/(marketing)/page.tsx` — três Q&A novos em `FAQ_DATA`; bot-aware `cityName` via `isbot` + `headers()` passado pro `FinalCTASection`.
13. `apps/web/modules/trade-points/ui/components/quota-banner.tsx` — novo, consome `useQuotaStatus`, memoizado via `React.memo`.
14. `apps/web/next.config.ts` — `headers()` setando `X-Robots-Tag` **somente** em `/ponto/solicitar` (nunca em `/ponto/[slug]` público — ver §2.7).

## Verificação

1. **Ordem de deploy (documentar no PR)**:
   1. User dropa o banco.
   2. Deploy schema (índice novo + `reliabilityScore`/`pendingSubmissionsCount` non-optional + `lastSubmissionAt` + `isShadowBanned` + status `"expired"` + `by_status_createdAt`).
   3. Deploy functions (`submitRequest`, `getSubmissionQuota`, `expireStalePending`, crons) + frontend.
      Inversão → migration error ou runtime break.
2. **Grep `by_requestedBy` — consumers (executado 2026-04-17)**: único hit é em `packages/backend/convex/schema.ts:110` (o próprio `.index(...)`). **Zero call-sites externos** — remoção do índice antigo é segura, sem migração de outras queries. Re-rodar o grep antes do PR pra confirmar que ninguém adicionou consumer entre o handoff e o merge:
   ```
   grep -rn 'by_requestedBy"' packages/ apps/ --include="*.ts" --include="*.tsx"
   ```
3. **Typecheck**: `pnpm -w turbo run typecheck --filter=web --filter=@workspace/backend`.
4. **Convex deploy**: confirmar schema validator aceita (users novos já saem com `reliabilityScore`) e novo índice propagado.
5. **Dev** em `http://localhost:3000/ponto/solicitar`:
   - Loading da quota: CTA desabilitado até `quota` resolver (mount inicial só).
   - Score=3, 0 pendentes: Status verde + Pill "2/2" no QuotaCard, sem Banner, CTA habilitado.
   - Submete 1: toast "Sugestão enviada — análise em 24–48h" + redirect para `/map`. Voltar para `/ponto/solicitar`: Banner "1 sugestão pendente · última há poucos segundos" (RelativeTime reativo); Pill "1/2"; `pendingSubmissionsCount` e `lastSubmissionAt` atualizados no user doc.
   - Submete 2: Banner warning "Limite atingido · última há X min — aguarde a revisão"; Status offline; Pill "0/2"; CTA off. Tentativa manual via dashboard Convex retorna `rate-limited`.
   - Race: disparar 2 `submitRequest` paralelos com `pendingSubmissionsCount=1` — OCC aborta uma (contador é write no mesmo doc), resultado final: 2 pendentes, não 3.
   - Editar `reliabilityScore=5` no dashboard: Pill "Ilimitado" verde, sem Banner, CTA sempre livre.
   - Fora do BR: toast `invalid-coordinates`.
   - Crosshair: Spinner ativo, `aria-busy="true"`, botão desabilitado; coords no `FormDescription`; foco-teclado visível; `aria-label` lido por screen reader.
   - Choicebox `suggestedHours`: selecionar "Tardes" + "Fins de semana"; payload enviado contém string `"Tardes, Fins de semana"`.
6. **Visual** vs `add-ponto.html`: hero com `<h1>`, safety card, quota card, CTA, legenda 24–48H.
7. **A11y**: devtools > Accessibility tree mostra **um único `<h1>`**; tab order voltar → campos → Crosshair → CTA.
8. **HTTP headers**: `curl -I http://localhost:3000/ponto/solicitar` **e** `curl -I http://localhost:3000/ponto/solicitar/` ambos retornam `X-Robots-Tag: noindex, nofollow` (servido pelo `next.config.ts`). `curl -I http://localhost:3000/ponto/<slug-aprovado>` **sem** `X-Robots-Tag`.
9. **Shadow ban**: criar user de teste com `isShadowBanned: true`, submeter — response `ok: true` com id fake; confirmar que nenhum row é inserido em `tradePoints`.
10. **Cron**: rodar manualmente `expireStalePending` via Convex CLI; verificar que pendentes >30d mudam para `status: "expired"` e `pendingSubmissionsCount` do requester decrementa.

11. **SEO / slug**:
    - Submeter sugestão → verificar no dashboard Convex que o `tradePoint` tem `slug: "banca-teste-uberlandia"` (formato correto, sem acentos).
    - Submeter outro ponto com mesmo nome na mesma cidade → slug vira `banca-teste-uberlandia-2` (sufixo numérico).
    - Aprovar manualmente (flip `status: "approved"`) e acessar `/ponto/banca-teste-uberlandia` → página renderiza com dados reais, metadata com `og:title`, JSON-LD `Place` + `BreadcrumbList`.
    - Acessar slug inexistente → `notFound()` (404).
    - Acessar slug de ponto `pending`/`expired` → `notFound()` (não vaza).
12. **Landing / FAQ / CTA**:
    - `curl https://.../ | grep "FAQPage"` mostra JSON-LD com os três Q&A novos (análise 24–48h, critérios, quota).
    - Landing renderiza CTA "Sugerir novo ponto de troca de figurinhas em {cidade}" apontando pra `/ponto/solicitar`.
    - **Bot vs user**: `curl -A "Googlebot/2.1" https://.../ | grep "perto de você"` retorna match; `curl -A "Mozilla/5.0 ..." -H "x-vercel-ip-city: S%C3%A3o%20Paulo" ...` renderiza "em São Paulo". Uma só variante canônica indexada.
    - Lighthouse SEO score da landing permanece ≥ 90 após mudanças.
    - `/ponto/[slug]` público retorna header **sem** `X-Robots-Tag` (indexável); `/ponto/solicitar` retorna `X-Robots-Tag: noindex, nofollow`.
13. **Página pública do ponto**: após aprovar um `tradePoint` manualmente, acessar `/ponto/<slug>` renderiza Announcement, Pill com contador de trocas, Status com "Ativo nesta semana" (ou offline), Relative Time, Typography no description, QR Code funcional (escaneia para a mesma URL).
