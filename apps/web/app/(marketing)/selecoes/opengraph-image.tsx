import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Seleções da Copa 2026 - Todas as Figurinhas";
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
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>⚽</div>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          48 Seleções da Copa 2026
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            marginTop: 16,
          }}
        >
          Todas as Figurinhas • Figurinha <span style={{ color: "#87d400" }}>Fácil</span>
        </p>
      </div>
    ),
    { ...size }
  );
}
