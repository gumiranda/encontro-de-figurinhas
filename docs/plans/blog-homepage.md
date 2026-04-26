# Blog Homepage Redesign — Plano Final v4

## Context

Redesign completo do blog Figurinha Fácil para SEO e engajamento. Stack: Next.js 15 App Router + Convex + shadcn/ui + Tailwind. Monorepo `/apps/web` + `/packages/backend`.

**Princípio-guia desta versão:** caminho mais curto e simples. MVP primeiro, expansão depois.

---

## Decisões Arquiteturais Confirmadas

### 1. Paginação: API nativa Convex

```ts
import { paginationOptsValidator } from "convex/server";

export const getPublishedPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) =>
    ctx.db
      .query("blogPosts")
      .withIndex("by_status_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .paginate(paginationOpts),
});
```

Client: `usePaginatedQuery(api.blog.getPublishedPaginated, {}, { initialNumItems: 9 })`.

### 2. Category Stats: Tabela precomputada

`blogCategoryStats` atualizada via mutation interna em publish/unpublish/delete. Zero `.collect()` para contar em tempo de read.

### 3. Trending: Índice dedicado

Índice `by_status_viewCount` no schema. Sort in-memory proibido.

### 4. Cache Strategy: Una sola

`fetchQuery` + `unstable_cache` + `revalidateTag("blog")`. Remover `preloadQuery`. Remover `revalidate` fixo. Reatividade só na página individual do post (views em tempo real).

### 5. FilterBar: Links de navegação

```tsx
<nav aria-label="Categorias">
  <Link href="/blog" aria-current={isActive ? "page" : undefined}>
    Todos
  </Link>
</nav>
```

Sem `role="tab"`. São links, não tabs.

### 6. Categoria: Static params + dynamicParams false

`generateStaticParams` retorna lista fixa de `blog-data.ts`. `export const dynamicParams = false`. Slug inválido cai em 404 automático sem query.

### 7. Canonical: Env var

`process.env.NEXT_PUBLIC_APP_URL` — zero hardcode.

### 8. OG Image: template único reutilizado

Um template Satori em `/apps/web/lib/og-template.tsx` com props `{ title, category, authorName }`. Categoria e post chamam o mesmo template. Homepage usa PNG estático em `/public/og/blog.png`.

### 9. LGPD Newsletter

Checkbox obrigatório + `consentedAt: v.number()` + `ipAddress: v.string()` em `newsletterSubscribers`.

### 10. Datas: date-fns

```ts
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
```

Proibido `toLocaleDateString()` (hydration mismatch).

---

## Decisões Novas (1-20)

### 1. HTTP action revalidation — ciclo completo

**Decisão:** Endpoint `/api/revalidate` em Next.js protegido por `REVALIDATE_SECRET` no header. Mutation interna `afterPublishPost` no Convex dispara `fetch` direto — sem scheduler.

**Justificativa:** Scheduler adiciona retry/monitoring que MVP não precisa. Fetch direto falha silenciosamente e revalida na próxima publicação.

**Implementação:**

- `/apps/web/app/api/revalidate/route.ts` valida header `x-revalidate-secret` e chama `revalidateTag("blog")`.
- Payload: `{ tag: "blog" }`.
- Em Convex: helper interno chamado pelas 3 mutations de gatilho (ver item 8). Falha = `console.error` e segue.

### 2. generateStaticParams vs dynamic — categoria page

**Decisão:** Categorias são lista ESTÁTICA em `blog-data.ts`. `generateStaticParams` retorna essa lista. `export const dynamicParams = false`.

**Justificativa:** Taxonomia fechada. Não precisa query pra validar slug. Mais rápido, menos código.

**Implementação:**

```ts
// /blog/categoria/[slug]/page.tsx
import { CATEGORIES } from "@/modules/blog/lib/blog-data";

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;
```

### 3. OG image Satori — template único

**Decisão:** UM template reutilizável com props. Homepage estático, categoria e post usam o mesmo helper.

**Justificativa:** Satori duplicado = dois lugares pra corrigir o mesmo bug.

**Implementação:**

