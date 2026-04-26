/**
 * Todos os startNumber/endNumber -1: figurinha 00 em absoluto 0, última em 1073.
 * Run: node packages/backend/data/scripts/shift-album-zero-based.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, "../album-2026.json");
const j = JSON.parse(fs.readFileSync(p, "utf8"));
for (const s of j.sections) {
  s.startNumber -= 1;
  s.endNumber -= 1;
}
j.version = 6;
fs.writeFileSync(p, JSON.stringify(j, null, 2) + "\n", "utf8");
const ext = j.sections.find((s) => s.code === "EXT");
const alb = j.sections.find((s) => s.code === "ALB");
console.log("ALB", alb?.startNumber, alb?.endNumber, "EXT", ext?.startNumber, ext?.endNumber, "total", j.totalStickers);
