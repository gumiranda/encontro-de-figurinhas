/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cities from "../cities.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_geo from "../lib/geo.js";
import type * as lib_ipLocationToken from "../lib/ipLocationToken.js";
import type * as lib_locationConstants from "../lib/locationConstants.js";
import type * as lib_locationRateLimit from "../lib/locationRateLimit.js";
import type * as lib_rateLimit from "../lib/rateLimit.js";
import type * as lib_setLocationErrors from "../lib/setLocationErrors.js";
import type * as lib_types from "../lib/types.js";
import type * as lib_userCoords from "../lib/userCoords.js";
import type * as lib_utils from "../lib/utils.js";
import type * as matches from "../matches.js";
import type * as permissions from "../permissions.js";
import type * as seedAlbumConfig from "../seedAlbumConfig.js";
import type * as seeds_seedCities from "../seeds/seedCities.js";
import type * as stickers from "../stickers.js";
import type * as tradePoints from "../tradePoints.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  cities: typeof cities;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/constants": typeof lib_constants;
  "lib/geo": typeof lib_geo;
  "lib/ipLocationToken": typeof lib_ipLocationToken;
  "lib/locationConstants": typeof lib_locationConstants;
  "lib/locationRateLimit": typeof lib_locationRateLimit;
  "lib/rateLimit": typeof lib_rateLimit;
  "lib/setLocationErrors": typeof lib_setLocationErrors;
  "lib/types": typeof lib_types;
  "lib/userCoords": typeof lib_userCoords;
  "lib/utils": typeof lib_utils;
  matches: typeof matches;
  permissions: typeof permissions;
  seedAlbumConfig: typeof seedAlbumConfig;
  "seeds/seedCities": typeof seeds_seedCities;
  stickers: typeof stickers;
  tradePoints: typeof tradePoints;
  users: typeof users;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
