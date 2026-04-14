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

  let parsedLat: number;
  let parsedLng: number;
  let decodedCity: string;

  if (!city || !lat || !lng) {
    return NextResponse.json({ error: "Geolocation unavailable" }, { status: 400 });
  }

  parsedLat = parseFloat(lat);
  parsedLng = parseFloat(lng);

  if (isNaN(parsedLat) || isNaN(parsedLng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  if (!isInBrazil(parsedLat, parsedLng)) {
    return NextResponse.json({ error: "Location outside Brazil" }, { status: 400 });
  }

  try {
    decodedCity = decodeURIComponent(city);
  } catch {
    decodedCity = city;
  }

  if (!isInBrazil(parsedLat, parsedLng)) {
    return NextResponse.json({ error: "Location outside Brazil" }, { status: 400 });
  }

  const attestationToken = await signIpLocationToken(
    { sub: userId, lat: parsedLat, lng: parsedLng },
    secret
  );

  const response = NextResponse.json({
    city: decodedCity,
    lat: parsedLat,
    lng: parsedLng,
    attestationToken,
  });
  response.headers.set("Cache-Control", "private, max-age=300");
  return response;
}
