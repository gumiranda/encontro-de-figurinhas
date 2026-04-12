// Flag gradients by FIFA code
export const FLAG_GRADIENTS: Record<string, string> = {
  // Hosts
  USA: "bg-gradient-to-br from-blue-900 via-red-500 to-white",
  CAN: "bg-gradient-to-r from-red-600 via-white to-red-600",
  MEX: "bg-gradient-to-r from-green-600 via-white to-red-600",
  // Grupo A
  RSA: "bg-gradient-to-br from-green-600 via-yellow-400 to-blue-700",
  KOR: "bg-gradient-to-br from-white via-red-500 to-blue-700",
  CZE: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  // Grupo B
  BIH: "bg-gradient-to-br from-blue-700 to-yellow-400",
  QAT: "bg-gradient-to-r from-white to-rose-800",
  SUI: "bg-gradient-to-br from-red-600 to-red-700",
  // Grupo C
  BRA: "bg-gradient-to-br from-green-500 to-yellow-400",
  MAR: "bg-gradient-to-b from-red-600 via-red-700 to-green-700",
  HAI: "bg-gradient-to-b from-blue-800 to-red-600",
  SCO: "bg-gradient-to-br from-blue-700 to-blue-900",
  // Grupo D
  PAR: "bg-gradient-to-b from-red-600 via-white to-blue-700",
  AUS: "bg-gradient-to-br from-blue-800 to-yellow-400",
  TUR: "bg-gradient-to-br from-red-600 to-red-700",
  // Grupo E
  GER: "bg-gradient-to-b from-black via-red-600 to-yellow-400",
  CUW: "bg-gradient-to-br from-blue-700 to-yellow-400",
  CIV: "bg-gradient-to-r from-orange-500 via-white to-green-600",
  ECU: "bg-gradient-to-b from-yellow-400 via-blue-700 to-red-600",
  // Grupo F
  NED: "bg-gradient-to-b from-red-500 via-white to-blue-600",
  JPN: "bg-gradient-to-br from-white to-red-600",
  SWE: "bg-gradient-to-br from-blue-600 to-yellow-400",
  TUN: "bg-gradient-to-br from-red-600 to-red-700",
  // Grupo G
  BEL: "bg-gradient-to-r from-black via-yellow-400 to-red-600",
  EGY: "bg-gradient-to-b from-red-600 via-white to-black",
  IRN: "bg-gradient-to-b from-green-600 via-white to-red-600",
  NZL: "bg-gradient-to-br from-blue-900 to-red-600",
  // Grupo H
  ESP: "bg-gradient-to-b from-red-600 via-yellow-400 to-red-600",
  CPV: "bg-gradient-to-br from-blue-800 via-white to-red-600",
  KSA: "bg-gradient-to-br from-green-700 to-green-600",
  URU: "bg-gradient-to-br from-white via-blue-400 to-blue-600",
  // Grupo I
  FRA: "bg-gradient-to-r from-blue-700 via-white to-red-600",
  SEN: "bg-gradient-to-r from-green-600 via-yellow-400 to-red-600",
  IRQ: "bg-gradient-to-b from-red-600 via-white to-black",
  NOR: "bg-gradient-to-br from-red-600 via-white to-blue-800",
  // Grupo J
  ARG: "bg-gradient-to-b from-blue-300 via-white to-blue-300",
  ALG: "bg-gradient-to-r from-green-600 to-white",
  AUT: "bg-gradient-to-b from-red-600 via-white to-red-600",
  JOR: "bg-gradient-to-r from-black via-green-600 to-red-600",
  // Grupo K
  POR: "bg-gradient-to-r from-green-600 to-red-600",
  COD: "bg-gradient-to-br from-blue-600 via-yellow-400 to-red-600",
  UZB: "bg-gradient-to-b from-blue-500 via-white to-green-600",
  COL: "bg-gradient-to-b from-yellow-400 via-blue-700 to-red-600",
  // Grupo L
  ENG: "bg-gradient-to-br from-white to-red-600",
  CRO: "bg-gradient-to-b from-red-600 via-white to-blue-700",
  GHA: "bg-gradient-to-b from-red-600 via-yellow-400 to-green-700",
  PAN: "bg-gradient-to-br from-blue-600 via-white to-red-600",
  // Extras
  EXT: "bg-gradient-to-br from-yellow-400 to-orange-500",
};

export function getFlagGradient(code: string): string {
  return FLAG_GRADIENTS[code] ?? "bg-gradient-to-br from-gray-500 to-gray-600";
}
