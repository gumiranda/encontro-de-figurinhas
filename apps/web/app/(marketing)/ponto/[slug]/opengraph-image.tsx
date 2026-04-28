import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Ponto de Troca de Figurinhas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const point = await fetchQuery(api.tradePoints.getBySlug, { slug });

  const name = point?.name ?? "Ponto de Troca";
  const city = point?.city?.name ?? "";
  const state = point?.city?.state ?? "";
  const location = city && state ? `${city}, ${state}` : "Brasil";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            marginBottom: 16,
          }}
        >
          📍
        </div>

        <h1
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: "rgba(255, 255, 255, 0.9)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Ponto de Troca
        </h1>

        <h2
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            margin: "16px 0 0 0",
            textAlign: "center",
            maxWidth: "90%",
            lineHeight: 1.1,
          }}
        >
          {name}
        </h2>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 32,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "16px 28px",
            borderRadius: 12,
            color: "#6366f1",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          🗺️ {location}
        </div>

        <p
          style={{
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "28px 0 0 0",
            fontWeight: 600,
          }}
        >
          Troca de Figurinhas Copa 2026
        </p>

        <p
          style={{
            position: "absolute",
            bottom: 36,
            fontSize: 22,
            color: "rgba(255, 255, 255, 0.85)",
            fontWeight: 600,
          }}
        >
          figurinhafacil.com.br
        </p>
      </div>
    ),
    { ...size }
  );
}
