import type { Doc } from "../_generated/dataModel";

/**
 * Get user's display name with fallback chain.
 */
export function getUserDisplayName(user: Doc<"users">): string {
  return user.displayNickname ?? user.nickname ?? user.name;
}