- `/apps/web/lib/og-template.tsx` exporta função `renderOgImage({ title, category?, authorName? })` que retorna `ImageResponse`.
- `/blog/categoria/[slug]/opengraph-image.tsx` e `/blog/[slug]/opengraph-image.tsx` importam e chamam com props diferentes.
- Homepage: `/public/og/blog.png` estático referenciado em `generateMetadata`.

### 4. Newsletter — double opt-in fora do MVP

**Decisão:** MVP salva com `status: "pending"` e NÃO envia email nenhum. Checkbox LGPD + `consentedAt` + `ipAddress` cobrem compliance legal.

**Justificativa:** Double opt-in sem email provider é teatro. LGPD exige consentimento registrado, não confirmação por email. Resend fica pra v2.

**Implementação:**

- Mutation `subscribeNewsletter` salva pending. Fim.
- `confirmNewsletterSubscription` REMOVIDA do escopo.
- Schema sem `confirmedAt`.
- Unsubscribe: link `mailto:` no email (quando existir) ou v2.

### 5. Busca interna — CORTADA

**Decisão:** Remover busca do MVP. Vai pra v2.

**Justificativa:** 48 artigos não justificam busca dedicada. Filter bar + categoria resolvem 80% da necessidade. Escopo extra de ~1 dia pra uso marginal.

**Implementação:** Remove `/blog/busca`, `searchPosts`, `searchIndex`, `blog-search-input.tsx`, `blog_search_performed` event. Nota no plano: "v2 — adicionar `searchIndex` em `blogPosts.title` quando virar necessário".

### 6. RSS — simplificação + cache

**Decisão:** Route handler com `export const revalidate = 3600`. 20 posts. Excerpt simples. `<media:thumbnail>` com `coverImage`.

**Justificativa:** Cache de 1h evita custo Convex por batida de leitor RSS. 20 é número redondo. Media thumbnail é 2 linhas e agrega valor.

**Implementação:**

```ts
// /apps/web/app/(marketing)/blog/rss.xml/route.ts
export const revalidate = 3600;

export async function GET() {
  const posts = await fetchQuery(api.blog.getPublishedPaginated, {
    paginationOpts: { numItems: 20, cursor: null },
  });
  // gerar XML com title, link, description (excerpt), pubDate, media:thumbnail
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
```

### 7. Analytics — PostHog free + Vercel Analytics

**Decisão:** PostHog free tier (1M events/mês) para eventos customizados. Vercel Analytics para page views.

**Justificativa:** Vercel Analytics grátis não captura eventos. PostHog free cobre 1M events e tem SDK Next.js decente.

**Eventos mínimos dia 1:**

| Evento                      | Trigger            | Props                            |
| --------------------------- | ------------------ | -------------------------------- |
| `blog_category_clicked`     | Click no FilterBar | `category`                       |
| `blog_load_more_clicked`    | Click no Load More | `page_number`                    |
| `blog_newsletter_submitted` | Submit do form     | `success: boolean`               |
| `blog_post_scroll_depth`    | Scroll milestones  | `depth: 25\|50\|75\|100`, `slug` |

**Implementação:**

- `posthog-js` no client, `PostHogProvider` no root `(marketing)/layout.tsx`.
- Helper `/apps/web/modules/blog/lib/analytics.ts` com `posthog.capture(event, props)`.
- Config com `persistence: "memory"` (ver item 16).

### 8. Revalidation — 3 gatilhos explícitos

**Decisão:** Só 3 mutations disparam `revalidateTag("blog")`:

1. `createPost` com `status: "published"`
2. `updatePost` quando `status` muda pra/de `"published"`
3. `deletePost` de post publicado

**Justificativa:** `incrementViews` NÃO revalida (muito frequente, mata o cache). `updateCategoryStats` NÃO revalida (é called-by das 3 acima).

**Implementação:** Helper interno `triggerRevalidation(ctx)` chamado no final das 3 mutations. Faz fetch para `/api/revalidate` com secret.

### 9. Trending com cache stale — inconsistência aceitável

**Decisão:** Aceitar. Trending atualiza só quando post novo é publicado (invalida cache). Entre publicações, trending congelado até 1h.

**Justificativa:** Trending "real-time" exige revalidation por view = complexidade pra ganho marginal em blog de 48 posts.

**Implementação:** Nota no plano e no JSDoc da query `getTrending`: "Staleness de até 1h ou próxima publicação — aceito".

