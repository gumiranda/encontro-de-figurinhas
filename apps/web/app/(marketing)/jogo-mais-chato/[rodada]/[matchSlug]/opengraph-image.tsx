import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Jogo Mais Chato — Copa 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ matchSlug: string }>;
}) {
  const { matchSlug } = await params;
  const data = await fetchQuery(api.boringGame.getMatchBySlug, {
    slug: matchSlug,
  });

  const home = data?.match.homeTeamName ?? "Time A";
  const homeFlag = data?.match.homeTeamFlag ?? "🏳️";
  const away = data?.match.awayTeamName ?? "Time B";
  const awayFlag = data?.match.awayTeamFlag ?? "🏳️";
  const totalVotes = data?.match.totalVotes ?? 0;
  const roundName = data?.round.name ?? "Copa 2026";

  const reasonCounts = data?.match.reasonCounts ?? {
    sem_chances: 0,
    jogo_truncado: 0,
    sem_estrelas: 0,
    placar_morno: 0,
    narrador_dormindo: 0,
    meme_potencial: 0,
  };
  const sumReasons = Object.values(reasonCounts).reduce((a, b) => a + b, 0);
  const topReason = (Object.entries(reasonCounts) as Array<[string, number]>)
    .sort(([, a], [, b]) => b - a)[0];
  const topReasonLabel: Record<string, string> = {
    sem_chances: "SEM CHANCES",
    jogo_truncado: "TRUNCADO",
    sem_estrelas: "SEM CRAQUES",
    placar_morno: "PLACAR MORNO",
    narrador_dormindo: "NARRADOR DORMIU",
    meme_potencial: "POTENCIAL DE MEME",
  };
  const topPct =
    sumReasons > 0 && topReason
      ? Math.round((topReason[1] / sumReasons) * 100)
      : 0;
  const topLabel = topReason ? topReasonLabel[topReason[0]] ?? "" : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0b1020",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: 60,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#ffc965",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {`● JOGO MAIS CHATO · ${roundName}`}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            marginTop: 40,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 140 }}>{homeFlag}</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{home}</div>
          </div>
          <div style={{ fontSize: 80, color: "#ffc965", fontWeight: 800 }}>
            ×
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div style={{ fontSize: 140 }}>{awayFlag}</div>
            <div style={{ fontSize: 36, fontWeight: 700 }}>{away}</div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 40,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 56, fontWeight: 800, color: "#ffc965" }}>
              {totalVotes.toLocaleString("pt-BR")}
            </div>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              VOTOS · JOGO CHATO
            </div>
          </div>
          {topLabel ? (
            <div
              style={{
                display: "flex",
                background: "#ffc965",
                color: "#0b1020",
                padding: "16px 28px",
                borderRadius: 16,
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              {`${topPct}% · ${topLabel}`}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          figurinhafacil.com.br/jogo-mais-chato
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    },
  );
}
