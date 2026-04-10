import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://figurinhafacil.com.br";

  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
  ];

  // TODO: Páginas de cidade dinâmicas quando implementadas
  // const cities = await fetchCities();
  // const cityPages = cities.map(city => ({
  //   url: `${baseUrl}/cidade/${city.slug}`,
  //   lastModified: new Date(),
  //   priority: 0.8,
  // }));

  return [...staticPages];
}
