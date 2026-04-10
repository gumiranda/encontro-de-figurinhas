import { Metadata } from "next";
import { LandingView } from "@/modules/landing/ui/views/landing-view";

export const metadata: Metadata = {
  metadataBase: new URL("https://figurinhafacil.com.br"),
  title: "Figurinha Facil | Troque suas figurinhas perto de voce",
  description:
    "A maior rede de troca de figurinhas do Brasil. Encontre colecionadores e pontos de troca em Sao Paulo, Rio de Janeiro, Belo Horizonte e mais.",
  keywords: ["figurinhas", "troca de figurinhas", "album", "colecionadores"],
  openGraph: {
    title: "Figurinha Facil",
    description: "Encontre quem tem as figurinhas que voce precisa",
    type: "website",
    locale: "pt_BR",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Figurinha Facil",
    description: "A maior rede de troca de figurinhas",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Figurinha Facil",
  description: "Plataforma de troca de figurinhas",
  url: "https://figurinhafacil.com.br",
};

export default function LandingPage() {
  // TODO: Fetch real stats from Convex when available
  // const stats = await fetchStats();
  const totalTrocas = null; // Will show "Milhares" instead of fake numbers

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingView totalTrocas={totalTrocas} />
    </>
  );
}
