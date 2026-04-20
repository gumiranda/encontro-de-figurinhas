import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateBlogListMetadata,
  generateBreadcrumbSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = generateBlogListMetadata();

async function loadPosts() {
  "use cache";
  cacheTag("blog");
  cacheLife("hours");
  return convexServer.query(api.blog.getPublished, { limit: 20 });
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default async function BlogPage() {
  const posts = await loadPosts();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Blog" },
  ]);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
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

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Blog <span className="text-primary">Figurinha Fácil</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Dicas de troca, novidades da Copa do Mundo 2026 e guias para
                completar seu álbum mais rápido.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <Link href={`/blog/${featuredPost.slug}`}>
                <Card className="overflow-hidden hover:border-primary transition-colors">
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredPost.coverImage && (
                      <div className="relative aspect-video md:aspect-auto">
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="flex flex-col justify-center py-8">
                      <Badge variant="secondary" className="w-fit mb-4">
                        {featuredPost.category}
                      </Badge>
                      <CardTitle className="text-2xl md:text-3xl mb-4 hover:text-primary transition-colors">
                        {featuredPost.title}
                      </CardTitle>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readingTime} min de leitura
                        </span>
                        {featuredPost.publishedAt && (
                          <span>{formatDate(featuredPost.publishedAt)}</span>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        )}

        {/* Other Posts */}
        {otherPosts.length > 0 && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-headline font-bold mb-8">
                Mais artigos
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post) => (
                  <Link key={post._id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:border-primary transition-colors">
                      {post.coverImage && (
                        <div className="relative aspect-video">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <Badge variant="outline" className="w-fit mb-2">
                          {post.category}
                        </Badge>
                        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min
                          </span>
                          {post.publishedAt && (
                            <span>{formatDate(post.publishedAt)}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <section className="py-24">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-2xl font-headline font-bold mb-4">
                Em breve!
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
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

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Quer completar seu álbum?
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
