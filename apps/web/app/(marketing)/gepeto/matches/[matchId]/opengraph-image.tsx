import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

export const runtime = "edge";
export const alt = "Gepeto - Palpite IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { matchId: string };
}) {
  const matchId = params.matchId as Id<"worldCupMatches">;
  let match;

  try {
    match = await fetchQuery(api.boringGame.getMatch, { matchId });
  } catch {
    match = null;
  }

  if (!match) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(135deg, #090e1c 0%, #181f33 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e1e4fa",
            fontSize: 48,
          }}
        >
          Jogo não encontrado
        </div>
      ),
      { ...size },
    );
  }

  const prediction = await fetchQuery(api.gepeto.getAIPrediction, {
    matchId,
  });

  const predictionText = prediction
    ? prediction.prediction === "home"
      ? match.homeTeamName
      : prediction.prediction === "away"
        ? match.awayTeamName
        : "Empate"
    : "Em análise...";

  const scoreText = prediction
    ? `${prediction.exactScore.home} x ${prediction.exactScore.away}`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #090e1c 0%, #181f33 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Inter, sans-serif",
          color: "#e1e4fa",
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#95aaff",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          🤖 Gepeto prevê
        </div>

        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span>{match.homeTeamFlag}</span>
          <span>{match.homeTeamName}</span>
          <span style={{ color: "#6b7280" }}>vs</span>
          <span>{match.awayTeamName}</span>
          <span>{match.awayTeamFlag}</span>
        </div>

        <div
          style={{
            fontSize: 42,
            color: "#4ff325",
            fontWeight: 600,
            padding: "12px 32px",
            background: "rgba(79, 243, 37, 0.1)",
            borderRadius: 12,
            marginBottom: 16,
          }}
        >
          {predictionText} {scoreText && `(${scoreText})`}
        </div>

        {prediction && (
          <div style={{ fontSize: 22, color: "#a6aabf" }}>
            {prediction.confidence}% confiança
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 18,
            color: "#6b7280",
          }}
        >
          figurinhafacil.com.br/gepeto
        </div>
      </div>
    ),
    { ...size },
  );
}
