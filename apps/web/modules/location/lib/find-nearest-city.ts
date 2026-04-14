import { haversine } from "./geo";
import { DISTANCE_THRESHOLD_KM, type CityWithCoords } from "./location-constants";

export function findNearestCity(
  userLat: number,
  userLng: number,
  cities: CityWithCoords[]
): { city: CityWithCoords; distance: number; isDistant: boolean } | null {
  if (cities.length === 0) return null;
  if (isNaN(userLat) || isNaN(userLng)) return null;

  const first = cities[0]!;
  const nearest = cities.reduce(
    (best, city) => {
      const distance = haversine(userLat, userLng, city.lat, city.lng);
      return distance < best.distance ? { city, distance } : best;
    },
    {
      city: first,
      distance: haversine(userLat, userLng, first.lat, first.lng),
    }
  );

  return {
    city: nearest.city,
    distance: Math.round(nearest.distance),
    isDistant: nearest.distance > DISTANCE_THRESHOLD_KM,
  };
}
