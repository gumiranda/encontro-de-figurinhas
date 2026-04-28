import { convexServer, api } from "@/lib/convex-server";

const BASE_URL = "https://figurinhafacil.com.br";
const SITE_NAME = "Figurinha Fácil";

export async function GET() {
  const posts = await convexServer.query(api.blog.getPublished, { limit: 50 });

  const rssItems = posts
    .map((post) => {
      const pubDate = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();

      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>${post.coverImage ? `
      <enclosure url="${post.coverImage}" type="image/jpeg"/>` : ""}
      <author>${post.author.name}</author>
      <category>${post.category}</category>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Guias de trocas, histórias de colecionadores, raridades e dicas para completar seu álbum da Copa 2026.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
