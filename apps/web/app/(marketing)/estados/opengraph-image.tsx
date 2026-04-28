import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Estados com Troca de Figurinhas Copa 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>📍</div>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          Estados com Troca de Figurinhas
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            marginTop: 16,
          }}
        >
          Copa 2026 • Figurinha Fácil
        </p>
      </div>
    ),
    { ...size }
  );
}
