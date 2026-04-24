import { mutation } from "./_generated/server";

// Seed para albumConfig - Copa 2026
// IMPORTANTE: version 0 = draft placeholder até Panini publicar oficial

type LegendEntry = { number: number; name: string };

type SeedSection = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra: boolean;
  flagEmoji?: string;
  goldenNumbers?: number[];
  legendNumbers?: LegendEntry[];
};

const FLAG_BY_CODE: Record<string, string> = {
  USA: "🇺🇸", CAN: "🇨🇦", MEX: "🇲🇽",
  RSA: "🇿🇦", KOR: "🇰🇷", CZE: "🇨🇿",
  BIH: "🇧🇦", QAT: "🇶🇦", SUI: "🇨🇭",
  BRA: "🇧🇷", MAR: "🇲🇦", HAI: "🇭🇹", SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  PAR: "🇵🇾", AUS: "🇦🇺", TUR: "🇹🇷",
  GER: "🇩🇪", CUW: "🇨🇼", CIV: "🇨🇮", ECU: "🇪🇨",
  NED: "🇳🇱", JPN: "🇯🇵", SWE: "🇸🇪", TUN: "🇹🇳",
  BEL: "🇧🇪", EGY: "🇪🇬", IRN: "🇮🇷", NZL: "🇳🇿",
  ESP: "🇪🇸", CPV: "🇨🇻", KSA: "🇸🇦", URU: "🇺🇾",
  FRA: "🇫🇷", SEN: "🇸🇳", IRQ: "🇮🇶", NOR: "🇳🇴",
  ARG: "🇦🇷", ALG: "🇩🇿", AUT: "🇦🇹", JOR: "🇯🇴",
  POR: "🇵🇹", COD: "🇨🇩", UZB: "🇺🇿", COL: "🇨🇴",
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", CRO: "🇭🇷", GHA: "🇬🇭", PAN: "🇵🇦",
  EXT: "✨",
};

// Números "10 da camisa" da seleção = startNumber + 9 por padrão,
// mais estrelas adicionais para grupos com várias estrelas.
function defaultGolden(start: number, end: number): number[] {
  // Sticker 10 (capitão/camisa 10) + sticker 20 (última figurinha/foto do time).
  const ten = start + 9;
  const last = end;
  return [ten, last];
}

const LEGENDS_BY_CODE: Record<string, LegendEntry[]> = {
  BRA: [{ number: 190, name: "NEYMAR" }],
  ARG: [{ number: 730, name: "MESSI" }],
  FRA: [{ number: 650, name: "MBAPPÉ" }],
  POR: [{ number: 810, name: "RONALDO" }],
  NOR: [{ number: 710, name: "HAALAND" }],
  ENG: [{ number: 890, name: "BELLINGHAM" }],
  GER: [{ number: 330, name: "MUSIALA" }],
  NED: [{ number: 410, name: "VAN DIJK" }],
};

