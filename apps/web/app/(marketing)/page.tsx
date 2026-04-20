import type { Metadata } from "next";
import { Suspense } from "react";
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

async function DynamicFinalCTA() {
  const h = await headers();
  const ua = h.get("user-agent") ?? "";
  const ipCity = h.get("x-vercel-ip-city");
  const cityName = isbot(ua)
    ? null
    : ipCity
      ? decodeURIComponent(ipCity)
      : null;

  return <FinalCTASection cityName={cityName} />;
}

function FinalCTASkeleton() {
  return (
    <section className="px-4 py-32 sm:px-6 md:py-40 relative overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-on-primary/10 text-on-primary/90 text-[0.625rem] font-medium uppercase tracking-[0.15em] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          Contagem regressiva
        </span>
        <div className="h-12 md:h-14 lg:h-16 bg-on-primary/10 rounded-lg animate-pulse mb-6 max-w-xl mx-auto" />
        <p className="text-on-primary/80 text-base md:text-lg mb-12 max-w-lg mx-auto leading-[1.7]">
          Enquanto você espera, alguém está trocando. Entre agora e complete seu álbum.
        </p>
        <div className="flex justify-center">
          <div className="h-14 w-64 bg-on-primary/20 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const totalTrocas = null;

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
        {/* 7. Final CTA - Capture remainders (dynamic - streams in) */}
        <Suspense fallback={<FinalCTASkeleton />}>
          <DynamicFinalCTA />
        </Suspense>
      </main>
      <LandingFooter />
    </>
  );
}
