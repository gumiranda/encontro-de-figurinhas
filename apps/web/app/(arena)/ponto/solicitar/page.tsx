import type { Metadata } from "next";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { api } from "@workspace/backend/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";
import { RequestTradePointView } from "@/modules/trade-points/ui/views/request-trade-point-view";

export const metadata: Metadata = {
  title: "Sugerir ponto de troca",
  robots: { index: false, follow: false },
};

export default async function PontoSolicitarPage() {
  const { userId, getToken } = await auth();
  if (!userId) redirect("/sign-in");

  const token = await getToken({ template: "convex" });
  if (!token) redirect("/sign-in");

  const user = await fetchQuery(api.users.getCurrentUser, {}, { token });
  if (!user?.hasCompletedOnboarding) redirect("/complete-profile");
  if (!user.cityId) redirect("/selecionar-localizacao");

  const city = await fetchQuery(
    api.cities.getById,
    { cityId: user.cityId },
    { token }
  );
  if (!city) redirect("/selecionar-localizacao");

  return (
    <RequestTradePointView
      cityId={user.cityId as Id<"cities">}
      cityLabel={`${city.name} (${city.state})`}
      defaultLat={city.lat}
      defaultLng={city.lng}
    />
  );
}
