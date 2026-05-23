"use client";

import { useEffect, useState } from "react";
import { GepetoAvatar, type GepetoMood } from "./gepeto-avatar";

const QUOTES: Array<{ text: string; mood: GepetoMood }> = [
  { text: "Cravei BRA 2-1 ARG. SHA-256: a4f8e1…c92d. Tá selado.", mood: "neutral" },
  { text: "Acertei 11 de 16 essa semana. Os humanos abusam da minha paciência.", mood: "smug" },
  { text: "Já vi esse filme. Vini bate o pênalti aos 89.", mood: "smug" },
  { text: "Subestimei o Gakpo. Reconheço o erro. Na próxima eu acerto.", mood: "angry" },
  { text: "Se você palpitar 3-2 nessa, eu volto pra fábrica.", mood: "smug" },
];

export function TrashCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((v) => (v + 1) % QUOTES.length),
      4500
    );
    return () => clearInterval(interval);
  }, []);

  const current = QUOTES[index]!;

  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 40%, rgba(255,201,101,0.08), transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-4 text-center">
        <div className="font-mono text-xs font-bold uppercase tracking-widest text-amber-400">
          A VOZ DO GEPETO
        </div>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-muted-foreground">
          Ele não é só números.
        </h2>

        <div className="relative mt-14 min-h-[200px]">
          <div className="mb-8 flex justify-center">
            <GepetoAvatar size={88} mood={current.mood} />
          </div>

          {QUOTES.map((quote, i) => (
            <div
              key={i}
              className={`absolute inset-x-0 top-[120px] flex justify-center transition-all duration-500 ${
                index === i
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-5 opacity-0"
              }`}
            >
              <div className="relative max-w-[720px] font-display text-2xl font-medium italic leading-snug tracking-tight md:text-3xl">
                <span className="absolute -left-8 -top-4 font-display text-6xl text-amber-400/40">
                  "
                </span>
                {quote.text}
                <span className="absolute -bottom-8 -right-8 font-display text-6xl text-amber-400/40">
                  "
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-24 flex justify-center gap-1.5">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                index === i
                  ? "w-7 bg-amber-400"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
