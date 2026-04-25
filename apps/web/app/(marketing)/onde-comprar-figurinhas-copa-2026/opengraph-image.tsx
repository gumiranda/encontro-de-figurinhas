import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Onde Comprar Figurinhas Copa 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
            "linear-gradient(135deg, #10b981 0%, #6366f1 50%, #a855f7 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 100,
            marginBottom: 12,
          }}
        >
          🛒
        </div>

        <h1
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Onde Comprar
        </h1>

        <h2
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: "white",
            margin: "8px 0 0 0",
            textAlign: "center",
            letterSpacing: -1,
          }}
        >
          Figurinhas Copa 2026
        </h2>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 44,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "16px 28px",
              borderRadius: 12,
              color: "#0f172a",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            📦 Pacotes
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "16px 28px",
              borderRadius: 12,
              color: "#0f172a",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            🏪 Bancas
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              padding: "16px 28px",
              borderRadius: 12,
              color: "#10b981",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            🔁 Trocar grátis
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
          Compare opções e economize R$ 2.000+
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
