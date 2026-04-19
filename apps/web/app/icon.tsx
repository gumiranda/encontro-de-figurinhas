import { ImageResponse } from "next/og";
import { BRAND_GRADIENTS, BRAND_COLORS } from "@workspace/ui/lib/design-tokens";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: BRAND_GRADIENTS.primary,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BRAND_COLORS.onPrimary,
          borderRadius: 6,
          fontWeight: 700,
        }}
      >
        F
      </div>
    ),
    {
      ...size,
    }
  );
}
