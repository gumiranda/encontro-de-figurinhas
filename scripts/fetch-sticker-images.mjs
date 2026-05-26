#!/usr/bin/env node
/**
 * Fetch sticker images from Google Images using browser-harness
 * 
 * Usage:
 *   cd packages/backend
 *   pnpm convex run album:getStickersWithoutImages | node ../../scripts/fetch-sticker-images.mjs
 * 
 * Or with limit:
 *   pnpm convex run album:getStickersWithoutImages | node ../../scripts/fetch-sticker-images.mjs --limit 5
 */

import { execSync, spawnSync } from "node:child_process";
import { createInterface } from "node:readline";
import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BACKEND_DIR = join(REPO_ROOT, "packages/backend");
const DEFAULT_BASE_URL = process.env.FIGURINHA_BASE_URL ?? "http://localhost:3002";

function figurinhaPath(slug) {
  return `/figurinha/${slug}`;
}

function figurinhaUrl(slug, baseUrl) {
  return `${baseUrl}${figurinhaPath(slug)}`;
}

function runConvex(functionName, args = {}) {
  const result = spawnSync("pnpm", ["convex", "run", functionName, JSON.stringify(args)], {
    encoding: "utf-8",
    cwd: BACKEND_DIR,
  });
  if (result.status !== 0) {
    const err = new Error(result.stderr?.trim() || result.stdout?.trim() || "convex run failed");
    err.stderr = result.stderr;
    throw err;
  }
  return JSON.parse(result.stdout.trim());
}

function buildSearchQueries(sticker) {
  const { name, sectionName, type } = sticker;
  const primary = buildSearchQuery(sticker);
  const fallbacks = [
    `${name} ${sectionName}`,
    sectionName,
    name,
  ];
  if (type === "escudo") {
    fallbacks.push(`${sectionName} football badge`, `${sectionName} seleção escudo`);
  }
  return [...new Set([primary, ...fallbacks])];
}

