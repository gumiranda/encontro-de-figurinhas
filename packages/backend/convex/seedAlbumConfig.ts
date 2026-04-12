import { mutation } from "./_generated/server";

// Seed para albumConfig - Copa 2026
// IMPORTANTE: version 0 = draft placeholder até Panini publicar oficial

const ALBUM_CONFIG_2026 = {
  totalStickers: 980,
  version: 1,
  year: 2026,
  sections: [
    // Hosts (seções especiais)
    { name: "EUA", startNumber: 1, endNumber: 20, isExtra: false },
    { name: "Canadá", startNumber: 21, endNumber: 40, isExtra: false },
    { name: "México", startNumber: 41, endNumber: 60, isExtra: false },
    // Grupo A (México já está nos hosts)
    { name: "África do Sul", startNumber: 61, endNumber: 80, isExtra: false },
    { name: "Coreia do Sul", startNumber: 81, endNumber: 100, isExtra: false },
    { name: "Tchéquia", startNumber: 101, endNumber: 120, isExtra: false },
    // Grupo B (Canadá já está nos hosts)
    { name: "Bósnia e Herzegovina", startNumber: 121, endNumber: 140, isExtra: false },
    { name: "Catar", startNumber: 141, endNumber: 160, isExtra: false },
    { name: "Suíça", startNumber: 161, endNumber: 180, isExtra: false },
    // Grupo C
    { name: "Brasil", startNumber: 181, endNumber: 200, isExtra: false },
    { name: "Marrocos", startNumber: 201, endNumber: 220, isExtra: false },
    { name: "Haiti", startNumber: 221, endNumber: 240, isExtra: false },
    { name: "Escócia", startNumber: 241, endNumber: 260, isExtra: false },
    // Grupo D (EUA já está nos hosts)
    { name: "Paraguai", startNumber: 261, endNumber: 280, isExtra: false },
    { name: "Austrália", startNumber: 281, endNumber: 300, isExtra: false },
    { name: "Turquia", startNumber: 301, endNumber: 320, isExtra: false },
    // Grupo E
    { name: "Alemanha", startNumber: 321, endNumber: 340, isExtra: false },
    { name: "Curaçao", startNumber: 341, endNumber: 360, isExtra: false },
    { name: "Costa do Marfim", startNumber: 361, endNumber: 380, isExtra: false },
    { name: "Equador", startNumber: 381, endNumber: 400, isExtra: false },
    // Grupo F
    { name: "Holanda", startNumber: 401, endNumber: 420, isExtra: false },
    { name: "Japão", startNumber: 421, endNumber: 440, isExtra: false },
    { name: "Suécia", startNumber: 441, endNumber: 460, isExtra: false },
    { name: "Tunísia", startNumber: 461, endNumber: 480, isExtra: false },
    // Grupo G
    { name: "Bélgica", startNumber: 481, endNumber: 500, isExtra: false },
    { name: "Egito", startNumber: 501, endNumber: 520, isExtra: false },
    { name: "Irã", startNumber: 521, endNumber: 540, isExtra: false },
    { name: "Nova Zelândia", startNumber: 541, endNumber: 560, isExtra: false },
    // Grupo H
    { name: "Espanha", startNumber: 561, endNumber: 580, isExtra: false },
    { name: "Cabo Verde", startNumber: 581, endNumber: 600, isExtra: false },
    { name: "Arábia Saudita", startNumber: 601, endNumber: 620, isExtra: false },
    { name: "Uruguai", startNumber: 621, endNumber: 640, isExtra: false },
    // Grupo I
    { name: "França", startNumber: 641, endNumber: 660, isExtra: false },
    { name: "Senegal", startNumber: 661, endNumber: 680, isExtra: false },
    { name: "Iraque", startNumber: 681, endNumber: 700, isExtra: false },
    { name: "Noruega", startNumber: 701, endNumber: 720, isExtra: false },
    // Grupo J
    { name: "Argentina", startNumber: 721, endNumber: 740, isExtra: false },
    { name: "Argélia", startNumber: 741, endNumber: 760, isExtra: false },
    { name: "Áustria", startNumber: 761, endNumber: 780, isExtra: false },
    { name: "Jordânia", startNumber: 781, endNumber: 800, isExtra: false },
    // Grupo K
    { name: "Portugal", startNumber: 801, endNumber: 820, isExtra: false },
    { name: "RD Congo", startNumber: 821, endNumber: 840, isExtra: false },
    { name: "Uzbequistão", startNumber: 841, endNumber: 860, isExtra: false },
    { name: "Colômbia", startNumber: 861, endNumber: 880, isExtra: false },
    // Grupo L
    { name: "Inglaterra", startNumber: 881, endNumber: 900, isExtra: false },
    { name: "Croácia", startNumber: 901, endNumber: 920, isExtra: false },
    { name: "Gana", startNumber: 921, endNumber: 940, isExtra: false },
    { name: "Panamá", startNumber: 941, endNumber: 960, isExtra: false },
    // Extras (20 stickers especiais)
    { name: "Extras", startNumber: 961, endNumber: 980, isExtra: true },
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
