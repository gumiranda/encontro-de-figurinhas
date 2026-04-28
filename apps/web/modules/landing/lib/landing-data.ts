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
    title: "Colecionadores a 5 minutos de você",
    description: "Nada de atravessar a cidade. Encontre quem está no seu bairro.",
    colorClass: "text-[var(--primary)] bg-[var(--primary)]/10",
  },
  {
    id: "smart-list",
    icon: "shield",
    title: "Cadastro em 2 minutos",
    description: "Digite os números, o sistema faz o resto. Sem planilha, sem bagunça.",
    colorClass: "text-[var(--secondary)] bg-[var(--secondary)]/10",
  },
  {
    id: "match",
    icon: "zap",
    title: "Match perfeito, notificação instantânea",
    description: "Apareceu alguém com a figurinha que falta? Você fica sabendo na hora.",
    colorClass: "text-[var(--tertiary)] bg-[var(--tertiary)]/10",
  },
];

export const NAV_ITEMS = [
  { label: "Como funciona", href: "#como", active: false },
  { label: "Seleções", href: "#selecoes", active: false },
  { label: "Segurança", href: "#seguranca", active: false },
  { label: "FAQ", href: "#faq", active: false },
];

export const TEAMS = [
  { slug: "bra", name: "Brasil", flag: "🇧🇷", count: "26.4k" },
  { slug: "arg", name: "Argentina", flag: "🇦🇷", count: "14.2k" },
  { slug: "fra", name: "França", flag: "🇫🇷", count: "9.1k" },
  { slug: "eng", name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", count: "8.7k" },
  { slug: "por", name: "Portugal", flag: "🇵🇹", count: "8.4k" },
  { slug: "ger", name: "Alemanha", flag: "🇩🇪", count: "7.9k" },
  { slug: "esp", name: "Espanha", flag: "🇪🇸", count: "7.2k" },
  { slug: "ned", name: "Holanda", flag: "🇳🇱", count: "5.8k" },
  { slug: "bel", name: "Bélgica", flag: "🇧🇪", count: "5.4k" },
  { slug: "cro", name: "Croácia", flag: "🇭🇷", count: "4.1k" },
  { slug: "uru", name: "Uruguai", flag: "🇺🇾", count: "3.8k" },
  { slug: "mex", name: "México", flag: "🇲🇽", count: "3.6k" },
  { slug: "can", name: "Canadá", flag: "🇨🇦", count: "3.2k" },
  { slug: "usa", name: "EUA", flag: "🇺🇸", count: "3.0k" },
  { slug: "jpn", name: "Japão", flag: "🇯🇵", count: "2.8k" },
  { slug: "kor", name: "Coreia", flag: "🇰🇷", count: "2.5k" },
  { slug: "mar", name: "Marrocos", flag: "🇲🇦", count: "2.4k" },
  { slug: "sen", name: "Senegal", flag: "🇸🇳", count: "2.1k" },
  { slug: "ecu", name: "Equador", flag: "🇪🇨", count: "1.9k" },
  { slug: "col", name: "Colômbia", flag: "🇨🇴", count: "1.8k" },
  { slug: "swe", name: "Suécia", flag: "🇸🇪", count: "1.7k" },
  { slug: "sui", name: "Suíça", flag: "🇨🇭", count: "1.6k" },
  { slug: "aus", name: "Austrália", flag: "🇦🇺", count: "1.5k" },
  { slug: "civ", name: "Costa do Marfim", flag: "🇨🇮", count: "1.4k" },
  { slug: "irn", name: "Irã", flag: "🇮🇷", count: "1.2k" },
  { slug: "tun", name: "Tunísia", flag: "🇹🇳", count: "1.1k" },
  { slug: "gha", name: "Gana", flag: "🇬🇭", count: "980" },
  { slug: "qat", name: "Qatar", flag: "🇶🇦", count: "920" },
  { slug: "alg", name: "Argélia", flag: "🇩🇿", count: "890" },
  { slug: "rsa", name: "África do Sul", flag: "🇿🇦", count: "820" },
  { slug: "egy", name: "Egito", flag: "🇪🇬", count: "780" },
  { slug: "tur", name: "Turquia", flag: "🇹🇷", count: "650" },
] as const;

export const FAQ_DATA = [
  {
    question: "Qual a figurinha mais rara da Seleção Brasileira?",
    answer:
      "A figurinha BRA-10 Legend (versão dourada do capitão) é a mais procurada — apenas 1 a cada 412 pacotes. Em segundo, BRA-FWC (escudo dourado).",
  },
  {
    question: "Como funciona a troca pelo FigurinhaFácil?",
    answer:
      "Você cadastra suas duplicatas e faltantes. O app encontra colecionadores próximos com match perfeito. Vocês confirmam pelo chat e marcam um ponto público de encontro.",
  },
  {
    question: "Onde trocar figurinhas perto de mim?",
    answer:
      "Mostramos colecionadores ativos num raio de 5 km da sua localização, com pontos de encontro validados em 847 cidades de 26 estados.",
  },
  {
    question: "É seguro trocar com desconhecidos?",
    answer:
      "Sim. Pontos públicos validados, chat com rate-limiting e sanitização, perfis verificados ganham selo, denúncia em 1 toque.",
  },
  {
    question: "Tem taxa? É pago?",
    answer:
      "Zero taxa. Só troca. O FigurinhaFácil é 100% gratuito — não cobramos comissão, intermediação ou assinatura.",
  },
] as const;

export const SOCIAL_STATS = {
  trocas: { value: "847.291", label: "Trocas realizadas", delta: "+12.847 hoje" },
  colecionadores: { value: "48.291", label: "Colecionadores ativos", delta: "2.418 online agora" },
  matchMedio: { value: "4m 18s", label: "Match médio", delta: "do cadastro à proposta" },
  cidades: { value: "847", label: "Cidades cobertas", delta: "26 estados" },
} as const;

export const RARITY_LEADERBOARD = [
  { rank: 1, code: "BRA-10 Legend", player: "Capitão", team: "Seleção Brasileira", flag: "🇧🇷", slug: "bra", seeking: "9.482", odds: "1 a cada 412", gold: true },
  { rank: 2, code: "ARG-FWC Legend", player: "Camisa 10", team: "Seleção Argentina", flag: "🇦🇷", slug: "arg", seeking: "7.214", odds: "1 a cada 388", gold: false },
  { rank: 3, code: "POR-FWC Legend", player: "Camisa 7", team: "Seleção Portuguesa", flag: "🇵🇹", slug: "por", seeking: "5.097", odds: "1 a cada 360", gold: false },
] as const;

export const TICKER_ITEMS = [
  { color: "secondary", text: "BRA-10 trocada em SP · há 4s" },
  { color: "tertiary", text: "ARG-FWC encontrada em RJ · há 11s" },
  { color: "secondary", text: "MEX-09 trocada em BH · há 18s" },
  { color: "primary", text: "142 matches/min agora" },
  { color: "secondary", text: "CAN-04 trocada em CWB · há 24s" },
  { color: "tertiary", text: "POR-FWC encontrada em POA · há 31s" },
  { color: "secondary", text: "FRA-07 trocada em SSA · há 38s" },
  { color: "primary", text: "48.291 colecionadores online" },
] as const;

export const COMPARE_TABLE = {
  headers: ["", "FigurinhaFácil", "Mercado Livre"],
  rows: [
    { label: "Taxa por transação", ff: "R$ 0 · sempre", ml: "11–16% + frete", ffGood: true },
    { label: "Tempo até a figurinha chegar", ff: "≤ 24h (encontro)", ml: "3–10 dias", ffGood: true },
    { label: "Match por código exato", ff: "Sim · BRA-10 ↔ ARG-09", ml: "Busca por título", ffGood: true },
    { label: "Risco de figurinha falsificada", ff: "Conferência presencial", ml: "Só na chegada", ffGood: true },
    { label: "Comunidade de coletores", ff: "48k verificados", ml: "Vendedores anônimos", ffGood: true },
  ],
} as const;

export const PROBLEM_STATS = [
  { value: "73%", label: "colecionadores com duplicatas", color: "error" },
  { value: "R$ 1.840", label: "custo médio para completar", color: "tertiary" },
  { value: "412 pacotes", label: "pra achar uma legendária", color: "primary" },
] as const;
