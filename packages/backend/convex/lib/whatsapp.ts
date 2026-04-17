import type { Doc } from "../_generated/dataModel";

export type WhatsappAccessState =
  | { state: "ok"; link: string }
  | { state: "blocked-link-invalid" }
  | { state: "blocked-minor" };

export function evaluateWhatsappAccess(
  user: Doc<"users">,
  point: Doc<"tradePoints">
): WhatsappAccessState {
  if (point.whatsappLinkStatus !== "active" || !point.whatsappLink) {
    return { state: "blocked-link-invalid" };
  }
  if (user.ageGroup === "child" && !user.parentalConsentAt) {
    return { state: "blocked-minor" };
  }
  return { state: "ok", link: point.whatsappLink };
}
