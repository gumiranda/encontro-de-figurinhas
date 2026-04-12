import { mutation } from "./_generated/server";

// Seed para albumConfig - Copa 2026
// IMPORTANTE: version 0 = draft placeholder até Panini publicar oficial

const ALBUM_CONFIG_2026 = {
  totalStickers: 980,
  version: 2, // Incrementado para forçar update
  year: 2026,
  sections: [
    // Hosts
    { name: "EUA", code: "USA", startNumber: 1, endNumber: 20, isExtra: false },
    { name: "Canadá", code: "CAN", startNumber: 21, endNumber: 40, isExtra: false },
    { name: "México", code: "MEX", startNumber: 41, endNumber: 60, isExtra: false },
    // Grupo A
    { name: "África do Sul", code: "RSA", startNumber: 61, endNumber: 80, isExtra: false },
    { name: "Coreia do Sul", code: "KOR", startNumber: 81, endNumber: 100, isExtra: false },
    { name: "Tchéquia", code: "CZE", startNumber: 101, endNumber: 120, isExtra: false },
    // Grupo B
    { name: "Bósnia e Herzegovina", code: "BIH", startNumber: 121, endNumber: 140, isExtra: false },
    { name: "Catar", code: "QAT", startNumber: 141, endNumber: 160, isExtra: false },
    { name: "Suíça", code: "SUI", startNumber: 161, endNumber: 180, isExtra: false },
    // Grupo C
    { name: "Brasil", code: "BRA", startNumber: 181, endNumber: 200, isExtra: false },
    { name: "Marrocos", code: "MAR", startNumber: 201, endNumber: 220, isExtra: false },
    { name: "Haiti", code: "HAI", startNumber: 221, endNumber: 240, isExtra: false },
    { name: "Escócia", code: "SCO", startNumber: 241, endNumber: 260, isExtra: false },
    // Grupo D
    { name: "Paraguai", code: "PAR", startNumber: 261, endNumber: 280, isExtra: false },
    { name: "Austrália", code: "AUS", startNumber: 281, endNumber: 300, isExtra: false },
    { name: "Turquia", code: "TUR", startNumber: 301, endNumber: 320, isExtra: false },
    // Grupo E
    { name: "Alemanha", code: "GER", startNumber: 321, endNumber: 340, isExtra: false },
    { name: "Curaçao", code: "CUW", startNumber: 341, endNumber: 360, isExtra: false },
    { name: "Costa do Marfim", code: "CIV", startNumber: 361, endNumber: 380, isExtra: false },
    { name: "Equador", code: "ECU", startNumber: 381, endNumber: 400, isExtra: false },
    // Grupo F
    { name: "Holanda", code: "NED", startNumber: 401, endNumber: 420, isExtra: false },
    { name: "Japão", code: "JPN", startNumber: 421, endNumber: 440, isExtra: false },
    { name: "Suécia", code: "SWE", startNumber: 441, endNumber: 460, isExtra: false },
    { name: "Tunísia", code: "TUN", startNumber: 461, endNumber: 480, isExtra: false },
    // Grupo G
    { name: "Bélgica", code: "BEL", startNumber: 481, endNumber: 500, isExtra: false },
    { name: "Egito", code: "EGY", startNumber: 501, endNumber: 520, isExtra: false },
    { name: "Irã", code: "IRN", startNumber: 521, endNumber: 540, isExtra: false },
    { name: "Nova Zelândia", code: "NZL", startNumber: 541, endNumber: 560, isExtra: false },
    // Grupo H
    { name: "Espanha", code: "ESP", startNumber: 561, endNumber: 580, isExtra: false },
    { name: "Cabo Verde", code: "CPV", startNumber: 581, endNumber: 600, isExtra: false },
    { name: "Arábia Saudita", code: "KSA", startNumber: 601, endNumber: 620, isExtra: false },
    { name: "Uruguai", code: "URU", startNumber: 621, endNumber: 640, isExtra: false },
    // Grupo I
    { name: "França", code: "FRA", startNumber: 641, endNumber: 660, isExtra: false },
    { name: "Senegal", code: "SEN", startNumber: 661, endNumber: 680, isExtra: false },
    { name: "Iraque", code: "IRQ", startNumber: 681, endNumber: 700, isExtra: false },
    { name: "Noruega", code: "NOR", startNumber: 701, endNumber: 720, isExtra: false },
    // Grupo J
    { name: "Argentina", code: "ARG", startNumber: 721, endNumber: 740, isExtra: false },
    { name: "Argélia", code: "ALG", startNumber: 741, endNumber: 760, isExtra: false },
    { name: "Áustria", code: "AUT", startNumber: 761, endNumber: 780, isExtra: false },
    { name: "Jordânia", code: "JOR", startNumber: 781, endNumber: 800, isExtra: false },
    // Grupo K
    { name: "Portugal", code: "POR", startNumber: 801, endNumber: 820, isExtra: false },
    { name: "RD Congo", code: "COD", startNumber: 821, endNumber: 840, isExtra: false },
    { name: "Uzbequistão", code: "UZB", startNumber: 841, endNumber: 860, isExtra: false },
    { name: "Colômbia", code: "COL", startNumber: 861, endNumber: 880, isExtra: false },
    // Grupo L
    { name: "Inglaterra", code: "ENG", startNumber: 881, endNumber: 900, isExtra: false },
    { name: "Croácia", code: "CRO", startNumber: 901, endNumber: 920, isExtra: false },
    { name: "Gana", code: "GHA", startNumber: 921, endNumber: 940, isExtra: false },
    { name: "Panamá", code: "PAN", startNumber: 941, endNumber: 960, isExtra: false },
    // Extras
    { name: "Extras", code: "EXT", startNumber: 961, endNumber: 980, isExtra: true },
  ],
};
// Mutation para criar/atualizar o albumConfig
export const seedAlbumConfig = mutation({
  args: {},
  handler: async (ctx) => {
    // Verificar se já existe
    const existing = await ctx.db.query("albumConfig").first();

    if (existing) {
      // Atualizar se version for maior
      if (ALBUM_CONFIG_2026.version > existing.version) {
        await ctx.db.patch(existing._id, ALBUM_CONFIG_2026);
        return { action: "updated", id: existing._id };
      }
      return { action: "skipped", reason: "version igual ou menor" };
    }

    // Criar novo
    const id = await ctx.db.insert("albumConfig", ALBUM_CONFIG_2026);
    return { action: "created", id };
  },
});
