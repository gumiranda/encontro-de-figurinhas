import { BASE_URL } from "@/lib/seo";

export { BASE_URL };

export const SITEMAP_SEGMENTS = [
  "static",
  "cidades",
  "estados",
  "selecoes",
  "raras",
  "figurinhas",
  "pontos",
  "blog",
  "blog-categorias",
  "jogo-mais-chato",
] as const;

export const SITEMAP_PATHS = SITEMAP_SEGMENTS.map(
  (segment) => `/sitemaps/${segment}/sitemap.xml`
);
