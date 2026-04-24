"use client";

import { useEffect, useState } from "react";

const STICKER_LOADING_MESSAGES = [
  "Organizando seu álbum...",
  "Contando figurinhas...",
  "Preparando suas repetidas...",
  "Checando coleção...",
  "Atualizando progresso...",
];

const MATCH_LOADING_MESSAGES = [
  "Procurando colecionadores...",
  "Analisando trocas possíveis...",
  "Conectando com a comunidade...",
  "Buscando matches perfeitos...",
  "Calculando compatibilidade...",
];

const MAP_LOADING_MESSAGES = [
  "Localizando pontos de troca...",
  "Mapeando arenas próximas...",
  "Encontrando colecionadores ativos...",
  "Carregando mapa da Arena...",
];

const GENERAL_LOADING_MESSAGES = [
  "Preparando tudo...",
  "Quase lá...",
  "Carregando...",
  "Um momento...",
];

type MessageCategory = "sticker" | "match" | "map" | "general";

const MESSAGE_MAP: Record<MessageCategory, string[]> = {
  sticker: STICKER_LOADING_MESSAGES,
  match: MATCH_LOADING_MESSAGES,
  map: MAP_LOADING_MESSAGES,
  general: GENERAL_LOADING_MESSAGES,
};

interface LoadingMessageProps {
  category?: MessageCategory;
  interval?: number;
  className?: string;
}

export function LoadingMessage({
  category = "general",
  interval = 2500,
  className,
}: LoadingMessageProps) {
  const messages = MESSAGE_MAP[category];
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 200);
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, interval]);

  return (
    <span
      className={`inline-block transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"} ${className ?? ""}`}
    >
      {messages[index]}
    </span>
  );
}

export function getRandomMessage(category: MessageCategory = "general"): string {
  const messages = MESSAGE_MAP[category];
  return messages[Math.floor(Math.random() * messages.length)] as string;
}