function searchGoogleImages(query, { largeOnly = true } = {}) {
  const encodedQuery = encodeURIComponent(query);
  const sizeFilter = largeOnly ? "&tbs=isz:l" : "";
  const script = `
browser-harness <<'PY'
new_tab("https://www.google.com/search?tbm=isch&q=${encodedQuery}${sizeFilter}")
wait_for_load()
import time
time.sleep(2)

extract_js = r"""
(() => {
  const bad = (src) =>
    !src ||
    !src.startsWith("http") ||
    /[.]svg($|[?#])/i.test(src) ||
    /fonts[.]gstatic[.]com|productlogos|google[.]com\\/images\\/branding|gstatic[.]com\\/images\\/cleardot|favicon|lh3[.]google[.]com\\/u\\//i.test(src);

  const estimateWidth = (src, width = 0) => {
    if (width > 0) return width;
    const patterns = [
      /[?&]w=(\\d+)/i,
      /=w(\\d+)/i,
      /=s(\\d+)/i,
      /-w(\\d+)/i,
    ];
    for (const pattern of patterns) {
      const match = src.match(pattern);
      if (match) return Number(match[1]);
    }
    if (src.includes("encrypted-tbn")) return 120;
    return 0;
  };

  const score = (src, meta = {}) => {
    let points = 0;
    if (meta.kind === "imgurl") points += 2000;
    if (meta.kind === "data-ou") points += 1800;
    if (meta.kind === "panel") points += 1400;
    if (meta.kind === "grid") points += 400;

    const width = estimateWidth(src, meta.width || 0);
    points += Math.min(width, 2400);
    if (width > 0 && width < 220) points -= 800;
    if (src.includes("encrypted-tbn")) points -= 200;
    return points;
  };

  const ranked = [];
  const push = (src, meta = {}) => {
    if (bad(src)) return;
    ranked.push({ src, points: score(src, meta) });
  };

  const scopes = ["#search", "[data-ri]", "div[data-id]"];
  for (const scope of scopes) {
    for (const a of document.querySelectorAll(scope + ' a[href*="imgurl="]')) {
      const match = a.href.match(/imgurl=([^&]+)/);
      if (match) push(decodeURIComponent(match[1]), { kind: "imgurl" });
    }
    for (const el of document.querySelectorAll(scope + " [data-ou]")) {
      push(el.getAttribute("data-ou"), { kind: "data-ou" });
    }
    for (const img of document.querySelectorAll(scope + " img")) {
      const width = img.naturalWidth || img.width || 0;
      const height = img.naturalHeight || img.height || 0;
      const kind = width >= 320 || height >= 320 ? "panel" : "grid";
      push(img.currentSrc, { kind, width, height });
      push(img.src, { kind, width, height });
      push(img.getAttribute("data-src"), { kind: "grid", width, height });
      push(img.getAttribute("data-iurl"), { kind: "grid", width, height });
    }
  }

  ranked.sort((a, b) => b.points - a.points);
  const best = ranked[0];
  if (!best) return null;
  if (best.points >= 700) return best.src;
  const acceptable = ranked.find((entry) => entry.points >= 250);
  return acceptable?.src ?? null;
})()
"""

time.sleep(2)

result = js(extract_js)
if not result:
    grid_link = js("""
(() => {
  const link =
    document.querySelector('#search a[href*="imgurl="]') ||
    document.querySelector('#search a[href*="imgres"]') ||
    document.querySelector("div[data-id] a");
  if (!link) return false;
  link.click();
  return true;
})()
""")
    if grid_link:
        time.sleep(2)
    result = js(extract_js)

print(result or "NO_IMAGE")
PY
`;

  try {
    const output = execSync(script, { encoding: "utf-8", timeout: 45000 });
    const lines = output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const url = lines.at(-1);
    if (url && url !== "NO_IMAGE" && url.startsWith("http")) {
      return url;
    }
    return null;
  } catch (e) {
    console.error("  Error searching:", e.message);
    return null;
  }
}

function searchStickerImage(sticker) {
  const queries = buildSearchQueries(sticker);
  for (const query of queries) {
    let imageUrl = searchGoogleImages(query, { largeOnly: true });
    if (!imageUrl) {
      imageUrl = searchGoogleImages(query, { largeOnly: false });
    }
    if (imageUrl) {
      return { imageUrl, query };
    }
  }
  return { imageUrl: null, query: queries[0] };
}

function buildSearchQuery(sticker) {
  const { name, sectionName, type } = sticker;
  
  if (type === "escudo") {
    return `${sectionName} national team logo badge`;
  }
  if (type === "team_photo") {
    return `${sectionName} national team squad photo 2024`;
  }
  if (type === "special") {
    return `FIFA World Cup 2026 ${name}`;
  }
  return `${name} ${sectionName} national team 2024`;
}

function updateStickerImage(sticker, imageUrl) {
  try {
    const result = runConvex("album:updateStickerImage", {
      absoluteNum: sticker.absoluteNum,
      imageUrl,
    });
    const verified = verifyStickerImage(sticker.slug, imageUrl);
    return { ok: true, result, verified };
  } catch (e) {
    console.error(`  ✗ Failed to update ${figurinhaPath(sticker.slug)}`);
    if (e.stderr) console.error(`    ${String(e.stderr).trim()}`);
    return { ok: false, verified: null };
  }
}

function verifyStickerImage(slug, expectedUrl) {
  const detail = runConvex("album:getStickerDetailBySlug", { slug });
  if (!detail) {
    return { ok: false, reason: "not found in DB" };
  }
  if (detail.imageUrl === expectedUrl) {
    return { ok: true, imageUrl: detail.imageUrl };
  }
  return {
    ok: false,
    reason: detail.imageUrl ? "imageUrl mismatch" : "imageUrl still empty",
    imageUrl: detail.imageUrl ?? null,
  };
}