### 10. Skeleton UX do Load More — comportamento exato

**Decisão:**

- 3 cards skeleton aparecem ABAIXO dos posts existentes durante fetch
- Botão vira disabled + texto "Carregando..."
- Scroll position preservado (sem scroll automático)
- Após load: skeleton some, botão volta ao normal ou some se `!hasMore`

**Justificativa:** Comportamento esperado pelo usuário. Mexer em scroll é anti-padrão.

**Implementação:** Estados do `BlogLoadMore`: `idle | loading | done`. Skeleton só na fase `loading`.

### 10b. Homepage data flow — cache + manual cursor

**Decisão:** Homepage usa `fetchQuery` + `unstable_cache` para os 9 primeiros posts (Server Component). Load More é client component separado que usa `useQuery` manual com estado local de cursor — NÃO usa `usePaginatedQuery`.

**Justificativa:** `usePaginatedQuery` + `unstable_cache` são modelos ortogonais. Misturar causa hidratação dupla. Separar: server renderiza inicial cacheado, client continua do cursor.

**Implementação:**

```tsx
// page.tsx (Server Component)
const initialPosts = await getCachedHomepageData(); // 9 posts
const lastCursor = initialPosts[8]?._id ?? null;

<BlogPostGrid posts={initialPosts} />
<BlogLoadMore initialCursor={lastCursor} />

// BlogLoadMore (Client Component)
const [cursor, setCursor] = useState(initialCursor);
const [allPosts, setAllPosts] = useState([]);
const result = useQuery(api.blog.getPublishedPaginated, {
  paginationOpts: { numItems: 9, cursor }
});
// Manual append to allPosts on load
```

**Nota:** `getHomepageData` e `getPublishedPaginated` NÃO usam `ctx.auth` — são queries públicas. Se usarem auth por engano, `fetchQuery` com cache quebra no build.

### 11. blogCategoryStats — sync inicial

**Decisão:** Mutation `rebuildCategoryStats` executada UMA VEZ via Convex Dashboard após deploy do schema. Faz `.collect()` (one-shot, ok) e popula a tabela.

**Justificativa:** Migration scripts automáticos são overkill pra operação pontual. 30 segundos de trabalho manual.

**Implementação:** Mutation documentada como "admin-only, rodar uma vez após deploy". Não executa automaticamente.

### 12. Hero image source — string URL genérica

**Decisão:** `coverImage: v.optional(v.string())` guarda URL (string). Aceita Convex storage URL, Unsplash, ou qualquer CDN. `remotePatterns` cobre `images.unsplash.com` + `*.convex.cloud`. Fallback: `/public/blog/placeholder.jpg`.

**Justificativa:** String URL é denominador comum mais simples. Abstração de storage vira v2.

**Implementação:**

```ts
// schema
coverImage: v.optional(v.string()),

// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    { protocol: 'https', hostname: '*.convex.cloud' },
  ],
},
```

### 13. Reading time — calculado no write

**Decisão:** Campo `readingTime: v.optional(v.number())` (minutos). Calculado em `createPost` e `updatePost` via helper: `Math.max(1, Math.ceil(content.split(/\s+/).length / 200))`.

**Justificativa:** Cálculo on-the-fly a cada render é desperdício. Calcular no write é zero-custo no read.

**Implementação:** Helper em `/packages/backend/convex/lib/reading-time.ts` chamado nas 2 mutations.

### 14. Error boundary — componente único

**Decisão:** UM componente `<BlogError>` em `/modules/blog/ui/components/blog-error.tsx`. Os 2 arquivos `error.tsx` (ver item 15) renderizam `<BlogError message="..." />` com props diferentes.

**Justificativa:** DRY. Um lugar pra ajustar visual, dois lugares pra ajustar copy.

**Implementação:**

```tsx
// blog-error.tsx
function BlogError({ message, reset }: { message: string; reset: () => void }) {
  return (/* UI + botão retry */);
}

// /blog/error.tsx → 3 linhas: "use client" + import + <BlogError message="..." reset={reset} />
```

### 15. not-found.tsx — um só pra tudo

**Decisão:** UM `not-found.tsx` em `/blog/not-found.tsx` serve pra todo o escopo. Categoria e rotas filhas herdam.

