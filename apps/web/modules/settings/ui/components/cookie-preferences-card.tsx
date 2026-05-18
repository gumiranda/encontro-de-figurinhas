"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { useCookieConsent } from "@/components/cookie-consent-provider";
import { Cookie, Check, X } from "lucide-react";

export function CookiePreferencesCard() {
  const { consentStatus, acceptCookies, rejectCookies, resetConsent } =
    useCookieConsent();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cookies</CardTitle>
        <CardDescription>
          Gerencie suas preferências de cookies de análise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cookie className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Cookies de análise (Vercel Analytics)</span>
          </div>
          <Badge
            variant={
              consentStatus === "accepted"
                ? "default"
                : consentStatus === "rejected"
                  ? "secondary"
                  : "outline"
            }
          >
            {consentStatus === "accepted" && (
              <>
                <Check className="mr-1 h-3 w-3" />
                Aceito
              </>
            )}
            {consentStatus === "rejected" && (
              <>
                <X className="mr-1 h-3 w-3" />
                Recusado
              </>
            )}
            {consentStatus === null && "Não definido"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {consentStatus !== "accepted" && (
            <Button variant="outline" size="sm" onClick={acceptCookies}>
              Aceitar cookies
            </Button>
          )}
          {consentStatus !== "rejected" && (
            <Button variant="outline" size="sm" onClick={rejectCookies}>
              Recusar cookies
            </Button>
          )}
          {consentStatus !== null && (
            <Button variant="ghost" size="sm" onClick={resetConsent}>
              Redefinir preferência
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Cookies de análise nos ajudam a entender como você usa o site para
          melhorar a experiência. Seus dados são tratados conforme nossa{" "}
          <a href="/privacidade" className="underline hover:text-foreground">
            Política de Privacidade
          </a>
          .
        </p>
      </CardContent>
    </Card>
  );
}
