export type Section = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
  flagEmoji?: string;
  relStart?: number; // First relative number (default 1). FWC champions uses 9.
};

export type SectionLookup = {
  byCode: Map<string, Section[]>;
  byIndex: Section[];
};

export type ParseResult = {
  valid: number[];
  invalid: string[];
  rejectedMultiCount: string[];
  formatted: string[];
};

export function buildSectionLookup(sections: Section[]): SectionLookup {
  const normalized = sections.map((s) => ({
    ...s,
    code: s.code.toUpperCase(),
  }));
  const byCode = new Map<string, Section[]>();
  const byIndex = [...normalized].sort((a, b) => a.startNumber - b.startNumber);

  for (const section of normalized) {
    const existing = byCode.get(section.code);
    if (existing) {
      existing.push(section);
    } else {
      byCode.set(section.code, [section]);
    }
  }

  for (let i = 1; i < byIndex.length; i++) {
    const prev = byIndex[i - 1];
    const curr = byIndex[i];
    if (prev && curr && curr.startNumber <= prev.endNumber) {
      console.warn(`Overlapping sections: ${prev.code} and ${curr.code}`);
    }
  }

  return { byCode, byIndex };
}

/**
 * Finds the section whose [startNumber, endNumber] contains `num`.
 * Numbers that fall in gaps between sections return `undefined`.
 * If ranges overlap, the section with the smaller `startNumber` wins (stable sort order).
 */
export function findSectionForNumber(
  num: number,
  lookup: SectionLookup
): Section | undefined {
  let lo = 0;
  let hi = lookup.byIndex.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const s = lookup.byIndex[mid];
    if (s === undefined) return undefined;
    if (num < s.startNumber) hi = mid - 1;
    else if (num > s.endNumber) lo = mid + 1;
    else return s;
  }
  return undefined;
}

const MAX_PARSE_ENTRIES = 500;

const SINGLE_PATTERN = /^([A-Z]{2,4})-(\d{1,2})$/;
const RANGE_PATTERN = /^([A-Z]{2,4})-(\d{1,2})-(\d{1,2})$/;
export const MULTI_COUNT_PREFIX = /^\d+[xX]/;
export const GLOBAL_SINGLE = /^\d+$/;
export const GLOBAL_RANGE = /^(\d+)-(\d+)$/;

type ParseEntryResult =
  | {
      kind: "ok";
      valid: number[];
      formatted: string | null;
    }
  | {
      kind: "invalid";
      label: string;
    }
  | {
      kind: "rejectMultiCount";
      label: string;
    };

function parseSingle(
  code: string,
  num: number,
  codeMap: Map<string, Section[]>
): ParseEntryResult {
  if (!Number.isInteger(num)) {
    return { kind: "invalid", label: `${code}-${num}` };
  }

  const sections = codeMap.get(code);
  if (!sections || sections.length === 0) {
    return { kind: "invalid", label: `${code}-${num}` };
  }

  // Find section where num fits within its relative range
  for (const section of sections) {
    const relStart = section.relStart ?? 1;
    const sectionSize = section.endNumber - section.startNumber + 1;
    const relEnd = relStart + sectionSize - 1;
    if (num >= relStart && num <= relEnd) {
      const absoluteNum = section.startNumber + (num - relStart);
      return {
        kind: "ok",
        valid: [absoluteNum],
        formatted: `${code}-${num}`,
      };
    }
  }

  return { kind: "invalid", label: `${code}-${num}` };
}

function parseRange(
  code: string,
  start: number,
  end: number,
  codeMap: Map<string, Section[]>
): ParseEntryResult {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { kind: "invalid", label: `${code}-${start}-${end}` };
  }

  const sections = codeMap.get(code);
  if (!sections || sections.length === 0) {
    return { kind: "invalid", label: `${code}-${start}-${end}` };
  }

  if (start > end) {
    return { kind: "invalid", label: `${code}-${start}-${end}` };
  }

  // Find section where range fits
  for (const section of sections) {
    const relStart = section.relStart ?? 1;
    const sectionSize = section.endNumber - section.startNumber + 1;
    const relEnd = relStart + sectionSize - 1;
    if (start >= relStart && end <= relEnd) {
      const numbers: number[] = [];
      for (let i = start; i <= end; i++) {
        numbers.push(section.startNumber + (i - relStart));
      }

      const formatted =
        start === end ? `${code}-${start}` : `${code}-${start} a ${code}-${end}`;

      return { kind: "ok", valid: numbers, formatted };
    }
  }

  return { kind: "invalid", label: `${code}-${start}-${end}` };
}

function parseGlobalSingle(
  num: number,
  totalStickers: number
): ParseEntryResult {
  if (!Number.isInteger(num) || num < 1 || num > totalStickers) {
    return { kind: "invalid", label: String(num) };
  }

  return {
    kind: "ok",
    valid: [num],
    formatted: String(num),
  };
}

