import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { BRAND_GRADIENTS, BRAND_COLORS } from "@workspace/ui/lib/design-tokens";

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
          background: BRAND_GRADIENTS.primary,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BRAND_COLORS.onPrimary,
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
