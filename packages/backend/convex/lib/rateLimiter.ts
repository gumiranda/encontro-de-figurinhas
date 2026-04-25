import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "../_generated/api";

/**
 * Rate limits server-side para queries/mutations públicas.
 *
 * Convex queries são read-only; apenas `rateLimiter.check()` funciona neles
 * (verifica sem consumir token). Mutations/actions podem chamar `.limit()`
 * para consumir tokens de fato.
 *
 * Sem userId autenticado (queries públicas anônimas), usamos chaves "global:*"
 * — limita o throughput total da função contra DoS em massa. Para fluxos
 * autenticados, passar `tokenIdentifier` do Clerk como key.
 */
export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // cities.search — pública, alto volume esperado (autocomplete)
  citiesSearch: {
    kind: "token bucket",
    rate: 300,
    period: MINUTE,
    capacity: 600,
    shards: 4,
  },

  // checkNicknameAvailable — pública, alvo de enumeração
  nicknameCheck: {
    kind: "token bucket",
    rate: 120,
    period: MINUTE,
    capacity: 240,
    shards: 4,
  },

  // completeProfile — mutation; por usuário 3 tentativas/hora
  // (previne batch reservation de nicknames por um único ator)
  completeProfile: {
    kind: "token bucket",
    rate: 3,
    period: HOUR,
    capacity: 3,
  },

  // siteStats.get — pública, sem auth, lookup tiny mas vetor DDoS de billing
  publicSiteStats: {
    kind: "token bucket",
    rate: 600,
    period: MINUTE,
    capacity: 1200,
    shards: 4,
  },

  // tradePoints SSG/listing endpoints públicos
  publicTradePointsList: {
    kind: "token bucket",
    rate: 300,
    period: MINUTE,
    capacity: 600,
    shards: 4,
  },
});
