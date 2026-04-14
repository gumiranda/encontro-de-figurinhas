import type {
  SetLocationErrorCode,
  SetLocationErrorData,
} from "@workspace/backend/lib/setLocationErrors";
import { ConvexError } from "convex/values";

const GENERIC = "Erro ao salvar localização. Tente novamente.";

const MESSAGES: Record<SetLocationErrorCode, string> = {
  LOCATION_RATE_LIMIT_COOLDOWN:
    "Por favor, aguarde um momento antes de alterar a localização novamente.",
  LOCATION_RATE_LIMIT_HOURLY:
    "Limite de atualizações de localização atingido. Tente novamente mais tarde.",
  LOCATION_CITY_NOT_FOUND: "Cidade não encontrada.",
  LOCATION_CITY_INACTIVE: "Esta cidade não está disponível no momento.",
  LOCATION_COORDS_PAIR_INVALID:
    "Dados de localização inválidos. Tente novamente.",
  LOCATION_IP_WITH_CLIENT_COORDS:
    "Não foi possível salvar com essa combinação. Escolha outra opção.",
  LOCATION_OUTSIDE_BRAZIL: "A localização precisa estar no Brasil.",
  LOCATION_GPS_COORDS_REQUIRED:
    "Ative a permissão de localização ou escolha a cidade manualmente.",
  LOCATION_IP_SERVER_CONFIG:
    "Serviço de localização indisponível. Tente mais tarde ou use a busca manual.",
  LOCATION_IP_TOKEN_REQUIRED:
    "Confirme a detecção por IP ou escolha a cidade na busca.",
  LOCATION_IP_TOKEN_INVALID:
    "A confirmação de localização expirou. Detecte novamente ou busque manualmente.",
  LOCATION_IP_CITY_MISMATCH:
    "A cidade escolhida não corresponde à localização detectada.",
  LOCATION_INVALID_SOURCE: GENERIC,
};

function isSetLocationErrorData(data: unknown): data is SetLocationErrorData {
  if (typeof data !== "object" || data === null || !("code" in data)) {
    return false;
  }
  const code = (data as { code: unknown }).code;
  return typeof code === "string" && code in MESSAGES;
}

/** Mensagem segura para o usuário, sem repassar detalhes internos do servidor. */
export function resolveSetLocationToastMessage(error: unknown): string {
  if (!(error instanceof ConvexError)) return GENERIC;
  const data = error.data;
  if (!isSetLocationErrorData(data)) return GENERIC;
  return MESSAGES[data.code];
}
