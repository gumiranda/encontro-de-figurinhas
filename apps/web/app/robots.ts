import type { MetadataRoute } from "next";

const BASE_URL = "https://figurinhafacil.com.br";

const DISALLOWED_PATHS = [
  "/points/",
  "/ponto/solicitar",
  "/map",
  "/admin/",
  "/complete-profile",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
