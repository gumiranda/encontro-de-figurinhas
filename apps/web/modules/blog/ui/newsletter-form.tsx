"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";

interface NewsletterFormProps {
  source?: string;
}

export function NewsletterForm({ source }: NewsletterFormProps) {
  const subscribe = useMutation(api.newsletter.subscribe);
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      const res = await subscribe({ email, source });
      if (res.alreadySubscribed) {
        toast.info("Você já está inscrito.");
      } else {
        toast.success("Inscrição confirmada. Até sexta!");
      }
      setEmail("");
    } catch (err) {
      const code =
        err instanceof ConvexError && typeof err.data === "string"
          ? err.data
          : "ERROR";
      if (code === "INVALID_EMAIL") {
        toast.error("Email inválido.");
      } else if (code === "RATE_LIMITED") {
        toast.error("Muitas tentativas. Tente novamente em alguns minutos.");
      } else {
        toast.error("Não foi possível inscrever. Tente novamente.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bh-newsletter-form mx-auto flex max-w-lg gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1.5"
    >
      <div className="flex flex-1 items-center gap-2 px-4">
        <Mail
          className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block"
          aria-hidden
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          autoComplete="email"
          className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          aria-label="Email"
          disabled={pending}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-gradient-to-br from-primary to-[color-mix(in_oklab,var(--primary)_70%,var(--secondary))] px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Assinar grátis"}
      </button>
    </form>
  );
}
