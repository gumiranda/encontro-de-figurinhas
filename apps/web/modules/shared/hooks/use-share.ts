import { toast } from "sonner";

type ShareInput = {
  title: string;
  text?: string;
  url: string;
};

type ShareResult =
  | { ok: true; method: "native" | "clipboard" }
  | { ok: false; reason: "cancelled" | "failed" };

export function useShare() {
  return async ({ title, text, url }: ShareInput): Promise<ShareResult> => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        toast.success("Compartilhado");
        return { ok: true, method: "native" };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return { ok: false, reason: "cancelled" };
        }
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado");
        return { ok: true, method: "clipboard" };
      } catch {
        toast.error("Não foi possível compartilhar");
        return { ok: false, reason: "failed" };
      }
    }

    toast.error("Compartilhamento indisponível neste navegador");
    return { ok: false, reason: "failed" };
  };
}
