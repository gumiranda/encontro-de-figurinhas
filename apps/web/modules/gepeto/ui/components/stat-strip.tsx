"use client";

interface StatProps {
  value: string;
  label: string;
  colorClass?: string;
}

function Stat({ value, label, colorClass = "text-foreground" }: StatProps) {
  return (
    <div>
      <div
        className={`font-display text-4xl font-bold tracking-tight ${colorClass}`}
      >
        {value}
      </div>
      <div className="mt-1.5 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function StatStrip() {
  return (
    <section className="border-y border-border bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          <Stat value="74%" label="acertos do Gepeto" colorClass="text-amber-400" />
          <Stat value="42" label="jogos analisados" colorClass="text-primary" />
          <Stat value="1.2K" label="bolões ativos" colorClass="text-emerald-400" />
          <Stat value="8.9K" label="usuários no Vs IA" colorClass="text-foreground" />
        </div>
      </div>
    </section>
  );
}
