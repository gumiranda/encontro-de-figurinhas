import { ConvexHttpClient } from "convex/browser";
import { api } from "@workspace/backend/_generated/api";

// Server-side Convex client for SSR/SSG
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL environment variable");
}

export const convexServer = new ConvexHttpClient(convexUrl);

// Re-export api for convenience
export { api };
