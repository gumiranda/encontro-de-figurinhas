import { Doc } from "../_generated/dataModel";

type UserWithLocation = Pick<Doc<"users">, "lat" | "lng" | "locationSource">;

export function getVerifiedCoords(
  user: UserWithLocation
): { lat: number; lng: number } | null {
  if (user.locationSource !== "gps") return null;
  if (user.lat === undefined || user.lng === undefined) return null;
  return { lat: user.lat, lng: user.lng };
}
