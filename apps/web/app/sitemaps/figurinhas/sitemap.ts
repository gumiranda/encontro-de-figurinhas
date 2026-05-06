import type { MetadataRoute } from "next";
import { getStickerSitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getStickerSitemap();
}
