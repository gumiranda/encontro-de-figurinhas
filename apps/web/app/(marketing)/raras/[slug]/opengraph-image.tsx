import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Figurinhas Raras Copa 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = await fetchQuery(api.album.getSectionBySlug, { slug });

  const teamName = section?.name ?? "Seleção";
  const flag = section?.flagEmoji ?? "🏆";
  const legendCount = section?.legendNumbers.length ?? 0;
  const goldenCount = section?.goldenNumbers.length ?? 0;
  const rareTotal = legendCount + goldenCount;

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
            "linear-gradient(135deg, #f59e0b 0%, #d97706 40%, #7c3aed 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 110,
            marginBottom: 12,
          }}
        >
          {flag}
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          🔥 Figurinhas Raras
        </h1>

        <h2
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: "white",
            margin: "12px 0 0 0",
            textAlign: "center",
          }}
        >
          {teamName}
        </h2>

        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "18px 32px",
              borderRadius: 14,
              color: "#7c3aed",
              fontSize: 28,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ✨ {legendCount} Lendas
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "18px 32px",
              borderRadius: 14,
              color: "#d97706",
              fontSize: 28,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ⭐ {goldenCount} Douradas
          </div>
        </div>

        <p
          style={{
            fontSize: 26,
            color: "rgba(255, 255, 255, 0.95)",
            margin: "32px 0 0 0",
            fontWeight: 600,
          }}
        >
          {rareTotal} raras • Copa do Mundo 2026
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
