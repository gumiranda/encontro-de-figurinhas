import jsPDF from "jspdf";
import type { SectionInfo } from "../ui/components/sticker-section-group";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 10;
const COLS = 6;
const COLS_EXT = 4;
const CELL_WIDTH = (PAGE_WIDTH - 2 * MARGIN) / COLS;
const CELL_WIDTH_EXT = (PAGE_WIDTH - 2 * MARGIN) / COLS_EXT;
const CELL_HEIGHT = 7;
const FONT_SIZE = 11;
const FONT_SIZE_EXT = 9;
const HEADER_SIZE = 13;
const CHECKBOX_SIZE = 4;
const MAX_Y = PAGE_HEIGHT - MARGIN;

const EXT_PLAYERS = [
  "Messi", "Doku", "Vini Jr", "Davies", "L.Díaz",
  "Modrić", "Caicedo", "Salah", "Jude", "Mbappé",
  "Wirtz", "Jiménez", "Hakimi", "Haaland", "Lewa",
  "CR7", "Son", "Yamal", "Pulisic", "Valverde",
];

const VARIANT_LABELS: Record<string, string> = {
  base: "Roxa",
  bronze: "Bronze",
  prata: "Prata",
  ouro: "Ouro",
};

function getExtLabel(relativeNum: number): string | null {
  if (relativeNum < 1 || relativeNum > 80) return null;
  const playerIdx = Math.floor((relativeNum - 1) / 4);
  const variantIdx = (relativeNum - 1) % 4;
  const player = EXT_PLAYERS[playerIdx];
  const variants = ["base", "bronze", "prata", "ouro"];
  const variant = variants[variantIdx];
  if (!player || !variant) return null;
  return `${player} (${VARIANT_LABELS[variant]})`;
}

type StickerEntry = { code: string; absoluteNum: number; label?: string };

export function generateStickerPdf(
  sections: SectionInfo[],
  options: {
    onlyMissing?: boolean;
    missingSet?: Set<number>;
  } = {}
): void {
  if (!sections?.length) {
    throw new Error("Sections required");
  }

  const { onlyMissing = false, missingSet = new Set() } = options;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let y = MARGIN;
  let hasContent = false;

  for (const section of sections) {
    const relStart = section.relStart ?? 1;
    const stickers: StickerEntry[] = [];

    const isExt = section.code.toUpperCase() === "EXT";
    for (let num = section.startNumber; num <= section.endNumber; num++) {
      if (onlyMissing && !missingSet.has(num)) continue;
      const relNum = num - section.startNumber + relStart;
      const code = `${section.code}-${relNum === 0 ? "00" : relNum}`;
      const label = isExt ? getExtLabel(relNum) ?? code : code;
      stickers.push({ code, absoluteNum: num, label });
    }

    if (stickers.length === 0) continue;
    hasContent = true;

    if (y + HEADER_SIZE > MAX_Y) {
      doc.addPage();
      y = MARGIN;
    }

    doc.setFontSize(HEADER_SIZE);
    doc.setFont("helvetica", "bold");
    const headerText = `${section.name} (${section.code})`;
    const maxWidth = PAGE_WIDTH - 2 * MARGIN;
    doc.text(headerText, MARGIN, y, { maxWidth });
    y += HEADER_SIZE / 2 + 4;

    const cols = isExt ? COLS_EXT : COLS;
    const cellWidth = isExt ? CELL_WIDTH_EXT : CELL_WIDTH;
    const fontSize = isExt ? FONT_SIZE_EXT : FONT_SIZE;

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", "normal");

    for (let i = 0; i < stickers.length; i++) {
      const col = i % cols;

      if (col === 0 && y + CELL_HEIGHT > MAX_Y) {
        doc.addPage();
        y = MARGIN;
      }

      const x = MARGIN + col * cellWidth;
      const { absoluteNum, label } = stickers[i];
      const isMissing = missingSet.has(absoluteNum);

      doc.rect(x, y - CHECKBOX_SIZE, CHECKBOX_SIZE, CHECKBOX_SIZE);
      
      if (isMissing) {
        doc.setFont("helvetica", "bold");
        doc.text("X", x + 0.8, y - 0.5);
        doc.setFont("helvetica", "normal");
      }

      doc.text(label ?? "", x + CHECKBOX_SIZE + 1.5, y);

      if (col === cols - 1) {
        y += CELL_HEIGHT;
      } else if (i === stickers.length - 1) {
        y += CELL_HEIGHT;
      }
    }

    y += 6;
  }

  if (!hasContent) {
    doc.setFontSize(12);
    doc.text("Nenhuma figurinha para exibir.", MARGIN, MARGIN + 10);
  }

  const filename = onlyMissing ? "figurinhas-faltantes.pdf" : "figurinhas-todas.pdf";
  doc.save(filename);
}
