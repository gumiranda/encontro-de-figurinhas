import type { Metadata } from "next";

import { PropostasPageView } from "@/modules/propostas/ui/views/propostas-page-view";

export const metadata: Metadata = {
  title: "Propostas | Figurinha Fácil",
  description:
    "Suas propostas de troca pendentes, aceitas e enviadas em um só lugar.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://figurinhafacil.com.br/propostas",
  },
};

export default function PropostasPage() {
  return <PropostasPageView />;
}
