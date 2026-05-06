import type { MetadataRoute } from "next";
import { getBoringGameSitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getBoringGameSitemap();
}
