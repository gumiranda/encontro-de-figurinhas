import { haversine } from "./geo";
import { DISTANCE_THRESHOLD_KM, type CityWithCoords } from "./location-constants";

export function findNearestCity(
  userLat: number,
  userLng: number,
  cities: CityWithCoords[]
): { city: CityWithCoords; distance: number; isDistant: boolean } | null {
  if (cities.length === 0) return null;
  if (isNaN(userLat) || isNaN(userLng)) return null;

  let nearest = cities[0]!;
  let minDistance = haversine(userLat, userLng, nearest.lat, nearest.lng);

  for (let i = 1; i < cities.length; i++) {
    const city = cities[i]!;
    const distance = haversine(userLat, userLng, city.lat, city.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }

  return {
    city: nearest,
    distance: Math.round(minDistance),
    isDistant: minDistance > DISTANCE_THRESHOLD_KM,
  };
}
