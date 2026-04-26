# Plano v4 — Implementação do Design de Blog Post

---

## 1. `apps/web/modules/blog/lib/use-reading-progress.ts` (NOVO)

Dois exports distintos:

**`<ReadingProgressTracker />`** — Componente sentinela sem retorno visual. Monta no topo do JSX da página. Dentro de um único rAF loop:

- Calcula `progress` de `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100`
- Escreve `document.documentElement.style.setProperty('--reading-progress', String(p))`
- Query `document.querySelector('[data-reading-percentage]')` cacheada na montagem; escreve `textContent` direto
- Query `document.querySelector('[data-reading-bar]')` cacheada; escreve `setAttribute('aria-valuenow', String(Math.round(p)))`
- Zero `useState` no caminho de scroll

**Cleanup obrigatório no unmount:**

```ts
return () => {
  cancelAnimationFrame(frame);
  document.documentElement.style.removeProperty("--reading-progress");
};
```

**`useActiveSection(headingIds: string[])`** — Hook React separado. IntersectionObserver com `rootMargin: "-40% 0px -55% 0px"`. Retorna `activeSectionId: string | null` via `useState`. Muda pouco (só quando seção cruza threshold).

**Grep pré-delete:**

```bash
rg "useEffect.*scroll" apps/web/modules/blog/ui/reading-progress.tsx
rg "IntersectionObserver" apps/web/modules/blog/ui/blog-toc.tsx
```

---

## 2. `apps/web/modules/blog/ui/reading-progress.tsx`

**JSX final:**

```tsx
export function ReadingProgress() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-muted/30 z-50 print:hidden">
      <div
        data-reading-bar
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-label="Progresso de leitura"
        className="h-full bg-gradient-to-r from-primary to-secondary reading-progress-bar"
      />
    </div>
  );
}
```

- `data-reading-bar` é o seletor que o tracker usa para escrever `aria-valuenow`
- Zero state, zero effect, zero props
- Largura e glow via CSS puro em `blog-prose.css`

**Componente:** Nenhum (inline primitivo)

**Dead code removido:** `useEffect` + `useState` + scroll listener + `requestAnimationFrame` interno.

**A11y:** `role="progressbar"`, `aria-valuenow` atualizado pelo tracker, `aria-label="Progresso de leitura"`.

---

## 3. `apps/web/modules/blog/ui/blog-toc.tsx`

**Mudanças:**

- Importa `useActiveSection()` para highlight dos links
- Remove IntersectionObserver duplicado
- Ring SVG usa `strokeDasharray="106.814"` (2π·17 exato)
- `<span data-reading-percentage>0%</span>` escrito pelo tracker

**Ring SVG:**

```tsx
<svg width="40" height="40" viewBox="0 0 40 40" className="mt-6" role="img" aria-label="Progresso de leitura">
  <circle cx="20" cy="20" r="17" className="stroke-outline-variant fill-none" strokeWidth="3" />
  <circle
    cx="20" cy="20" r="17"
    className="stroke-secondary fill-none reading-progress-ring"
    strokeWidth="3"
    strokeDasharray="106.814"
    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
  />
</svg>
<div className="text-center mt-2">
  <span data-reading-percentage className="font-headline font-bold text-base">0%</span>
  <span className="text-xs text-muted-foreground block">lido</span>
</div>
```

**Componente:** Nenhum

**Dead code removido:** `useEffect` com IntersectionObserver, state `activeId`, `ReadingPercentage` componente.

**Risco monitorado:** `filter: drop-shadow` no ring durante scroll custa paint. Medir no Lighthouse pós-deploy.

---

## 4. `apps/web/modules/blog/ui/blog-prose.css`

**Drop cap com fallback:**

```css
.blog-prose > p:first-of-type::first-letter {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@supports not (background-clip: text) {
  .blog-prose > p:first-of-type::first-letter {
    background: none;
    color: var(--primary);
  }
}
```

**Progress bar + ring (sem `data-progress`):**

```css
.reading-progress-bar {
  width: calc(var(--reading-progress, 0) * 1%);
  transition: width 150ms ease-out;
  box-shadow: 0 0 8px var(--primary);
}

.reading-progress-ring {
  stroke-dashoffset: calc(106.814 - 106.814 * var(--reading-progress, 0) / 100);
  filter: drop-shadow(0 0 4px var(--secondary));
}

@media (prefers-reduced-motion: reduce) {
  .reading-progress-bar,
  .reading-progress-ring {
    transition: none;
  }
}
```

**Grep pré-delete:**

```bash
rg "first-of-type::first-letter" apps/web/modules/blog/ui/blog-prose.css
```

**Dead code removido:** Gradient antigo com `hsl()` hardcoded.

---

## 5. `apps/web/app/(marketing)/blog/[slug]/page.tsx`

**Tracker no topo do JSX:**

