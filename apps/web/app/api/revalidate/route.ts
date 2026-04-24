import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

const ALLOWED_TAG_PREFIXES = ["ponto:", "cidade:", "sitemap"];

function isAllowedTag(tag: string): boolean {
  return ALLOWED_TAG_PREFIXES.some(
    (prefix) => tag === prefix || tag.startsWith(prefix)
  );
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function extractBearer(auth: string | null): string | null {
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "server-misconfigured" },
      { status: 500 }
    );
  }

  const url = new URL(request.url);
  const version = url.searchParams.get("v");
  if (version !== "1") {
    return NextResponse.json(
      { ok: false, error: "unsupported-version" },
      { status: 400 }
    );
  }

  const provided = extractBearer(request.headers.get("authorization"));
  if (!provided || !safeCompare(provided, expected)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  const tags = (body as { tags?: unknown })?.tags;
  if (!Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json(
      { ok: false, error: "tags-required" },
      { status: 400 }
    );
  }

  const rejected: string[] = [];
  const revalidated: string[] = [];
  for (const tag of tags) {
    if (typeof tag !== "string" || !isAllowedTag(tag)) {
      rejected.push(String(tag));
      continue;
    }
    revalidateTag(tag, { expire: 0 });
    revalidated.push(tag);
  }

  if (revalidated.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no-allowed-tags", rejected },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true, revalidated, rejected });
}
