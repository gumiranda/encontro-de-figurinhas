"use client";

import { LandingHeader } from "../components/landing-header";
import { HeroSection } from "../components/hero-section";
import { CitiesSection } from "../components/cities-section";
import { FeaturesSection } from "../components/features-section";
import { LandingFooter } from "../components/landing-footer";

interface LandingViewProps {
  totalTrocas?: string | null;
}

export function LandingView({ totalTrocas }: LandingViewProps) {
  return (
    <>
      <LandingHeader />
      <main id="main-content" className="pt-24 min-h-screen">
        <HeroSection totalTrocas={totalTrocas} />
        <CitiesSection />
        <FeaturesSection />
      </main>
      <LandingFooter />
    </>
  );
}
