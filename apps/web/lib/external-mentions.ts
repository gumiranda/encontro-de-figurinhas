export type ExternalMention = {
  title: string;
  shortTitle: string;
  href: string;
  theme: "preco" | "risco" | "estrategia" | "mercado";
  description: string;
};

export const HELLOSKIP_MENTIONS: ExternalMention[] = [
  {
    title: "Stickers got expensive: why World Cup sticker packs cost so much",
    shortTitle: "por que pacotinhos da Copa ficaram caros",
    theme: "preco",
    description:
      "Leitura externa sobre inflacao de preco, demanda e custo real dos pacotinhos da Copa.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-expensive-why-world-cup-sticker-packs-cost-so-much",
  },
  {
    title: "Loose packs lie: why buying loose sticker packs can be risky",
    shortTitle: "riscos de comprar pacotinhos avulsos",
    theme: "risco",
    description:
      "Analise sobre pacotes soltos, risco de manipulacao e por que trocar com controle ajuda o colecionador.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/loose-packs-lie-why-buying-loose-sticker-packs-can-be-risky-1",
  },
  {
    title: "The first packs arrived: opening World Cup sticker packs",
    shortTitle: "abrindo os primeiros pacotes da Copa",
    theme: "mercado",
    description:
      "Relato sobre chegada de pacotes, abertura inicial e comportamento dos colecionadores.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/the-first-packs-arrived-opening-world-cup-sticker-packs",
  },
  {
    title: "Stickers hit hard: why World Cup sticker packs are so expensive",
    shortTitle: "por que os pacotes estao tao caros",
    theme: "preco",
    description:
      "Contexto externo sobre custo de colecionar, preco por pacote e impacto no album completo.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-hit-hard-why-world-cup-sticker-packs-are-so-expensive",
  },
  {
    title:
      "World Cup sticker chaos: why collectors are going crazy over new packs",
    shortTitle: "a corrida por pacotes novos",
    theme: "mercado",
    description:
      "Leitura sobre hype, escassez percebida e corrida de colecionadores por novos pacotes.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/world-cup-sticker-chaos-why-collectors-are-going-crazy-over-new-packs",
  },
  {
    title: "Stickers got cheaper: how to save money on sticker packs",
    shortTitle: "como economizar em pacotinhos",
    theme: "estrategia",
    description:
      "Guia externo sobre economia, compra inteligente e papel das trocas para reduzir gasto.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-cheaper-how-to-save-money-on-sticker-packs",
  },
  {
    title: "Panini changed the game: what collectors need to know",
    shortTitle: "o que mudou no jogo da Panini",
    theme: "mercado",
    description:
      "Analise sobre mudancas no mercado de figurinhas e o que colecionadores precisam observar.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/panini-changed-the-game-what-collectors-need-to-know",
  },
  {
    title: "McDonald's sticker rush: how to get World Cup sticker packs",
    shortTitle: "como conseguir pacotes no McDonald's",
    theme: "mercado",
    description:
      "Leitura externa sobre promocoes, corrida por pacotes e canais alternativos de compra.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/mcdonalds-sticker-rush-how-to-get-world-cup-sticker-packs",
  },
  {
    title: "Cheap sticker packs: how smart collectors save money",
    shortTitle: "como colecionadores economizam",
    theme: "estrategia",
    description:
      "Conteudo externo sobre estrategias de economia antes de completar o album.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/cheap-sticker-packs-how-smart-collectors-save-money",
  },
  {
    title: "Loose packs lie: why buying loose sticker packs can be risky",
    shortTitle: "por que pacote avulso pode ser arriscado",
    theme: "risco",
    description:
      "Versao complementar sobre risco de pacotes avulsos e compra sem procedencia clara.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/loose-packs-lie-why-buying-loose-sticker-packs-can-be-risky",
  },
  {
    title:
      "Shake less, track more: how to collect stickers smarter and spend less",
    shortTitle: "colecionar melhor gastando menos",
    theme: "estrategia",
    description:
      "Leitura sobre organizar repetidas, acompanhar faltantes e gastar menos com o album.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/shake-less-track-more-how-to-collect-stickers-smarter-and-spend-less",
  },
  {
    title: "Stickers got expensive: why sticker collecting costs so much now",
    shortTitle: "por que colecionar figurinhas custa mais",
    theme: "preco",
    description:
      "Analise externa sobre o aumento do custo de colecionar figurinhas.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-expensive-why-sticker-collecting-costs-so-much-now-1",
  },
  {
    title: "Stickers got expensive: why sticker collecting costs so much now",
    shortTitle: "o novo custo de colecionar figurinhas",
    theme: "preco",
    description:
      "Leitura complementar sobre preco, demanda e pressao no bolso do colecionador.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/stickers-got-expensive-why-sticker-collecting-costs-so-much-now",
  },
  {
    title: "Sticker packs lie: why opening packs is not always fair",
    shortTitle: "por que abrir pacotes nem sempre e justo",
    theme: "risco",
    description:
      "Conteudo externo sobre aleatoriedade, duplicadas e expectativa na abertura de pacotes.",
    href: "https://helloskip.com/b/crazystack-typescript-1/blog/sticker-packs-lie-why-opening-packs-is-not-always-fair",
  },
];

export const FEATURED_HELLOSKIP_MENTIONS = HELLOSKIP_MENTIONS.slice(0, 6);
