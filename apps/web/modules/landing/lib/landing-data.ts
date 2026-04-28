export const CITIES = [
  {
    id: "sao-paulo",
    slug: "sao-paulo",
    name: "São Paulo",
    state: "SP",
    stateDescription: "Estado de São Paulo",
    activePoints: 342,
    participants: "12.4k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuuUtCCr4bfjwCv8uXSHbMzTGSF7QHZ6uH_ZaCGk49rqtzLweP3SQvj6cOvOqvMK9owKbZ67QIs378iZd5e2XDl1A3Pnjc2ETwlNl7ZyOnh4Mzo4aYga45W9sZt_apGuxEbMQHbIGA1038jvCyDraG0TlPksOkeO2cmSc7lHPl9VBGZb6HAFBLyam8_zV9ak08UImAIeh5nXbcG8fC7We1s-wieG1lnuvPwurv6zoQCyOtKDAnoRDFZ2DAYHHcM883Y0x2W3h3alWJ",
    imageAlt: "Vista aérea de São Paulo à noite",
  },
  {
    id: "rio-de-janeiro",
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    state: "RJ",
    stateDescription: "Estado do Rio de Janeiro",
    activePoints: 218,
    participants: "8.9k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4gaJXFfwtBUeMQbVikd4Aa1-cwF4zr6ezo8sna8no0-vo5udxpIAszRIYRFenUncQQF-_abuUz5NCoJnUXe7OqXGNPoIYrYd6kNWiPOeCsJmgihDMlDrX40PyzXnmZzPpQbpe80Qsix2qPgPRedOo35D0iNBU6WD_2w-3I5NVG2Jy5jFt8_DIlbBsfBkUWpUm_68vBTZMPz3CqoFd4A_dt7aACJ6WsKytcsUVgMNXbXwLOeWdco_SnFZ1ro8BN1Y6aGnV-HkHQzAT",
    imageAlt: "Rio de Janeiro com Cristo Redentor ao pôr do sol",
  },
  {
    id: "belo-horizonte",
    slug: "belo-horizonte",
    name: "Belo Horizonte",
    state: "MG",
    stateDescription: "Minas Gerais",
    activePoints: 156,
    participants: "5.2k",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUB2G0kZC9MXt2HmYl7Ls11spLftjo98iEMXU-ZHUW5qqcUxjU4Ut01bT5LGKRUSwndupUqBBA35T1lL8S01W4INOmfOq-YB9WS-seArDE_l1c9AQOwc7hU_CVMWVOB86TDVHf0sej1G5e8P8oHNUEf67g4IijzfAbdY4v1OJw2NB9E0gs2xyNayVznZx4wZ5OmWofV7ZNRrVLl5jV5TctjM0JRuLn7MBzZpVNr02Gnb_kmCHGAorlEXhMxyAbPRzHFxJXoAZoETxF",
    imageAlt: "Arquitetura e montanhas de Belo Horizonte",
  },
];

export const CITY_SUGGESTIONS = [
  { name: "São Paulo", slug: "sao-paulo", state: "Estado de São Paulo", activeUsers: "1.2k" },
  { name: "Rio de Janeiro", slug: "rio-de-janeiro", state: "Estado do Rio de Janeiro", activeUsers: "850" },
  { name: "Belo Horizonte", slug: "belo-horizonte", state: "Minas Gerais", activeUsers: "620" },
];

export const FEATURES = [
  {
    id: "nearby",
    icon: "map",
    title: "Trocas de figurinhas perto de você",
    description: "Veja pontos de troca e colecionadores num raio de 5km. Sem deslocamento desnecessário.",
    colorClass: "text-[var(--primary)] bg-[var(--primary)]/10",
  },
  {
    id: "smart-list",
    icon: "shield",
    title: "Lista inteligente de repetidas",
    description: "Cadastre suas figurinhas repetidas e faltantes do álbum Copa 2026. O sistema cruza automaticamente com outros colecionadores.",
    colorClass: "text-[var(--secondary)] bg-[var(--secondary)]/10",
  },
  {
    id: "match",
    icon: "zap",
    title: "Match instantâneo com colecionadores",
    description: "Receba alerta quando alguém próximo tiver a figurinha da Copa 2026 que você procura.",
    colorClass: "text-[var(--tertiary)] bg-[var(--tertiary)]/10",
  },
];

export const NAV_ITEMS = [
  { label: "Explorar", href: "/", active: true },
  { label: "Como Funciona", href: "/como-funciona", active: false },
  { label: "Álbum", href: "/album-copa-do-mundo-2026", active: false },
  { label: "Cidades", href: "/#cities-heading", active: false },
];
