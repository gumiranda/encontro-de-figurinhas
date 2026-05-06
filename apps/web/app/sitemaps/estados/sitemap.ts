import type { MetadataRoute } from "next";
import { getStateSitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getStateSitemap();
}
