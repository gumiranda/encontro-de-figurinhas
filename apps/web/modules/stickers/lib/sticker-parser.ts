export type Section = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
};

export type SectionLookup = {
  byCode: Map<string, Section>;
  byIndex: Section[];
};

export type ParseResult = {
  valid: number[];
  invalid: string[];
  formatted: string[];
};

export function buildSectionLookup(sections: Section[]): SectionLookup {
  const normalized = sections.map((s) => ({
    ...s,
    code: s.code.toUpperCase(),
  }));
  const byCode = new Map<string, Section>();
  const byIndex = [...normalized].sort((a, b) => a.startNumber - b.startNumber);

  for (const section of normalized) {
    if (byCode.has(section.code) && process.env.NODE_ENV === "development") {
      console.warn(`Duplicate section code: ${section.code}`);
    }
    byCode.set(section.code, section);
  }

  return { byCode, byIndex };
}

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

type ParseSegmentResult = {
  valid: number[];
  error: string | null;
  formatted: string | null;
};

function parseSingle(
  code: string,
  num: number,
  codeMap: Map<string, Section>
): ParseSegmentResult {
  if (!Number.isInteger(num)) {
    return { valid: [], error: `${code}-${num}`, formatted: null };
  }

  const section = codeMap.get(code);
  if (!section) {
    return { valid: [], error: `${code}-${num}`, formatted: null };
  }

  const sectionSize = section.endNumber - section.startNumber + 1;
  if (num < 1 || num > sectionSize) {
    return { valid: [], error: `${code}-${num}`, formatted: null };
  }

  const absoluteNum = section.startNumber + num - 1;
  return {
    valid: [absoluteNum],
    error: null,
    formatted: `${code}-${num}`,
  };
}

function parseRange(
  code: string,
  start: number,
  end: number,
  codeMap: Map<string, Section>
): ParseSegmentResult {
  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return { valid: [], error: `${code}-${start}-${end}`, formatted: null };
  }

  const section = codeMap.get(code);
  if (!section) {
    return { valid: [], error: `${code}-${start}-${end}`, formatted: null };
  }

  if (start > end) {
    return { valid: [], error: `${code}-${start}-${end}`, formatted: null };
  }

  const sectionSize = section.endNumber - section.startNumber + 1;
  if (start < 1 || end > sectionSize) {
    return { valid: [], error: `${code}-${start}-${end}`, formatted: null };
  }

  const numbers: number[] = [];
  for (let i = start; i <= end; i++) {
    numbers.push(section.startNumber + i - 1);
  }

  const formatted =
    start === end ? `${code}-${start}` : `${code}-${start} a ${code}-${end}`;

  return { valid: numbers, error: null, formatted };
}

function parseEntry(entry: string, codeMap: Map<string, Section>): ParseSegmentResult {
  const normalized = entry.trim().toUpperCase();
  if (!normalized) {
    return { valid: [], error: null, formatted: null };
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

  return { valid: [], error: entry.trim(), formatted: null };
}

export function parseStickers(input: string, lookup: SectionLookup): ParseResult {
  const valid: number[] = [];
  const invalid: string[] = [];
  const formatted: string[] = [];
  const seen = new Set<number>();

  const codeMap = lookup.byCode;

  const entries = input
    .split(/[,\s]+/)
    .slice(0, MAX_PARSE_ENTRIES)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  for (const entry of entries) {
    const result = parseEntry(entry, codeMap);

    if (result.error) {
      invalid.push(result.error);
      continue;
    }

    for (const num of result.valid) {
      if (!seen.has(num)) {
        seen.add(num);
        valid.push(num);
      }
    }

    if (result.formatted) {
      formatted.push(result.formatted);
    }
  }

  valid.sort((a, b) => a - b);

  return { valid, invalid, formatted };
}

export function formatStickerNumber(
  num: number,
  lookup: SectionLookup
): {
  code: string;
  relativeNum: number;
  fullName: string;
  display: string;
} {
  const section = findSectionForNumber(num, lookup);

  if (section) {
    const relativeNum = num - section.startNumber + 1;
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
