import { ConvexError } from "convex/values";

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function relativeFromNow(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `há ${Math.max(1, minutes)}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

export function relativeUntil(ts: number | null | undefined): string {
  if (ts === null || ts === undefined) return "sem prazo";
  const diff = ts - Date.now();
  if (diff <= 0) return "expirada";
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 24) {
    const minutes = Math.floor((diff % 3_600_000) / 60_000);
    return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}min`;
  }
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return `${days}d ${remHours}h`;
}

const AVATAR_GRADIENTS = [
  "bg-gradient-to-br from-primary to-primary-dim text-primary-foreground",
  "bg-gradient-to-br from-tertiary to-tertiary-dim text-tertiary-foreground",
  "bg-gradient-to-br from-secondary to-secondary-dim text-secondary-foreground",
  "bg-gradient-to-br from-[#c8a4ff] to-[#8a5cf6] text-[#2a1465]",
] as const;

export function gradientForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const idx = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx] ?? AVATAR_GRADIENTS[0];
}

export type TradeErrorCode =
  | "STATE_CHANGED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "USER_BANNED"
  | "STICKERS_CHANGED"
  | "AUTH_REQUIRED"
  | "ALREADY_PENDING"
  | "RATE_LIMITED"
  | "UNKNOWN";

const TRADE_ERROR_COPY: Record<TradeErrorCode, string> = {
  STATE_CHANGED: "Esta proposta foi atualizada por outra pessoa.",
  FORBIDDEN: "Você não tem permissão para esta ação.",
  NOT_FOUND: "Proposta não encontrada.",
  USER_BANNED: "Conta suspensa. Contate suporte.",
  STICKERS_CHANGED: "Figurinhas mudaram desde a proposta.",
  AUTH_REQUIRED: "Sessão expirada. Faça login novamente.",
  ALREADY_PENDING: "Já existe uma proposta pendente com esta pessoa.",
  RATE_LIMITED: "Muitas ações em pouco tempo. Aguarde.",
  UNKNOWN: "Falha de conexão. Tente novamente.",
};

export function mapTradeError(err: unknown): {
  message: string;
  code: TradeErrorCode;
} {
  if (err instanceof ConvexError) {
    const raw = typeof err.data === "string" ? err.data : "";
    if (raw in TRADE_ERROR_COPY) {
      const code = raw as TradeErrorCode;
      return { code, message: TRADE_ERROR_COPY[code] };
    }
  }
  return { code: "UNKNOWN", message: TRADE_ERROR_COPY.UNKNOWN };
}
