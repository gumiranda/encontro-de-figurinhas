import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Vencedor — Jogo Mais Chato";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ rodada: string }>;
}) {
  const { rodada } = await params;
  const round = await fetchQuery(api.boringGame.getRoundBySlug, {
    slug: rodada,
  });

  let winner: {
    homeTeamFlag: string;
    homeTeamName: string;
    awayTeamFlag: string;
    awayTeamName: string;
    totalVotes: number;
  } | null = null;
  let total = 0;
  let pct = 0;

  if (round) {
    const matches = await fetchQuery(api.boringGame.getRoundResult, {
      roundId: round._id,
    });
    total = matches.reduce((acc, m) => acc + m.totalVotes, 0);
    if (matches[0]) {
      winner = {
        homeTeamFlag: matches[0].homeTeamFlag,
        homeTeamName: matches[0].homeTeamName,
        awayTeamFlag: matches[0].awayTeamFlag,
        awayTeamName: matches[0].awayTeamName,
        totalVotes: matches[0].totalVotes,
      };
      pct = total > 0 ? Math.round((matches[0].totalVotes / total) * 100) : 0;
    }
  }

  const roundName = round?.name ?? "Copa 2026";

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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#ffc965",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {`● VENCEDOR · ${roundName}`}
        </div>

        {winner ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 40,
                marginTop: 30,
              }}
            >
              <div style={{ fontSize: 130 }}>{winner.homeTeamFlag}</div>
              <div style={{ fontSize: 70, color: "#ffc965", fontWeight: 800 }}>
                ×
              </div>
              <div style={{ fontSize: 130 }}>{winner.awayTeamFlag}</div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 48,
                fontWeight: 800,
                textAlign: "center",
              }}
            >
              {`${winner.homeTeamName} × ${winner.awayTeamName}`}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 32,
                background: "#ffc965",
                color: "#0b1020",
                padding: "20px 48px",
                borderRadius: 24,
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: 3,
              }}
            >
              {`${pct}% · OFICIALMENTE CHATO`}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 16,
                fontSize: 22,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {`${winner.totalVotes.toLocaleString("pt-BR")} votos`}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 56, fontWeight: 800, marginTop: 30 }}>
            Sem votos ainda
          </div>
        )}

        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 40,
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
