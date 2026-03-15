import { SpotsMap } from "@/modules/spots/ui/components/spots-map";

export const metadata = {
  title: "Mapa - Encontro de Figurinhas",
  description: "Encontre pontos de troca de figurinhas perto de você",
};

export default function MapaPage() {
  return <SpotsMap />;
}
