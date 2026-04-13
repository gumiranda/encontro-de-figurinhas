export type Section = {
  name: string;
  code: string; // Código FIFA (ex: BRA, ARG, ENG)
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
};

export type SectionLookup = {
  /** FIFA codes as uppercase keys (case-insensitive lookup) */
  byCode: Map<string, Section>;
  byIndex: Section[]; // sorted by startNumber for index lookup
};

export type ParseResult = {
  valid: number[]; // Números absolutos adicionados
  invalid: string[]; // Entradas não reconhecidas
  formatted: string[]; // Exibição amigável (ex: "BRA-10", "ARG-1 a ARG-15")
};

// Build a lookup structure for O(1) code access and sorted number lookup
export function buildSectionLookup(sections: Section[]): SectionLookup {
  const byCode = new Map<string, Section>();
  const byIndex = [...sections].sort((a, b) => a.startNumber - b.startNumber);

  for (const section of sections) {
    const key = section.code.toUpperCase();
    if (byCode.has(key) && process.env.NODE_ENV === "development") {
      console.warn(`Duplicate section code: ${section.code}`);
    }
    byCode.set(key, section);
  }

  return { byCode, byIndex };
}

// Find section for a given absolute number (byIndex sorted by startNumber)
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

// Regex para formato estrito
// Singular: BRA-10 (código de 2-4 letras + hífen + número de 1-2 dígitos)
const SINGLE_PATTERN = /^([A-Z]{2,4})-(\d{1,2})$/;
// Range: BRA-1-15 (código + hífen + início + hífen + fim)
const RANGE_PATTERN = /^([A-Z]{2,4})-(\d{1,2})-(\d{1,2})$/;

// Sanitiza input removendo tags HTML/scripts
function sanitize(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// Parseia uma entrada singular (ex: BRA-10)
function parseSingle(
  code: string,
  num: number,
  codeMap: Map<string, Section>
): { valid: number | null; error: string | null; formatted: string | null } {
  const section = codeMap.get(code);
  if (!section) {
    return { valid: null, error: `${code}-${num}`, formatted: null };
  }

  const sectionSize = section.endNumber - section.startNumber + 1;
  if (num < 1 || num > sectionSize) {
    return { valid: null, error: `${code}-${num}`, formatted: null };
  }

  const absoluteNum = section.startNumber + num - 1;
  return {
    valid: absoluteNum,
    error: null,
    formatted: `${code}-${num}`,
  };
}

// Parseia uma entrada de range (ex: BRA-1-15)
function parseRange(
  code: string,
  start: number,
  end: number,
  codeMap: Map<string, Section>
): { valid: number[]; error: string | null; formatted: string | null } {
  const section = codeMap.get(code);
  if (!section) {
    return { valid: [], error: `${code}-${start}-${end}`, formatted: null };
  }

  // Validar range invertido
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

// Parseia uma única entrada (detecta se é singular ou range)
function parseEntry(
  entry: string,
  codeMap: Map<string, Section>
): { valid: number[]; error: string | null; formatted: string | null } {
  const normalized = sanitize(entry).toUpperCase();
  if (!normalized) {
    return { valid: [], error: null, formatted: null };
  }

  // Tentar range primeiro (2 hífens)
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

  // Tentar singular (1 hífen)
  const singleMatch = normalized.match(SINGLE_PATTERN);
  if (singleMatch) {
    const [, code, numStr] = singleMatch;
    if (code && numStr) {
      const result = parseSingle(code, parseInt(numStr, 10), codeMap);
      return {
        valid: result.valid !== null ? [result.valid] : [],
        error: result.error,
        formatted: result.formatted,
      };
    }
  }

  // Formato inválido
  return { valid: [], error: entry.trim(), formatted: null };
}

export function parseStickers(input: string, sections: Section[]): ParseResult {
  const valid: number[] = [];
  const invalid: string[] = [];
  const formatted: string[] = [];
  const seen = new Set<number>();

  const { byCode: codeMap } = buildSectionLookup(sections);

  // Dividir por vírgula, espaço ou quebra de linha
  const entries = input
    .split(/[,\s\n]+/)
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

  // Ordenar para consistência
  valid.sort((a, b) => a - b);

  return { valid, invalid, formatted };
}

// Formatar número para exibição com código da seção
export function formatStickerNumber(
  num: number,
  lookupOrSections: SectionLookup | Section[]
): {
  code: string;
  relativeNum: number;
  fullName: string;
  display: string;
} {
  // Support both SectionLookup and Section[] for backwards compatibility
  const lookup = Array.isArray(lookupOrSections)
    ? buildSectionLookup(lookupOrSections)
    : lookupOrSections;

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

// Agrupar números por seção - O(n) instead of O(n*m)
export function groupBySections(
  numbers: number[],
  lookupOrSections: SectionLookup | Section[]
): Map<string, number[]> {
  // Support both SectionLookup and Section[] for backwards compatibility
  const lookup = Array.isArray(lookupOrSections)
    ? buildSectionLookup(lookupOrSections)
    : lookupOrSections;

  const groups = new Map<string, number[]>();

  for (const num of numbers) {
    const section = findSectionForNumber(num, lookup);
    if (section) {
      const key = section.code.toUpperCase();
      const existing = groups.get(key);
      if (existing) {
        existing.push(num);
      } else {
        groups.set(key, [num]);
      }
    }
  }

  return groups;
}
