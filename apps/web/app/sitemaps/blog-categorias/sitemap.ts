import type { MetadataRoute } from "next";
import { getBlogCategorySitemap } from "@/lib/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return getBlogCategorySitemap();
}
