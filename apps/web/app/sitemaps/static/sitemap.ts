import type { MetadataRoute } from "next";
import { getStaticSitemap } from "@/lib/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return getStaticSitemap();
}
