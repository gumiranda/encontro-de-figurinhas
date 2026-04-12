import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const VALID_SIZES = [192, 512];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ size: string }> }
) {
  const { size: sizeParam } = await params;
  const size = parseInt(sizeParam, 10);

  if (!VALID_SIZES.includes(size)) {
    return new Response("Invalid size", { status: 400 });
  }

  const fontSize = Math.floor(size * 0.6);
  const borderRadius = Math.floor(size * 0.2);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize,
          background: "linear-gradient(135deg, #3C82F6 0%, #1E40AF 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        F
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}
