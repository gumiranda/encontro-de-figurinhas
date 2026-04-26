"use client";

import { ConvexReactClient } from "convex/react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

// Singleton — shared by PublicProviders + ChatoProviders pra evitar duas
// WebSocket connections no mesmo browser tab.
export const browserConvex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL,
);
