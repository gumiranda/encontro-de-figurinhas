import { internalMutation } from "./_generated/server";
import { UserStatus, TWENTY_FOUR_HOURS } from "./lib/types";

const SAO_PAULO_SPOTS = [
  {
    title: "Praça da Sé",
    description: "Galera trocando figurinhas na praça principal do centro",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    title: "Parque Ibirapuera - Portão 3",
    description: "Encontro todo sábado de manhã perto do portão 3",
    latitude: -23.5874,
    longitude: -46.6576,
  },
  {
    title: "Estação Paulista do Metrô",
    description: "Trocas rápidas na saída do metrô, horário de almoço",
    latitude: -23.5629,
    longitude: -46.6596,
  },
  {
    title: "Shopping Eldorado - Praça de Alimentação",
    description: "Mesa reservada perto do Burger King",
    latitude: -23.5722,
    longitude: -46.6952,
  },
  {
    title: "MASP - Vão Livre",
    description: "Embaixo do MASP, domingos de tarde. Trazer as repetidas!",
    latitude: -23.5614,
    longitude: -46.6558,
  },
  {
    title: "Parque Villa-Lobos",
    description: "Perto do playground, fim de semana",
    latitude: -23.5469,
    longitude: -46.7225,
  },
  {
    title: "Mercadão Municipal",
    description: "Encontro depois de comer pastel de bacalhau",
    latitude: -23.5415,
    longitude: -46.6297,
  },
  {
    title: "Pátio do Colégio",
    description: "Ponto histórico! Troca de figurinhas raras aqui",
    latitude: -23.5477,
    longitude: -46.6341,
  },
  {
    title: "Liberdade - Praça da Liberdade",
    description: "Ao lado da feira japonesa, sábados",
    latitude: -23.5575,
    longitude: -46.6345,
  },
  {
    title: "Pinacoteca - Jardim da Luz",
    description: "No parque em frente à Pinacoteca, boa sombra",
    latitude: -23.5341,
    longitude: -46.6335,
  },
];

export const seedSpots = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Get or create system user (idempotent)
    let systemUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", "system"))
      .first();

    if (!systemUser) {
      const systemUserId = await ctx.db.insert("users", {
        clerkId: "system",
        name: "Sistema",
        role: "user",
        status: UserStatus.APPROVED,
      });
      systemUser = await ctx.db.get(systemUserId);
    }

    const now = Date.now();
    let createdCount = 0;

    for (const spot of SAO_PAULO_SPOTS) {
      await ctx.db.insert("spots", {
        title: spot.title,
        description: spot.description,
        latitude: spot.latitude,
        longitude: spot.longitude,
        createdBy: systemUser!._id,
        createdByName: systemUser!.name,
        createdAt: now - Math.random() * 12 * 60 * 60 * 1000, // Random time in last 12h
        expiresAt: now + TWENTY_FOUR_HOURS,
        upvotes: Math.floor(Math.random() * 5),
        downvotes: 0,
        isActive: true,
      });
      createdCount++;
    }

    return { createdCount };
  },
});

export const clearSpots = internalMutation({
  args: {},
  handler: async (ctx) => {
    const allVotes = await ctx.db.query("votes").collect();
    for (const vote of allVotes) {
      await ctx.db.delete(vote._id);
    }

    const allSpots = await ctx.db.query("spots").collect();
    for (const spot of allSpots) {
      await ctx.db.delete(spot._id);
    }

    return { deletedSpots: allSpots.length, deletedVotes: allVotes.length };
  },
});
