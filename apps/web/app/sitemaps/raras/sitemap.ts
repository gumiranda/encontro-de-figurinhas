import type { MetadataRoute } from "next";
import { getRareSitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getRareSitemap();
}
