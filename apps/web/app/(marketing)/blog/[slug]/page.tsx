import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
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
import { BlogToc } from "@/modules/blog/ui/blog-toc";
import { ShareRail } from "@/modules/blog/ui/share-rail";
import "@/modules/blog/ui/blog-prose.css";

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
  const slugs = await convexServer.query(api.blog.getAllSlugs, {});
  return slugs.map((slug) => ({ slug }));
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

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, relatedPosts] = await Promise.all([
    loadPost(slug),
    loadRelated(slug),
  ]);

  if (!post) {
    notFound();
  }

  const { sanitizedHtml, headings } = await processContent(post.content);
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
        name: post.title,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt
      ? new Date(post.publishedAt).toISOString()
      : undefined,
    dateModified: post.updatedAt
      ? new Date(post.updatedAt).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    image: post.coverImage,
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
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".blog-prose h2", ".blog-prose > p:first-of-type"],
    },
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <ReadingProgress />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium line-clamp-1">
                  {post.title}
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex gap-2 flex-wrap mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-headline font-bold tracking-tight mb-6">
                {post.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                {post.excerpt}
              </p>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {post.author.avatar && (
                      <AvatarImage src={post.author.avatar} />
                    )}
                    <AvatarFallback>
                      {post.author.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{post.author.name}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {post.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {readingTime} min de leitura
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cover Image */}
        {post.coverImage && (
          <section className="container mx-auto px-4 -mt-8">
            <div className="relative aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1280px) 800px, 100vw"
                className="object-cover"
              />
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
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-headline font-bold mb-8 text-center">
                Artigos relacionados
              </h2>

              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {relatedPosts.map((related) => (
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
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-lg">
                          {related.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {related.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
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
    </>
  );
}
