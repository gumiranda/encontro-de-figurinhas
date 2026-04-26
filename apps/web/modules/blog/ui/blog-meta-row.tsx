import { Calendar, Clock, Eye } from "lucide-react";

interface BlogMetaRowProps {
  publishedAt?: number;
  readingTime: number;
  views?: number;
  className?: string;
}

function formatCompact(n: number): string {
  if (n >= 10000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

function formatPostDate(ms: number): { iso: string; label: string } {
  const d = new Date(ms);
  const dayMonth = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  })
    .format(d)
    .replace(".", "");
  return {
    iso: d.toISOString(),
    label: `${dayMonth} · ${d.getFullYear()}`,
  };
}

export function BlogMetaRow({
  publishedAt,
  readingTime,
  views,
  className,
}: BlogMetaRowProps) {
  const date = publishedAt ? formatPostDate(publishedAt) : null;
  return (
    <div
      className={`flex items-center gap-5 flex-wrap text-sm text-muted-foreground ${className ?? ""}`}
    >
      {date && (
        <span className="flex items-center gap-1.5">
          <Calendar className="size-4" aria-hidden />
          <time dateTime={date.iso}>{date.label}</time>
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <Clock className="size-4" aria-hidden />
        {readingTime} min de leitura
      </span>
      {typeof views === "number" && views > 0 && (
        <span className="flex items-center gap-1.5" aria-label={`${views} visualizações`}>
          <Eye className="size-4" aria-hidden />
          {formatCompact(views)}
        </span>
      )}
    </div>
  );
}
