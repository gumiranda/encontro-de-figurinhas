import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Single source of truth for cover-image / next-image allowed hosts.
 * Imported by `apps/web/lib/cover-image-validation.ts` so the admin form
 * validator never drifts from what next/image will actually render.
 */
export const COVER_REMOTE_PATTERNS = [
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
    pathname: "/aida-public/**",
  },
  {
    protocol: "https",
    hostname: "*.convex.cloud",
    pathname: "/api/storage/**",
  },
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  transpilePackages: ["@workspace/ui", "@workspace/backend"],
  devIndicators: false,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: COVER_REMOTE_PATTERNS,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
      {
        source: "/ponto/solicitar",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/(.*)\\.(ico|png|jpg|jpeg|gif|svg|woff|woff2|avif|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
