"use client";

import { Separator } from "@workspace/ui/components/separator";
import { DataExportCard } from "./data-export-card";
import { AccountDeletionCard } from "./account-deletion-card";
import { CookiePreferencesCard } from "./cookie-preferences-card";

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">
          Ajustes
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências de privacidade e dados
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-headline text-xl font-semibold">Privacidade</h2>
        <CookiePreferencesCard />
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-headline text-xl font-semibold">Seus Dados</h2>
        <DataExportCard />
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-headline text-xl font-semibold">Conta</h2>
        <AccountDeletionCard />
      </section>
    </div>
  );
}