**Justificativa:** Next.js propaga `notFound()` pro mais próximo. Um arquivo = menos manutenção.

**Implementação:** Remove `not-found.tsx` nested. Só `/blog/not-found.tsx` existe.

### 16. PostHog + LGPD — memory persistence

**Decisão:** PostHog com `persistence: "memory"` (sem cookies). Page views via Vercel Analytics (first-party, isento de banner).

**Justificativa:** Banner de cookies é UX ruim e dev overhead. Memory persistence atende analytics sem cookies = sem banner.

**Implementação:**

```ts
posthog.init(POSTHOG_KEY, {
  api_host: "https://app.posthog.com",
  persistence: "memory",
  autocapture: false,
});
```

### 17. Cronograma implementação — 7 dias úteis

**Decisão:** Replanejamento em 7 dias com cortes aplicados (ver seção "Ordem de Implementação" abaixo).

**Justificativa:** Busca removida + componentes mesclados + error boundaries simplificados liberam 3 dias.

### 18. Post detail page — fora de escopo

**Decisão:** Escopo deste plano = LISTAGEM (homepage + categoria). Post detail ganha SÓ 2 adições:

- Chamada de `incrementViews` no mount
- OG image via template compartilhado

Redesign completo do post detail é plano separado.

**Justificativa:** Manter escopo. Post detail tem prioridades próprias (comentários, share, related posts) que viram outro projeto.

**incrementViews em RSC:** Mutation não roda em Server Component. Solução: client component `<PostViewTracker slug={slug} />` montado na page, chama mutation via `useMutation` no `useEffect`.

### 19. Performance budget — metas realistas

**Decisão:** Metas ajustadas pra atingíveis.

| Métrica           | Target          | Medição                      |
| ----------------- | --------------- | ---------------------------- |
| JS Bundle `/blog` | < 180kb gzipped | `ANALYZE=true npm run build` |
| LCP               | < 2.5s mobile   | Lighthouse                   |
| CLS               | 0               | Lighthouse                   |
| TTFB (cache hit)  | < 100ms         | Vercel Analytics             |
| FCP               | < 1.8s          | Lighthouse                   |
| INP               | < 200ms         | Lighthouse                   |

**Justificativa:** Core Web Vitals oficiais do Google (LCP 2.5s). Meta agressiva demais vira ignorada. Bundle realista com shadcn + lucide + date-fns + posthog + convex.

### 20. FilterBar scroll indicator — mask-image com fallback

**Decisão:** `mask-image` + `-webkit-mask-image`. Aceitar degradação em Safari antigo.

**Justificativa:** Caminho mais curto. iOS Safari moderno suporta. Safari 12 não é audiência.

**Implementação:**

```css
.filter-bar-container {
  mask-image: linear-gradient(
    to right,
    transparent,
    black 16px,
    black calc(100% - 16px),
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 16px,
    black calc(100% - 16px),
    transparent
  );
}
```

---

## Fora de Escopo (v2)

Cortes explícitos com justificativa:

- **`/blog/busca` + `searchPosts` + `searchIndex`** — 48 posts não justificam busca; filter bar resolve.
- **`confirmNewsletterSubscription` mutation** — double opt-in sem email provider é teatro.
- **`confirmedAt` em `newsletterSubscribers`** — sem confirmação, campo não serve.
- **Migration script de `viewCount`** — `?? 0` em runtime cobre.
- **Dois templates Satori (categoria + post separados)** — vira um template com props.
- **3 `error.tsx` nested** — vira 1 componente `<BlogError>` reutilizado.
- **3 `not-found.tsx` nested** — Next propaga, 1 em `/blog` cobre tudo.
- **Vercel Analytics para eventos customizados** — não captura grátis, vira PostHog free.
- **`blog_search_performed` event** — sem busca, sem evento.
- **Revalidation em `incrementViews`** — mata cache, inviabiliza performance.
- **Página `/blog/tag/[slug]`** — tags ficam só como schema prep.
- **Página `/blog/autor/[slug]`** — EEAT importante mas não blocking.
- **Admin UI `/admin/blog`** — Convex Dashboard cobre MVP.
- **i18n `/en/blog`** — Brasil-focused, sem benefício.
- **Pipeline de blurhash por imagem** — placeholder cinza único serve.
- **Batch update de viewCount** — race condition aceitável em trending.

