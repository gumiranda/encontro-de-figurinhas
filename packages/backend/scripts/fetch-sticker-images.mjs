#!/usr/bin/env node
/**
 * Wrapper — delegates to repo-root script with correct cwd.
 *
 * Usage (from packages/backend):
 *   pnpm convex run album:getStickersWithoutImages | node scripts/fetch-sticker-images.mjs --limit 5
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const rootScript = join(repoRoot, "scripts/fetch-sticker-images.mjs");

const child = spawn(process.execPath, [rootScript, ...process.argv.slice(2)], {
  stdio: "inherit",
  cwd: repoRoot,
});

child.on("exit", (code) => process.exit(code ?? 1));
