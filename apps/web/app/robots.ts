import type { MetadataRoute } from "next";

const BASE_URL = "https://figurinhafacil.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/points/",
          "/ponto/solicitar",
          "/map",
          "/admin/",
          "/complete-profile",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
