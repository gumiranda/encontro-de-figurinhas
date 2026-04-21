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
}: WhatsappButtonProps) {
  if (whatsapp.state === "blocked-not-participant") {
    return null;
  }

  if (whatsapp.state === "ok") {
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block w-full">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-5 text-sm font-medium text-secondary-foreground opacity-80"
              disabled
              aria-disabled
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              WhatsApp indisponível
            </button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{TOOLTIP_BY_STATE[whatsapp.state]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
