import { isInBrazil } from "@/modules/location/lib/geo";
import { auth } from "@clerk/nextjs/server";
import { signIpLocationToken } from "@workspace/backend/lib/ipLocationToken";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = process.env.IP_LOCATION_ATTESTATION_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Geolocation unavailable" }, { status: 500 });
  }

  const city = request.headers.get("x-vercel-ip-city");
  const lat = request.headers.get("x-vercel-ip-latitude");
  const lng = request.headers.get("x-vercel-ip-longitude");

  if (!city || !lat || !lng) {
    return NextResponse.json({ error: "Geolocation unavailable" }, { status: 400 });
  }

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  if (!isInBrazil(parsedLat, parsedLng)) {
    return NextResponse.json({ error: "Location outside Brazil" }, { status: 400 });
  }

  const decodedCity = (() => {
    try {
      return decodeURIComponent(city);
    } catch {
      return city;
    }
  })();

  const { token: attestationToken, expiresAt } = await signIpLocationToken(
    { sub: userId, lat: parsedLat, lng: parsedLng },
    secret
  );

  const response = NextResponse.json({
    city: decodedCity,
    lat: parsedLat,
    lng: parsedLng,
    attestationToken,
    /** Espelha `exp` do payload assinado; o cliente pode recusar antes de usar. A autoridade é `verifyIpLocationToken` no Convex. */
    expiresAt,
  });
  response.headers.set("Cache-Control", "private, max-age=300");
  return response;
}
