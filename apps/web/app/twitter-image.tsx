import { ImageResponse } from "next/og";
import { BRAND_GRADIENTS } from "@workspace/ui/lib/design-tokens";

export const runtime = "edge";

export const alt = "Figurinha Fácil - Troque figurinhas perto de você";
export const size = {
  width: 1200,
  height: 630,
};
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
          background: BRAND_GRADIENTS.primary,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              background: "white",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
            }}
          >
            🎴
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "white",
              margin: 0,
              textAlign: "center",
            }}
          >
            Figurinha Fácil
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "rgba(255, 255, 255, 0.9)",
              margin: "20px 0 0 0",
              textAlign: "center",
            }}
          >
            Troque figurinhas perto de você
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 48,
          }}
        >
          {["São Paulo", "Rio de Janeiro", "Belo Horizonte"].map((city) => (
            <div
              key={city}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                padding: "12px 24px",
                borderRadius: 9999,
                color: "white",
                fontSize: 18,
              }}
            >
              {city}
            </div>
          ))}
        </div>
        <p
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          figurinhafacil.com.br
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
