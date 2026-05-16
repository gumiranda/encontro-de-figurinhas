export const LOCAL_LINK_TARGETS = [
  {
    name: "Blog Glau na Capital",
    city: "Brasilia",
    angle: "agenda de shopping e ponto oficial de troca",
    href: "https://glaunacapital.com/2026/05/12/album-da-copa-2026-ganha-espaco-interativo-de-troca-no-conjunto-nacional-que-celebra-55-anos-com-clima-de-estadio/",
  },
  {
    name: "Blog do Madeira",
    city: "Varginha",
    angle: "ponto fixo de troca e servico local",
    href: "https://blogdomadeira.com.br/varginha-ganha-ponto-fixo-para-troca-de-figurinhas-da-copa-2026/",
  },
] as const;

export const COMPARISON_PAGES = [
  {
    slug: "figurinha-facil-vs-planilha",
    title: "Figurinha Facil vs planilha",
    description:
      "Compare controle manual em planilha com uma arena de trocas que cruza repetidas, faltantes e cidade.",
  },
  {
    slug: "figurinha-facil-vs-grupo-whatsapp",
    title: "Figurinha Facil vs grupo de WhatsApp",
    description:
      "Veja quando grupo ajuda, onde vira bagunca e como usar matches por figurinha para trocar melhor.",
  },
  {
    slug: "melhores-apps-controlar-figurinhas-copa-2026",
    title: "Melhores apps para controlar figurinhas da Copa 2026",
    description:
      "Checklist de criterios para escolher app de controle, troca e organizacao do album da Copa.",
  },
] as const;

export type ComparisonSlug = (typeof COMPARISON_PAGES)[number]["slug"];
