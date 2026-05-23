"use client";

import { GepetoAvatar } from "./gepeto-avatar";

function BoloesFeature() {
  const leaderboard = [
    { rank: 1, name: "thiagomb", pts: 312 },
    { rank: 2, name: "Gepeto", pts: 298, isAI: true },
    { rank: 3, name: "miltonfigueira", pts: 281, isMe: true },
  ];

  return (
    <div className="flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/5 to-transparent p-7">
      <div className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
        BOLÕES
      </div>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">
        Crie um bolão entre amigos. Gepeto vai junto.
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        Convite com código de 6 letras. Gepeto entra como adversário comum.
        Ranking, atividade, cutucadas, multiplicadores de mata-mata.
      </p>

      <div className="mt-auto space-y-1.5 pt-6">
        {leaderboard.map((u) => (
          <div
            key={u.rank}
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-xl border px-3 py-2 ${
              u.isMe
                ? "border-primary bg-primary/10"
                : "border-border bg-muted/50"
            }`}
          >
            <div
              className={`font-mono text-xs font-bold ${
                u.rank === 1 ? "text-amber-400" : "text-muted-foreground"
              }`}
            >
              #{u.rank}
            </div>
            <div className="flex items-center gap-2">
              {u.isAI && <GepetoAvatar size={20} mood="smug" glow={false} />}
              <span
                className={`text-xs font-semibold ${
                  u.isMe ? "text-primary" : ""
                }`}
              >
                {u.isAI ? "Gepeto" : `@${u.name}`}
              </span>
            </div>
            <div className="font-mono text-xs font-bold">{u.pts}pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VsIAFeature() {
  return (
    <div className="flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-400/5 to-transparent p-7">
      <div className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
        VS IA
      </div>
      <h3 className="mt-2 font-display text-xl font-bold tracking-tight">
        "Bati a IA" virou status.
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        Cada rodada que você bate o Gepeto vira badge. Compartilhe a streak no
        grupo do WhatsApp.
      </p>

      <div className="mt-auto pt-6">
        <div className="rounded-2xl border border-emerald-400 bg-gradient-to-r from-emerald-400/15 to-emerald-400/5 px-3.5 py-5 text-center">
          <div className="text-4xl">🏆</div>
          <div className="mt-1.5 font-display text-sm font-semibold">
            Você bateu a IA
          </div>
          <div className="mt-1 text-[11px] text-emerald-300">
            streak 7🔥 · +10 pts
          </div>
        </div>
      </div>
    </div>
  );
}

function CapituloFeature() {
  return (
    <div className="flex min-h-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-amber-400/5 to-transparent p-7">
      <div className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
        CAPÍTULO SEMANAL
      </div>
      <h3 className="mt-2 font-display text-xl font-bold tracking-tight">
        A novela do Gepeto.
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
        Toda semana um capítulo com placar, trash-talk e análise. Conteúdo SEO
        indexado.
      </p>

      <div className="mt-auto pt-6">
        <div className="rounded-xl border border-border bg-slate-950/55 p-3.5">
          <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
            CAP 03 · QUARTAS
          </div>
          <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="text-center">
              <div className="font-display text-2xl font-bold text-amber-400">
                11
              </div>
              <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
                GEPETO
              </div>
            </div>
            <div className="text-muted-foreground">×</div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold">9</div>
              <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
                HUMANOS
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturesGrid() {
  return (
    <section className="border-t border-border py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 max-w-xl">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-400">
            O QUE TEM DENTRO
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Não é só um placar. É a sua copa.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1 lg:row-span-1">
            <BoloesFeature />
          </div>
          <VsIAFeature />
          <CapituloFeature />
        </div>
      </div>
    </section>
  );
}
