import { internalMutation } from "./_generated/server";

const FLAG: Record<string, string> = {
  // Grupo A
  MEX: "🇲🇽",
  RSA: "🇿🇦",
  KOR: "🇰🇷",
  CZE: "🇨🇿",

  // Grupo B
  CAN: "🇨🇦",
  SUI: "🇨🇭",
  QAT: "🇶🇦",
  BIH: "🇧🇦",

  // Grupo C
  BRA: "🇧🇷",
  MAR: "🇲🇦",
  HAI: "🇭🇹",
  SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",

  // Grupo D
  USA: "🇺🇸",
  PAR: "🇵🇾",
  AUS: "🇦🇺",
  TUR: "🇹🇷",

  // Grupo E
  GER: "🇩🇪",
  CUW: "🇨🇼",
  CIV: "🇨🇮",
  ECU: "🇪🇨",

  // Grupo F
  NED: "🇳🇱",
  JPN: "🇯🇵",
  SWE: "🇸🇪",
  TUN: "🇹🇳",

  // Grupo G
  BEL: "🇧🇪",
  EGY: "🇪🇬",
  IRN: "🇮🇷",
  NZL: "🇳🇿",

  // Grupo H
  ESP: "🇪🇸",
  CPV: "🇨🇻",
  KSA: "🇸🇦",
  URU: "🇺🇾",

  // Grupo I
  FRA: "🇫🇷",
  SEN: "🇸🇳",
  NOR: "🇳🇴",
  IRQ: "🇮🇶",

  // Grupo J
  ARG: "🇦🇷",
  ALG: "🇩🇿",
  AUT: "🇦🇹",
  JOR: "🇯🇴",

  // Grupo K
  POR: "🇵🇹",
  UZB: "🇺🇿",
  COL: "🇨🇴",
  COD: "🇨🇩",

  // Grupo L
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  CRO: "🇭🇷",
  GHA: "🇬🇭",
  PAN: "🇵🇦",
};

const NAME: Record<string, string> = {
  // Grupo A
  MEX: "México",
  RSA: "África do Sul",
  KOR: "Coreia do Sul",
  CZE: "República Tcheca",

  // Grupo B
  CAN: "Canadá",
  SUI: "Suíça",
  QAT: "Catar",
  BIH: "Bósnia e Herzegovina",

  // Grupo C
  BRA: "Brasil",
  MAR: "Marrocos",
  HAI: "Haiti",
  SCO: "Escócia",

  // Grupo D
  USA: "Estados Unidos",
  PAR: "Paraguai",
  AUS: "Austrália",
  TUR: "Turquia",

  // Grupo E
  GER: "Alemanha",
  CUW: "Curaçao",
  CIV: "Costa do Marfim",
  ECU: "Equador",

  // Grupo F
  NED: "Holanda",
  JPN: "Japão",
  SWE: "Suécia",
  TUN: "Tunísia",

  // Grupo G
  BEL: "Bélgica",
  EGY: "Egito",
  IRN: "Irã",
  NZL: "Nova Zelândia",

  // Grupo H
  ESP: "Espanha",
  CPV: "Cabo Verde",
  KSA: "Arábia Saudita",
  URU: "Uruguai",

  // Grupo I
  FRA: "França",
  SEN: "Senegal",
  NOR: "Noruega",
  IRQ: "Iraque",

  // Grupo J
  ARG: "Argentina",
  ALG: "Argélia",
  AUT: "Áustria",
  JOR: "Jordânia",

  // Grupo K
  POR: "Portugal",
  UZB: "Uzbequistão",
  COL: "Colômbia",
  COD: "RD Congo",

  // Grupo L
  ENG: "Inglaterra",
  CRO: "Croácia",
  GHA: "Gana",
  PAN: "Panamá",
};

const EMPTY_REASON_COUNTS = {
  sem_chances: 0,
  jogo_truncado: 0,
  sem_estrelas: 0,
  placar_morno: 0,
  narrador_dormindo: 0,
  meme_potencial: 0,
};

type SeedMatch = {
  home: string;
  away: string;
  kickoffAt: number;
  venue?: string;
};

type SeedRound = {
  slug: string;
  name: string;
  phase: string;
  order: number;
  startDate: number;
  endDate: number;
  isActive: boolean;
  phaseShort: string;
  matches: SeedMatch[];
};

