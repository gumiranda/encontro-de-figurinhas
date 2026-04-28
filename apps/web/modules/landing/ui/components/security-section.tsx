"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { COMPARE_TABLE } from "../../lib/landing-data";
import { ShieldCheck, MessageSquare, BadgeCheck } from "lucide-react";

export function SecuritySection() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section id="seguranca" className="section-band px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`grid lg:grid-cols-12 gap-12 items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="lg:col-span-5">
            <span className="eyebrow">Garantia de troca segura</span>
            <h2 className="mt-4 font-bold text-3xl md:text-5xl tracking-tight leading-[1.05] text-pretty text-[#e1e4fa]">
              Sua figurinha rara
              <br />
              merece <span className="text-gradient-hero">quem a complete.</span>
            </h2>
            <p className="mt-5 text-[#a6aabf] text-lg leading-relaxed max-w-md">
              Não é venda. Não é leilão. É troca direta entre coletores — com
              camadas de segurança que marketplaces tradicionais não têm.
            </p>
            <div className="mt-8 space-y-3">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#4ff325] mt-0.5 fill-current" />
                <div>
                  <p className="font-semibold text-sm text-[#e1e4fa]">
                    Pontos de encontro validados
                  </p>
                  <p className="text-xs text-[#a6aabf] mt-0.5">
                    Locais públicos e movimentados, validados por moderação.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="w-5 h-5 text-[#4ff325] mt-0.5 fill-current" />
                <div>
                  <p className="font-semibold text-sm text-[#e1e4fa]">
                    Chat com rate-limiting + sanitização
                  </p>
                  <p className="text-xs text-[#a6aabf] mt-0.5">
                    Anti-spam, anti-link malicioso, denúncia em 1 toque.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <BadgeCheck className="w-5 h-5 text-[#4ff325] mt-0.5 fill-current" />
                <div>
                  <p className="font-semibold text-sm text-[#e1e4fa]">
                    Reputação verificada
                  </p>
                  <p className="text-xs text-[#a6aabf] mt-0.5">
                    Cada troca acumula reviews. 4.9★ é o piso da comunidade.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl bg-[#13192b] border border-white/5 overflow-hidden shadow-ambient-lg">
            <div className="grid grid-cols-3 border-b border-white/5">
              <div className="p-5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#a6aabf]">
                  Comparação
                </p>
              </div>
              <div className="p-5 bg-[#95aaff]/5 border-l border-[#95aaff]/20">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#95aaff]">
                  FigurinhaFácil
                </p>
                <p className="font-bold mt-1 text-[#e1e4fa]">Troca direta</p>
              </div>
              <div className="p-5 border-l border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#a6aabf]">
                  Marketplace tradicional
                </p>
                <p className="font-bold mt-1 text-[#a6aabf]">Mercado Livre</p>
              </div>
            </div>
            <div className="divide-y divide-white/5 text-sm">
              {COMPARE_TABLE.rows.map((row) => (
                <div key={row.label} className="grid grid-cols-3">
                  <div className="p-4 text-[#a6aabf]">{row.label}</div>
                  <div className="p-4 bg-[#95aaff]/5 border-l border-[#95aaff]/20 text-[#4ff325] font-semibold">
                    {row.ff}
                  </div>
                  <div className="p-4 border-l border-white/5 text-[#a6aabf]">
                    {row.ml}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 text-center font-semibold text-lg md:text-xl text-[#a6aabf] max-w-2xl mx-auto">
          &ldquo;<span className="text-[#e1e4fa]">Encontre collectors como você.</span>
          &rdquo;
          <span className="block mt-1 text-xs font-mono text-[#a6aabf]">
            — a comunidade, não a transação.
          </span>
        </p>
      </div>
    </section>
  );
}
