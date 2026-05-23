export function getSafeInternalRedirect(value: string | null | undefined) {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export function withRedirectParam(path: string, redirectPath: string | null) {
  if (!redirectPath) return path;
  return `${path}?redirect=${encodeURIComponent(redirectPath)}`;
}
