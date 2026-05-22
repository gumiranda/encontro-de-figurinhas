import {
  buildSectionLookup,
  formatStickerNumber,
  type Section,
} from "./sticker-parser";

function formatStickerWithQty(display: string, qty: number): string {
  return qty > 1 ? `${display} (x${qty})` : display;
}

export function buildDuplicatesWhatsAppText({
  sections,
  duplicateCounts,
  header = "🔄 Minhas figurinhas repetidas — Copa 2026",
}: {
  sections: Section[];
  duplicateCounts: Map<number, number>;
  header?: string;
}): string | null {
  if (duplicateCounts.size === 0) return null;

  const lookup = buildSectionLookup(sections);
  const lines: string[] = [header, ""];

  for (const section of sections) {
    const stickersInSection: string[] = [];

    for (let n = section.startNumber; n <= section.endNumber; n++) {
      const qty = duplicateCounts.get(n);
      if (!qty) continue;
      const { display } = formatStickerNumber(n, lookup);
      stickersInSection.push(formatStickerWithQty(display, qty));
    }

    if (stickersInSection.length === 0) continue;

    const emoji = section.flagEmoji ?? "🎫";
    lines.push(`${emoji} ${section.name}`);
    lines.push(stickersInSection.join(", "));
    lines.push("");
  }

  while (lines.at(-1) === "") lines.pop();

  return lines.join("\n");
}

export function openWhatsAppWithText(text: string): void {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer"
  );
}
