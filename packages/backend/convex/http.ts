import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { castVoteHttp, castVoteOptions } from "./boringGame";
import { rateLimiter } from "./lib/rateLimiter";

const http = httpRouter();

// Sticker slug lookup for middleware redirect
const getStickerSlugHttp = httpAction(async (ctx, request) => {
  // Global rate limit (300/min)
  const { ok } = await rateLimiter.limit(ctx, "stickerSlugLookup", {
    key: "global",
    throws: false,
  });
  if (!ok) {
    return new Response(null, { status: 429 });
  }

  const url = new URL(request.url);
  const numStr = url.searchParams.get("num");
  const num = numStr ? parseInt(numStr, 10) : NaN;

  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    return new Response(null, { status: 400 });
  }

  const detail = await ctx.runQuery(api.album.getStickerDetail, { absoluteNum: num });
  if (!detail) {
    return new Response(null, { status: 404 });
  }

  return Response.json({ slug: detail.slug });
});

http.route({
  path: "/api/sticker-slug",
  method: "GET",
  handler: getStickerSlugHttp,
});

http.route({
  path: "/api/boring-vote",
  method: "POST",
  handler: castVoteHttp,
});

http.route({
  path: "/api/boring-vote",
  method: "OPTIONS",
  handler: castVoteOptions,
});

export default http;
