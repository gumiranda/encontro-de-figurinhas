"use client";

import { memo } from "react";
import { AlertTriangle, BarChart3, Rocket, ShieldCheck, Timer } from "lucide-react";

/** Timeline estático para pontos aprovados — alinhado ao mock em docs/design/9-ponto-detalhe */
export const PointLifecycleCard = memo(function PointLifecycleCard() {
  return (
    <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-6 shadow-xl">
      <h3 className="mb-8 flex items-center gap-2 font-headline text-xl font-bold text-foreground">
        <BarChart3 className="size-6 shrink-0 text-primary" aria-hidden />
        Ciclo de vida do ponto
      </h3>
      <div className="relative space-y-8">
        <div
          className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-outline-variant/30"
          aria-hidden
        />

        <div className="relative flex gap-6">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-[0_0_15px_rgba(149,170,255,0.4)]">
            <Timer className="size-5 text-on-primary" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-headline text-lg font-bold text-primary">
              Pendente
            </p>
            <p className="text-sm text-on-surface-variant">
              Localização enviada para revisão da curadoria.
            </p>
            <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-outline">
              Concluído
            </span>
          </div>
        </div>

        <div className="relative flex gap-6">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-[0_0_15px_rgba(149,170,255,0.4)]">
            <ShieldCheck className="size-5 text-on-primary" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-headline text-lg font-bold text-primary">
              Aprovado
            </p>
            <p className="text-sm text-on-surface-variant">
              Link do WhatsApp integrado por administrador.
            </p>
            <span className="mt-2 block text-[10px] font-bold uppercase tracking-wider text-outline">
              Concluído
            </span>
          </div>
        </div>

        <div className="relative flex gap-6">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary shadow-[0_0_15px_rgba(79,243,37,0.4)]">
            <Rocket className="size-5 text-on-secondary" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-headline text-lg font-bold text-secondary">
              Ativo
            </p>
            <p className="text-sm font-medium text-foreground">
              Pronto para receber check-ins e trocas.
            </p>
            <span className="mt-2 block text-[10px] font-bold uppercase italic tracking-wider text-secondary">
              Status atual
            </span>
          </div>
        </div>

        <div className="relative flex gap-6 opacity-40">
          <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest">
            <AlertTriangle className="size-5 text-outline" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-headline text-lg font-bold text-on-surface-variant">
              Suspenso
            </p>
            <p className="text-sm text-on-surface-variant">
              Alerta de segurança se houver +3 denúncias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
