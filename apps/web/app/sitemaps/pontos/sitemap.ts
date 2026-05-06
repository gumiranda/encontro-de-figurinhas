import type { MetadataRoute } from "next";
import { getTradePointSitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getTradePointSitemap();
}
