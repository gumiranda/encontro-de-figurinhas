"use client";

import { memo } from "react";
import { Heart } from "lucide-react";

type ConfidenceGaugeCardProps = {
  /** Score 0–10 (schema do ponto) */
  confidenceScore: number;
};

const R = 58;
const CIRC = 2 * Math.PI * R;

export const ConfidenceGaugeCard = memo(function ConfidenceGaugeCard({
  confidenceScore,
}: ConfidenceGaugeCardProps) {
  const pct = Math.min(10, Math.max(0, confidenceScore)) / 10;
  const dashOffset = CIRC * (1 - pct);
  const display = Math.round(confidenceScore * 10);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-high p-6 text-center">
      <div className="pointer-events-none absolute top-0 right-0 p-4 opacity-10">
        <Heart className="size-16 text-foreground" strokeWidth={1.25} aria-hidden />
      </div>
      <h4 className="mb-4 font-headline text-sm font-bold uppercase tracking-widest text-outline">
        Saúde do ponto
      </h4>
      <div className="relative inline-flex items-center justify-center">
        <svg
          className="h-32 w-32 -rotate-90"
          viewBox="0 0 128 128"
          aria-hidden
        >
          <circle
            className="text-surface-container-highest"
            cx="64"
            cy="64"
            fill="transparent"
            r={R}
            stroke="currentColor"
            strokeWidth="8"
          />
          <circle
            className="text-secondary"
            cx="64"
            cy="64"
            fill="transparent"
            r={R}
            stroke="currentColor"
            strokeDasharray={String(CIRC)}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <span className="font-headline absolute text-3xl font-extrabold text-foreground">
          {display}
        </span>
      </div>
      <p className="mt-4 font-headline text-xs font-bold uppercase tracking-tighter text-secondary">
        Score de confiança
      </p>
      <p className="mt-2 px-4 text-xs text-on-surface-variant">
        Baseado em check-ins bem-sucedidos e avaliações.
      </p>
    </div>
  );
});
