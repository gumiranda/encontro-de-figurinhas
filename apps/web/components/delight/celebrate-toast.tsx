"use client";

import { toast } from "sonner";
import { createElement } from "react";
import { Trophy, Sparkles, PartyPopper, Star, Rocket, Target, Medal } from "lucide-react";

type CelebrationLevel = "small" | "medium" | "big";

interface CelebrateOptions {
  level?: CelebrationLevel;
  description?: string;
  duration?: number;
}

const ICONS = {
  small: Sparkles,
  medium: PartyPopper,
  big: Trophy,
};

const CELEBRATION_EMOJIS = {
  small: ["", "", ""],
  medium: ["", "", ""],
  big: ["", "", ""],
};

function getRandomEmoji(level: CelebrationLevel): string {
  const emojis = CELEBRATION_EMOJIS[level];
  return emojis[Math.floor(Math.random() * emojis.length)] ?? "";
}

export function celebrateToast(message: string, options: CelebrateOptions = {}) {
  const { level = "small", description, duration = 4000 } = options;
  const Icon = ICONS[level];
  const emoji = getRandomEmoji(level);

  toast.success(message, {
    description: description ? `${emoji} ${description}` : undefined,
    duration,
    icon: createElement(Icon, {
      className: `h-5 w-5 ${level === "big" ? "text-tertiary animate-shake-celebrate" : level === "medium" ? "text-secondary" : "text-primary"}`,
    }),
    classNames: {
      toast: level === "big" ? "animate-bounce-in" : undefined,
    },
  });
}

export const celebrationMessages = {
  profileComplete: {
    title: "Perfil completo!",
    description: "Bem-vindo à Arena. Hora de trocar!",
    level: "medium" as const,
  },
  firstStickers: {
    title: "Primeiras figurinhas cadastradas!",
    description: "Seu álbum está tomando forma.",
    level: "small" as const,
  },
  sectionComplete: {
    title: "Seção completa!",
    description: "Continue assim, você está arrasando!",
    level: "medium" as const,
  },
  albumHalfway: {
    title: "Metade do álbum!",
    description: "Você passou dos 50%. A reta final!",
    level: "big" as const,
  },
  albumComplete: {
    title: "ÁLBUM COMPLETO!",
    description: "Você é um verdadeiro campeão!",
    level: "big" as const,
  },
  firstMatch: {
    title: "Primeiro match!",
    description: "Alguém tem o que você precisa.",
    level: "medium" as const,
  },
  checkIn: {
    title: "Check-in confirmado!",
    description: "Você está na arena. Boas trocas!",
    level: "small" as const,
  },
  tradePointJoined: {
    title: "Você entrou no ponto!",
    description: "Agora é só combinar as trocas.",
    level: "small" as const,
  },
};

export function celebrateMilestone(
  milestone: keyof typeof celebrationMessages
): void {
  const { title, description, level } = celebrationMessages[milestone];
  celebrateToast(title, { description, level });
}
