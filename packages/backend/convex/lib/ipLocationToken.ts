const TOKEN_TTL_MS = 10 * 60 * 1000;

export type IpLocationPayload = {
  sub: string;
  lat: number;
  lng: number;
  exp: number;
};

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUint8Array(b64: string): Uint8Array {
  const pad = b64.length % 4 === 0 ? "" : "=".repeat(4 - (b64.length % 4));
  const base64 = b64.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/** Emitido pela rota Next `/api/ip-location` (mesmo segredo em Convex e no app web). */
export async function signIpLocationToken(
  payload: Omit<IpLocationPayload, "exp">,
  secret: string
): Promise<{ token: string; expiresAt: number }> {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const full: IpLocationPayload = {
    ...payload,
    exp: expiresAt,
  };
  const payloadStr = JSON.stringify(full);
  const payloadBytes = new TextEncoder().encode(payloadStr);
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, payloadBytes);
  const token = `${uint8ArrayToBase64Url(payloadBytes)}.${uint8ArrayToBase64Url(new Uint8Array(sig))}`;
  return { token, expiresAt };
}

export async function verifyIpLocationToken(
  token: string,
  expectedSub: string,
  secret: string
): Promise<IpLocationPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  if (!payloadB64 || !sigB64) return null;

  const payloadBytes = base64UrlToUint8Array(payloadB64);
  const sigBytes = base64UrlToUint8Array(sigB64);

  const key = await importHmacKey(secret);
  const payloadBuf = new Uint8Array(payloadBytes);
  const sigBuf = new Uint8Array(sigBytes);
  const ok = await crypto.subtle.verify("HMAC", key, sigBuf, payloadBuf);
  if (!ok) return null;

  let parsed: IpLocationPayload;
  try {
    parsed = JSON.parse(new TextDecoder().decode(payloadBytes)) as IpLocationPayload;
  } catch {
    return null;
  }

  if (typeof parsed.sub !== "string" || parsed.sub !== expectedSub) return null;
  if (typeof parsed.lat !== "number" || typeof parsed.lng !== "number") return null;
  // Autoridade para expiração: `exp` está no payload assinado; ignorar checks só no cliente.
  if (typeof parsed.exp !== "number" || parsed.exp <= Date.now()) return null;

  return parsed;
}
