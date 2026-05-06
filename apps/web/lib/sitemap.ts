import type { MetadataRoute } from "next";
import type { FunctionReturnType } from "convex/server";
import { cacheLife, cacheTag } from "next/cache";
import { convexServer, api } from "@/lib/convex-server";
import { BASE_URL } from "@/lib/sitemap-config";

type BlogSitemapResult = FunctionReturnType<typeof api.blog.listForSitemap>;

const BLOG_CATEGORY_SLUGS = [
  "guias",
  "guia",
  "historia",
  "raridades",
  "copa-2026",
] as const;

function getSsgSecret(): string {
  const secret = process.env.SSG_SECRET;
  if (!secret) throw new Error("SSG_SECRET not configured");
  return secret;
}

function uniqueByUrl(pages: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return pages.filter((page) => {
    if (seen.has(page.url)) return false;
    seen.add(page.url);
    return true;
  });
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
  return convexServer.query(api.album.getAllStickerDetailsForSitemap, {});
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

// SLA invalidação:
// - Webhook OK: <=5s pós-vote (scheduler runAfter(0) + revalidateTag -> next render).
// - Webhook FAIL (após 4 retries com backoff 0/2s/10s/60s): cacheLife("minutes")
//   = 5min stale max. Monitorar Convex logs filter `function:notifyRevalidate`
//   pra detectar drift sustentado.
async function loadBoringRoundsForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheTag("boring-game:sitemap");
  cacheLife("minutes");
  return convexServer.query(api.boringGame.listRoundsForSitemap, {});
}

async function loadBoringMatchesForSitemap() {
  "use cache";
  cacheTag("sitemap");
  cacheTag("boring-game:sitemap");
  cacheLife("minutes");
  return convexServer.query(api.boringGame.listMatchesForSitemap, {});
}

export function getStaticSitemap(now = new Date()): MetadataRoute.Sitemap {
  return [
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
      url: `${BASE_URL}/custo-album-copa-2026`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/calculadora-figurinhas`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}

export async function getCitySitemap(
  now = new Date()
): Promise<MetadataRoute.Sitemap> {
  const cities = await loadCitiesForSitemap();
  return cities.map((c) => ({
    url: `${BASE_URL}/cidade/${c.slug}`,
    lastModified: new Date(c.updatedAt ?? now),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

export async function getTradePointSitemap(): Promise<MetadataRoute.Sitemap> {
  const tradePoints = await loadTradePointsForSitemap();
  return tradePoints.map((p) => ({
    url: `${BASE_URL}/ponto/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
}

export async function getStateSitemap(
  now = new Date()
): Promise<MetadataRoute.Sitemap> {
  const states = await loadStatesForSitemap();
  return states.map((s) => ({
    url: `${BASE_URL}/estado/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

export async function getStickerSitemap(
  now = new Date()
): Promise<MetadataRoute.Sitemap> {
  const stickers = await loadStickersForSitemap();
  return stickers.map((s) => ({
    url: `${BASE_URL}/figurinha/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}

export async function getTeamSitemap(
  now = new Date()
): Promise<MetadataRoute.Sitemap> {
  const teams = await loadTeamsForSitemap();
  return teams.map((slug) => ({
    url: `${BASE_URL}/selecao/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export async function getRareSitemap(
  now = new Date()
): Promise<MetadataRoute.Sitemap> {
  const teams = await loadTeamsForSitemap();
  return teams.map((slug) => ({
    url: `${BASE_URL}/raras/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export async function getBlogSitemap(
  now = new Date()
): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await loadBlogForSitemap();
  return uniqueByUrl([
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog/feed.xml`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/blog/quanto-custa-completar-album-copa-2026`,
      lastModified: new Date("2026-04-25T00:00:00Z"),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    ...blogPosts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);
}

export function getBlogCategorySitemap(
  now = new Date()
): MetadataRoute.Sitemap {
  return BLOG_CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/categoria/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));
}

export async function getBoringGameSitemap(
  now = new Date()
): Promise<MetadataRoute.Sitemap> {
  const [boringRounds, boringMatches] = await Promise.all([
    loadBoringRoundsForSitemap(),
    loadBoringMatchesForSitemap(),
  ]);

  const boringRoundPages: MetadataRoute.Sitemap = boringRounds.flatMap((r) => [
    {
      url: `${BASE_URL}/jogo-mais-chato/${r.slug}`,
      lastModified: new Date(r.lastModified),
      changeFrequency: r.isActive ? ("hourly" as const) : ("weekly" as const),
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/jogo-mais-chato/${r.slug}/resultado`,
      lastModified: new Date(r.lastModified),
      changeFrequency: r.isActive ? ("hourly" as const) : ("weekly" as const),
      priority: 0.65,
    },
  ]);

  const boringMatchPages: MetadataRoute.Sitemap = boringMatches.map((m) => ({
    url: `${BASE_URL}/jogo-mais-chato/${m.roundSlug}/${m.matchSlug}`,
    lastModified: new Date(m.lastModified),
    changeFrequency: "hourly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: `${BASE_URL}/jogo-mais-chato`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/jogo-mais-chato/ranking`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...boringRoundPages,
    ...boringMatchPages,
  ];
}

export async function getAllSitemapPages(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const sitemaps = await Promise.all([
    getStaticSitemap(now),
    getCitySitemap(now),
    getStateSitemap(now),
    getTeamSitemap(now),
    getRareSitemap(now),
    getStickerSitemap(now),
    getTradePointSitemap(),
    getBlogSitemap(now),
    getBlogCategorySitemap(now),
    getBoringGameSitemap(now),
  ]);
  return uniqueByUrl(sitemaps.flat());
}
