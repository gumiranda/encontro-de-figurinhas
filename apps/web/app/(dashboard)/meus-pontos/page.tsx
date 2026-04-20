import type { Metadata } from "next";
import { MyPointsView } from "@/modules/trade-points/ui/views/my-points-view";

export const metadata: Metadata = {
  title: "Meus Pontos | Encontro de Figurinhas",
  description: "Gerencie os pontos de troca que você participa.",
  robots: { index: false, follow: false },
};

export default function MeusPontosPage() {
  return <MyPointsView />;
}