```tsx
import { ReadingProgressTracker } from "@/modules/blog/lib/use-reading-progress";

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // ...
  return (
    <>
      <ReadingProgressTracker />
      <JsonLd data={breadcrumbSchema} />
      {/* resto */}
    </>
  );
}
```

#### 5.1 Hero Chips

APENAS categoria, sem tags:

```tsx
<Badge variant="secondary">{post.category}</Badge>
```

**Componente:** `Badge variant="secondary"`

#### 5.2 Cover Image

`aspect-[2/1]`, badge FORA da imagem (acima), sem overlay:

```tsx
{
  post.coverImage && (
    <section className="container mx-auto px-4 -mt-8">
      <div className="max-w-4xl mx-auto">
        <Badge variant="premium" className="mb-3">
          {post.category}
        </Badge>
        <div className="relative aspect-[2/1] rounded-xl overflow-hidden shadow-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            fetchPriority="high"
            sizes="(min-width: 1280px) 800px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
```

**Componente:** `Badge variant="premium"` (confirmado existir)

**SEO:** `alt={post.title}` nunca vazio.

#### 5.3 Author Bio

Manter layout atual. Adicionar:

```tsx
<Avatar aria-label={`Foto de ${post.author.name}`}>
```

#### 5.4 Related Posts

Inline (YAGNI). `aspect-video` nos thumbs (16:9 padrão para cards compactos; cover usa 2:1 premium — inconsistência aceita).

**Confirmar antes:** query `api.blog.getRelated` em `blog.ts` retorna `category`, `author.name`, `readingTime`, `excerpt`, `coverImage`. Se não, ajustar projeção no mesmo PR.

```tsx
{
  relatedPosts.map((related) => (
    <Link key={related._id} href={`/blog/${related.slug}`}>
      <Card className="h-full hover:border-primary transition-colors hover:-translate-y-0.5">
        {related.coverImage && (
          <div className="relative aspect-video">
            <Image
              src={related.coverImage}
              alt={related.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <Badge variant="secondary" className="w-fit mb-2">
            {related.category}
          </Badge>
          <CardTitle className="line-clamp-2 text-lg">{related.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {related.excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{related.author.name}</span>
            <span className="opacity-40">·</span>
            <span>{related.readingTime} min</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  ));
}
```

**Componente:** `Card`, `Badge variant="secondary"`

#### 5.5 End CTA

Badge simples (não Announcement). Gradient com `color-mix`:

```tsx
import { Zap, ArrowRight } from "lucide-react";

<section className="py-16 md:py-24">
  <div className="container mx-auto px-4 text-center">
    <div className="max-w-2xl mx-auto p-8 md:p-12 rounded-3xl bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--primary)_12%,transparent),_transparent_60%)] border border-primary/15">
      <Badge variant="outline" className="rounded-full gap-1.5 mb-4">
        <Zap className="size-3.5" />
        Pronto pra começar
      </Badge>
      <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4 text-balance">
        Pronto para completar seu álbum?
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
        Cadastre-se gratuitamente e encontre colecionadores para trocar figurinhas perto
        de você.
      </p>
      <Button size="lg" asChild>
        <Link href="/sign-up">
          Criar conta grátis
          <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>
    </div>
  </div>
</section>;
```

**Componente:** `Badge variant="outline"`, `Button`

**Icon:** `Zap` de lucide-react (confirmado)

---

## Dependências a Resolver ANTES

| Dependência                                        | Necessário para                            |
| -------------------------------------------------- | ------------------------------------------ |
| Índice `by_category_publishedAt`                   | Botão "Ler próximo guia"                   |
| Campos `author.bio`, `author.role`, `author.email` | Author bio rico                            |
| Campo `relatedHubs[]` no schema                    | Seção "Continue explorando"                |
| Auditoria da query `getRelated`                    | Confirmar projeção retorna todos os campos |

---

## Cortado do Escopo e Motivo

| Item                          | Motivo                                    |
| ----------------------------- | ----------------------------------------- |
| Seção "Continue explorando"   | Requer `relatedHubs[]` no schema          |
| Botão "Ler próximo guia"      | Não existe índice                         |
| `BlogCoverImage.tsx`          | YAGNI                                     |
| `BlogRelatedCard.tsx`         | YAGNI                                     |
| Author bio rico               | Schema não tem campos                     |
| Overlay do cover              | Decorativo, título fora da imagem         |
| Tags no hero                  | Duplica categoria                         |
| Kibo `Announcement`           | Overkill para eyebrow decorativo          |
| `data-progress="0"`           | Zero valor (glow em width=0 é invisível)  |
| `ReadingPercentage` com state | `getComputedStyle` em rAF = forced reflow |

---

## Verificação

1. Cover com badge acima da imagem + `aspect-[2/1]`
2. Progress ring atualiza ao rolar (via CSS custom property)
3. JSON-LD válido no Rich Results Test
