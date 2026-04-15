const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

export function formatRelativeTime(timestamp: number): string {
  if (!Number.isFinite(timestamp) || timestamp <= 0) return "—";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 0) return "agora";
  if (seconds < 60) return rtf.format(-seconds, "second");
  if (seconds < 3600) return rtf.format(-Math.floor(seconds / 60), "minute");
  if (seconds < 86400) return rtf.format(-Math.floor(seconds / 3600), "hour");
  return rtf.format(-Math.floor(seconds / 86400), "day");
}
