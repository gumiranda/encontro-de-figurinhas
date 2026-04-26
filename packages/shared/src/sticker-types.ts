export const STICKER_TYPES = ["escudo", "player", "team_photo", "special"] as const;
export type StickerType = (typeof STICKER_TYPES)[number];

export const VARIANTS = ["base", "bronze", "prata", "ouro"] as const;
export type Variant = (typeof VARIANTS)[number];

export interface StickerDetail {
  sectionCode: string;
  sectionName: string;
  relativeNum: number;
  absoluteNum: number;
  name: string;
  nameNormalized: string;
  slug: string;
  type?: StickerType;
  variant?: Variant;
  flagEmoji?: string;
}

export interface StickerDisplay {
  code: string;
  relativeNum: number;
  fullName: string;
  display: string;
  playerName?: string;
  stickerType?: StickerType;
  slug?: string;
}
