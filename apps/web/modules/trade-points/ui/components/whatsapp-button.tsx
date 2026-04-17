"use client";

import { memo } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

type WhatsappState =
  | { state: "ok"; link: string }
  | { state: "blocked-link-invalid" }
  | { state: "blocked-minor" };

type WhatsappButtonProps = {
  whatsapp: WhatsappState;
};

const TOOLTIP_BY_STATE: Record<
  Exclude<WhatsappState["state"], "ok">,
  string
> = {
  "blocked-link-invalid": "Link sendo verificado",
  "blocked-minor": "Aguardando consentimento parental",
};

export const WhatsappButton = memo(function WhatsappButton({
  whatsapp,
}: WhatsappButtonProps) {
  if (whatsapp.state === "ok") {
    return (
      <Button
        asChild
        size="lg"
        className="w-full bg-green-600 text-white shadow-lg shadow-green-500/30 hover:bg-green-700"
      >
        <a href={whatsapp.link} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="mr-2 h-5 w-5" />
          Entrar no grupo do WhatsApp
        </a>
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="block w-full">
            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              disabled
              aria-disabled
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp indisponível
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{TOOLTIP_BY_STATE[whatsapp.state]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
