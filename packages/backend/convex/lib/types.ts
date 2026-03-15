export const Sector = {
  GENERAL: "general",
} as const;

export const Role = {
  SUPERADMIN: "superadmin",
  CEO: "ceo",
  USER: "user",
} as const;

export const UserStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
export const MAX_SPOT_LIFETIME = 72 * 60 * 60 * 1000;

export type RoleValue = (typeof Role)[keyof typeof Role];
export type SectorValue = (typeof Sector)[keyof typeof Sector];
export type UserStatusValue = (typeof UserStatus)[keyof typeof UserStatus];

export type Coordinates = { latitude: number; longitude: number };

export function sanitizeText(input: string): string {
  return input
    .replace(/[\u200B-\u200F\uFEFF\u202A-\u202E]/g, "")
    .replace(/[^\P{Cc}\n\t]/gu, "")
    .trim();
}

export function isValidValue<T extends string>(
  values: readonly T[],
  input: string,
): input is T {
  return (values as readonly string[]).includes(input);
}
