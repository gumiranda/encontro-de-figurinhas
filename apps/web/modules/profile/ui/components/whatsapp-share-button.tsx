"use client";

import { Button } from "@workspace/ui/components/button";
import { Share2 } from "lucide-react";

type Props = {
  displayNickname: string;
  nickname: string;
  duplicatesCount: number;
  albumCompletionPct: number;
};

export function WhatsAppShareButton({
  displayNickname,
  nickname,
  duplicatesCount,
  albumCompletionPct,
}: Props) {
  const shareText = [
    `🏆 Figurinhas do @${displayNickname}!`,
    `📊 Álbum: ${albumCompletionPct.toFixed(1)}% completo`,
    `🔄 ${duplicatesCount} repetidas disponíveis`,
    ``,
    `Veja: https://figurinhafacil.com.br/u/${nickname}`,
  ].join("\n");

  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white">
      <a href={shareUrl} target="_blank" rel="noopener noreferrer">
        <Share2 className="size-4 mr-2" />
        Compartilhar no WhatsApp
      </a>
    </Button>
  );
}
