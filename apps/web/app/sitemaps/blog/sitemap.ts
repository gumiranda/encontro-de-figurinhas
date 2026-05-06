import type { MetadataRoute } from "next";
import { getBlogSitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getBlogSitemap();
}
