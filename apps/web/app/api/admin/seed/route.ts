import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@workspace/backend/_generated/api";
import { NextResponse } from "next/server";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export async function POST(request: Request) {
  if (!convexUrl) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const { userId, getToken } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await getToken({ template: "convex" });
  if (!token) {
    return NextResponse.json({ error: "Failed to get auth token" }, { status: 401 });
  }

  const client = new ConvexHttpClient(convexUrl);
  client.setAuth(token);

  // Parse which seeds to run
  let body: { seeds?: string[] } = {};
  try {
    body = await request.json();
  } catch {
    // Default to all
  }

  const seeds = body.seeds ?? ["all"];

  try {
    if (seeds.includes("all")) {
      const result = await client.mutation(api.adminSeed.seedAll, {});
      return NextResponse.json(result);
    }

    if (seeds.includes("album")) {
      const result = await client.mutation(api.adminSeed.seedAlbum, {});
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown seed type" }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
