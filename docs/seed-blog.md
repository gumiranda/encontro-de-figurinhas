# Seed de Blog Posts — Guia de Uso

## Visão geral

Os artigos do blog ficam em `packages/backend/convex/seedBlog.ts` dentro do array `BLOG_POSTS`. O seed é uma `internalMutation` que insere todos os posts de uma vez — mas **apenas se o banco estiver vazio**.

## Como rodar o seed

### 1. Banco vazio (primeira vez)

Se o banco de dados não tem nenhum blog post ainda, basta chamar a mutation:

```bash
npx convex run seedBlog:seedBlogPosts
```

Isso insere todos os artigos do array `BLOG_POSTS` e retorna:

```json
{ "inserted": ["slug-1", "slug-2", ...], "count": 53 }
```

### 2. Banco já populado

Se já existem posts, o seed **pula automaticamente** e retorna:

```json
{ "skipped": true, "message": "Blog posts already exist" }
```

Para forçar o re-seed, é preciso limpar a tabela primeiro:

```bash
# Apagar todos os blog posts (requer criar mutation de limpeza ou usar o dashboard)
npx convex dashboard
```

No dashboard, navegue até a tabela `blogPosts`, selecione e delete os documentos, depois rode o seed novamente.

### 3. Adicionar um artigo individual (banjo já populado)

Use a mutation pública `blog:create` como admin:

```bash
npx convex run blog:create '{
  "title": "Figurinhas Nova Seleção Copa 2026: Convocação e Álbum FIFA",
  "slug": "figurinhas-nova-selecao-copa-2026",
  "excerpt": "Convocação provável...",
  "content": "<p>Conteúdo HTML...</p>",
  "category": "Seleções Copa 2026",
  "tags": ["Nova Seleção", "Copa do Mundo 2026", "figurinhas", "álbum FIFA 2026", "Grupo X"],
  "seoTitle": "Figurinhas Nova Seleção Copa 2026 — Convocação e Álbum",
  "seoDescription": "Convocação provável...",
  "status": "published"
}'
```

Requer autenticação como usuário `admin`.

## Estrutura de um artigo no seed

Cada entrada do `BLOG_POSTS` segue este formato:

```typescript
{
  title: "Figurinhas [Seleção] Copa 2026: Convocação e Álbum FIFA",
  slug: "figurinhas-[slug]-copa-2026",
  excerpt: "Convocação provável da [seleção] na Copa 2026, técnico [nome], Grupo [X], álbum oficial FIFA e troca de figurinhas no Figurinha Fácil.",
  content: `...HTML...`.trim(),
  category: "Seleções Copa 2026",
  tags: ["[Seleção]", "Copa do Mundo 2026", "figurinhas", "álbum FIFA 2026", "Grupo [X]"],
  seoTitle: "Figurinhas [Seleção] Copa 2026 — Convocação e Álbum",
  seoDescription: "Convocação provável da [seleção] na Copa 2026, técnico [nome], Grupo [X], álbum oficial FIFA e troca de figurinhas no Figurinha Fácil.",
}
```

## Template HTML do content

O `content` usa HTML puro (renderizado via `dangerouslySetInnerHTML` no frontend). Seções na ordem:

1. **Intro** — Parágrafo com dados da Copa 2026, seleção, apelido, grupo e adversários
2. **Ficha rápida** — `<blockquote>` com continente, ranking, técnico, última Copa e grupo
3. **Banner de estreia** (apenas seleções debutantes) — `<p>🆕 <strong>ESTREIA HISTÓRICA NA COPA DO MUNDO</strong> — ...</p>`
4. **Sobre a Seleção** — `<h2>` + 1-2 parágrafos
5. **Provável Convocação** — `<h2>` + `<h3>` por posição (Goleiros, Defensores, Meio-campistas, Atacantes) com `<ul>/<li>`
6. **Aviso** — `<blockquote>⚠️ Esta é uma convocação provável...</blockquote>`
7. **Estrelas** — `<h2>` + `<ul>` com 5 jogadores como `<li><strong>Nome</strong> (Clube)</li>`
8. **Técnico** — `<h2>` + parágrafo
9. **Grupo** — `<h2>` + `<table>` com confrontos
10. **Histórico** — `<h2>` + `<ul>` com maior conquista, última participação e total de Copas
11. **Figurinhas no Álbum** — `<h2>📒 ...` + parágrafo + `<ul>` com tipos de figurinha
12. **Onde Trocar** — `<h2>🔄 ...` + `<ol>` com 4 passos
13. **FAQ** — `<h2>` + 6 perguntas como `<h3>` + `<p>`
14. **Conclusão** — `<h2>` + parágrafo com CTA
15. **Leia também** — `<h2>` + `<ul>` com 3 links internos

## Arquivos relevantes

| Arquivo | Função |
|---------|--------|
| `packages/backend/convex/seedBlog.ts` | Array `BLOG_POSTS` + mutation `seedBlogPosts` |
| `packages/backend/convex/schema.ts` | Schema da tabela `blogPosts` |
| `packages/backend/convex/blog.ts` | Queries e mutations públicas (`create`, `update`) |
| `apps/web/app/(marketing)/blog/[slug]/page.tsx` | Página de artigo no frontend |
| `apps/web/app/(marketing)/blog/page.tsx` | Listagem do blog |

## Checklist para adicionar novo artigo

1. Criar a entrada no array `BLOG_POSTS` em `seedBlog.ts` seguindo o template
2. Se a seleção é estreante, incluir o banner de estreia após a ficha rápida
3. Verificar que o `slug` é único (não existe no array)
4. Para banco já populado, usar `blog:create` ao invés do seed
5. Rodar `npx convex run seedBlog:seedBlogPosts` (se banco vazio) ou `blog:create` (se populado)
