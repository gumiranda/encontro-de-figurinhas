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
import {
  generateBlogPostMetadata,
  generateBreadcrumbSchema,
  generateArticleSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

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

  return generateBlogPostMetadata(
    post.title,
    post.slug,
    post.excerpt,
    post.coverImage ?? undefined,
    post.seoTitle ?? undefined,
    post.seoDescription ?? undefined
  );
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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    { name: post.title },
  ]);

  const articleSchema = generateArticleSchema(
    post.title,
    post.slug,
    post.excerpt,
    post.publishedAt ?? Date.now(),
    post.updatedAt ?? undefined,
    post.author,
    post.coverImage ?? undefined
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
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
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>

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
                    {post.readingTime} min de leitura
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
                className="object-cover"
                priority
              />
            </div>
          </section>
        )}

        {/* Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <article className="max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-headline prose-a:text-primary">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </article>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="max-w-3xl mx-auto mt-12 pt-8 border-t">
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
            )}

            {/* Back to Blog */}
            <div className="max-w-3xl mx-auto mt-12">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar ao blog
                </Link>
              </Button>
            </div>
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
                    <Card className="h-full hover:border-primary transition-colors">
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
