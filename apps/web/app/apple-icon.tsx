import { ImageResponse } from "next/og";
import { BRAND_GRADIENTS, BRAND_COLORS } from "@workspace/ui/lib/design-tokens";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: BRAND_GRADIENTS.primary,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BRAND_COLORS.onPrimary,
          borderRadius: 40,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
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
