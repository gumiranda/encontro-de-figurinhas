/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as _helpers_pagination from "../_helpers/pagination.js";
import type * as album from "../album.js";
import type * as blog from "../blog.js";
import type * as boringGame from "../boringGame.js";
import type * as checkins from "../checkins.js";
import type * as cities from "../cities.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_checkinHelpers from "../lib/checkinHelpers.js";
import type * as lib_confidence_status from "../lib/confidence_status.js";
import type * as lib_constants from "../lib/constants.js";
import type * as lib_coverImageUrl from "../lib/coverImageUrl.js";
import type * as lib_geo from "../lib/geo.js";
import type * as lib_ipLocationToken from "../lib/ipLocationToken.js";
import type * as lib_limits from "../lib/limits.js";
import type * as lib_locationRateLimit from "../lib/locationRateLimit.js";
import type * as lib_rateLimit from "../lib/rateLimit.js";
import type * as lib_rateLimiter from "../lib/rateLimiter.js";
import type * as lib_reportCategories from "../lib/reportCategories.js";
import type * as lib_report_severity from "../lib/report_severity.js";
import type * as lib_setLocationErrors from "../lib/setLocationErrors.js";
import type * as lib_slug from "../lib/slug.js";
import type * as lib_tradeHelpers from "../lib/tradeHelpers.js";
import type * as lib_types from "../lib/types.js";
import type * as lib_userCoords from "../lib/userCoords.js";
import type * as lib_utils from "../lib/utils.js";
import type * as lib_whatsapp from "../lib/whatsapp.js";
import type * as matches from "../matches.js";
import type * as newsletter from "../newsletter.js";
import type * as permissions from "../permissions.js";
import type * as reports from "../reports.js";
import type * as revalidate from "../revalidate.js";
import type * as seedAlbumConfig from "../seedAlbumConfig.js";
import type * as seedBlog from "../seedBlog.js";
import type * as seedBoringGame from "../seedBoringGame.js";
import type * as seeds_seedCities from "../seeds/seedCities.js";
import type * as seeds_seedTradePoints from "../seeds/seedTradePoints.js";
import type * as siteStats from "../siteStats.js";
import type * as states from "../states.js";
import type * as stickers from "../stickers.js";
import type * as tradePoints from "../tradePoints.js";
import type * as trades from "../trades.js";
import type * as userMatchInteractions from "../userMatchInteractions.js";
import type * as userTradePoints from "../userTradePoints.js";
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
  "_helpers/pagination": typeof _helpers_pagination;
  album: typeof album;
  blog: typeof blog;
  boringGame: typeof boringGame;
  checkins: typeof checkins;
  cities: typeof cities;
  crons: typeof crons;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/checkinHelpers": typeof lib_checkinHelpers;
  "lib/confidence_status": typeof lib_confidence_status;
  "lib/constants": typeof lib_constants;
  "lib/coverImageUrl": typeof lib_coverImageUrl;
  "lib/geo": typeof lib_geo;
  "lib/ipLocationToken": typeof lib_ipLocationToken;
  "lib/limits": typeof lib_limits;
  "lib/locationRateLimit": typeof lib_locationRateLimit;
  "lib/rateLimit": typeof lib_rateLimit;
  "lib/rateLimiter": typeof lib_rateLimiter;
  "lib/reportCategories": typeof lib_reportCategories;
  "lib/report_severity": typeof lib_report_severity;
  "lib/setLocationErrors": typeof lib_setLocationErrors;
  "lib/slug": typeof lib_slug;
  "lib/tradeHelpers": typeof lib_tradeHelpers;
  "lib/types": typeof lib_types;
  "lib/userCoords": typeof lib_userCoords;
  "lib/utils": typeof lib_utils;
  "lib/whatsapp": typeof lib_whatsapp;
  matches: typeof matches;
  newsletter: typeof newsletter;
  permissions: typeof permissions;
  reports: typeof reports;
  revalidate: typeof revalidate;
  seedAlbumConfig: typeof seedAlbumConfig;
  seedBlog: typeof seedBlog;
  seedBoringGame: typeof seedBoringGame;
  "seeds/seedCities": typeof seeds_seedCities;
  "seeds/seedTradePoints": typeof seeds_seedTradePoints;
  siteStats: typeof siteStats;
  states: typeof states;
  stickers: typeof stickers;
  tradePoints: typeof tradePoints;
  trades: typeof trades;
  userMatchInteractions: typeof userMatchInteractions;
  userTradePoints: typeof userTradePoints;
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

export declare const components: {
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
      getValue: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          key?: string;
          name: string;
          sampleShards?: number;
        },
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          shard: number;
          ts: number;
          value: number;
        }
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
    time: {
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
    };
  };
};
