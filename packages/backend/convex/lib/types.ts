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