const D = (iso: string) => new Date(iso).getTime();
const ROUNDS: SeedRound[] = [
  {
    slug: "fase-grupos-rodada-1",
    name: "Fase de Grupos — Rodada 1",
    phase: "groups",
    phaseShort: "grupos-r1",
    order: 1,
    startDate: D("2026-06-11T00:00:00Z"),
    endDate: D("2026-06-18T05:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "MEX",
        away: "RSA",
        kickoffAt: D("2026-06-11T19:00:00Z"),
        venue: "Estádio Azteca, Cidade do México",
      },
      {
        home: "KOR",
        away: "CZE",
        kickoffAt: D("2026-06-12T02:00:00Z"),
        venue: "Estadio Akron, Guadalajara",
      },
      {
        home: "CAN",
        away: "BIH",
        kickoffAt: D("2026-06-12T19:00:00Z"),
        venue: "BMO Field, Toronto",
      },
      {
        home: "USA",
        away: "PAR",
        kickoffAt: D("2026-06-13T01:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "QAT",
        away: "SUI",
        kickoffAt: D("2026-06-13T19:00:00Z"),
        venue: "Levi's Stadium, San Francisco Bay Area",
      },
      {
        home: "BRA",
        away: "MAR",
        kickoffAt: D("2026-06-13T22:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
      {
        home: "HAI",
        away: "SCO",
        kickoffAt: D("2026-06-14T01:00:00Z"),
        venue: "Gillette Stadium, Boston",
      },
      {
        home: "AUS",
        away: "TUR",
        kickoffAt: D("2026-06-14T04:00:00Z"),
        venue: "BC Place, Vancouver",
      },
      {
        home: "GER",
        away: "CUW",
        kickoffAt: D("2026-06-14T17:00:00Z"),
        venue: "NRG Stadium, Houston",
      },
      {
        home: "NED",
        away: "JPN",
        kickoffAt: D("2026-06-14T20:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "CIV",
        away: "ECU",
        kickoffAt: D("2026-06-14T23:00:00Z"),
        venue: "Lincoln Financial Field, Filadélfia",
      },
      {
        home: "SWE",
        away: "TUN",
        kickoffAt: D("2026-06-15T02:00:00Z"),
        venue: "Estadio BBVA, Monterrey",
      },
      {
        home: "ESP",
        away: "CPV",
        kickoffAt: D("2026-06-15T16:00:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
      {
        home: "BEL",
        away: "EGY",
        kickoffAt: D("2026-06-15T19:00:00Z"),
        venue: "Lumen Field, Seattle",
      },
      {
        home: "KSA",
        away: "URU",
        kickoffAt: D("2026-06-15T22:00:00Z"),
        venue: "Hard Rock Stadium, Miami",
      },
      {
        home: "IRN",
        away: "NZL",
        kickoffAt: D("2026-06-16T01:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "FRA",
        away: "SEN",
        kickoffAt: D("2026-06-16T19:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
      {
        home: "IRQ",
        away: "NOR",
        kickoffAt: D("2026-06-16T22:00:00Z"),
        venue: "Gillette Stadium, Boston",
      },
      {
        home: "ARG",
        away: "ALG",
        kickoffAt: D("2026-06-17T01:00:00Z"),
        venue: "Arrowhead Stadium, Kansas City",
      },
      {
        home: "AUT",
        away: "JOR",
        kickoffAt: D("2026-06-17T04:00:00Z"),
        venue: "Levi's Stadium, San Francisco Bay Area",
      },
      {
        home: "POR",
        away: "COD",
        kickoffAt: D("2026-06-17T17:00:00Z"),
        venue: "NRG Stadium, Houston",
      },
      {
        home: "ENG",
        away: "CRO",
        kickoffAt: D("2026-06-17T20:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "GHA",
        away: "PAN",
        kickoffAt: D("2026-06-17T23:00:00Z"),
        venue: "BMO Field, Toronto",
      },
      {
        home: "UZB",
        away: "COL",
        kickoffAt: D("2026-06-18T02:00:00Z"),
        venue: "Estádio Azteca, Cidade do México",
      },
    ],
  },
  {
    slug: "fase-grupos-rodada-2",
    name: "Fase de Grupos — Rodada 2",
    phase: "groups",
    phaseShort: "grupos-r2",
    order: 2,
    startDate: D("2026-06-18T06:00:00Z"),
    endDate: D("2026-06-24T05:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "CZE",
        away: "RSA",
        kickoffAt: D("2026-06-18T16:00:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
      {
        home: "SUI",
        away: "BIH",
        kickoffAt: D("2026-06-18T19:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "CAN",
        away: "QAT",
        kickoffAt: D("2026-06-18T22:00:00Z"),
        venue: "BC Place, Vancouver",
      },
      {
        home: "MEX",
        away: "KOR",
        kickoffAt: D("2026-06-19T01:00:00Z"),
        venue: "Estadio Akron, Guadalajara",
      },
      {
        home: "USA",
        away: "AUS",
        kickoffAt: D("2026-06-19T19:00:00Z"),
        venue: "Lumen Field, Seattle",
      },
      {
        home: "SCO",
        away: "MAR",
        kickoffAt: D("2026-06-19T22:00:00Z"),
        venue: "Gillette Stadium, Boston",
      },
      {
        home: "BRA",
        away: "HAI",
        kickoffAt: D("2026-06-20T01:00:00Z"),
        venue: "Lincoln Financial Field, Filadélfia",
      },
      {
        home: "TUR",
        away: "PAR",
        kickoffAt: D("2026-06-20T04:00:00Z"),
        venue: "Levi's Stadium, San Francisco Bay Area",
      },
      {
        home: "NED",
        away: "SWE",
        kickoffAt: D("2026-06-20T17:00:00Z"),
        venue: "NRG Stadium, Houston",
      },
      {
        home: "GER",
        away: "CIV",
        kickoffAt: D("2026-06-20T20:00:00Z"),
        venue: "BMO Field, Toronto",
      },
      {
        home: "ECU",
        away: "CUW",
        kickoffAt: D("2026-06-21T00:00:00Z"),
        venue: "Arrowhead Stadium, Kansas City",
      },
      {
        home: "TUN",
        away: "JPN",
        kickoffAt: D("2026-06-21T04:00:00Z"),
        venue: "Estadio BBVA, Monterrey",
      },
      {
        home: "ESP",
        away: "KSA",
        kickoffAt: D("2026-06-21T16:00:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
      {
        home: "BEL",
        away: "IRN",
        kickoffAt: D("2026-06-21T19:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "URU",
        away: "CPV",
        kickoffAt: D("2026-06-21T22:00:00Z"),
        venue: "Hard Rock Stadium, Miami",
      },
      {
        home: "NZL",
        away: "EGY",
        kickoffAt: D("2026-06-22T01:00:00Z"),
        venue: "BC Place, Vancouver",
      },
      {
        home: "ARG",
        away: "AUT",
        kickoffAt: D("2026-06-22T17:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "FRA",
        away: "IRQ",
        kickoffAt: D("2026-06-22T21:00:00Z"),
        venue: "Lincoln Financial Field, Filadélfia",
      },
      {
        home: "NOR",
        away: "SEN",
        kickoffAt: D("2026-06-23T00:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
      {
        home: "JOR",
        away: "ALG",
        kickoffAt: D("2026-06-23T03:00:00Z"),
        venue: "Levi's Stadium, San Francisco Bay Area",
      },
      {
        home: "POR",
        away: "UZB",
        kickoffAt: D("2026-06-23T17:00:00Z"),
        venue: "NRG Stadium, Houston",
      },
      {
        home: "ENG",
        away: "GHA",
        kickoffAt: D("2026-06-23T20:00:00Z"),
        venue: "Gillette Stadium, Boston",
      },
      {
        home: "PAN",
        away: "CRO",
        kickoffAt: D("2026-06-23T23:00:00Z"),
        venue: "BMO Field, Toronto",
      },
      {
        home: "COL",
        away: "COD",
        kickoffAt: D("2026-06-24T02:00:00Z"),
        venue: "Estadio Akron, Guadalajara",
      },
    ],
  },
  {
    slug: "fase-grupos-rodada-3",
    name: "Fase de Grupos — Rodada 3",
    phase: "groups",
    phaseShort: "grupos-r3",
    order: 3,
    startDate: D("2026-06-24T06:00:00Z"),
    endDate: D("2026-06-28T05:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "SUI",
        away: "CAN",
        kickoffAt: D("2026-06-24T19:00:00Z"),
        venue: "BC Place, Vancouver",
      },
      {
        home: "BIH",
        away: "QAT",
        kickoffAt: D("2026-06-24T19:00:00Z"),
        venue: "Lumen Field, Seattle",
      },
      {
        home: "SCO",
        away: "BRA",
        kickoffAt: D("2026-06-24T22:00:00Z"),
        venue: "Hard Rock Stadium, Miami",
      },
      {
        home: "MAR",
        away: "HAI",
        kickoffAt: D("2026-06-24T22:00:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
      {
        home: "CZE",
        away: "MEX",
        kickoffAt: D("2026-06-25T01:00:00Z"),
        venue: "Estádio Azteca, Cidade do México",
      },
      {
        home: "RSA",
        away: "KOR",
        kickoffAt: D("2026-06-25T01:00:00Z"),
        venue: "Estadio BBVA, Monterrey",
      },
      {
        home: "ECU",
        away: "GER",
        kickoffAt: D("2026-06-25T20:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
      {
        home: "CUW",
        away: "CIV",
        kickoffAt: D("2026-06-25T20:00:00Z"),
        venue: "Lincoln Financial Field, Filadélfia",
      },
      {
        home: "JPN",
        away: "SWE",
        kickoffAt: D("2026-06-25T23:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "TUN",
        away: "NED",
        kickoffAt: D("2026-06-25T23:00:00Z"),
        venue: "Arrowhead Stadium, Kansas City",
      },
      {
        home: "TUR",
        away: "USA",
        kickoffAt: D("2026-06-26T02:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "PAR",
        away: "AUS",
        kickoffAt: D("2026-06-26T02:00:00Z"),
        venue: "Levi's Stadium, San Francisco Bay Area",
      },
      {
        home: "NOR",
        away: "FRA",
        kickoffAt: D("2026-06-26T19:00:00Z"),
        venue: "Gillette Stadium, Boston",
      },
      {
        home: "SEN",
        away: "IRQ",
        kickoffAt: D("2026-06-26T19:00:00Z"),
        venue: "BMO Field, Toronto",
      },
      {
        home: "CPV",
        away: "KSA",
        kickoffAt: D("2026-06-27T00:00:00Z"),
        venue: "NRG Stadium, Houston",
      },
      {
        home: "URU",
        away: "ESP",
        kickoffAt: D("2026-06-27T00:00:00Z"),
        venue: "Estadio Akron, Guadalajara",
      },
      {
        home: "EGY",
        away: "IRN",
        kickoffAt: D("2026-06-27T03:00:00Z"),
        venue: "Lumen Field, Seattle",
      },
      {
        home: "NZL",
        away: "BEL",
        kickoffAt: D("2026-06-27T03:00:00Z"),
        venue: "BC Place, Vancouver",
      },
      {
        home: "PAN",
        away: "ENG",
        kickoffAt: D("2026-06-27T21:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
      {
        home: "CRO",
        away: "GHA",
        kickoffAt: D("2026-06-27T21:00:00Z"),
        venue: "Lincoln Financial Field, Filadélfia",
      },
      {
        home: "COL",
        away: "POR",
        kickoffAt: D("2026-06-27T23:30:00Z"),
        venue: "Hard Rock Stadium, Miami",
      },
      {
        home: "COD",
        away: "UZB",
        kickoffAt: D("2026-06-27T23:30:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
      {
        home: "ALG",
        away: "AUT",
        kickoffAt: D("2026-06-28T02:00:00Z"),
        venue: "Arrowhead Stadium, Kansas City",
      },
      {
        home: "JOR",
        away: "ARG",
        kickoffAt: D("2026-06-28T02:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
    ],
  },
  {
    slug: "16-avos-de-final",
    name: "16-avos de Final",
    phase: "round_of_32",
    phaseShort: "16-avos",
    order: 4,
    startDate: D("2026-06-28T06:00:00Z"),
    endDate: D("2026-07-04T05:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "2A",
        away: "2B",
        kickoffAt: D("2026-06-28T19:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "1C",
        away: "2F",
        kickoffAt: D("2026-06-29T17:00:00Z"),
        venue: "NRG Stadium, Houston",
      },
      {
        home: "1E",
        away: "Melhor 3º (A/B/C/D/F)",
        kickoffAt: D("2026-06-29T20:30:00Z"),
        venue: "Gillette Stadium, Boston",
      },
      {
        home: "1F",
        away: "2C",
        kickoffAt: D("2026-06-30T01:00:00Z"),
        venue: "Estadio BBVA, Monterrey",
      },
      {
        home: "2E",
        away: "2I",
        kickoffAt: D("2026-06-30T17:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "1I",
        away: "Melhor 3º (C/D/F/G/H)",
        kickoffAt: D("2026-06-30T21:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
      {
        home: "1A",
        away: "Melhor 3º (C/E/F/H/I)",
        kickoffAt: D("2026-07-01T01:00:00Z"),
        venue: "Estádio Azteca, Cidade do México",
      },
      {
        home: "1L",
        away: "Melhor 3º (E/H/I/J/K)",
        kickoffAt: D("2026-07-01T16:00:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
      {
        home: "1G",
        away: "Melhor 3º (A/E/H/I/J)",
        kickoffAt: D("2026-07-01T20:00:00Z"),
        venue: "Lumen Field, Seattle",
      },
      {
        home: "1D",
        away: "Melhor 3º (B/E/F/I/J)",
        kickoffAt: D("2026-07-02T00:00:00Z"),
        venue: "Levi's Stadium, San Francisco Bay Area",
      },
      {
        home: "1H",
        away: "2J",
        kickoffAt: D("2026-07-02T19:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "2K",
        away: "2L",
        kickoffAt: D("2026-07-02T23:00:00Z"),
        venue: "BMO Field, Toronto",
      },
      {
        home: "1B",
        away: "Melhor 3º (E/F/G/I/J)",
        kickoffAt: D("2026-07-03T03:00:00Z"),
        venue: "BC Place, Vancouver",
      },
      {
        home: "2D",
        away: "2G",
        kickoffAt: D("2026-07-03T18:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "1J",
        away: "2H",
        kickoffAt: D("2026-07-03T22:00:00Z"),
        venue: "Hard Rock Stadium, Miami",
      },
      {
        home: "1K",
        away: "Melhor 3º (D/E/I/J/L)",
        kickoffAt: D("2026-07-04T01:30:00Z"),
        venue: "GEHA Field at Arrowhead Stadium, Kansas City",
      },
    ],
  },
  {
    slug: "oitavas-de-final",
    name: "Oitavas de Final",
    phase: "round_of_16",
    phaseShort: "oitavas",
    order: 5,
    startDate: D("2026-07-04T06:00:00Z"),
    endDate: D("2026-07-07T23:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "Vencedor M90",
        away: "Vencedor M75",
        kickoffAt: D("2026-07-04T17:00:00Z"),
        venue: "NRG Stadium, Houston",
      },
      {
        home: "Vencedor M74",
        away: "Vencedor M77",
        kickoffAt: D("2026-07-04T21:00:00Z"),
        venue: "Lincoln Financial Field, Filadélfia",
      },
      {
        home: "Vencedor M76",
        away: "Vencedor M78",
        kickoffAt: D("2026-07-05T20:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
      {
        home: "Vencedor M79",
        away: "Vencedor M80",
        kickoffAt: D("2026-07-06T00:00:00Z"),
        venue: "Estádio Azteca, Cidade do México",
      },
      {
        home: "Vencedor M83",
        away: "Vencedor M84",
        kickoffAt: D("2026-07-06T19:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "Vencedor M81",
        away: "Vencedor M82",
        kickoffAt: D("2026-07-07T00:00:00Z"),
        venue: "Lumen Field, Seattle",
      },
      {
        home: "Vencedor M86",
        away: "Vencedor M88",
        kickoffAt: D("2026-07-07T16:00:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
      {
        home: "Vencedor M85",
        away: "Vencedor M87",
        kickoffAt: D("2026-07-07T20:00:00Z"),
        venue: "BC Place, Vancouver",
      },
    ],
  },
  {
    slug: "quartas-de-final",
    name: "Quartas de Final",
    phase: "quarter_finals",
    phaseShort: "quartas",
    order: 6,
    startDate: D("2026-07-08T00:00:00Z"),
    endDate: D("2026-07-12T05:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "Vencedor M89",
        away: "Vencedor M90",
        kickoffAt: D("2026-07-09T20:00:00Z"),
        venue: "Gillette Stadium, Boston",
      },
      {
        home: "Vencedor M93",
        away: "Vencedor M94",
        kickoffAt: D("2026-07-10T19:00:00Z"),
        venue: "SoFi Stadium, Los Angeles",
      },
      {
        home: "Vencedor M91",
        away: "Vencedor M92",
        kickoffAt: D("2026-07-11T21:00:00Z"),
        venue: "Hard Rock Stadium, Miami",
      },
      {
        home: "Vencedor M95",
        away: "Vencedor M96",
        kickoffAt: D("2026-07-12T01:00:00Z"),
        venue: "GEHA Field at Arrowhead Stadium, Kansas City",
      },
    ],
  },
  {
    slug: "semifinais",
    name: "Semifinais",
    phase: "semi_finals",
    phaseShort: "semis",
    order: 7,
    startDate: D("2026-07-12T06:00:00Z"),
    endDate: D("2026-07-15T23:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "Vencedor M97",
        away: "Vencedor M98",
        kickoffAt: D("2026-07-14T19:00:00Z"),
        venue: "AT&T Stadium, Dallas",
      },
      {
        home: "Vencedor M99",
        away: "Vencedor M100",
        kickoffAt: D("2026-07-15T19:00:00Z"),
        venue: "Mercedes-Benz Stadium, Atlanta",
      },
    ],
  },
  {
    slug: "disputa-terceiro-lugar",
    name: "Disputa de 3º Lugar",
    phase: "third_place",
    phaseShort: "3o-lugar",
    order: 8,
    startDate: D("2026-07-16T00:00:00Z"),
    endDate: D("2026-07-18T23:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "Perdedor M101",
        away: "Perdedor M102",
        kickoffAt: D("2026-07-18T21:00:00Z"),
        venue: "Hard Rock Stadium, Miami",
      },
    ],
  },
  {
    slug: "final",
    name: "Final",
    phase: "final",
    phaseShort: "final",
    order: 9,
    startDate: D("2026-07-19T00:00:00Z"),
    endDate: D("2026-07-19T23:59:59Z"),
    isActive: true,
    matches: [
      {
        home: "Vencedor M101",
        away: "Vencedor M102",
        kickoffAt: D("2026-07-19T19:00:00Z"),
        venue: "MetLife Stadium, New Jersey",
      },
    ],
  },
];
function matchSlug(home: string, away: string, phaseShort: string) {
  return `${home.toLowerCase()}-x-${away.toLowerCase()}-${phaseShort}`;
}

export const seedBoringGame = internalMutation({
  args: {},
  handler: async (ctx) => {
    let createdRounds = 0;
    let updatedRounds = 0;
    let createdMatches = 0;
    let updatedMatches = 0;

    for (const r of ROUNDS) {
      const existingRound = await ctx.db
        .query("worldCupRounds")
        .withIndex("by_slug", (q) => q.eq("slug", r.slug))
        .unique();

      let roundId;
      if (existingRound) {
        await ctx.db.patch(existingRound._id, {
          name: r.name,
          phase: r.phase,
          startDate: r.startDate,
          endDate: r.endDate,
          isActive: r.isActive,
          order: r.order,
        });
        roundId = existingRound._id;
        updatedRounds++;
      } else {
        roundId = await ctx.db.insert("worldCupRounds", {
          slug: r.slug,
          name: r.name,
          phase: r.phase,
          startDate: r.startDate,
          endDate: r.endDate,
          isActive: r.isActive,
          order: r.order,
        });
        createdRounds++;
      }

      for (const m of r.matches) {
        const slug = matchSlug(m.home, m.away, r.phaseShort);
        const existingMatch = await ctx.db
          .query("worldCupMatches")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .unique();

        const baseFields = {
          roundId,
          slug,
          homeTeamCode: m.home,
          homeTeamName: NAME[m.home] ?? m.home,
          homeTeamFlag: FLAG[m.home] ?? "🏳️",
          awayTeamCode: m.away,
          awayTeamName: NAME[m.away] ?? m.away,
          awayTeamFlag: FLAG[m.away] ?? "🏳️",
          kickoffAt: m.kickoffAt,
          venue: m.venue,
        };

        if (existingMatch) {
          await ctx.db.patch(existingMatch._id, baseFields);
          updatedMatches++;
        } else {
          await ctx.db.insert("worldCupMatches", {
            ...baseFields,
            totalVotes: 0,
            reasonCounts: EMPTY_REASON_COUNTS,
          });
          createdMatches++;
        }
      }
    }

    return {
      createdRounds,
      updatedRounds,
      createdMatches,
      updatedMatches,
    };
  },
});
