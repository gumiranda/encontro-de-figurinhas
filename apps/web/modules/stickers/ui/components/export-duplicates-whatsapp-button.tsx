"use client";

import { Button } from "@workspace/ui/components/button";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  buildDuplicatesWhatsAppText,
  openWhatsAppWithText,
} from "../../lib/build-duplicates-whatsapp-text";
import type { Section } from "../../lib/sticker-parser";

type Props = {
  sections: Section[];
  duplicateCounts: Map<number, number>;
  disabled?: boolean;
  className?: string;
};

export function ExportDuplicatesWhatsAppButton({
  sections,
  duplicateCounts,
  disabled,
  className,
}: Props) {
  const count = duplicateCounts.size;

  const handleClick = () => {
    const text = buildDuplicatesWhatsAppText({ sections, duplicateCounts });
    if (!text) {
      toast.info("Nenhuma figurinha repetida cadastrada");
      return;
    }
    openWhatsAppWithText(text);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={disabled || count === 0}
      onClick={handleClick}
      className={className}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      WhatsApp ({count})
    </Button>
  );
}
