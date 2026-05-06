import type { MetadataRoute } from "next";
import { getCitySitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getCitySitemap();
}
