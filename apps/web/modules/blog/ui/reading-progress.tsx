"use client";

import { useReadingProgress } from "./reading-progress-provider";

export function ReadingProgress() {
  const progress = useReadingProgress();

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-muted/30"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso de leitura"
      aria-valuetext={`${progress}% lido`}
    >
      <div
        className="h-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
