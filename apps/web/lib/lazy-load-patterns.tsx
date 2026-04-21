/**
 * Lazy-loading patterns to reduce initial bundle size
 * Use dynamic() for route groups and heavy libraries
 */

import dynamic from "next/dynamic";
import type React from "react";

/**
 * Lazy-load Leaflet map for geo-based pages
 * ⚠️ Leaflet is 500KB+, should only load on map-heavy pages
 * Pages: /arena, /(arena)/map, /(marketing)/cidade
 */
export const LazyMapView = dynamic(
  () => import("@/modules/map/ui/views/map-arena-view").then((mod) => mod.MapArenaView),
  {
    loading: () => (
      <div className="w-full h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando mapa...</p>
        </div>
      </div>
    ),
    ssr: false, // Geolocation API is client-only
  }
);

/**
 * Lazy-load dicebear avatar generation
 * Only needed on user profile pages and settings
 */
export const LazyAvatarPicker = dynamic(
  () => import("@/modules/auth/ui/components/avatar-picker").then((mod) => mod.AvatarPicker),
  {
    loading: () => (
      <div className="w-full h-48 bg-muted animate-pulse rounded-lg" />
    ),
    ssr: false, // Avatar generation uses canvas/dom APIs
  }
);

/**
 * Lazy-load match cards for /dashboard/matches
 * Heavy component with complex filtering logic
 */
export const LazyMatchesView = dynamic(
  () =>
    import("@/app/(dashboard)/matches/page").then((mod) => mod.default),
  {
    loading: () => (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-32 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    ),
    ssr: true, // Can be server-rendered for SEO
  }
);

/**
 * Lazy-load location selector for complex geolocation flows
 */
export const LazyLocationSelector = dynamic(
  () => import("@/modules/location/ui/views/location-selector-view").then((mod) => mod.LocationSelectorView),
  {
    loading: () => (
      <div className="w-full h-64 bg-muted animate-pulse rounded-lg" />
    ),
    ssr: false, // Uses navigator.geolocation
  }
);

/**
 * Lazy-load trade point map for /arena/map
 * This is the heaviest component - Leaflet + clustering
 */
export const LazyArenaMap = dynamic(
  () => import("@/modules/map/ui/views/map-arena-view").then((mod) => mod.MapArenaView),
  {
    loading: () => (
      <div className="w-full h-full min-h-screen bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Carregando mapa interativo...</p>
      </div>
    ),
    ssr: false,
  }
);

/**
 * Helper to wrap route groups with lazy loading
 * Usage in layout.tsx:
 *
 * export default function ArenaLayout({ children }) {
 *   return (
 *     <Suspense fallback={<MapSkeleton />}>
 *       {children}
 *     </Suspense>
 *   );
 * }
 */
export function MapSkeleton() {
  return (
    <div className="w-full h-screen bg-muted animate-pulse flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="h-8 w-32 bg-muted-foreground/20 rounded mx-auto" />
        <div className="h-4 w-48 bg-muted-foreground/20 rounded mx-auto" />
      </div>
    </div>
  );
}

/**
 * Conditional import pattern for feature flags
 * Usage:
 *
 * if (process.env.NEXT_PUBLIC_ENABLE_ADVANCED_MATCHING) {
 *   const AdvancedMatching = await import("./advanced-matching");
 *   // Use advanced matching
 * }
 */
export async function loadFeatureModule(featureName: string) {
  try {
    const module = await import(`@/features/${featureName}`);
    return module;
  } catch (error) {
    console.warn(`Feature ${featureName} not available`, error);
    return null;
  }
}

/**
 * Bundle analysis helper
 * Run: npm install --save-dev @next/bundle-analyzer
 * Then check .next/static files
 */
export const BUNDLE_ANALYSIS_CHECKLIST = {
  leaflet: {
    size: "500KB+",
    usage: "[/arena, /map routes only]",
    lazy: true,
  },
  dicebear: {
    size: "~50KB",
    usage: "[Avatar generation pages]",
    lazy: true,
  },
  "leaflet.markercluster": {
    size: "~30KB",
    usage: "[Trade point maps]",
    lazy: true,
  },
  convex: {
    size: "~100KB",
    usage: "[All pages - core]",
    lazy: false,
  },
  "next/image": {
    size: "~5KB",
    usage: "[Image optimization]",
    lazy: false,
  },
} as const;
