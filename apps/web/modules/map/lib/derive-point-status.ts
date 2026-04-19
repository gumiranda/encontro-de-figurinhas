import type { TradePointMapItem } from "./use-arena-map";

export type PinStatus = "active" | "idle";

export function derivePointStatus(p: TradePointMapItem): PinStatus {
  return (p.activeCheckinsCount ?? 0) > 0 ? "active" : "idle";
}
