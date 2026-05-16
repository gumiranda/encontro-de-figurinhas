// Shared sample data for both profiles. Sticker codes follow CLAUDE.md rule:
// always BRA-10 / ARG-09 / MEX-09 — never raw integers.

const ME = {
  displayNickname: "lucas.f",
  nickname: "lucas-f",
  city: "Vila Madalena, São Paulo",
  state: "SP",
  initials: "LF",
  joinedAt: "Mar 2026",
  ratingAvg: 4.9,
  ratingCount: 38,
  totalTrades: 47,
  albumProgress: 612,
  albumTotal: 980,
  bio: "Coleciono desde 2002. Aceito trocas em ponto público — Vila Madalena ou metrô Faria Lima.",
  isVerified: true,
};

const PUBLIC_USER = {
  displayNickname: "marina.s",
  nickname: "marina-s",
  city: "Pinheiros, São Paulo",
  state: "SP",
  initials: "MS",
  joinedAt: "Fev 2026",
  ratingAvg: 4.9,
  ratingCount: 142,
  totalTrades: 142,
  albumProgress: 847,
  albumTotal: 980,
  isVerified: true,
};

// 18 duplicates — varied selections, qty, rarity
const DUPLICATES = [
  { code: "BRA-10", flag: "🇧🇷", qty: 6, rarity: "common", name: "Capitão" },
  { code: "BRA-04", flag: "🇧🇷", qty: 3, rarity: "common", name: "Zagueiro" },
  { code: "BRA-FWC", flag: "🇧🇷", qty: 1, rarity: "legend", name: "Escudo" },
  { code: "ARG-07", flag: "🇦🇷", qty: 2, rarity: "common", name: "Meia" },
  { code: "ARG-11", flag: "🇦🇷", qty: 4, rarity: "common", name: "Ponta" },
  { code: "FRA-19", flag: "🇫🇷", qty: 2, rarity: "common", name: "Atacante" },
  { code: "FRA-FWC", flag: "🇫🇷", qty: 1, rarity: "legend", name: "Escudo" },
  { code: "POR-07", flag: "🇵🇹", qty: 3, rarity: "common", name: "Camisa 7" },
  { code: "ENG-09", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", qty: 2, rarity: "common", name: "Centroavante" },
  { code: "GER-13", flag: "🇩🇪", qty: 5, rarity: "common", name: "Meio-campo" },
  { code: "ESP-16", flag: "🇪🇸", qty: 2, rarity: "common", name: "Volante" },
  { code: "MEX-09", flag: "🇲🇽", qty: 3, rarity: "common", name: "Camisa 9" },
  { code: "CAN-04", flag: "🇨🇦", qty: 2, rarity: "common", name: "Lateral" },
  { code: "USA-11", flag: "🇺🇸", qty: 2, rarity: "common", name: "Atacante" },
  { code: "JPN-08", flag: "🇯🇵", qty: 1, rarity: "common", name: "Meia" },
  { code: "KOR-07", flag: "🇰🇷", qty: 1, rarity: "common", name: "Camisa 7" },
  { code: "URU-21", flag: "🇺🇾", qty: 2, rarity: "common", name: "Lateral" },
  { code: "CRO-10", flag: "🇭🇷", qty: 1, rarity: "common", name: "Camisa 10" },
];

const NEEDS = [
  { code: "ARG-09", flag: "🇦🇷", rarity: "common", priority: "high" },
  { code: "ARG-FWC", flag: "🇦🇷", rarity: "legend", priority: "high" },
  { code: "FRA-07", flag: "🇫🇷", rarity: "common", priority: "high" },
  { code: "ITA-06", flag: "🇮🇹", rarity: "common", priority: "med" },
  { code: "BEL-15", flag: "🇧🇪", rarity: "common", priority: "med" },
  { code: "POR-FWC", flag: "🇵🇹", rarity: "legend", priority: "high" },
  { code: "GER-FWC", flag: "🇩🇪", rarity: "legend", priority: "med" },
  { code: "NED-22", flag: "🇳🇱", rarity: "common", priority: "med" },
  { code: "MAR-10", flag: "🇲🇦", rarity: "common", priority: "low" },
  { code: "SEN-19", flag: "🇸🇳", rarity: "common", priority: "low" },
  { code: "ECU-13", flag: "🇪🇨", rarity: "common", priority: "low" },
  { code: "DEN-08", flag: "🇩🇰", rarity: "common", priority: "med" },
];

const RECENT_TRADES = [
  { with: "@joao.p", got: "POR-07", gave: "BRA-10", when: "há 2h", rating: 5 },
  { with: "@ana.m", got: "GER-13", gave: "BRA-04", when: "ontem", rating: 5 },
  { with: "@pedro.c", got: "ARG-11", gave: "MEX-09", when: "3 dias", rating: 4 },
];

Object.assign(window, { ME, PUBLIC_USER, DUPLICATES, NEEDS, RECENT_TRADES });
