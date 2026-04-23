"use client";

import { memo } from "react";
import { MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

type WhatsappState =
  | { state: "ok"; link: string }
  | { state: "blocked-link-invalid" }
  | { state: "blocked-minor" }
  | { state: "blocked-not-participant" };

type WhatsappButtonProps = {
  whatsapp: WhatsappState;
  /** `card` = cartão gradiente do mock ponto-detalhe; `inline` = CTA full-width padrão */
  layout?: "card" | "inline";
};

const TOOLTIP_BY_STATE: Record<
  Exclude<WhatsappState["state"], "ok" | "blocked-not-participant">,
  string
> = {
  "blocked-link-invalid": "Link sendo verificado",
  "blocked-minor": "Aguardando consentimento parental",
};

export const WhatsappButton = memo(function WhatsappButton({
  whatsapp,
  layout = "inline",
}: WhatsappButtonProps) {
  if (whatsapp.state === "blocked-not-participant") {
    return null;
  }

  if (whatsapp.state === "ok") {
    if (layout === "card") {
      return (
        <a
          href={whatsapp.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-[#128C7E] to-[#075E54] p-6 text-white shadow-lg transition-transform hover:scale-[1.02]"
        >
          <div className="rounded-full bg-white/20 p-3 transition-colors group-hover:bg-white/30">
            <MessageCircle className="size-8 shrink-0" aria-hidden />
          </div>
          <div className="text-center">
            <h4 className="font-headline text-lg font-extrabold uppercase leading-none">
              Grupo de trocas
            </h4>
            <p className="mt-1 text-xs text-white/80">Acesso exclusivo aprovado</p>
          </div>
          <span className="w-full rounded-xl bg-white py-2 text-center text-sm font-bold uppercase tracking-wider text-[#075E54] shadow-md transition active:scale-95">
            Entrar agora
          </span>
        </a>
      );
    }
    return (
      <a
        href={whatsapp.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--whatsapp-brand)] px-4 py-5 text-white shadow-lg transition-colors hover:bg-[var(--whatsapp-brand-dark)]"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
        <span className="font-headline text-lg font-black uppercase italic tracking-wide">
          Entrar no grupo do WhatsApp
        </span>
      </a>
    );
  }

  const blockedCard =
    layout === "card" ? (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface-container-high p-6 opacity-80">
        <div className="rounded-full bg-muted p-3">
          <MessageCircle className="size-8 shrink-0 text-muted-foreground" aria-hidden />
        </div>
        <div className="text-center">
          <h4 className="font-headline text-lg font-extrabold uppercase text-muted-foreground">
            Grupo de trocas
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">WhatsApp indisponível</p>
        </div>
        <span className="w-full rounded-xl border border-border py-2 text-center text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Indisponível
        </span>
      </div>
    ) : (
      <button
        type="button"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-5 text-sm font-medium text-secondary-foreground opacity-80"
        disabled
        aria-disabled
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
        WhatsApp indisponível
      </button>
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block w-full">{blockedCard}</span>
        </TooltipTrigger>
        <TooltipContent>{TOOLTIP_BY_STATE[whatsapp.state]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
