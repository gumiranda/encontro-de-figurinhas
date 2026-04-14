function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const BRAZIL_BOUNDS = {
  lat: { min: -33.75, max: 5.27 },
  lng: { min: -73.99, max: -28.0 },
};

export function isInBrazil(lat: number, lng: number): boolean {
  return (
    lat >= BRAZIL_BOUNDS.lat.min &&
    lat <= BRAZIL_BOUNDS.lat.max &&
    lng >= BRAZIL_BOUNDS.lng.min &&
    lng <= BRAZIL_BOUNDS.lng.max
  );
}
