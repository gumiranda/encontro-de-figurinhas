"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useCookieConsent } from "./cookie-consent-provider";

export function CookieConsentBanner() {
  const { consentStatus, isLoading, acceptCookies, rejectCookies } =
    useCookieConsent();

  if (isLoading || consentStatus !== null) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="mx-auto max-w-2xl border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Cookies e Privacidade</CardTitle>
          <CardDescription>
            Usamos cookies de análise para melhorar sua experiência. Seus dados
            são tratados conforme a LGPD.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground">
            Ao aceitar, você permite o uso de cookies de análise (Vercel
            Analytics). Você pode alterar sua preferência a qualquer momento em{" "}
            <Link href="/ajustes" className="underline hover:text-foreground">
              Ajustes
            </Link>
            . Saiba mais em nossa{" "}
            <Link
              href="/privacidade"
              className="underline hover:text-foreground"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={rejectCookies}
            className="w-full sm:w-auto"
          >
            Recusar
          </Button>
          <Button onClick={acceptCookies} className="w-full sm:w-auto">
            Aceitar cookies
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
