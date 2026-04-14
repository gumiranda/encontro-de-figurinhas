import type { api } from "@workspace/backend/_generated/api";
import citiesData from "@workspace/backend/seeds/cities-data.json";
import type { FunctionReturnType } from "convex/server";

export type CityWithCoords = FunctionReturnType<typeof api.cities.getAll>[number];

export function isCityWithCoords(city: unknown): city is CityWithCoords {
  return (
    typeof city === "object" &&
    city !== null &&
    "_id" in city &&
    "name" in city &&
    "state" in city &&
    "lat" in city &&
    "lng" in city &&
    typeof (city as CityWithCoords).lat === "number" &&
    typeof (city as CityWithCoords).lng === "number"
  );
}

export const SUGGESTED_CITY_KEYS = citiesData.map((city) => ({
  name: city.name,
  state: city.state,
}));

export const DISTANCE_THRESHOLD_KM = 100;
