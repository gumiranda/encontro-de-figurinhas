import { fetchQuery } from "convex/nextjs";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { api } from "@workspace/backend/_generated/api";
import { LocationSelectorView } from "@/modules/location/ui/views/location-selector-view";
import {
  SUGGESTED_CITY_KEYS,
  type CityWithCoords,
} from "@/modules/location/lib/location-constants";
import type { Viewport } from "next";

export const metadata = { title: "Selecionar localização" };

export const viewport: Viewport = {
  viewportFit: "cover",
};

const getCities = unstable_cache(
  () => fetchQuery(api.cities.getAll),
  ["cities-all-coords"],
  { revalidate: 3600 }
);

export default async function SelecionarLocalizacaoPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const [token, citiesOrError] = await Promise.all([
    getToken({ template: "convex" }),
    getCities().catch((e: unknown) =>
      e instanceof Error ? e : new Error("Erro desconhecido")
    ),
  ]);

  if (!token) redirect("/sign-in");

  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
  if (!user?.hasCompletedOnboarding) redirect("/complete-profile");
  if (!user?.hasCompletedStickerSetup) redirect("/cadastrar-figurinhas");

  let cities: CityWithCoords[] = [];
  let citiesError: string | undefined;

  if (citiesOrError instanceof Error) {
    citiesError = citiesOrError.message;
    console.error("Failed to fetch cities:", citiesOrError);
  } else {
    cities = citiesOrError;
  }

  const cityMap = new Map(
    cities.map((c) => [`${c.name}|${c.state}`, c] as const)
  );

  const suggestedCities = SUGGESTED_CITY_KEYS.reduce<CityWithCoords[]>(
    (acc, key) => {
      const found = cityMap.get(`${key.name}|${key.state}`);
      if (found) acc.push(found);
      else if (process.env.NODE_ENV === "development") {
        console.warn(
          `SUGGESTED_CITY not found in seed: ${key.name}, ${key.state}`
        );
      }
      return acc;
    },
    []
  );

  return (
    <LocationSelectorView
      cities={cities}
      suggestedCities={suggestedCities}
      citiesError={citiesError}
      currentCityId={user?.cityId}
    />
  );
}