---

## Backend: Queries e Mutations

### Schema Updates

**Arquivo:** `/packages/backend/convex/schema.ts`

```ts
// Adicionar a blogPosts:
viewCount: v.optional(v.number()),
readingTime: v.optional(v.number()),
coverImage: v.optional(v.string()),

// Adicionar índice:
.index("by_status_viewCount", ["status", "viewCount"])

// Nova tabela:
blogCategoryStats: defineTable({
  category: v.string(),
  count: v.number(),
  updatedAt: v.number(),
}).index("by_category", ["category"]),

// Nova tabela:
newsletterSubscribers: defineTable({
  email: v.string(),
  status: v.union(v.literal("pending"), v.literal("unsubscribed")),
  consentedAt: v.number(),
  ipAddress: v.string(),
  createdAt: v.number(),
}).index("by_email", ["email"]),
```

**Schema prep (documentado, não implementar):**

```ts
// v2: blogTags + blogPostTags junction
// v2: blogAuthors table com bio, linkedin, avatar
// v2: searchIndex em blogPosts.title
```

### Novas Queries

**Arquivo:** `/packages/backend/convex/blog.ts`

| Query                   | Descrição                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `getHomepageData`       | Retorna featured + weekly (2) + recent (9) + trending (5)                                         |
| `getCategoryStats`      | Lê de `blogCategoryStats`                                                                         |
| `getPublishedPaginated` | Usa `paginationOptsValidator` (chamada via `useQuery` com cursor manual, não `usePaginatedQuery`) |
| `getTrending`           | Usa índice `by_status_viewCount` (cache stale aceito)                                             |

### Novas Mutations

| Mutation               | Descrição                                                  |
| ---------------------- | ---------------------------------------------------------- |
| `incrementViews`       | Incrementa viewCount (race condition aceita, não revalida) |
| `updateCategoryStats`  | Interna, chamada em create/update/delete                   |
| `rebuildCategoryStats` | Admin-only, rodar uma vez após deploy                      |
| `subscribeNewsletter`  | Salva em newsletterSubscribers com LGPD fields             |

### Mutations que disparam `revalidateTag("blog")`

1. `createPost` (com `status: "published"`)
2. `updatePost` (quando `status` muda pra/de `published`)
3. `deletePost` (de post publicado)

### HTTP: Revalidation

**Arquivo:** `/apps/web/app/api/revalidate/route.ts`

```ts
// Valida header x-revalidate-secret
// Chama revalidateTag(body.tag)
// Retorna { revalidated: true } ou 401
```

Chamado pelas 3 mutations via fetch direto. Falha silenciosa = log + segue.

---

## Estrutura de Arquivos

```
/apps/web/
  app/
    api/revalidate/
      route.ts                    # Revalidation endpoint
    (marketing)/blog/
      page.tsx                    # Homepage
      error.tsx                   # Usa <BlogError>
      not-found.tsx               # Único pra todo /blog
      opengraph-image.tsx         # Homepage OG (estático ou template)
      categoria/
        [slug]/
          page.tsx                # generateStaticParams + dynamicParams=false
          opengraph-image.tsx     # Chama og-template
          error.tsx               # Usa <BlogError>
      rss.xml/
        route.ts                  # RSS com revalidate 3600
      [slug]/
        page.tsx                  # Post detail (já existe, + incrementViews)
        opengraph-image.tsx       # Chama og-template

  lib/
    og-template.tsx               # renderOgImage({ title, category?, authorName? })

  modules/blog/
    lib/
      blog-data.ts                # CATEGORIES com slug/nome/ícone/descrição
      blog-schemas.ts             # JSON-LD generators (Blog, ItemList, BreadcrumbList)
      format-date.ts              # date-fns helpers
      analytics.ts                # PostHog event helpers
      constants.ts                # BLUR_PLACEHOLDER
    ui/components/
      blog-hero-section.tsx       # Server
      blog-filter-bar.tsx         # Client (links com aria-current)
      blog-featured-posts.tsx     # Server
      blog-post-grid.tsx          # Server
      blog-post-card.tsx          # Server
      blog-load-more.tsx          # Client (useQuery + manual cursor state)
      blog-trending-sidebar.tsx   # Server
      blog-trending-mobile.tsx    # Server (horizontal scroll)
      blog-category-strip.tsx     # Server
      blog-newsletter-cta.tsx     # Client (form + LGPD checkbox)
      blog-breadcrumbs.tsx        # Server
      blog-empty-state.tsx        # Server
      blog-skeleton.tsx           # Client (só Load More)
      blog-error.tsx              # Componente reutilizado
      post-view-tracker.tsx       # Client (incrementViews via useEffect)

/packages/backend/convex/
  blog.ts                         # Queries + mutations (expandir)
  newsletter.ts                   # subscribeNewsletter
  schema.ts                       # Schema updates
  lib/
    reading-time.ts               # Helper calculateReadingTime
    revalidation.ts               # Helper triggerRevalidation
```