const SECTIONS: SeedSection[] = [
  { name: "EUA", code: "USA", startNumber: 1, endNumber: 20, isExtra: false },
  { name: "Canadá", code: "CAN", startNumber: 21, endNumber: 40, isExtra: false },
  { name: "México", code: "MEX", startNumber: 41, endNumber: 60, isExtra: false },
  { name: "África do Sul", code: "RSA", startNumber: 61, endNumber: 80, isExtra: false },
  { name: "Coreia do Sul", code: "KOR", startNumber: 81, endNumber: 100, isExtra: false },
  { name: "Tchéquia", code: "CZE", startNumber: 101, endNumber: 120, isExtra: false },
  { name: "Bósnia e Herzegovina", code: "BIH", startNumber: 121, endNumber: 140, isExtra: false },
  { name: "Catar", code: "QAT", startNumber: 141, endNumber: 160, isExtra: false },
  { name: "Suíça", code: "SUI", startNumber: 161, endNumber: 180, isExtra: false },
  { name: "Brasil", code: "BRA", startNumber: 181, endNumber: 200, isExtra: false },
  { name: "Marrocos", code: "MAR", startNumber: 201, endNumber: 220, isExtra: false },
  { name: "Haiti", code: "HAI", startNumber: 221, endNumber: 240, isExtra: false },
  { name: "Escócia", code: "SCO", startNumber: 241, endNumber: 260, isExtra: false },
  { name: "Paraguai", code: "PAR", startNumber: 261, endNumber: 280, isExtra: false },
  { name: "Austrália", code: "AUS", startNumber: 281, endNumber: 300, isExtra: false },
  { name: "Turquia", code: "TUR", startNumber: 301, endNumber: 320, isExtra: false },
  { name: "Alemanha", code: "GER", startNumber: 321, endNumber: 340, isExtra: false },
  { name: "Curaçao", code: "CUW", startNumber: 341, endNumber: 360, isExtra: false },
  { name: "Costa do Marfim", code: "CIV", startNumber: 361, endNumber: 380, isExtra: false },
  { name: "Equador", code: "ECU", startNumber: 381, endNumber: 400, isExtra: false },
  { name: "Holanda", code: "NED", startNumber: 401, endNumber: 420, isExtra: false },
  { name: "Japão", code: "JPN", startNumber: 421, endNumber: 440, isExtra: false },
  { name: "Suécia", code: "SWE", startNumber: 441, endNumber: 460, isExtra: false },
  { name: "Tunísia", code: "TUN", startNumber: 461, endNumber: 480, isExtra: false },
  { name: "Bélgica", code: "BEL", startNumber: 481, endNumber: 500, isExtra: false },
  { name: "Egito", code: "EGY", startNumber: 501, endNumber: 520, isExtra: false },
  { name: "Irã", code: "IRN", startNumber: 521, endNumber: 540, isExtra: false },
  { name: "Nova Zelândia", code: "NZL", startNumber: 541, endNumber: 560, isExtra: false },
  { name: "Espanha", code: "ESP", startNumber: 561, endNumber: 580, isExtra: false },
  { name: "Cabo Verde", code: "CPV", startNumber: 581, endNumber: 600, isExtra: false },
  { name: "Arábia Saudita", code: "KSA", startNumber: 601, endNumber: 620, isExtra: false },
  { name: "Uruguai", code: "URU", startNumber: 621, endNumber: 640, isExtra: false },
  { name: "França", code: "FRA", startNumber: 641, endNumber: 660, isExtra: false },
  { name: "Senegal", code: "SEN", startNumber: 661, endNumber: 680, isExtra: false },
  { name: "Iraque", code: "IRQ", startNumber: 681, endNumber: 700, isExtra: false },
  { name: "Noruega", code: "NOR", startNumber: 701, endNumber: 720, isExtra: false },
  { name: "Argentina", code: "ARG", startNumber: 721, endNumber: 740, isExtra: false },
  { name: "Argélia", code: "ALG", startNumber: 741, endNumber: 760, isExtra: false },
  { name: "Áustria", code: "AUT", startNumber: 761, endNumber: 780, isExtra: false },
  { name: "Jordânia", code: "JOR", startNumber: 781, endNumber: 800, isExtra: false },
  { name: "Portugal", code: "POR", startNumber: 801, endNumber: 820, isExtra: false },
  { name: "RD Congo", code: "COD", startNumber: 821, endNumber: 840, isExtra: false },
  { name: "Uzbequistão", code: "UZB", startNumber: 841, endNumber: 860, isExtra: false },
  { name: "Colômbia", code: "COL", startNumber: 861, endNumber: 880, isExtra: false },
  { name: "Inglaterra", code: "ENG", startNumber: 881, endNumber: 900, isExtra: false },
  { name: "Croácia", code: "CRO", startNumber: 901, endNumber: 920, isExtra: false },
  { name: "Gana", code: "GHA", startNumber: 921, endNumber: 940, isExtra: false },
  { name: "Panamá", code: "PAN", startNumber: 941, endNumber: 960, isExtra: false },
  { name: "Extras", code: "EXT", startNumber: 961, endNumber: 980, isExtra: true },
];

function enrichSection(s: SeedSection) {
  return {
    ...s,
    flagEmoji: s.flagEmoji ?? FLAG_BY_CODE[s.code] ?? "",
    goldenNumbers:
      s.goldenNumbers ??
      (s.isExtra ? [] : defaultGolden(s.startNumber, s.endNumber)),
    legendNumbers: s.legendNumbers ?? LEGENDS_BY_CODE[s.code] ?? [],
  };
}

const ALBUM_CONFIG_2026 = {
  totalStickers: 980,
  version: 3, // bump: campos novos (flagEmoji, goldenNumbers, legendNumbers)
  year: 2026,
  sections: SECTIONS.map(enrichSection),
};

export const seedAlbumConfig = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("albumConfig").first();

    if (!existing) {
      const id = await ctx.db.insert("albumConfig", ALBUM_CONFIG_2026);
      return { action: "created", id };
    }

    // Patch-merge idempotente: preserva flags já setados, preenche apenas
    // campos novos que ainda estejam undefined.
    const existingByCode = new Map(
      existing.sections.map((s) => [s.code.toUpperCase(), s])
    );
    const mergedSections = SECTIONS.map((seed) => {
      const cur = existingByCode.get(seed.code.toUpperCase());
      const enriched = enrichSection(seed);
      if (!cur) return enriched;
      return {
        ...enriched,
        // Mantém nome e ranges canônicos do seed;
        // preserva overrides de flag/golden/legend quando já existirem.
        flagEmoji: cur.flagEmoji ?? enriched.flagEmoji,
        goldenNumbers: cur.goldenNumbers ?? enriched.goldenNumbers,
        legendNumbers: cur.legendNumbers ?? enriched.legendNumbers,
      };
    });

    await ctx.db.patch(existing._id, {
      totalStickers: ALBUM_CONFIG_2026.totalStickers,
      version: Math.max(existing.version, ALBUM_CONFIG_2026.version),
      year: ALBUM_CONFIG_2026.year,
      sections: mergedSections,
    });
    return { action: "updated", id: existing._id };
  },
});
