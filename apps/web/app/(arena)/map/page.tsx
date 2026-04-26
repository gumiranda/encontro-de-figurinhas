import type { Metadata } from "next";
import { MapArenaView } from "@/modules/map/ui/views/map-arena-view";

export const metadata: Metadata = {
  title: "Mapa da arena",
  description: "Encontre pontos de troca de figurinhas perto de você.",
  robots: { index: false, follow: false },
};

export default function MapPage() {
  return <MapArenaView />;
}
