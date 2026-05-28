import type { Metadata } from "next";
import { Suspense } from "react";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { BASE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { AlbumHeroSection } from "@/modules/album-copa/ui/components/hero-section";
import { AlbumInfoSection } from "@/modules/album-copa/ui/components/info-section";
import { HowToCollectSection } from "@/modules/album-copa/ui/components/how-to-collect";
import { RareFigurinesSection } from "@/modules/album-copa/ui/components/rare-figurines";
import { TipsAndTricksSection } from "@/modules/album-copa/ui/components/tips-and-tricks";
import { ArticleSection } from "@/modules/album-copa/ui/components/article-section";
import { AlbumCTASection } from "@/modules/album-copa/ui/components/cta-section";

export const metadata: Metadata = {
  title: {
    absolute: "Álbum da Copa do Mundo 2026 - Guia Completo de Figurinhas",
  },
  description:
    "Tudo sobre o álbum da Copa 2026: como colecionar 980 figurinhas, dicas para encontrar raras, preços e onde comprar. Guia completo para colecionadores.",
  keywords: [
    "álbum copa do mundo 2026",
    "como colecionar figurinhas",
    "figurinhas raras copa",
    "guia álbum copa 2026",
    "donde comprar figurinhas copa",
    "dicas colecionar figurinhas",
    "figurinhas mais valiosas copa 2026",
    "album panini copa 2026",
  ],
  alternates: {
    canonical: `${BASE_URL}/album-copa`,
  },
  openGraph: {
    type: "article",
    url: `${BASE_URL}/album-copa`,
    title: "Álbum da Copa do Mundo 2026 - Guia Completo de Figurinhas",
    description:
      "Tudo sobre o álbum da Copa 2026: como colecionar 980 figurinhas, dicas para encontrar raras, preços e onde comprar.",
    images: [
      {
        url: `${BASE_URL}/og-album-copa.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Álbum da Copa do Mundo 2026 - Guia Completo",
    description:
      "Tudo sobre como colecionar as 980 figurinhas do álbum da Copa 2026.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Álbum da Copa do Mundo 2026 - Guia Completo de Figurinhas",
  description:
    "Tudo sobre o álbum da Copa 2026: como colecionar 980 figurinhas, dicas para encontrar raras, preços e onde comprar.",
  datePublished: "2026-05-28",
  dateModified: "2026-05-28",
  image: `${BASE_URL}/og-album-copa.png`,
  author: {
    "@type": "Organization",
    name: "FigurinhaFácil",
    url: BASE_URL,
  },
};

export default function AlbumCopaPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <LandingHeader />
      <main className="overflow-hidden">
        <AlbumHeroSection />
        <AlbumInfoSection />
        <HowToCollectSection />
        <RareFigurinesSection />
        <TipsAndTricksSection />
        <ArticleSection />
        <AlbumCTASection />
      </main>
      <LandingFooter />
    </>
  );
}