function stdinIsPiped() {
  if (process.stdin.isTTY) return false;
  try {
    return statSync(0).isFIFO();
  } catch {
    return false;
  }
}

async function readStdin() {
  let input = "";
  const rl = createInterface({ input: process.stdin });
  for await (const line of rl) {
    input += line;
  }
  return input.trim();
}

function loadStickersFromConvex(limit) {
  console.log("Loading stickers from Convex...\n");
  return runConvex("album:getStickersWithoutImages", { limit });
}

async function loadStickers(limit) {
  if (!stdinIsPiped()) {
    return loadStickersFromConvex(limit);
  }

  const input = await readStdin();
  if (!input) {
    throw new Error("No sticker data on stdin.");
  }
  return JSON.parse(input);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes("--help")) {
    console.log("Usage:");
    console.log("  cd packages/backend && pnpm fetch:sticker-images --limit N [--base-url http://localhost:3002]");
    console.log("  pnpm convex run album:getStickersWithoutImages | node scripts/fetch-sticker-images.mjs --limit N");
    process.exit(0);
  }

  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 10;
  const baseUrlIdx = args.indexOf("--base-url");
  const baseUrl = baseUrlIdx >= 0 ? args[baseUrlIdx + 1] : DEFAULT_BASE_URL;

  const stickers = await loadStickers(limit);
  const total = Math.min(stickers.length, limit);
  console.log(`Processing ${total} of ${stickers.length} stickers...\n`);

  const results = [];
  let success = 0;
  for (let i = 0; i < total; i++) {
    const sticker = stickers[i];
    const pagePath = figurinhaPath(sticker.slug);
    const pageUrl = figurinhaUrl(sticker.slug, baseUrl);

    console.log(`[${i + 1}/${total}] ${sticker.name} (${sticker.sectionName})`);
    console.log(`  Page:  ${pagePath}`);
    console.log(`  Open:  ${pageUrl}`);

    const queryList = buildSearchQueries(sticker);
    console.log(`  Query: ${queryList[0]}`);
    if (queryList.length > 1) {
      console.log(`  Fallbacks: ${queryList.slice(1).join(" | ")}`);
    }

    const { imageUrl, query } = searchStickerImage(sticker);
    if (imageUrl) {
      if (query !== queryList[0]) {
        console.log(`  Matched query: ${query}`);
      }
      console.log(`  Found: ${imageUrl}`);
      const update = updateStickerImage(sticker, imageUrl);
      if (update.ok && update.verified?.ok) {
        console.log(`  ✓ DB verified`);
        success++;
        results.push({ slug: sticker.slug, pagePath, pageUrl, status: "updated", imageUrl });
      } else if (update.ok) {
        console.log(`  ! Updated but verify failed: ${update.verified?.reason ?? "unknown"}`);
        results.push({
          slug: sticker.slug,
          pagePath,
          pageUrl,
          status: "verify_failed",
          imageUrl,
          reason: update.verified?.reason,
        });
      } else {
        results.push({ slug: sticker.slug, pagePath, pageUrl, status: "update_failed", imageUrl });
      }
    } else {
      console.log(`  No image found`);
      results.push({ slug: sticker.slug, pagePath, pageUrl, status: "not_found" });
    }

    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\nDone! ${success}/${total} images updated and verified.\n`);
  console.log("Summary:");
  for (const row of results) {
    const status =
      row.status === "updated"
        ? "OK"
        : row.status === "not_found"
          ? "MISS"
          : row.status === "verify_failed"
            ? "VERIFY_FAIL"
            : "FAIL";
    console.log(`  [${status}] ${row.pagePath}`);
    if (row.imageUrl) console.log(`         ${row.imageUrl}`);
    if (row.reason) console.log(`         reason: ${row.reason}`);
  }
}

main().catch(console.error);
