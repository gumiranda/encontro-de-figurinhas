export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

export function openWhatsApp(title: string, url: string): void {
  const text = encodeURIComponent(`${title}\n${url}`);
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
}

export async function nativeShare(
  title: string,
  url: string
): Promise<"shared" | "aborted" | "unsupported"> {
  if (typeof navigator === "undefined" || !("share" in navigator))
    return "unsupported";
  try {
    await navigator.share({ title, url });
    return "shared";
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return "aborted";
    return "aborted";
  }
}

export function hasNativeShare(): boolean {
  return typeof navigator !== "undefined" && "share" in navigator;
}
