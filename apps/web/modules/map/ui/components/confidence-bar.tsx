export function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, score * 10));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={10}
      aria-valuenow={score}
      aria-label={`Confiança ${score.toFixed(1)} de 10`}
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
    >
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
