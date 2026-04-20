import type { Metadata } from "next";
import { headers } from "next/headers";
import { isbot } from "isbot";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { HeroSection } from "@/modules/landing/ui/components/hero-section";
import { SocialProofSection } from "@/modules/landing/ui/components/social-proof-section";
import { FeaturesSection } from "@/modules/landing/ui/components/features-section";
import { HowItWorksSection } from "@/modules/landing/ui/components/how-it-works-section";
import { CitiesSection } from "@/modules/landing/ui/components/cities-section";
import { FAQSection } from "@/modules/landing/ui/components/faq-section";
import { FinalCTASection } from "@/modules/landing/ui/components/final-cta-section";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateSportsEventSchema,
  generateCombinedSchema,
  GEO_OPTIMIZED_FAQS,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Figurinha Fácil - Troque Figurinhas da Copa 2026 Perto de Você",
  description:
    "O álbum da Copa 2026 tem 980 figurinhas. Economize até R$ 5.000 trocando com colecionadores em mais de 100 cidades. Cadastre suas repetidas e encontre quem tem as que você precisa.",
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "article:published_time": "2025-01-01T00:00:00Z",
    "article:modified_time": new Date().toISOString(),
  },
};

const FAQ_DATA = [
  ...GEO_OPTIMIZED_FAQS,
  {
    question: "Preciso pagar para usar o Figurinha Fácil?",
    answer:
      "Não. Figurinha Fácil é 100% gratuito para colecionadores. Você pode cadastrar figurinhas, encontrar trocas e usar o mapa sem custo algum.",
  },
  {
    question: "Funciona na minha cidade?",
    answer:
      "Estamos em mais de 100 cidades brasileiras e crescendo. Se sua cidade não aparece, cadastre-se — você ajuda a expandir a rede e será notificado quando houver colecionadores próximos.",
  },
];

const HOW_TO_STEPS = [
  {
    title: "Crie sua conta em 30 segundos",
    description:
      "Cadastro rápido, sem burocracia. Use seu e-mail ou conta Google.",
  },
  {
    title: "Cadastre repetidas e faltantes",
    description:
      "Marque as figurinhas que você tem de sobra e as que precisa completar.",
  },
  {
    title: "Encontre trocas e combine",
    description:
      "Veja no mapa quem está perto e combine o encontro para realizar a troca.",
  },
];

const organizationSchema = generateOrganizationSchema();
const webSiteSchema = generateWebSiteSchema();
const faqSchema = generateFAQSchema(FAQ_DATA);
const howToSchema = generateHowToSchema(
  "Como trocar figurinhas no Figurinha Fácil",
  "Aprenda a trocar figurinhas em 3 passos simples e complete seu álbum da Copa 2026.",
  HOW_TO_STEPS
);
const sportsEventSchema = generateSportsEventSchema();

const combinedSchema = generateCombinedSchema([
  organizationSchema,
  webSiteSchema,
  faqSchema,
  howToSchema,
  sportsEventSchema,
]);

export default async function LandingPage() {
  const totalTrocas = null;

  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ipCity = h.get("x-vercel-ip-city");
  const cityName = isbot(ua)
    ? null
    : ipCity
      ? decodeURIComponent(ipCity)
      : null;

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main id="main-content" className="pt-24 min-h-screen">
        {/* 1. Hero - Core value proposition */}
        <HeroSection totalTrocas={totalTrocas} />
        {/* 2. Social Proof - Build trust */}
        <SocialProofSection />
        {/* 3. Features/Solution - How we solve it */}
        <FeaturesSection />
        {/* 4. How It Works - Reduce complexity */}
        <HowItWorksSection />
        {/* 5. Cities - Show where it works */}
        <CitiesSection />
        {/* 6. FAQ - Handle objections */}
        <FAQSection faqs={FAQ_DATA} />
        {/* 7. Final CTA - Capture remainders */}
        <FinalCTASection cityName={cityName} />
      </main>
      <LandingFooter />
    </>
  );
}
