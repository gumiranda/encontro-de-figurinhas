import { ConvexHttpClient } from "convex/browser";

// Server-side Convex client for use in Server Components (e.g. generateMetadata).
// No auth - only use for public queries (without getAuthenticatedUser).
const convexServer = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default convexServer;
