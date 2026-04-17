import { MetadataRoute } from "next";

const BASE_URL = "https://figurinhafacil.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Páginas estáticas principais
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
  ];

  // Páginas de cidades principais (SEO keywords)
  const majorCities = [
    "sao-paulo",
    "rio-de-janeiro",
    "belo-horizonte",
    "brasilia",
    "salvador",
    "fortaleza",
    "curitiba",
    "recife",
    "porto-alegre",
    "manaus",
    "goiania",
    "campinas",
    "santos",
    "guarulhos",
    "niteroi",
  ];

  const cityPages: MetadataRoute.Sitemap = majorCities.map((city) => ({
    url: `${BASE_URL}/cidade/${city}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Pontos de troca conhecidos (será expandido dinamicamente)
  const tradePoints = [
    "praca-da-se-sp",
    "parque-ibirapuera-sp",
  ];

  const tradePointPages: MetadataRoute.Sitemap = tradePoints.map((point) => ({
    url: `${BASE_URL}/ponto/${point}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Páginas de arena pública
  const arenaPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/arena/map`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  return [...staticPages, ...cityPages, ...tradePointPages, ...arenaPages];
}