**Removidos (comparado ao v3):**

- `/blog/busca/` (toda a rota)
- `/blog/categoria/[slug]/not-found.tsx`
- `/blog/busca/error.tsx`
- `blog-search-input.tsx`
- `http.ts` do Convex (fetch direto, sem action dedicada)

---

## Ordem de Implementação (7 dias úteis)

### Dia 1: Backend

1. [ ] Schema: `viewCount`, `readingTime`, `coverImage`, índice `by_status_viewCount`
2. [ ] Schema: tabela `blogCategoryStats`
3. [ ] Schema: tabela `newsletterSubscribers` (sem `confirmedAt`)
4. [ ] Query: `getHomepageData`
5. [ ] Query: `getCategoryStats`
6. [ ] Query: `getPublishedPaginated` com API nativa
7. [ ] Query: `getTrending`
8. [ ] Mutation: `incrementViews`, `updateCategoryStats`, `rebuildCategoryStats`, `subscribeNewsletter`
9. [ ] Helper: `calculateReadingTime`
10. [ ] Helper: `triggerRevalidation` + integração nas 3 mutations de gatilho
11. [ ] Route handler: `/api/revalidate`

### Dia 2: Lib + Componentes Base

12. [ ] `blog-data.ts`: categorias
13. [ ] `format-date.ts`: helpers date-fns
14. [ ] `blog-schemas.ts`: JSON-LD generators
15. [ ] `analytics.ts`: PostHog helpers + init com `persistence: "memory"`
16. [ ] `constants.ts`: `BLUR_PLACEHOLDER`
17. [ ] `og-template.tsx`: renderOgImage
18. [ ] `blog-post-card.tsx` com `next/image`
19. [ ] `blog-skeleton.tsx`
20. [ ] `blog-empty-state.tsx`
21. [ ] `blog-breadcrumbs.tsx`
22. [ ] `blog-error.tsx`

### Dia 3: Seções Principais

23. [ ] `blog-hero-section.tsx`
24. [ ] `blog-filter-bar.tsx` com mask-image
25. [ ] `blog-featured-posts.tsx`
26. [ ] `blog-post-grid.tsx`
27. [ ] `blog-load-more.tsx` com `useQuery` + manual cursor state (estados idle/loading/done)

### Dia 4: Complementos

28. [ ] `blog-trending-sidebar.tsx`
29. [ ] `blog-trending-mobile.tsx` (horizontal scroll)
30. [ ] `blog-category-strip.tsx`
31. [ ] `blog-newsletter-cta.tsx` com checkbox LGPD
32. [ ] RSS feed route com `revalidate = 3600`

### Dia 5: Páginas + OG

33. [ ] Rewrite `/blog/page.tsx` com `unstable_cache`
34. [ ] `/blog/categoria/[slug]/page.tsx` com `generateStaticParams` + `dynamicParams = false`
35. [ ] `opengraph-image.tsx` para categoria (chama template)
36. [ ] `opengraph-image.tsx` para post (chama template)
37. [ ] `/blog/error.tsx` + `/blog/not-found.tsx`
38. [ ] `/blog/categoria/[slug]/error.tsx`

### Dia 6: SEO + Integrações

39. [ ] `generateMetadata` completo em todas as rotas
40. [ ] JSON-LD: Blog, ItemList, BreadcrumbList
41. [ ] `robots` condicional em categoria vazia
42. [ ] `<link rel="alternate" type="application/rss+xml">` no head
43. [ ] Sitemap: adicionar categorias dinamicamente
44. [ ] Analytics events instrumentados (PostHog)
45. [ ] `post-view-tracker.tsx` client component + montado em post detail page

