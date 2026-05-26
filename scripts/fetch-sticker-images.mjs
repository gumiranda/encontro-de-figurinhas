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

function searchGoogleImages(query) {
  const encodedQuery = encodeURIComponent(query);
  const script = `
browser-harness <<'PY'
new_tab("https://www.google.com/search?tbm=isch&q=${encodedQuery}")
wait_for_load()
import time
time.sleep(2)

# Click on first good result
click_at_xy(180, 270)
time.sleep(2)

# Extract large image URL
result = js("""
(() => {
    const panelImgs = document.querySelectorAll('img[src^="https://"]');
    for (const img of panelImgs) {
        if ((img.naturalWidth > 400 || img.width > 400) && !img.src.includes('encrypted-tbn')) {
            return img.src;
        }
    }
    return null;
})()
""")
print(result or "NO_IMAGE")
PY
`;

  try {
    const output = execSync(script, { encoding: "utf-8", timeout: 30000 });
    const url = output.trim();
    if (url && url !== "NO_IMAGE" && url.startsWith("http")) {
      return url;
    }
    return null;
  } catch (e) {
    console.error("Error searching:", e.message);
    return null;
  }
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

    const query = buildSearchQuery(sticker);
    console.log(`  Query: ${query}`);

    const imageUrl = searchGoogleImages(query);
    if (imageUrl) {
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
