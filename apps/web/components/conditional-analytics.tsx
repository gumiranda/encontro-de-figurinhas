"use client";

import { Analytics } from "@vercel/analytics/next";
import { useCookieConsent } from "./cookie-consent-provider";

export function ConditionalAnalytics() {
  const { consentStatus } = useCookieConsent();

  if (consentStatus !== "accepted") {
    return null;
  }

  return <Analytics />;
}
