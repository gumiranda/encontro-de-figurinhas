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

  myPointsDashboard: {
    kind: "token bucket",
    rate: 60,
    period: MINUTE,
    capacity: 120,
  },

  // Newsletter subscribe — public, single global bucket against email-spam abuse.
  newsletterSubscribe: {
    kind: "token bucket",
    rate: 60,
    period: MINUTE,
    capacity: 120,
    shards: 4,
  },

  // Newsletter unsubscribe — per-IP key (extracted by the route handler from
  // x-forwarded-for). Avoids global-key DoS where one attacker locks out all
  // users; unauthenticated, so the route handler is the trust boundary.
  newsletterUnsubscribe: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 60,
  },

  // Per-token brute-force guard. UUIDv4 isn't bruteforceable in cosmic time,
  // but cheap cap stops a misbehaving email client from re-firing the link.
  newsletterUnsubscribeToken: {
    kind: "token bucket",
    rate: 5,
    period: 10 * MINUTE,
    capacity: 5,
  },

  // checkins.create — per-user throttle against spam checkins
  checkinCreate: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 60,
  },

  // trades.initiate — per-user 10/hour (matches existing manual logic)
  tradeInitiate: {
    kind: "token bucket",
    rate: 10,
    period: HOUR,
    capacity: 10,
  },

  // userMatchInteractions.toggleHidden — moderate throttle
  toggleHidden: {
    kind: "token bucket",
    rate: 60,
    period: MINUTE,
    capacity: 120,
  },

  // stickers.toggleSticker — per-user throttle (50+ stickers abuse vector)
  toggleSticker: {
    kind: "token bucket",
    rate: 120,
    period: MINUTE,
    capacity: 240,
  },

  // boringGame.castVote — per-user throttle (revote legítimo)
  boringGameVoteUser: {
    kind: "token bucket",
    rate: 30,
    period: HOUR,
    capacity: 30,
  },

  // boringGame.castVote — per-IP throttle (multi-account anti-spam, NAT/CGNAT margem)
  boringGameVoteIp: {
    kind: "token bucket",
    rate: 60,
    period: HOUR,
    capacity: 60,
  },

  // publicProfile — global bucket (não por nickname pra evitar user enumeration)
  publicProfile: {
    kind: "token bucket",
    rate: 60,
    period: MINUTE,
    capacity: 120,
    shards: 4,
  },

  // HTTP /api/sticker-slug — middleware redirect lookup, global bucket
  stickerSlugLookup: {
    kind: "token bucket",
    rate: 300,
    period: MINUTE,
    capacity: 600,
    shards: 4,
  },
});
