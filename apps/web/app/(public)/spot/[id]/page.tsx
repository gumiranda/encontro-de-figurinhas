import type { Metadata } from "next";
import convexServer from "@/lib/convex-server";
import { api } from "@workspace/backend/_generated/api";
import { SpotDetailClient } from "./spot-detail-client";

export const revalidate = 60;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const spot = await convexServer.query(api.spots.getById, { id });

    if (!spot) {
      return {
        title: "Ponto não encontrado - Encontro de Figurinhas",
        description: "Este ponto de troca não existe ou já expirou.",
      };
    }

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const ogImage = mapboxToken
      ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+22c55e(${spot.longitude},${spot.latitude})/${spot.longitude},${spot.latitude},14,0/600x315@2x?access_token=${mapboxToken}`
      : undefined;

    return {
      title: `${spot.title} - Encontro de Figurinhas`,
      description:
        spot.description || "Ponto de troca de figurinhas ativo!",
      openGraph: {
        title: spot.title,
        description:
          spot.description || "Ponto de troca de figurinhas ativo!",
        ...(ogImage && {
          images: [{ url: ogImage, width: 1200, height: 630 }],
        }),
      },
    };
  } catch {
    return {
      title: "Encontro de Figurinhas",
      description: "Encontre pontos de troca de figurinhas perto de você",
    };
  }
}

export default async function SpotPage({ params }: Props) {
  const { id } = await params;
  return <SpotDetailClient spotId={id} />;
}
