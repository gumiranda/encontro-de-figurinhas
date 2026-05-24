import { ConvexError } from "convex/values";

const DEFAULT_MESSAGE = "Não foi possível concluir agora. Tente novamente.";
const RATE_LIMIT_MESSAGE =
  "Muitas tentativas em sequência. Aguarde alguns minutos e tente de novo.";

const INTERNAL_ERROR_MARKERS = [
  "[CONVEX",
  "Server Error",
  "Uncaught ConvexError",
  "Request ID",
  "node_modules",
  "Called by client",
  " at async ",
  " at ",
];

const KNOWN_MESSAGES: Array<[RegExp, string]> = [
  [/RateLimited|rate-limited|Muitas tentativas/i, RATE_LIMIT_MESSAGE],
  [
    /Not authenticated|Não autenticado|AUTH_REQUIRED/i,
    "Sua sessão expirou. Entre novamente para continuar.",
  ],
  [
    /Jogo já começou|Placar final definido|Palpites fechados/i,
    "Esse jogo já fechou para palpites.",
  ],
  [/Placar não pode ser negativo/i, "O placar não pode ter números negativos."],
  [
    /Jogo não encontrado/i,
    "Não encontramos esse jogo. Volte à lista e tente de novo.",
  ],
  [
    /Bolão não encontrado/i,
    "Não encontramos esse bolão. Confira o convite e tente de novo.",
  ],
  [/Código inválido/i, "Convite inválido. Confira o código e tente de novo."],
  [/Sem permissão|FORBIDDEN/i, "Você não tem permissão para fazer isso."],
  [/Nome do bolão/i, "Use um nome de bolão entre 3 e 36 caracteres."],
  [/Emoji inválido/i, "Escolha outro emoji para o bolão."],
  [/Cor inválida/i, "Escolha outra cor para o bolão."],
  [/Multiplicador inválido/i, "Revise os multiplicadores do bolão."],
  [/Comentário vazio/i, "Escreva algo antes de publicar."],
  [/Membro não encontrado/i, "Não encontramos esse membro no bolão."],
  [/Escolha outro membro/i, "Escolha outro membro para cutucar."],
  [/Palpite inválido/i, "Revise o placar e tente salvar de novo."],
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getConvexData(error: unknown): unknown {
  return error instanceof ConvexError ? error.data : null;
}

function getErrorText(error: unknown): string {
  const data = getConvexData(error);
  if (typeof data === "string") return data;
  if (isRecord(data)) {
    const code = data.code;
    const kind = data.kind;
    const message = data.message;
    return [code, kind, message]
      .filter((value): value is string => typeof value === "string")
      .join(" ");
  }
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "";
}

function hasInternalDetails(message: string) {
  return INTERNAL_ERROR_MARKERS.some((marker) => message.includes(marker));
}

export function getGepetoToastError(
  error: unknown,
  fallback = DEFAULT_MESSAGE,
) {
  const message = getErrorText(error).trim();

  for (const [pattern, copy] of KNOWN_MESSAGES) {
    if (pattern.test(message)) return copy;
  }

  if (!message || hasInternalDetails(message)) return fallback;
  return message.length > 160 ? fallback : message;
}