### Dia 7: Responsive + A11y + Testing

46. [ ] Mobile: trending horizontal scroll
47. [ ] Mobile: filter bar scroll indicator testado
48. [ ] Touch targets >= 44px
49. [ ] Keyboard navigation
50. [ ] Screen reader path
51. [ ] Lighthouse mobile (LCP/CLS/FCP/INP)
52. [ ] Bundle analyzer: confirmar < 180kb
53. [ ] Rodar `rebuildCategoryStats` manualmente no Convex Dashboard

---

## Notas Técnicas Adicionais

### Environment Variables

`REVALIDATE_SECRET` precisa estar em DOIS lugares:

- `.env.local` do Next.js (lido pelo route handler)
- Convex environment variables (lido pela mutation que faz fetch)

### PostHog Routing

`PostHogProvider` em `(marketing)/layout.tsx`. Verificar se `/blog/[slug]` está DENTRO do grupo `(marketing)` — se estiver fora, PostHog não carrega. Estrutura atual assume `/app/(marketing)/blog/[slug]/page.tsx`.

### Satori Runtime

`opengraph-image.tsx` precisa de:

```ts
export const runtime = "edge";
```

Default Node.js runtime pode quebrar Satori em produção.

### remotePatterns Pathname

Algumas versões do Next.js exigem `pathname` explícito:

```ts
{
  protocol: 'https',
  hostname: '*.convex.cloud',
  pathname: '/**'  // explícito
},
```

---

## Verificação Final

### SEO Checklist

- [ ] Cada categoria tem URL indexável
- [ ] OG image renderiza (testar em opengraph.xyz ou metatags.io)
- [ ] JSON-LD válido (schema.org validator)
- [ ] RSS feed funciona em Feedly
- [ ] Sitemap inclui categorias dinamicamente
- [ ] Canonical com `NEXT_PUBLIC_APP_URL` em todas as páginas
- [ ] Breadcrumbs visuais + schema
- [ ] Categoria vazia tem `noindex`

### Performance Checklist

- [ ] Bundle `/blog` < 180kb gzipped
- [ ] LCP < 2.5s mobile
- [ ] CLS = 0
- [ ] TTFB (cache hit) < 100ms
- [ ] FCP < 1.8s
- [ ] INP < 200ms
- [ ] Hero image com `priority`
- [ ] Demais imagens lazy
- [ ] Skeleton não causa layout shift (dimensões fixas)

### UX Checklist

- [ ] Filter bar scroll indicator visível (mask-image)
- [ ] Load More preserva scroll position
- [ ] Load More mostra 3 skeleton cards + botão disabled
- [ ] Empty states não quebram layout
- [ ] Error boundary `<BlogError>` com retry funciona
- [ ] Newsletter feedback claro (sucesso/erro)
- [ ] Mobile trending horizontal com snap

### LGPD Checklist

- [ ] Newsletter com checkbox de consentimento obrigatório
- [ ] `consentedAt` e `ipAddress` salvos
- [ ] PostHog com `persistence: "memory"` (sem cookies, sem banner)
- [ ] Política de privacidade linkada no form

### A11y Checklist

- [ ] Touch targets >= 44px
- [ ] `aria-current="page"` no filtro ativo
- [ ] `aria-label` nas navegações
- [ ] Focus visible em todos os interativos
- [ ] Screen reader path lógico
- [ ] Contraste AA em texto sobre gradient

### Analytics Checklist (PostHog)

- [ ] `blog_category_clicked` firing
- [ ] `blog_load_more_clicked` firing
- [ ] `blog_newsletter_submitted` firing
- [ ] `blog_post_scroll_depth` firing (25/50/75/100)
- [ ] Vercel Analytics capturando page views

### Backend Checklist

- [ ] `rebuildCategoryStats` rodado uma vez após deploy
- [ ] 3 mutations de gatilho chamando `triggerRevalidation`
- [ ] `/api/revalidate` validando secret
- [ ] `incrementViews` NÃO revalida cache
- [ ] `readingTime` calculado em create/update

---

Plano v4 pronto para implementação.
