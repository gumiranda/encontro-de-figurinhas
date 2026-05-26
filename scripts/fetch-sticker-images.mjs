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

import { execSync } from "node:child_process";
import { createInterface } from "node:readline";

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

function updateStickerImage(absoluteNum, imageUrl) {
  const escaped = imageUrl.replace(/"/g, '\\"');
  const cmd = `cd packages/backend && pnpm convex run album:updateStickerImage '{"absoluteNum": ${absoluteNum}, "imageUrl": "${escaped}"}'`;
  try {
    execSync(cmd, { encoding: "utf-8", stdio: "pipe" });
    console.log(`✓ Updated sticker ${absoluteNum}`);
    return true;
  } catch (e) {
    console.error(`✗ Failed to update sticker ${absoluteNum}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes("--help")) {
    console.log("Usage: pnpm convex run album:getStickersWithoutImages | node scripts/fetch-sticker-images.mjs [--limit N]");
    process.exit(0);
  }

  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 10;

  // Read stdin
  let input = "";
  const rl = createInterface({ input: process.stdin });
  
  for await (const line of rl) {
    input += line;
  }

  const stickers = JSON.parse(input);
  const total = Math.min(stickers.length, limit);
  console.log(`Processing ${total} of ${stickers.length} stickers...\n`);

  let success = 0;
  for (let i = 0; i < total; i++) {
    const sticker = stickers[i];
    console.log(`[${i + 1}/${total}] ${sticker.name} (${sticker.sectionName})`);
    
    const query = buildSearchQuery(sticker);
    console.log(`  Query: ${query}`);
    
    const imageUrl = searchGoogleImages(query);
    if (imageUrl) {
      console.log(`  Found: ${imageUrl.substring(0, 60)}...`);
      if (updateStickerImage(sticker.absoluteNum, imageUrl)) {
        success++;
      }
    } else {
      console.log(`  No image found`);
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\nDone! ${success}/${total} images updated.`);
}

main().catch(console.error);
