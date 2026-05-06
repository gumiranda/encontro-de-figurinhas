import type { MetadataRoute } from "next";
import { getTeamSitemap } from "@/lib/sitemap";

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getTeamSitemap();
}
