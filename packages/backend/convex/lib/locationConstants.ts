export const LOCATION_RATE_LIMIT = {
  COOLDOWN_MS: 30_000,
  MAX_PER_HOUR: 10,
  WINDOW_MS: 60 * 60 * 1000,
} as const;

/**
 * Raio máximo entre o centro cadastrado da cidade e as coords enviadas pelo cliente.
 * Geolocalização do browser pode ser falsificada; o servidor não trata coords como prova
 * absoluta — só coerência com a cidade escolhida. Para decisões críticas (preço, compliance),
 * use `cityId` (ou fontes atestadas como IP) em vez de confiar só em lat/lng de GPS.
 */
export const GEO_VALIDATION = {
  MAX_DISTANCE_FROM_CITY_KM: 200,
} as const;
