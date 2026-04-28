import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookmarkPlus,
  BookOpen,
  CheckCircle2,
  Clock,
  Diamond,
  Flame,
  History,
  Library,
  Rss,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateBlogListMetadata,
  generateBreadcrumbSchema,
  generateItemListSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LoadMorePosts } from "@/modules/blog/ui/load-more-posts";
import { NewsletterForm } from "@/modules/blog/ui/newsletter-form";
import "@/modules/blog/ui/blog-home.css";

export const metadata: Metadata = {
  ...generateBlogListMetadata(),
  alternates: {
    ...generateBlogListMetadata().alternates,
    types: {
      "application/rss+xml": "https://figurinhafacil.com.br/blog/feed.xml",
    },
  },
};

async function loadPosts() {
  "use cache";
  cacheTag("blog");
  cacheLife("hours");
  return convexServer.query(api.blog.getPublished, { limit: 20 });
}

async function loadTrending() {
  "use cache";
  cacheTag("blog");
  cacheLife("hours");
  return convexServer.query(api.blog.getTrending, { limit: 5 });
}

async function loadActiveSeries() {
  "use cache";
  cacheTag("blog");
  cacheLife("hours");
  return convexServer.query(api.blog.getActiveSeries, {});
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_CARDS = [
  {
    label: "Guias",
    desc: "Como colecionar, trocar, organizar.",
    Icon: BookOpen,
    accent: "var(--primary)",
  },
  {
    label: "História",
    desc: "A saga dos álbuns de Copa.",
    Icon: History,
    accent: "var(--secondary)",
  },
  {
    label: "Raridades",
    desc: "O que vale mais e por quê.",
    Icon: Diamond,
    accent: "#ffc965",
  },
  {
    label: "Copa 2026",
    desc: "Tudo sobre a nova edição.",
    Icon: Trophy,
    accent: "var(--primary)",
  },
] as const;

export default async function BlogPage() {
  const [posts, trending, series] = await Promise.all([
    loadPosts(),
    loadTrending(),
    loadActiveSeries(),
  ]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Blog" },
  ]);

  const itemListSchema = generateItemListSchema(
    "Blog Figurinha Fácil - Artigos sobre Figurinhas da Copa 2026",
    "Guias de trocas, histórias de colecionadores, raridades e dicas para completar seu álbum.",
    posts.slice(0, 100).map((p) => ({
      name: p.title,
      url: `${BASE_URL}/blog/${p.slug}`,
      description: p.excerpt,
    }))
  );

  const combinedSchema = generateCombinedSchema([breadcrumbSchema, itemListSchema]);

  // SSR renders exactly 12 posts (1 featured + 2 big-pair + 9 grid) so
  // LoadMorePosts can skip them cleanly when fetching subsequent pages.
  const featured = posts[0];
  const bigPair = posts.slice(1, 3);
  const gridPosts = posts.slice(3, 12);

  const categoryCounts = new Map<string, number>();
  for (const p of posts) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
  }
  const filterChips: { label: string; count: number; slug: string }[] = [
    { label: "Todos", count: posts.length, slug: "" },
    ...Array.from(categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, count]) => ({ label, count, slug: categorySlug(label) })),
  ];

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="bh-hero py-16">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">Blog</li>
              </ol>
            </nav>

            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div className="bh-fade-up">
                <span className="bh-eyebrow">
                  <span className="bh-live-dot" />
                  Blog · Arena de conteúdo
                </span>
                <h1 className="font-headline mt-5 text-4xl font-extrabold leading-[1.02] tracking-tight md:text-5xl lg:text-6xl text-balance">
                  Tudo sobre o{" "}
                  <span className="bh-text-gradient">álbum da Copa</span> — da
                  banca à estante.
                </h1>
                <p className="mt-6 max-w-prose text-base text-muted-foreground md:text-lg">
                  Guias de trocas, histórias de colecionadores, raridades,
                  rankings e os bastidores dos álbuns. Escrito por torcedores,
                  pra torcedores.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button size="lg" asChild>
                    <Link href="#mais-recentes">
                      <Zap className="h-4 w-4" />
                      Ler os mais recentes
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#newsletter">
                      <Rss className="h-4 w-4" />
                      Assinar newsletter
                    </Link>
                  </Button>
                </div>
                <dl className="mt-9 flex flex-wrap gap-7 text-sm text-muted-foreground">
                  <div>
                    <dt className="sr-only">Artigos publicados</dt>
                    <dd>
                      <strong className="font-headline mr-1 text-xl font-bold text-foreground">
                        {posts.length}
                      </strong>
                      artigos publicados
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Categorias</dt>
                    <dd>
                      <strong className="font-headline mr-1 text-xl font-bold text-foreground">
                        {categoryCounts.size}
                      </strong>
                      categorias
                    </dd>
                  </div>
                </dl>
              </div>

              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="bh-fade-up bh-delay-2 bh-featured-card"
                  style={
                    featured.coverImage
                      ? { backgroundImage: `url(${featured.coverImage})` }
                      : undefined
                  }
                >
                  <span className="bh-spine">
                    <Flame className="h-3.5 w-3.5" />
                    Em alta agora
                  </span>
                  <div className="mb-1 flex flex-wrap gap-2">
                    <span className="bh-chip bh-chip-primary">
                      {featured.category}
                    </span>
                  </div>
                  <h2 className="font-headline mt-2 text-2xl font-bold leading-[1.1] tracking-tight md:text-3xl text-balance">
                    {featured.title}
                  </h2>
                  <div className="mt-3.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="bh-avatar">{initials(featured.author.name)}</div>
                    <span>{featured.author.name}</span>
                    <span aria-hidden>·</span>
                    <span>{featured.readingTime} min de leitura</span>
                    {featured.publishedAt && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{formatDate(featured.publishedAt)}</span>
                      </>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Filter chips */}
        <section className="container mx-auto mt-3 px-4">
          <div className="bh-filter-bar">
            {filterChips.map((chip, i) => (
              <Link
                key={chip.label}
                href={chip.slug ? `/blog/categoria/${chip.slug}` : "/blog"}
                className={`bh-filter-chip ${i === 0 ? "active" : ""}`}
              >
                {chip.label}
                <span className="count">{chip.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Main grid: content + trending sidebar */}
        <section className="container mx-auto mt-8 px-4">
          <div className="bh-main-grid">
            <div>
              {/* Big-pair */}
              {bigPair.length > 0 && (
                <div>
                  <div className="bh-section-head">
                    <div>
                      <span className="bh-eyebrow">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Em destaque
                      </span>
                      <h2 className="bh-section-title mt-2">
                        Lidos nesta semana
                      </h2>
                    </div>
                  </div>
                  <div className="bh-big-pair">
                    {bigPair.map((post) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="bh-big-card"
                      >
                        <div
                          className="bh-thumb"
                          style={
                            post.coverImage
                              ? { backgroundImage: `url(${post.coverImage})` }
                              : undefined
                          }
                        />
                        <div className="bh-body">
                          <div className="flex gap-1.5">
                            <span className="bh-chip bh-chip-primary">
                              {post.category}
                            </span>
                          </div>
                          <h3>{post.title}</h3>
                          <p className="bh-excerpt">{post.excerpt}</p>
                          <div className="mt-auto flex items-center gap-2.5 text-xs text-muted-foreground">
                            <div className="bh-avatar">
                              {initials(post.author.name)}
                            </div>
                            <span>{post.author.name}</span>
                            <span className="opacity-40">·</span>
                            <span>{post.readingTime} min</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Post grid */}
              {gridPosts.length > 0 && (
                <div id="mais-recentes">
                  <div className="bh-section-head">
                    <h2 className="bh-section-title">Mais recentes</h2>
                    <Link href="/blog" className="bh-section-link">
                      Todos os artigos
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="bh-post-grid">
                    {gridPosts.map((post) => (
                      <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="bh-post-card"
                      >
                        <div className="bh-thumb">
                          {post.coverImage && (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              sizes="(min-width: 1080px) 33vw, (min-width: 720px) 50vw, 100vw"
                              className="object-cover"
                            />
                          )}
                          <span className="bh-cat">{post.category}</span>
                        </div>
                        <div className="bh-body">
                          <h3>{post.title}</h3>
                          <p className="bh-excerpt">{post.excerpt}</p>
                          <div className="bh-meta">
                            <div className="bh-avatar">
                              {initials(post.author.name)}
                            </div>
                            <span>{post.author.name}</span>
                            <span className="bh-read-time">
                              <Clock className="h-3.5 w-3.5" />
                              {post.readingTime} min
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <LoadMorePosts mode={{ kind: "all" }} />
                </div>
              )}
            </div>

            {/* Trending sidebar */}
            {trending.length > 0 && (
              <aside className="bh-trending">
                <h4>
                  <Flame className="h-4 w-4" />
                  Em alta agora
                </h4>
                <ol>
                  {trending.map((t, i) => (
                    <li key={t._id}>
                      <span className="bh-rank">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Link href={`/blog/${t.slug}`} className="block">
                        <p className="bh-t-title">{t.title}</p>
                        <div className="bh-t-meta">
                          <span>{t.category}</span>
                          <span className="opacity-40">·</span>
                          <span>{t.views.toLocaleString("pt-BR")} leituras</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
                <div className="bh-stat-grid">
                  <div className="bh-stat">
                    <div className="bh-stat-num">{posts.length}</div>
                    <div className="bh-stat-lbl">artigos</div>
                  </div>
                  <div className="bh-stat">
                    <div
                      className="bh-stat-num"
                      style={{ color: "var(--primary)" }}
                    >
                      {categoryCounts.size}
                    </div>
                    <div className="bh-stat-lbl">categorias</div>
                  </div>
                  <div className="bh-stat">
                    <div
                      className="bh-stat-num"
                      style={{ color: "#ffc965" }}
                    >
                      {new Set(posts.map((p) => p.author.name)).size}
                    </div>
                    <div className="bh-stat-lbl">autores</div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </section>

        {/* Series */}
        {series && (
          <section className="container mx-auto mt-12 px-4">
            <div className="bh-section-head">
              <h2 className="bh-section-title">Série em andamento</h2>
            </div>
            <article className="bh-series-card">
              <div className="bh-series-head">
                <div>
                  <span className="bh-chip bh-chip-tertiary mb-2.5 inline-flex">
                    <Library className="h-3.5 w-3.5" />
                    Série · {series.episodes.filter((e) => e.status === "published").length}/{series.totalPlanned}
                  </span>
                  <h3 className="bh-series-title mt-2">{series.title}</h3>
                  {series.description && (
                    <p className="mt-1.5 max-w-prose text-sm text-muted-foreground">
                      {series.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-white/[0.08]"
                >
                  <BookmarkPlus className="h-4 w-4" />
                  Seguir série
                </button>
              </div>
              <div className="bh-series-episodes">
                {Array.from({ length: series.totalPlanned }).map((_, idx) => {
                  const number = idx + 1;
                  const ep = series.episodes.find(
                    (e) => e.episodeNumber === number
                  );
                  const isPublished = ep && ep.status === "published";
                  const isCurrent =
                    isPublished &&
                    number ===
                      Math.max(
                        ...series.episodes
                          .filter((e) => e.status === "published")
                          .map((e) => e.episodeNumber)
                      );
                  const numClass = !ep
                    ? "bh-episode-num upcoming"
                    : isCurrent
                      ? "bh-episode-num current"
                      : "bh-episode-num";
                  const wrapClass = ep
                    ? "bh-episode"
                    : "bh-episode upcoming";
                  const inner = (
                    <>
                      <div className={numClass}>
                        {String(number).padStart(2, "0")}
                      </div>
                      <div className="bh-episode-info">
                        <h4>{ep ? ep.title : "Em breve"}</h4>
                        <p>
                          {ep
                            ? `${ep.readingTime} min · ${ep.author}`
                            : `Próximo episódio · #${number}`}
                        </p>
                      </div>
                      {isCurrent ? (
                        <span className="bh-chip bh-chip-tertiary text-[0.6rem]">
                          Novo
                        </span>
                      ) : isPublished ? (
                        <CheckCircle2
                          className="h-5 w-5 shrink-0"
                          style={{ color: "#ffc965" }}
                        />
                      ) : (
                        <Clock
                          className="h-5 w-5 shrink-0 text-muted-foreground"
                        />
                      )}
                    </>
                  );
                  return ep ? (
                    <Link
                      key={number}
                      href={`/blog/${ep.slug}`}
                      className={wrapClass}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div key={number} className={wrapClass}>
                      {inner}
                    </div>
                  );
                })}
              </div>
            </article>
          </section>
        )}

        {/* Category strip */}
        <section className="container mx-auto mt-16 px-4">
          <div className="bh-section-head">
            <h2 className="bh-section-title">Navegue por categoria</h2>
          </div>
          <div className="bh-cat-strip">
            {CATEGORY_CARDS.map((cat) => {
              const count = categoryCounts.get(cat.label) ?? 0;
              return (
                <Link
                  key={cat.label}
                  href={`/blog/categoria/${categorySlug(cat.label)}`}
                  className="bh-cat-card"
                >
                  <span className="bh-cnt">{count}</span>
                  <div
                    className="bh-cat-icon"
                    style={{
                      background: `color-mix(in oklab, ${cat.accent} 12%, transparent)`,
                      color: cat.accent,
                    }}
                  >
                    <cat.Icon className="h-5 w-5" />
                  </div>
                  <h4>{cat.label}</h4>
                  <p>{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Empty state */}
        {posts.length === 0 && (
          <section className="py-24">
            <div className="container mx-auto px-4 text-center">
              <h2 className="font-headline mb-4 text-2xl font-bold">
                Em breve!
              </h2>
              <p className="mx-auto mb-8 max-w-md text-muted-foreground">
                Estamos preparando conteúdos incríveis sobre figurinhas e a Copa
                do Mundo 2026. Volte em breve!
              </p>
              <Button asChild>
                <Link href="/">
                  Voltar ao início
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section id="newsletter" className="container mx-auto mt-20 px-4">
          <div className="bh-newsletter">
            <span className="bh-eyebrow">
              <Rss className="h-3.5 w-3.5" />
              Newsletter semanal
            </span>
            <h3>Receba o melhor do álbum na sua caixa, toda sexta.</h3>
            <p>
              Guias exclusivos, alertas de figurinha rara perto de você e
              entrevistas com colecionadores. Sem spam, sem enrolação.
            </p>
            <NewsletterForm source="blog-home" />
            <p className="bh-newsletter-meta">
              <span className="bh-live-dot" />
              Junto com colecionadores. Cancele quando quiser.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline mb-6 text-2xl font-bold md:text-3xl">
              Quer completar seu álbum?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Cadastre-se gratuitamente e encontre colecionadores para trocar
              figurinhas perto de você.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
