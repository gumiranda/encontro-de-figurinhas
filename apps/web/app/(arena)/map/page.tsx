import type { Metadata } from "next";
import { MapArenaView } from "@/modules/map/ui/views/map-arena-view";

export const metadata: Metadata = {
  title: "Mapa da Arena | Encontro de Figurinhas",
  description: "Encontre pontos de troca de figurinhas perto de você.",
  alternates: { canonical: "/map" },
  openGraph: {
    title: "Mapa da Arena",
    description: "Encontre pontos de troca de figurinhas perto de você.",
  },
  robots: { index: false, follow: false },
};

export default function MapPage() {
  return <MapArenaView />;
}
