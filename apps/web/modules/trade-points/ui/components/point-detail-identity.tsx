"use client";

import { memo } from "react";
import Link from "next/link";
import { ChevronRight, Clock, MapPin } from "lucide-react";

type PointDetailIdentityProps = {
  name: string;
  address: string;
  cityName: string | null;
  suggestedHours?: string;
};

export const PointDetailIdentity = memo(function PointDetailIdentity({
  name,
  address,
  cityName,
  suggestedHours,
}: PointDetailIdentityProps) {
  return (
    <section className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="space-y-2">
        <nav
          className="mb-4 flex items-center gap-2 text-sm font-medium text-on-surface-variant"
          aria-label="Navegação"
        >
          <Link href="/meus-pontos" className="hover:text-primary">
            Meus pontos
          </Link>
          <ChevronRight className="size-4 shrink-0 opacity-70" aria-hidden />
          <span className="text-primary">Status do ponto</span>
        </nav>
        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-foreground">
          {name}
        </h1>
        <p className="flex items-center gap-2 text-on-surface-variant">
          <MapPin className="size-4 shrink-0" aria-hidden />
          <span>
            {address}
            {cityName ? ` — ${cityName}` : ""}
          </span>
        </p>
        {suggestedHours ? (
          <p className="flex items-center gap-2 text-on-surface-variant">
            <Clock className="size-4 shrink-0" aria-hidden />
            <span>{suggestedHours}</span>
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3 self-start rounded-full border border-secondary/20 bg-secondary/10 px-6 py-3 md:self-center">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
        </span>
        <span className="font-headline text-sm font-bold uppercase tracking-widest text-secondary">
          Ativo
        </span>
      </div>
    </section>
  );
});
