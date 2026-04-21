"use client";

import { MatchesSection } from "@/modules/trade-points/ui/components/matches-section";
import { PeakHoursChart } from "@/modules/trade-points/ui/components/peak-hours-chart";
import { PointHeader } from "@/modules/trade-points/ui/components/point-header";
import { PointHero } from "@/modules/trade-points/ui/components/point-hero";
import { WhatsappButton } from "@/modules/trade-points/ui/components/whatsapp-button";

const lat = -23.55052;
const lng = -46.633308;

const scores = [1.2, 5.4, 9.2] as const;

export default function TradePointLeafDevPage() {
  const lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="mx-auto max-w-lg space-y-10 px-4 py-8">
      <header className="space-y-1">
        <h1 className="font-headline text-xl font-bold">Trade point leaf UI</h1>
        <p className="text-sm text-muted-foreground">
          Hero, header, WhatsApp, matches (vazio/N), horários (24 barras).
          PointActions com Convex — não incluído aqui.
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          PointHero
        </h2>
        {scores.map((confidenceScore) => (
          <div key={confidenceScore} className="space-y-2">
            <p className="text-xs text-muted-foreground">
              confidenceScore = {confidenceScore}
            </p>
            <PointHero
              name="Ponto preview"
              lat={lat}
              lng={lng}
              confidenceScore={confidenceScore}
            />
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          PointHeader
        </h2>
        {scores.map((confidenceScore) => (
          <div key={confidenceScore} className="space-y-2 rounded-xl border border-border/60 p-2">
            <p className="px-2 text-xs text-muted-foreground">
              score {confidenceScore} · check-ins &amp; afluência variam
            </p>
            <PointHeader
              name="Arena Paulista"
              address="Av. Paulista, 1000 — Bela Vista"
              suggestedHours="Sáb 10h–18h"
              cityName="São Paulo"
              confidenceScore={confidenceScore}
              activeCheckinsCount={confidenceScore < 3 ? 1 : 12}
              lastActivityAt={lastWeek}
              participantCount={42}
            />
          </div>
        ))}
        <div className="space-y-2 rounded-xl border border-dashed border-border/80 p-2">
          <p className="px-2 text-xs text-muted-foreground">
            Sem lastActivityAt → &quot;Sem atividade&quot;
          </p>
          <PointHeader
            name="Sem atividade"
            address="Rua Exemplo, 1"
            cityName={null}
            confidenceScore={4}
            activeCheckinsCount={0}
            lastActivityAt={undefined}
            participantCount={0}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          WhatsappButton
        </h2>
        <WhatsappButton
          whatsapp={{ state: "ok", link: "https://wa.me/5511999999999" }}
        />
        <WhatsappButton whatsapp={{ state: "blocked-link-invalid" }} />
        <WhatsappButton whatsapp={{ state: "blocked-minor" }} />
        <div className="rounded-lg border border-border/50 p-3 text-sm text-muted-foreground">
          <code>blocked-not-participant</code> →{" "}
          <span className="text-foreground">null</span> (nada abaixo)
        </div>
        <WhatsappButton whatsapp={{ state: "blocked-not-participant" }} />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          PeakHoursChart
        </h2>
        <p className="text-xs text-muted-foreground">Sem dados</p>
        <PeakHoursChart peakHours={undefined} />
        <p className="text-xs text-muted-foreground">Array curto + picos</p>
        <PeakHoursChart
          peakHours={[0, 0, 2, 0, 0, 0, 1, 3, 8, 12, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          MatchesSection
        </h2>
        <MatchesSection tradePointId="preview" matchCount={0} />
        <MatchesSection tradePointId="preview" matchCount={4} />
      </section>
    </div>
  );
}