function parseGlobalRange(
  start: number,
  end: number,
  totalStickers: number
): ParseEntryResult {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start > end ||
    start < 1 ||
    end > totalStickers
  ) {
    return { kind: "invalid", label: `${start}-${end}` };
  }

  const numbers: number[] = [];
  for (let i = start; i <= end; i++) {
    numbers.push(i);
  }

  return {
    kind: "ok",
    valid: numbers,
    formatted: start === end ? String(start) : `${start} a ${end}`,
  };
}

function parseEntry(
  entry: string,
  codeMap: Map<string, Section[]>,
  totalStickers: number
): ParseEntryResult {
  const originalEntry = entry.trim();
  const normalized = originalEntry.toUpperCase();
  if (!normalized) {
    return { kind: "invalid", label: originalEntry };
  }

  if (MULTI_COUNT_PREFIX.test(originalEntry)) {
    return { kind: "rejectMultiCount", label: originalEntry };
  }

  const rangeMatch = normalized.match(RANGE_PATTERN);
  if (rangeMatch) {
    const [, code, startStr, endStr] = rangeMatch;
    if (code && startStr && endStr) {
      return parseRange(
        code,
        parseInt(startStr, 10),
        parseInt(endStr, 10),
        codeMap
      );
    }
  }

  const singleMatch = normalized.match(SINGLE_PATTERN);
  if (singleMatch) {
    const [, code, numStr] = singleMatch;
    if (code && numStr) {
      return parseSingle(code, parseInt(numStr, 10), codeMap);
    }
  }

  const globalRangeMatch = normalized.match(GLOBAL_RANGE);
  if (globalRangeMatch) {
    const [, startStr, endStr] = globalRangeMatch;
    if (startStr && endStr) {
      return parseGlobalRange(
        parseInt(startStr, 10),
        parseInt(endStr, 10),
        totalStickers
      );
    }
  }

  const globalSingleMatch = normalized.match(GLOBAL_SINGLE);
  if (globalSingleMatch) {
    return parseGlobalSingle(parseInt(normalized, 10), totalStickers);
  }

  return { kind: "invalid", label: originalEntry };
}

export function parseStickers(
  input: string,
  lookup: SectionLookup,
  totalStickers: number
): ParseResult {
  const valid: number[] = [];
  const invalid: string[] = [];
  const rejectedMultiCount: string[] = [];
  const formatted: string[] = [];
  const seen = new Set<number>();

  const codeMap = lookup.byCode;

  const entries = input
    .split(/[,\s]+/)
    .slice(0, MAX_PARSE_ENTRIES)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  for (const entry of entries) {
    const result = parseEntry(entry, codeMap, totalStickers);

    if (result.kind === "invalid") {
      invalid.push(result.label);
      continue;
    }

    if (result.kind === "rejectMultiCount") {
      rejectedMultiCount.push(result.label);
      continue;
    }

    let addedAny = false;
    for (const num of result.valid) {
      if (!seen.has(num)) {
        seen.add(num);
        valid.push(num);
        addedAny = true;
      }
    }

    if (result.formatted && addedAny) {
      formatted.push(result.formatted);
    }
  }

  valid.sort((a, b) => a - b);

  return { valid, invalid, rejectedMultiCount, formatted };
}

export type StickerType = "escudo" | "player" | "team_photo" | "special";
export type Variant = "base" | "bronze" | "prata" | "ouro";

export type StickerDisplay = {
  code: string;
  relativeNum: number;
  fullName: string;
  display: string;
  playerName?: string;
  stickerType?: StickerType;
  slug?: string;
  variant?: Variant;
};

export function getRelativeNum(num: number, section: Section): number {
  const relStart = section.relStart ?? 1;
  return (num - section.startNumber) + relStart;
}

export function formatStickerNumber(
  num: number,
  lookup: SectionLookup
): StickerDisplay {
  const section = findSectionForNumber(num, lookup);

  if (section) {
    const relativeNum = getRelativeNum(num, section);
    return {
      code: section.code,
      relativeNum,
      fullName: section.name,
      display: `${section.code}-${relativeNum}`,
    };
  }

  return {
    code: "???",
    relativeNum: num,
    fullName: "Desconhecido",
    display: String(num),
  };
}

export function formatStickerNumberStrict(
  num: number,
  lookup: SectionLookup
): StickerDisplay {
  const section = findSectionForNumber(num, lookup);
  if (!section) {
    throw new Error(`No section found for sticker number ${num}`);
  }
  const relativeNum = getRelativeNum(num, section);
  return {
    code: section.code,
    relativeNum,
    fullName: section.name,
    display: `${section.code}-${relativeNum}`,
  };
}

export function groupBySections(
  numbers: number[],
  lookup: SectionLookup
): Map<string, number[]> {
  const groups = new Map<string, number[]>();

  for (const num of numbers) {
    const section = findSectionForNumber(num, lookup);
    if (section) {
      const existing = groups.get(section.code);
      if (existing) {
        existing.push(num);
      } else {
        groups.set(section.code, [num]);
      }
    }
  }

  return groups;
}
