"use client";

import { CreditCard, IdCard, LayoutTemplate } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import type { HeroVariant } from "./profile-hero";

type HeroVariantSelectorProps = {
  value: HeroVariant;
  onChange: (variant: HeroVariant) => void;
};

const VARIANTS: {
  value: HeroVariant;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    value: "trading-card",
    label: "Trading card",
    description: "Estilo figurinha com efeito holográfico",
    icon: CreditCard,
  },
  {
    value: "banner",
    label: "Banner social",
    description: "Layout horizontal para compartilhar",
    icon: LayoutTemplate,
  },
  {
    value: "credential",
    label: "Credencial",
    description: "Com QR code embutido",
    icon: IdCard,
  },
];

export function HeroVariantSelector({ value, onChange }: HeroVariantSelectorProps) {
  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-base">Estilo do perfil</CardTitle>
        <CardDescription>Como seu perfil aparece para outros</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {VARIANTS.map((variant) => {
            const Icon = variant.icon;
            const isSelected = value === variant.value;

            return (
              <button
                key={variant.value}
                type="button"
                onClick={() => onChange(variant.value)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-surface-container-high hover:border-white/20"
                )}
              >
                <div
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    isSelected
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-container-highest text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{variant.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {variant.description}
                  </div>
                </div>
                <div
                  className={cn(
                    "size-4 shrink-0 rounded-full border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-outline-variant"
                  )}
                >
                  {isSelected && (
                    <div className="size-full rounded-full bg-on-primary scale-50" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
