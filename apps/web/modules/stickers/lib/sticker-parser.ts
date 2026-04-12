export type Section = {
  name: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
};

export type ParseResult = {
  valid: number[];
  invalid: string[];
};

// Cria um mapeamento de prefixo curto para secao
// Ex: "EUA" -> { startNumber: 1, endNumber: 20 }
function buildPrefixMap(sections: Section[]): Map<string, Section> {
  const map = new Map<string, Section>();

  for (const section of sections) {
    // Extrair prefixo do nome (primeiras 3 letras em uppercase)
    // Ex: "EUA" -> "EUA", "Canada" -> "CAN", "Grupo A - Selecao 4" -> "GRU"
    const prefix = section.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .substring(0, 3)
      .toUpperCase();
    map.set(prefix, section);

    // Tambem mapear nome completo normalizado
    const fullName = section.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase();
    map.set(fullName, section);
  }

  return map;
}

// Extrai o prefixo e numero de uma entrada
// Ex: "BRA 12" -> { prefix: "BRA", num: 12 }
// Ex: "bra12" -> { prefix: "BRA", num: 12 }
// Ex: "BRA-12" -> { prefix: "BRA", num: 12 }
// Ex: "12" -> { prefix: null, num: 12 }
function parseEntry(entry: string): { prefix: string | null; num: number | null } {
  const trimmed = entry.trim();
  if (!trimmed) return { prefix: null, num: null };

  // Tentar numero direto primeiro
  const directNum = parseInt(trimmed, 10);
  if (!isNaN(directNum) && trimmed === String(directNum)) {
    return { prefix: null, num: directNum };
  }

  // Tentar formato com prefixo: "BRA 12", "BRA12", "BRA-12"
  const match = trimmed.match(/^([A-Za-z]+)[\s\-]?(\d+)$/);
  if (match && match[1] && match[2]) {
    const prefix = match[1].toUpperCase();
    const num = parseInt(match[2], 10);
    return { prefix, num };
  }

  return { prefix: null, num: null };
}

export function parseStickers(
  input: string,
  sections: Section[],
  maxSticker: number = 980
): ParseResult {
  const valid: number[] = [];
  const invalid: string[] = [];
  const seen = new Set<number>();

  const prefixMap = buildPrefixMap(sections);

  // Dividir por virgula, espaco ou quebra de linha
  const entries = input
    .split(/[,\s\n]+/)
    .map((e) => e.trim())
    .filter((e) => e.length > 0);

  for (const entry of entries) {
    const { prefix, num } = parseEntry(entry);

    if (num === null) {
      invalid.push(entry);
      continue;
    }

    let finalNum: number;

    if (prefix === null) {
      // Numero direto - usar como esta
      finalNum = num;
    } else {
      // Com prefixo - tentar mapear para numero absoluto
      const section = prefixMap.get(prefix);
      if (section) {
        // Numero relativo dentro da secao
        // Ex: "EUA 5" com section { startNumber: 1, endNumber: 20 }
        // -> startNumber + num - 1 = 1 + 5 - 1 = 5
        finalNum = section.startNumber + num - 1;

        // Validar que esta dentro do range da secao
        if (finalNum > section.endNumber) {
          invalid.push(entry);
          continue;
        }
      } else {
        // Prefixo desconhecido - tentar usar numero direto
        finalNum = num;
      }
    }

    // Validar range e duplicatas
    if (finalNum < 1 || finalNum > maxSticker) {
      invalid.push(entry);
      continue;
    }

    if (seen.has(finalNum)) {
      continue; // Ignorar duplicatas silenciosamente
    }

    seen.add(finalNum);
    valid.push(finalNum);
  }

  // Ordenar para consistencia
  valid.sort((a, b) => a - b);

  return { valid, invalid };
}

// Formatar numero para exibicao com prefixo da secao
export function formatStickerNumber(
  num: number,
  sections: Section[]
): { display: string; sectionName: string } {
  for (const section of sections) {
    if (num >= section.startNumber && num <= section.endNumber) {
      const relativeNum = num - section.startNumber + 1;
      const prefix = section.name.substring(0, 3).toUpperCase();
      return {
        display: `${prefix} ${relativeNum}`,
        sectionName: section.name,
      };
    }
  }

  return { display: String(num), sectionName: "Desconhecido" };
}

// Agrupar numeros por secao
export function groupBySections(
  numbers: number[],
  sections: Section[]
): Map<string, number[]> {
  const groups = new Map<string, number[]>();

  // Inicializar grupos vazios
  for (const section of sections) {
    groups.set(section.name, []);
  }

  for (const num of numbers) {
    for (const section of sections) {
      if (num >= section.startNumber && num <= section.endNumber) {
        const group = groups.get(section.name) ?? [];
        group.push(num);
        groups.set(section.name, group);
        break;
      }
    }
  }

  // Remover grupos vazios
  for (const [key, value] of groups) {
    if (value.length === 0) {
      groups.delete(key);
    }
  }

  return groups;
}
