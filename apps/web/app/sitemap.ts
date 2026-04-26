import type { MetadataRoute } from "next";
import type { FunctionReturnType } from "convex/server";
import { cacheLife, cacheTag } from "next/cache";
import { convexServer, api } from "@/lib/convex-server";

const BASE_URL = "https://figurinhafacil.com.br";

type BlogSitemapResult = FunctionReturnType<typeof api.blog.listForSitemap>;

function getSsgSecret(): string {
  const secret = process.env.SSG_SECRET;
  if (!secret) throw new Error("SSG_SECRET not configured");
  return secret;
}

async function loadCitiesForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheLife("days");
  return convexServer.query(api.cities.listForSitemap, {});
}

async function loadTradePointsForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheLife("days");
  const all: Array<{ slug: string; updatedAt: number }> = [];
  let cursor: string | null = null;
  for (let i = 0; i < 20; i++) {
    const result: {
      page: Array<{ slug: string; updatedAt: number }>;
      continueCursor: string | null;
      isDone: boolean;
    } = await convexServer.query(api.tradePoints.listApprovedForSitemapPage, {
      secret: getSsgSecret(),
      cursor,
      pageSize: 5000,
    });
    all.push(...result.page);
    if (result.isDone) break;
    cursor = result.continueCursor;
  }
  return all;
}

async function loadStatesForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheLife("days");
  return convexServer.query(api.states.listForSitemap, {});
}

async function loadStickersForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheLife("days");
  return convexServer.query(api.album.listStickersForSitemap, {});
}

async function loadTeamsForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheLife("days");
  return convexServer.query(api.album.getAllSectionSlugs, {});
}

async function loadBlogForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheLife("days");
  const all: Array<{ slug: string; updatedAt: number | undefined }> = [];
  let cursor: string | null = null;
  for (let i = 0; i < 20; i++) {
    const result: BlogSitemapResult = await convexServer.query(
      api.blog.listForSitemap,
      {
        paginationOpts: { numItems: 1000, cursor },
      }
    );
    all.push(...result.page);
    if (result.isDone) break;
    cursor = result.continueCursor;
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/como-funciona`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/album-copa-do-mundo-2026`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contato`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/termos`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacidade`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    // Hub pages
    {
      url: `${BASE_URL}/cidades`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/estados`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/selecoes`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/figurinhas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/raras`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/onde-comprar-figurinhas-copa-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pontos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const [cities, tradePoints, states, stickers, teams, blogPosts] =
    await Promise.all([
      loadCitiesForSitemap(),
      loadTradePointsForSitemap(),
      loadStatesForSitemap(),
      loadStickersForSitemap(),
      loadTeamsForSitemap(),
      loadBlogForSitemap(),
    ]);

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE_URL}/cidade/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tradePointPages: MetadataRoute.Sitemap = tradePoints.map((p) => ({
    url: `${BASE_URL}/ponto/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${BASE_URL}/estado/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const stickerPages: MetadataRoute.Sitemap = stickers.map((s) => ({
    url: `${BASE_URL}/figurinha/${s.number}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const teamPages: MetadataRoute.Sitemap = teams.map((slug) => ({
    url: `${BASE_URL}/selecao/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const rarePages: MetadataRoute.Sitemap = teams.map((slug) => ({
    url: `${BASE_URL}/raras/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...cityPages,
    ...statePages,
    ...teamPages,
    ...rarePages,
    ...stickerPages,
    ...tradePointPages,
    ...blogPages,
  ];
}
