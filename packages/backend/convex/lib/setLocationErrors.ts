import { ConvexError } from "convex/values";

/** Códigos estáveis para o cliente mapear mensagens (i18n) sem depender do texto do servidor. */
export const SET_LOCATION_ERROR_CODES = [
  "LOCATION_RATE_LIMIT_COOLDOWN",
  "LOCATION_RATE_LIMIT_HOURLY",
  "LOCATION_CITY_NOT_FOUND",
  "LOCATION_CITY_INACTIVE",
  "LOCATION_COORDS_PAIR_INVALID",
  "LOCATION_IP_WITH_CLIENT_COORDS",
  "LOCATION_OUTSIDE_BRAZIL",
  "LOCATION_GPS_COORDS_REQUIRED",
  "LOCATION_IP_SERVER_CONFIG",
  "LOCATION_IP_TOKEN_REQUIRED",
  "LOCATION_IP_TOKEN_INVALID",
  "LOCATION_IP_CITY_MISMATCH",
  "LOCATION_INVALID_SOURCE",
] as const;

export type SetLocationErrorCode = (typeof SET_LOCATION_ERROR_CODES)[number];

export type SetLocationErrorData = { code: SetLocationErrorCode };

export function throwSetLocationError(code: SetLocationErrorCode): never {
  throw new ConvexError<SetLocationErrorData>({ code });
}
