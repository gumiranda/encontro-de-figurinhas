import { haversine } from "./geo";
import {
  DISTANCE_THRESHOLD_KM,
  type CityWithCoords,
  isCityWithCoords,
} from "./location-constants";

export function findNearestCity(
  userLat: number,
  userLng: number,
  cities: CityWithCoords[]
): { city: CityWithCoords; distance: number; isDistant: boolean } | null {
  if (cities.length === 0) return null;
  if (isNaN(userLat) || isNaN(userLng)) return null;

  const validCities = cities.filter(isCityWithCoords);
  if (validCities.length === 0) return null;

  let nearest: CityWithCoords | null = null;
  let minDistance = Infinity;

  for (const city of validCities) {
    const distance = haversine(userLat, userLng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  if (!nearest) return null;

  return {
    city: nearest,
    distance: Math.round(minDistance),
    isDistant: minDistance > DISTANCE_THRESHOLD_KM,
  };
}
