import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Flame } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import { BASE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { processContent } from "@/modules/blog/lib/process-content";
import { calculateReadingTime } from "@/modules/blog/lib/reading-time";
import { ReadingProgress } from "@/modules/blog/ui/reading-progress";
import { ReadingProgressProvider } from "@/modules/blog/ui/reading-progress-provider";
import { BlogToc } from "@/modules/blog/ui/blog-toc";
import { ShareRail } from "@/modules/blog/ui/share-rail";
import { HeroActions } from "@/modules/blog/ui/hero-actions";
import { BlogMetaRow } from "@/modules/blog/ui/blog-meta-row";
import { ViewTracker } from "@/modules/blog/ui/view-tracker";
import type { Id } from "@workspace/backend/_generated/dataModel";
import "@/modules/blog/ui/blog-prose.css";
import "@/modules/blog/ui/blog-home.css";

async function loadMetrics(postId: Id<"blogPosts">) {
  "use cache";
  cacheLife("minutes");
  try {
    const metrics = await convexServer.query(api.blog.getMetrics, { postId });
    return metrics ?? { likes: 0, saves: 0, comments: 0 };
  } catch {
    return { likes: 0, saves: 0, comments: 0 };
  }
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

async function loadPost(slug: string) {
  "use cache";
  cacheTag(`blog:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.blog.getBySlug, { slug });
}

async function loadRelated(slug: string) {
  "use cache";
  cacheTag(`blog:${slug}`);
  cacheLife("hours");
  return convexServer.query(api.blog.getRelated, { slug, limit: 3 });
}

export async function generateStaticParams() {
  const all: string[] = [];
  let cursor: string | null = null;
  for (let i = 0; i < 50; i++) {
    const result: {
      slugs: string[];
      continueCursor: string;
      isDone: boolean;
    } = await convexServer.query(api.blog.getAllSlugs, {
      paginationOpts: { numItems: 1000, cursor },
    });
    all.push(...result.slugs);
    if (result.isDone) break;
    cursor = result.continueCursor;
  }
  if (all.length === 0) {
    return [{ slug: "__placeholder__" }];
  }
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    return { title: "Post não encontrado" };
  }

  const canonical = `${BASE_URL}/blog/${post.slug}`;

  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      url: canonical,
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      modifiedTime: post.updatedAt
        ? new Date(post.updatedAt).toISOString()
        : undefined,
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function renderTitle(title: string, highlight?: string) {
  if (!highlight) return title;
  const lc = title.toLowerCase();
  const i = lc.indexOf(highlight.toLowerCase());
  if (i < 0) return title;
  return (
    <>
      {title.slice(0, i)}
      <span className="text-tertiary">
        {title.slice(i, i + highlight.length)}
      </span>
      {title.slice(i + highlight.length)}
    </>
  );
}

// Prevent XSS via JSON-LD injection
function sanitizeJsonLdValue(val: string): string {
  return val
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

async function safeProcessContent(content: string) {
  try {
    return await processContent(content);
  } catch (e) {
    console.error("Content processing failed:", e);
    return {
      sanitizedHtml: "<p>Erro ao processar conteúdo.</p>",
      headings: [],
      wordCount: 0,
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await loadPost(slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, metrics] = await Promise.all([
    loadRelated(slug),
    loadMetrics(post._id),
  ]);

  const { sanitizedHtml, headings, wordCount } = await safeProcessContent(
    post.content
  );
  const readingTime = calculateReadingTime(sanitizedHtml);
  const canonical = `${BASE_URL}/blog/${post.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${BASE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: sanitizeJsonLdValue(post.title),
        item: canonical,
      },
    ],
  };

  const imageUrl = post.coverImage?.startsWith("http")
    ? post.coverImage
    : post.coverImage
      ? `${BASE_URL}${post.coverImage}`
      : `${BASE_URL}/opengraph-image`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: sanitizeJsonLdValue(post.title),
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: sanitizeJsonLdValue(post.author.name),
    },
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    publisher: {
      "@type": "Organization",
      name: "Figurinha Fácil",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.svg`,
      },
    },
    wordCount,
    articleSection: post.category,
    keywords: post.tags.join(", "),
    inLanguage: "pt-BR",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".blog-prose p.lead", ".blog-prose h2"],
    },
  };

  // Product/FAQ types (optional fields added to schema)
  type ProductField = {
    name: string;
    sku?: string;
    price: number;
    priceCurrency: string;
    image?: string;
    description?: string;
    url?: string;
    availability?: string;
  };
  type FaqField = { question: string; answer: string };
  const postWithSeo = post as typeof post & {
    products?: ProductField[];
    faqs?: FaqField[];
  };

  // Product JSON-LD (from structured Convex field)
  const productSchemas = (postWithSeo.products ?? []).map((p: ProductField) => ({
    "@context": "https://schema.org" as const,
    "@type": "Product" as const,
    name: sanitizeJsonLdValue(p.name),
    sku: p.sku,
    description: p.description ? sanitizeJsonLdValue(p.description) : undefined,
    image: p.image,
    offers: {
      "@type": "Offer" as const,
      price: p.price,
      priceCurrency: p.priceCurrency,
      availability: p.availability ?? "https://schema.org/InStock",
      url: p.url,
    },
  }));

  // FAQ JSON-LD (from structured Convex field)
  const faqSchema =
    postWithSeo.faqs && postWithSeo.faqs.length > 0
      ? {
          "@context": "https://schema.org" as const,
          "@type": "FAQPage" as const,
          mainEntity: postWithSeo.faqs.map((f: FaqField) => ({
            "@type": "Question" as const,
            name: sanitizeJsonLdValue(f.question),
            acceptedAnswer: {
              "@type": "Answer" as const,
              text: sanitizeJsonLdValue(f.answer),
            },
          })),
        }
      : null;

  const author = post.author as typeof post.author & { role?: string };

  return (
    <ReadingProgressProvider>
      <div
        className="dark min-h-screen text-foreground"
        style={{ backgroundColor: "#090e1c" }}
      >
        <JsonLd data={breadcrumbSchema} />
        <JsonLd data={articleSchema} />
        {productSchemas.map((schema, i: number) => (
          <JsonLd key={`product-${i}`} data={schema} />
        ))}
        {faqSchema && <JsonLd data={faqSchema} />}
        <ReadingProgress />
        <LandingHeader />
        <ViewTracker slug={slug} />
        <main className="pt-24">
          {/* Hero */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 max-w-5xl">
              <nav className="mb-8 text-sm text-muted-foreground" aria-label="Breadcrumb">
                <ol className="flex items-center gap-2 flex-wrap">
                  <li>
                    <Link href="/blog" className="hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li className="text-muted-foreground/60">/</li>
                  <li>
                    <Link
                      href={`/blog?categoria=${encodeURIComponent(post.category)}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {post.category}
                    </Link>
                  </li>
                  <li className="text-muted-foreground/60">/</li>
                  <li className="text-foreground font-medium line-clamp-1">
                    {post.title}
                  </li>
                </ol>
              </nav>

              <div className="flex gap-2 flex-wrap mb-6">
                <Badge
                  variant="outline"
                  className="uppercase tracking-wider px-3 py-1 rounded-full bg-white/[0.04] border-white/10 text-foreground/90"
                >
                  {post.category}
                </Badge>
                {post.tags.slice(0, 2).map((tag, idx) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`uppercase tracking-wider px-3 py-1 rounded-full bg-transparent ${
                      idx === 0
                        ? "border-emerald-500/40 text-emerald-400"
                        : "border-amber-500/40 text-amber-400"
                    }`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1
                id="post-title"
                className="font-headline font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] text-foreground"
              >
                {renderTitle(post.title, post.titleHighlight)}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mt-6">
                {post.excerpt}
              </p>

              <div className="mt-10 flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 bg-gradient-to-br from-emerald-500 to-blue-500">
                    {post.author.avatar && (
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    )}
                    <AvatarFallback className="bg-transparent text-white font-bold">
                      {(post.author.name?.trim() || "?")
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((p) => p.charAt(0).toUpperCase())
                        .join("") || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="leading-tight">
                    <p className="font-bold text-foreground">{post.author.name}</p>
                    {author.role && (
                      <p className="text-sm text-muted-foreground">{author.role}</p>
                    )}
                  </div>
                </div>

                <span
                  className="hidden sm:block h-8 w-px bg-outline-variant/40"
                  aria-hidden
                />

                <BlogMetaRow
                  publishedAt={post.publishedAt}
                  readingTime={readingTime}
                  views={post.views}
                />

                <div className="ml-auto">
                  <HeroActions
                    postId={post._id}
                    title={post.title}
                    url={canonical}
                    initialCounts={{ likes: metrics.likes, saves: metrics.saves }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Cover */}
          {post.coverImage && (
            <section className="container mx-auto px-4 max-w-5xl">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-outline-variant/20">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1024px, 100vw"
                  className="object-cover"
                />
                {post.isTrending && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge
                      variant="premium"
                      className="uppercase tracking-wider gap-1.5 px-3 py-1.5 text-xs"
                      aria-label="Este artigo está em tendência"
                    >
                      <Flame className="size-3.5" aria-hidden />
                      Em alta
                    </Badge>
                  </div>
                )}
              </div>
            </section>
          )}

        {/* Mobile TOC */}
        <div className="xl:hidden container mx-auto px-4 mt-8 mb-4">
          <BlogToc headings={headings} variant="mobile" />
        </div>

        {/* Content with Three-Column Layout */}
        <section className="py-12">
          <div className="container mx-auto px-4 xl:grid xl:grid-cols-[240px_1fr_220px] xl:gap-12">
            {/* Left Rail: Share */}
            <ShareRail
              title={post.title}
              url={canonical}
              postId={post._id}
              initialCounts={{ likes: metrics.likes, saves: metrics.saves }}
              className="hidden xl:block sticky"
              style={{ top: "var(--header-h, 5rem)" }}
            />

            {/* Article */}
            <article className="blog-prose max-w-3xl mx-auto xl:mx-0 prose prose-lg dark:prose-invert prose-headings:font-headline prose-a:text-primary">
              <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
            </article>

            {/* Right Rail: TOC */}
            <BlogToc
              headings={headings}
              variant="desktop"
              className="hidden xl:block sticky"
              style={{ top: "var(--header-h, 5rem)" }}
            />
          </div>
        </section>

        {/* Tags */}
        {post.tags.length > 0 && (
          <section className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto pt-8 border-t">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Author Bio (inline) */}
        <section className="container mx-auto px-4 mt-12">
          <div className="max-w-3xl mx-auto p-6 rounded-xl bg-surface-container border border-outline-variant/40">
            <div className="flex items-start gap-4">
              <Avatar className="size-16">
                {post.author.avatar && (
                  <AvatarImage src={post.author.avatar} />
                )}
                <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground">
                  {post.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-headline font-bold text-lg">
                  {post.author.name}
                </p>
                <p className="text-sm text-tertiary uppercase tracking-wider font-medium">
                  Autor
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Blog */}
        <section className="container mx-auto px-4 mt-12">
          <div className="max-w-3xl mx-auto">
            <Button variant="outline" asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao blog
              </Link>
            </Button>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-5xl">
                <div className="bh-section-head">
                  <div>
                    <span className="bh-eyebrow">Continue lendo</span>
                    <h2 className="bh-section-title mt-2">
                      Artigos relacionados
                    </h2>
                  </div>
                  <Link href="/blog" className="bh-section-link">
                    Ver todos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="bh-post-grid">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related._id}
                      href={`/blog/${related.slug}`}
                      className="bh-post-card"
                    >
                      <div className="bh-thumb">
                        {related.coverImage && (
                          <Image
                            src={related.coverImage}
                            alt={related.title}
                            fill
                            sizes="(min-width: 1080px) 33vw, 100vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="bh-body">
                        <h3>{related.title}</h3>
                        <p className="bh-excerpt">{related.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Pronto para completar seu álbum?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
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
      </div>
    </ReadingProgressProvider>
  );
}
