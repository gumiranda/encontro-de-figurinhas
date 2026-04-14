export const Sector = {
  GENERAL: "general",
} as const;

export type SectorType = (typeof Sector)[keyof typeof Sector];

export const Role = {
  SUPERADMIN: "superadmin",
  CEO: "ceo",
  USER: "user",
} as const;

export type RoleType = (typeof Role)[keyof typeof Role];

const ROLE_VALUES = new Set<string>(Object.values(Role));
const SECTOR_VALUES = new Set<string>(Object.values(Sector));

export function isValidRole(role: string): role is RoleType {
  return ROLE_VALUES.has(role);
}

export function isValidSector(sector: string): sector is SectorType {
  return SECTOR_VALUES.has(sector);
}

