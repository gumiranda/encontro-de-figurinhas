import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Diamond,
  History,
  Trophy,
} from "lucide-react";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import { BASE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import "@/modules/blog/ui/blog-home.css";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function categorySlug(category: string): string {
  return category
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const CATEGORY_META: Record<
  string,
  { Icon: typeof BookOpen; accent: string; desc: string }
> = {
  guias: {
    Icon: BookOpen,
    accent: "var(--primary)",
    desc: "Tutoriais, checklists e passo-a-passos para colecionar, trocar e completar o álbum da Copa 2026 como um pro.",
  },
  guia: {
    Icon: BookOpen,
    accent: "var(--primary)",
    desc: "Tutoriais, checklists e passo-a-passos para colecionar, trocar e completar o álbum da Copa 2026 como um pro.",
  },
  historia: {
    Icon: History,
    accent: "var(--secondary)",
    desc: "A saga dos álbuns da Copa contada por quem viveu cada edição.",
  },
  raridades: {
    Icon: Diamond,
    accent: "#ffc965",
    desc: "Figurinhas raras, douradas, lendárias: o que vale, como identificar e onde encontrar.",
  },
  "copa-2026": {
    Icon: Trophy,
    accent: "var(--primary)",
    desc: "Tudo sobre a nova edição: seleções, elenco e estreias do álbum da Copa 2026.",
  },
};

function metaFor(slug: string) {
  return (
    CATEGORY_META[slug] ?? {
      Icon: BookOpen,
      accent: "var(--primary)",
      desc: "Histórias, guias e novidades dos colecionadores.",
    }
  );
}

async function loadAllPosts() {
  "use cache";
  cacheTag("blog");
  cacheLife("hours");
  return convexServer.query(api.blog.getPublished, { limit: 100 });
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

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const all = await loadAllPosts();
  const inCat = all.filter((p) => categorySlug(p.category) === slug);
  const label = inCat[0]?.category ?? slug;
  const canonical = `${BASE_URL}/blog/categoria/${slug}`;
  return {
    title: `${label} | Blog Figurinha Fácil`,
    description: metaFor(slug).desc,
    alternates: { canonical },
    openGraph: {
      title: `${label} · Blog Figurinha Fácil`,
      description: metaFor(slug).desc,
      url: canonical,
      type: "website",
    },
  };
}

export default async function BlogCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const all = await loadAllPosts();
  const posts = all.filter((p) => categorySlug(p.category) === slug);

  if (posts.length === 0) {
    notFound();
  }

  const label = posts[0]!.category;
  const meta = metaFor(slug);
  const Icon = meta.Icon;

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
        name: label,
        item: `${BASE_URL}/blog/categoria/${slug}`,
      },
    ],
  };

  const featured = posts[0]!;
  const rest = posts.slice(1);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <LandingHeader />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero */}
        <section className="bh-hero py-14">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">{label}</li>
              </ol>
            </nav>

            <div className="mt-4 flex items-center gap-4">
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl border"
                style={{
                  background: `color-mix(in oklab, ${meta.accent} 12%, transparent)`,
                  borderColor: `color-mix(in oklab, ${meta.accent} 25%, transparent)`,
                  color: meta.accent,
                }}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h1 className="font-headline text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
                {label}
              </h1>
            </div>
            <p className="mt-5 max-w-prose text-base text-muted-foreground md:text-lg">
              {meta.desc}
            </p>

            <dl className="mt-8 flex flex-wrap gap-10">
              <div className="flex flex-col">
                <dt className="font-headline text-xl font-bold tracking-tight">
                  {posts.length}
                </dt>
                <dd className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
                  artigos
                </dd>
              </div>
              <div className="flex flex-col">
                <dt
                  className="font-headline text-xl font-bold tracking-tight"
                  style={{ color: meta.accent }}
                >
                  {new Set(posts.map((p) => p.author.name)).size}
                </dt>
                <dd className="mt-0.5 text-xs uppercase tracking-widest text-muted-foreground">
                  autores
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Featured wide + grid */}
        <section className="container mx-auto mt-8 px-4">
          <div className="bh-post-grid">
            <Link
              key={featured._id}
              href={`/blog/${featured.slug}`}
              className="bh-big-card"
              style={{ gridColumn: "1 / -1" }}
            >
              <div
                className="bh-thumb"
                style={
                  featured.coverImage
                    ? { backgroundImage: `url(${featured.coverImage})` }
                    : undefined
                }
              />
              <div className="bh-body">
                <div className="flex gap-1.5">
                  <span className="bh-chip bh-chip-primary">{label}</span>
                </div>
                <h3>{featured.title}</h3>
                <p className="bh-excerpt">{featured.excerpt}</p>
                <div className="mt-auto flex items-center gap-2.5 text-xs text-muted-foreground">
                  <div className="bh-avatar">{initials(featured.author.name)}</div>
                  <span>{featured.author.name}</span>
                  <span className="opacity-40">·</span>
                  <span>{featured.readingTime} min</span>
                  {featured.publishedAt && (
                    <>
                      <span className="opacity-40">·</span>
                      <span>{formatDate(featured.publishedAt)}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>

            {rest.map((post) => (
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
                    <div className="bh-avatar">{initials(post.author.name)}</div>
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
        </section>

        <section className="container mx-auto mt-16 px-4 pb-16">
          <Link
            href="/blog"
            className="bh-section-link"
          >
            Ver todas as categorias
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
