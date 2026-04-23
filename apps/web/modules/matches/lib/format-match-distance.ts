/** Same rule as Convex `listMyMatches` / plan: 0.5 km steps. */
export function roundDistanceKmHalf(distanceKm: number): number {
  return Math.round(distanceKm * 2) / 2;
}

export function formatDistanceKmLabel(distanceKm: number): string {
  const km = roundDistanceKmHalf(distanceKm);
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  const shown = Number.isInteger(km) ? km : km.toFixed(1);
  return `${shown} km`;
}
