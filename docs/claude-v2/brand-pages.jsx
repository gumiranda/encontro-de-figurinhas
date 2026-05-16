// ─────────────────────────────────────────────────────────────
// SPEC PAGE 01 — A marca + construção + zona de proteção
// ─────────────────────────────────────────────────────────────

function PageMark() {
  return (
    <div className="bg-paper p-12" style={{ width: "100%", height: "100%" }}>
      <div className="flex items-center justify-between mb-8">
        <span className="ribbon-num">01 · A MARCA</span>
        <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>Identidade visual · v1</span>
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h1 className="ff-display" style={{ fontSize: 56, lineHeight: 1, color: "var(--navy-800)" }}>
            A marca em <span style={{ color: "var(--lime-700)" }}>movimento</span>.
          </h1>
          <p className="mt-4 max-w-2xl" style={{ fontSize: 17, lineHeight: 1.5, color: "var(--ink-60)" }}>
            FigurinhaFácil é a troca direta entre colecionadores. A marca representa exatamente isso:
            duas figurinhas inclinadas uma em direção à outra, conectadas por um ponto central. As setas
            indicam que ninguém é só doador ou só receptor — é uma troca real.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Big presentation of the mark */}
          <div className="spec flex items-center justify-center" style={{ minHeight: 380, background: "var(--navy-800)" }}>
            <FFLockup variant="stack" size="lg" surface="navy" />
          </div>
          <div className="spec" style={{ background: "var(--navy-800)" }}>
            <div className="flex items-center justify-center" style={{ height: 240 }}>
              <FFMark size={220} />
            </div>
            <div className="border-t border-white/10 pt-4 mt-2 grid grid-cols-3 gap-3 text-white">
              <div>
                <p className="ff-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Símbolo</p>
                <p className="ff-display text-sm mt-1">Duas figurinhas em troca</p>
              </div>
              <div>
                <p className="ff-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Forma</p>
                <p className="ff-display text-sm mt-1">Paralelograma · 12% inclinação</p>
              </div>
              <div>
                <p className="ff-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Centro</p>
                <p className="ff-display text-sm mt-1">Ponto navy + 2 setas brancas</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Construction grid */}
          <div className="spec col-span-2">
            <p className="ribbon-num">CONSTRUÇÃO</p>
            <div className="grid-hairline mt-4 rounded-lg flex items-center justify-center" style={{ height: 220, background: "var(--navy-50)" }}>
              <FFMark size={180} />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 text-xs" style={{ color: "var(--ink-60)" }}>
              <div>
                <p className="ff-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Stroke</p>
                <p className="ff-display mt-0.5" style={{ color: "var(--ink)", fontSize: 13 }}>4% da altura</p>
              </div>
              <div>
                <p className="ff-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Raio canto</p>
                <p className="ff-display mt-0.5" style={{ color: "var(--ink)", fontSize: 13 }}>8% lado curto</p>
              </div>
              <div>
                <p className="ff-mono text-[10px] uppercase tracking-[0.18em] opacity-60">Inclinação</p>
                <p className="ff-display mt-0.5" style={{ color: "var(--ink)", fontSize: 13 }}>±6° por sticker</p>
              </div>
            </div>
          </div>

          {/* Clear space */}
          <div className="spec">
            <p className="ribbon-num">ZONA DE PROTEÇÃO</p>
            <div className="mt-4 rounded-lg p-6 flex items-center justify-center" style={{ background: "var(--navy-50)", height: 220 }}>
              <div style={{ position: "relative", padding: 28 }}>
                <div style={{ position: "absolute", inset: 0, border: "1.5px dashed rgba(16,62,133,0.3)", borderRadius: 6 }}></div>
                <FFMark size={120} />
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: "var(--ink-60)" }}>
              Margem mínima = altura do ponto central, em todos os lados.
            </p>
          </div>
        </div>

        {/* Min size */}
        <div className="spec">
          <div className="flex items-center justify-between">
            <p className="ribbon-num">TAMANHO MÍNIMO</p>
            <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>nunca abaixo destes valores</span>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-5">
            <div className="text-center">
              <div className="rounded-lg p-6 flex items-center justify-center" style={{ background: "var(--navy-50)", height: 100 }}>
                <FFMark size={32} />
              </div>
              <p className="ff-mono text-xs mt-3 font-bold">24px · só símbolo</p>
              <p className="text-xs mt-1" style={{ color: "var(--ink-60)" }}>Favicon, avatar</p>
            </div>
            <div className="text-center">
              <div className="rounded-lg p-6 flex items-center justify-center" style={{ background: "var(--navy-50)", height: 100 }}>
                <FFLockup variant="horizontal" size="sm" surface="paper" />
              </div>
              <p className="ff-mono text-xs mt-3 font-bold">120px · lockup horizontal</p>
              <p className="text-xs mt-1" style={{ color: "var(--ink-60)" }}>Header, e-mail</p>
            </div>
            <div className="text-center">
              <div className="rounded-lg p-6 flex items-center justify-center" style={{ background: "var(--navy-50)", height: 100 }}>
                <FFLockup variant="stack" size="sm" surface="paper" />
              </div>
              <p className="ff-mono text-xs mt-3 font-bold">96px · lockup vertical</p>
              <p className="text-xs mt-1" style={{ color: "var(--ink-60)" }}>Print, social card</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPEC PAGE 02 — Cores
// ─────────────────────────────────────────────────────────────

function PageColors() {
  const primary = [
    { name: "Navy 800",  hex: "#103e85", usage: "Primária · fundos, headers", text: "#fff" },
    { name: "Lime 500",  hex: "#7ed635", usage: "Acento · CTA, destaque",     text: "#0a2a5e" },
  ];
  const support = [
    { name: "Navy 900",  hex: "#0a2a5e", usage: "Profundidade",   text: "#fff" },
    { name: "Cyan 500",  hex: "#2cb1e6", usage: "Sticker secundária", text: "#0a2a5e" },
    { name: "Lime 700",  hex: "#4d8a1e", usage: "Lime sobre branco",  text: "#fff" },
    { name: "Ink",       hex: "#0a1530", usage: "Texto sobre branco", text: "#fff" },
    { name: "Paper",     hex: "#f5f3ec", usage: "Fundo claro",        text: "#0a1530" },
  ];

  return (
    <div className="bg-paper p-12" style={{ width: "100%", height: "100%" }}>
      <div className="flex items-center justify-between mb-8">
        <span className="ribbon-num">02 · CORES</span>
        <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>extraídas direto do logo</span>
      </div>

      <h1 className="ff-display mb-3" style={{ fontSize: 56, lineHeight: 1, color: "var(--navy-800)" }}>
        Marinho que sustenta.
        <br /><span style={{ color: "var(--lime-700)" }}>Lime que decide.</span>
      </h1>
      <p className="max-w-2xl mb-10" style={{ fontSize: 17, lineHeight: 1.5, color: "var(--ink-60)" }}>
        Duas cores carregam a marca. Navy é o oceano onde tudo se passa. Lime é o lance —
        a CTA, a notificação, a peça que salta. Use como 80/20.
      </p>

      <div className="mb-10">
        <p className="ribbon-num mb-4">PALETA PRIMÁRIA</p>
        <div className="grid grid-cols-2 gap-5">
          {primary.map(c => (
            <div key={c.hex} className="chip">
              <div className="swatch" style={{ background: c.hex, height: 180 }}>
                <span className="ff-display" style={{ fontSize: 36, color: c.text }}>{c.name}</span>
              </div>
              <div className="meta">
                <div className="flex items-baseline justify-between">
                  <span className="ff-mono text-sm font-bold">{c.hex.toUpperCase()}</span>
                  <span className="text-xs" style={{ color: "var(--ink-60)" }}>{c.usage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <p className="ribbon-num mb-4">PALETA DE SUPORTE</p>
        <div className="grid grid-cols-5 gap-3">
          {support.map(c => (
            <div key={c.hex} className="chip">
              <div className="swatch" style={{ background: c.hex, height: 90 }}></div>
              <div className="meta" style={{ padding: "10px 12px" }}>
                <span className="ff-display text-sm" style={{ fontSize: 13 }}>{c.name}</span>
                <span className="ff-mono text-[11px] font-bold">{c.hex.toUpperCase()}</span>
                <span className="text-[10px]" style={{ color: "var(--ink-60)" }}>{c.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="spec" style={{ background: "var(--navy-800)" }}>
          <p className="ribbon-num" style={{ color: "var(--lime-500)" }}>USO 80 / 20</p>
          <div className="flex items-end gap-1 mt-4 h-24">
            <div style={{ background: "var(--navy-800)", border: "2px solid #fff", flex: 80, height: "100%", borderRadius: 8 }}></div>
            <div style={{ background: "var(--lime-500)", flex: 20, height: "100%", borderRadius: 8 }}></div>
          </div>
          <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.6)" }}>
            80% navy + 20% lime. Lime nunca vira fundo dominante — fica na ação.
          </p>
        </div>
        <div className="spec">
          <p className="ribbon-num">CONTRASTE</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            {[
              { bg:"#103e85", fg:"#fff", ratio:"10.9:1", label:"Navy + branco" },
              { bg:"#103e85", fg:"#7ed635", ratio:"5.1:1", label:"Navy + lime" },
              { bg:"#7ed635", fg:"#0a2a5e", ratio:"7.6:1", label:"Lime + navy" },
              { bg:"#fff",   fg:"#103e85", ratio:"10.9:1", label:"Branco + navy" },
            ].map(p => (
              <div key={p.label} className="rounded p-2 ff-display" style={{ background: p.bg, color: p.fg, fontSize: 11 }}>
                <div className="font-bold">{p.label}</div>
                <div className="ff-mono text-[10px] mt-1 opacity-80">AAA · {p.ratio}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="spec">
          <p className="ribbon-num">RARIDADE NO PRODUTO</p>
          <div className="space-y-2 mt-3">
            {[
              { name:"Comum",   pct:"82%", color:"#a4abc1" },
              { name:"Especial", pct:"15%", color:"#2cb1e6" },
              { name:"Lendária", pct:"3%",  color:"#7ed635" },
            ].map(r => (
              <div key={r.name} className="flex items-center gap-3">
                <div style={{ width: 14, height: 14, background: r.color, borderRadius: 4 }}></div>
                <span className="ff-display text-xs flex-1">{r.name}</span>
                <span className="ff-mono text-xs font-bold">{r.pct}</span>
              </div>
            ))}
            <p className="text-[10px] mt-3" style={{ color: "var(--ink-60)" }}>
              Cyan e lime classificam raridade dentro do app — não invente novas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPEC PAGE 03 — Tipografia + voz
// ─────────────────────────────────────────────────────────────

function PageType() {
  return (
    <div className="bg-paper p-12" style={{ width: "100%", height: "100%" }}>
      <div className="flex items-center justify-between mb-8">
        <span className="ribbon-num">03 · TIPOGRAFIA & VOZ</span>
        <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>Poppins + Inter + JetBrains Mono</span>
      </div>

      <h1 className="ff-display mb-3" style={{ fontSize: 56, lineHeight: 1, color: "var(--navy-800)" }}>
        Direto. Sem firula. <br />
        <span style={{ color: "var(--lime-700)" }}>Tipo conversa de mesa.</span>
      </h1>
      <p className="max-w-2xl mb-10" style={{ fontSize: 17, color: "var(--ink-60)" }}>
        Poppins black para títulos — geométrica, lowercase, mesma da marca.
        Inter para texto. Mono para códigos de figurinha (BRA-10, ARG-09, MEX-09).
      </p>

      {/* Type stack */}
      <div className="grid grid-cols-3 gap-5 mb-8">
        <div className="spec">
          <div className="flex items-baseline justify-between mb-3">
            <span className="ff-display" style={{ fontSize: 28, color: "var(--navy-800)" }}>Poppins</span>
            <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>Display · 800 / 900</span>
          </div>
          <p style={{ fontFamily:"Poppins", fontWeight:800, fontSize: 64, lineHeight: 0.85, color:"var(--ink)", letterSpacing:"-0.04em" }}>Aa</p>
          <div className="ff-mono text-[10px] mt-2" style={{ color: "var(--ink-60)" }}>
            ABCDEFGHIJKLM<br />0123456789 · áéíóú
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--ink-60)" }}>
            Headlines, CTA, números. Sempre lowercase em headlines (igual à marca).
          </p>
        </div>
        <div className="spec">
          <div className="flex items-baseline justify-between mb-3">
            <span className="ff-display" style={{ fontSize: 28, color: "var(--navy-800)" }}>Inter</span>
            <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>Texto · 400 / 500 / 700</span>
          </div>
          <p style={{ fontFamily:"Inter", fontWeight:700, fontSize: 64, lineHeight: 0.85, color:"var(--ink)" }}>Aa</p>
          <div className="ff-mono text-[10px] mt-2" style={{ color: "var(--ink-60)" }}>
            ABCDEFGHIJKLM<br />0123456789 · áéíóú
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--ink-60)" }}>
            Corpo, parágrafos, formulários. Sempre 16px+ no produto.
          </p>
        </div>
        <div className="spec">
          <div className="flex items-baseline justify-between mb-3">
            <span className="ff-display" style={{ fontSize: 28, color: "var(--navy-800)" }}>JetBrains Mono</span>
            <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>Códigos · 600 / 700</span>
          </div>
          <p style={{ fontFamily:"JetBrains Mono", fontWeight:700, fontSize: 56, lineHeight: 0.85, color:"var(--ink)", letterSpacing:"0.02em" }}>BRA-10</p>
          <div className="ff-mono text-[10px] mt-2" style={{ color: "var(--ink-60)" }}>
            BRA-10 · ARG-09 · FRA-19<br />MEX-09 · BRA-FWC
          </div>
          <p className="text-xs mt-3" style={{ color: "var(--ink-60)" }}>
            <strong>SEMPRE</strong> use o código da figurinha (formato XYZ-NN), nunca o número cru.
          </p>
        </div>
      </div>

      {/* Type scale */}
      <div className="spec mb-8">
        <p className="ribbon-num mb-4">ESCALA TIPOGRÁFICA</p>
        <div className="space-y-1">
          {[
            { tag: "Display 1 — H1", sz: 64, w: 800, fam: "Poppins", text: "encontre quem completa o seu álbum.", caseLow: true },
            { tag: "Display 2 — H2", sz: 44, w: 800, fam: "Poppins", text: "como funciona", caseLow: true },
            { tag: "Title — H3",     sz: 24, w: 700, fam: "Poppins", text: "Repetidas disponíveis", caseLow: false },
            { tag: "Body L",         sz: 18, w: 400, fam: "Inter",   text: "Você cadastra suas figurinhas. A gente acha quem tem o que falta no seu álbum.", caseLow: false },
            { tag: "Body M",         sz: 15, w: 400, fam: "Inter",   text: "Mensagem padrão de corpo do site e do app.", caseLow: false },
            { tag: "Code",           sz: 13, w: 700, fam: "JetBrains Mono", text: "BRA-10  ·  ARG-09  ·  MEX-09", caseLow: false },
          ].map(t => (
            <div key={t.tag} className="flex items-baseline gap-6 py-3 border-b last:border-0" style={{ borderColor: "rgba(10,21,48,0.06)" }}>
              <div className="ff-mono text-[10px] uppercase tracking-[0.16em] flex-shrink-0" style={{ width: 130, color: "var(--ink-60)" }}>{t.tag}</div>
              <div style={{ fontFamily: t.fam, fontWeight: t.w, fontSize: t.sz, lineHeight: 1.05, color: "var(--ink)", letterSpacing: t.fam==="Poppins" ? "-0.03em" : 0 }}>
                {t.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice */}
      <div className="grid grid-cols-2 gap-5">
        <div className="voice-card do">
          <p className="ff-mono text-[10px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: "var(--lime-700)" }}>✓ ESCREVA ASSIM</p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--ink)" }}>
            <li>• "Encontre quem tem a sua BRA-10."</li>
            <li>• "Sem taxa. Só troca."</li>
            <li>• "Você tem 6 repetidas. Bora trocar?"</li>
            <li>• "Marina, você tem o que ele procura."</li>
          </ul>
          <p className="text-xs mt-4" style={{ color: "var(--ink-60)" }}>
            Curto. Brasileiro. Direto. Frase curta + verbo de ação. Sempre 2ª pessoa.
          </p>
        </div>
        <div className="voice-card dont">
          <p className="ff-mono text-[10px] uppercase tracking-[0.18em] font-bold mb-3" style={{ color: "#9b3030" }}>✗ NÃO ESCREVA ASSIM</p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--ink)" }}>
            <li>• "Nossa plataforma utiliza algoritmos…"</li>
            <li>• "Bora bater perna no Mercado Livre? 😜"</li>
            <li>• "Adquira sua figurinha 10."</li>
            <li>• "Conecte-se a entusiastas da modalidade."</li>
          </ul>
          <p className="text-xs mt-4" style={{ color: "var(--ink-60)" }}>
            Sem corporativês. Sem gírias forçadas. Sem emojis na cópia oficial.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SPEC PAGE 04 — Don'ts + variações de uso
// ─────────────────────────────────────────────────────────────

function PageVariations() {
  return (
    <div className="bg-paper p-12" style={{ width: "100%", height: "100%" }}>
      <div className="flex items-center justify-between mb-8">
        <span className="ribbon-num">04 · APLICAÇÃO</span>
        <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>variantes válidas + o que evitar</span>
      </div>

      <h1 className="ff-display mb-3" style={{ fontSize: 56, lineHeight: 1, color: "var(--navy-800)" }}>
        Quando, onde, e <span style={{ color: "var(--lime-700)" }}>como não</span>.
      </h1>

      <div className="grid grid-cols-4 gap-4 mt-8 mb-10">
        <div className="spec text-center" style={{ background: "var(--navy-800)" }}>
          <p className="ff-mono text-[10px] uppercase tracking-[0.18em] mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>Padrão · navy</p>
          <div className="flex items-center justify-center" style={{ height: 130 }}>
            <FFLockup variant="stack" size="md" surface="navy" />
          </div>
        </div>
        <div className="spec text-center" style={{ background: "var(--paper-2)" }}>
          <p className="ff-mono text-[10px] uppercase tracking-[0.18em] mb-3" style={{ color: "var(--ink-60)" }}>Sobre claro</p>
          <div className="flex items-center justify-center" style={{ height: 130 }}>
            <FFLockup variant="stack" size="md" surface="paper" />
          </div>
        </div>
        <div className="spec text-center" style={{ background: "var(--lime-500)" }}>
          <p className="ff-mono text-[10px] uppercase tracking-[0.18em] mb-3" style={{ color: "var(--navy-900)", opacity: 0.7 }}>Sobre lime</p>
          <div className="flex items-center justify-center" style={{ height: 130 }}>
            <FFLockup variant="stack" size="md" surface="lime" />
          </div>
        </div>
        <div className="spec text-center bg-ink">
          <p className="ff-mono text-[10px] uppercase tracking-[0.18em] mb-3 text-white/50">Mono · branco</p>
          <div className="flex items-center justify-center" style={{ height: 130 }}>
            <FFMark size={120} monochrome="white" />
          </div>
        </div>
      </div>

      {/* DON'TS */}
      <p className="ribbon-num mb-4" style={{ color: "#9b3030" }}>O QUE NÃO FAZER</p>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Não esticar",     style: { transform: "scale(1.4, 0.7)" } },
          { label: "Não rotacionar",  style: { transform: "rotate(15deg)" } },
          { label: "Não trocar cores", swap: true },
          { label: "Não colocar sombra", glow: true },
          { label: "Não adicionar contorno", outline: true },
          { label: "Não sobrepor texto", overlay: true },
          { label: "Não usar gradiente fora da paleta", grad: true },
          { label: "Não combinar com outro logo", combo: true },
        ].map((d, i) => (
          <div key={i} className="spec relative" style={{ minHeight: 160 }}>
            <span className="absolute top-3 right-3" style={{ color: "#c43d3d", fontSize: 22 }}>✕</span>
            <div className="flex items-center justify-center" style={{ height: 100, background: "var(--navy-800)", borderRadius: 8, overflow:"hidden" }}>
              <div style={{
                ...d.style,
                filter: d.glow ? "drop-shadow(0 0 12px #ff3) drop-shadow(0 0 24px #f0f)" : null,
              }}>
                {d.swap ? (
                  <svg width="110" height="80" viewBox="0 0 200 144" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 38 18 L 96 14 L 100 116 L 34 124 Z" fill="#e91e63" stroke="#fff" strokeWidth="4"/>
                    <path d="M 100 14 L 162 18 L 166 124 L 100 116 Z" fill="#ff9800" stroke="#fff" strokeWidth="4"/>
                    <circle cx="100" cy="70" r="11" fill="#fff" stroke="#fff" strokeWidth="3"/>
                  </svg>
                ) : d.outline ? (
                  <div style={{ padding: 6, border: "3px solid #fff", borderRadius: 12 }}>
                    <FFMark size={90} />
                  </div>
                ) : d.overlay ? (
                  <div style={{ position: "relative" }}>
                    <FFMark size={100} />
                    <span className="absolute inset-0 flex items-center justify-center ff-display text-white" style={{ fontSize: 28, textShadow: "2px 2px #000" }}>SALE</span>
                  </div>
                ) : d.grad ? (
                  <svg width="100" height="72" viewBox="0 0 200 144" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="bad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ff00ff"/>
                        <stop offset="1" stopColor="#ffff00"/>
                      </linearGradient>
                    </defs>
                    <path d="M 38 18 L 96 14 L 100 116 L 34 124 Z" fill="url(#bad)" stroke="#fff" strokeWidth="4"/>
                    <path d="M 100 14 L 162 18 L 166 124 L 100 116 Z" fill="url(#bad)" stroke="#fff" strokeWidth="4"/>
                    <circle cx="100" cy="70" r="11" fill="#fff"/>
                  </svg>
                ) : d.combo ? (
                  <div className="flex items-center gap-2">
                    <FFMark size={70} />
                    <span style={{ fontSize: 24 }}>×</span>
                    <span className="ff-display" style={{ color: "#fff", fontSize: 18 }}>Marca X</span>
                  </div>
                ) : (
                  <FFMark size={100} />
                )}
              </div>
            </div>
            <p className="ff-mono text-xs mt-3 font-bold">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP MOCKUP 01 — Hero da landing page com a nova identidade
// ─────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <div className="hero-bleed pattern-stickers" style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      {/* Floating sticker decorations */}
      <div style={{ position: "absolute", left: -40, top: 80, transform: "rotate(-12deg)" }}>
        <div className="ff-tile cyan" style={{ width: 130 }}></div>
      </div>
      <div style={{ position: "absolute", right: -30, top: 200, transform: "rotate(8deg)" }}>
        <div className="ff-tile lime" style={{ width: 110 }}></div>
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 60, transform: "rotate(-4deg)" }}>
        <div className="ff-tile navy" style={{ width: 90, opacity: 0.6 }}></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-12 pt-8 relative z-10">
        <FFLockup variant="horizontal" size="sm" surface="navy" />
        <div className="flex items-center gap-3">
          <span className="eyebrow dark">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>radar</span>
            ao vivo · 847 trocas hoje
          </span>
          <button className="btn-pill primary">Entrar no app</button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-12" style={{ paddingTop: 70 }}>
        <div className="rotate-tape mb-6">COPA DO MUNDO 2026</div>
        <h1 className="ff-display" style={{ fontSize: 88, lineHeight: 0.92, color: "#fff", maxWidth: 900 }}>
          Encontre quem
          <br />
          <span style={{ color: "var(--lime-500)" }}>completa</span> o seu álbum.
        </h1>
        <p className="mt-6 max-w-xl" style={{ fontSize: 18, lineHeight: 1.5, color: "rgba(255,255,255,0.75)" }}>
          Cadastre suas repetidas e a gente acha alguém perto de você que tem o que falta.
          Sem taxa. Sem frete. Só troca.
        </p>
        <div className="flex gap-4 mt-8">
          <button className="btn-pill primary" style={{ padding: "16px 28px", fontSize: 14 }}>
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18 }}>swap_horiz</span>
            Ver propostas perto de mim
          </button>
          <button className="btn-pill ghost" style={{ padding: "16px 28px", fontSize: 14 }}>
            Como funciona
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_outward</span>
          </button>
        </div>

        {/* Stat row */}
        <div className="flex gap-8 mt-12 text-center">
          {[
            { num: "847k", label: "figurinhas trocadas" },
            { num: "32", label: "seleções" },
            { num: "0", label: "taxa cobrada" },
          ].map(s => (
            <div key={s.label}>
              <div className="ff-display" style={{ fontSize: 36, color: "var(--lime-500)" }}>{s.num}</div>
              <div className="ff-mono text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// APP MOCKUP 02 — Tela do app (mobile) + app icon
// ─────────────────────────────────────────────────────────────

function PageMobile() {
  return (
    <div className="bg-paper p-12" style={{ width: "100%", height: "100%" }}>
      <div className="flex items-center justify-between mb-8">
        <span className="ribbon-num">06 · NO PRODUTO</span>
        <span className="ff-mono text-xs" style={{ color: "var(--ink-60)" }}>app + ícone</span>
      </div>

      <h1 className="ff-display mb-3" style={{ fontSize: 48, lineHeight: 1, color: "var(--navy-800)" }}>
        Como vive na <span style={{ color: "var(--lime-700)" }}>tela</span>.
      </h1>

      <div className="grid grid-cols-3 gap-8 mt-10 items-center">
        {/* Phone mock */}
        <div className="flex justify-center">
          <div className="phone">
            <div className="phone-screen">
              {/* Status bar mimic */}
              <div className="flex items-center justify-between px-5 pt-7 text-white text-xs ff-mono">
                <span>9:41</span>
                <span>●●● ▾</span>
              </div>
              {/* Content */}
              <div className="px-4 pt-6">
                <FFLockup variant="horizontal" size="sm" surface="navy" />
              </div>
              <div className="px-4 mt-4">
                <p className="ff-display text-white" style={{ fontSize: 22, lineHeight: 1, letterSpacing: "-0.02em" }}>
                  oi, lucas. <br />
                  <span style={{ color: "var(--lime-500)" }}>3 propostas</span> novas.
                </p>
              </div>
              <div className="mx-4 mt-5 rounded-xl p-4" style={{ background: "rgba(255,255,255,0.08)", backdropFilter:"blur(8px)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 32, height: 32, borderRadius: 99, background: "var(--cyan-500)" }}></div>
                    <div>
                      <p className="ff-display text-white text-sm">@marina.s</p>
                      <p className="ff-mono text-[9px] text-white/50">a 2 min · 1.2 km</p>
                    </div>
                  </div>
                  <span className="code-pill" style={{ background:"rgba(126,214,53,0.2)", color:"var(--lime-500)", fontSize: 9 }}>BRA-10</span>
                </div>
                <div className="grid grid-cols-3 gap-1 mt-3">
                  {["BRA-10","ARG-07","FRA-19"].map(c => (
                    <div key={c} className="ff-tile cyan" style={{ aspectRatio: "3/4", borderWidth: 1.5 }}>
                      <span className="absolute bottom-1 left-1 ff-mono text-[7px] font-bold text-white">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mx-4 mt-3 rounded-xl p-3 flex items-center justify-between" style={{ background: "var(--lime-500)" }}>
                <span className="ff-display text-sm" style={{ color: "var(--navy-900)" }}>Aceitar troca</span>
                <span className="material-symbols-outlined icon-fill" style={{ color: "var(--navy-900)", fontSize: 18 }}>arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

        {/* App icon stack */}
        <div className="text-center">
          <p className="ribbon-num mb-4 inline-flex">APP ICON · iOS</p>
          <div className="flex flex-col items-center gap-4">
            <FFAppIcon size={180} />
            <FFAppIcon size={120} />
            <div className="flex items-center gap-2 mt-2">
              <FFAppIcon size={56} />
              <FFAppIcon size={40} />
              <FFAppIcon size={28} />
            </div>
            <p className="ff-mono text-xs mt-3" style={{ color: "var(--ink-60)" }}>
              1024 · 180 · 60 · 40 · 29 px
            </p>
          </div>
        </div>

        {/* Notification + share */}
        <div className="space-y-4">
          <p className="ribbon-num">PUSH NOTIFICATION</p>
          <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.95)", backdropFilter:"blur(20px)", border: "1px solid rgba(0,0,0,0.06)", boxShadow:"0 12px 30px -10px rgba(10,21,48,0.2)" }}>
            <div className="flex items-start gap-3">
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--navy-800)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FFMark size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="ff-display text-xs font-bold">FigurinhaFácil</span>
                  <span className="ff-mono text-[10px]" style={{ color: "var(--ink-60)" }}>agora</span>
                </div>
                <p className="text-sm mt-1" style={{ color: "var(--ink)" }}>
                  <strong>@marina.s</strong> tem a sua <span className="ff-mono font-bold">BRA-10</span>. A 1.2 km de você.
                </p>
              </div>
            </div>
          </div>

          <p className="ribbon-num pt-4">SHARE CARD · WHATSAPP</p>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(10,21,48,0.1)" }}>
            <div className="bg-navy p-4">
              <div className="flex items-center gap-2">
                <FFMark size={32} />
                <span className="ff-display text-white text-sm">figurinhafácil</span>
              </div>
              <div className="mt-3">
                <div className="ff-display text-white" style={{ fontSize: 22, lineHeight: 1 }}>@lucas.f</div>
                <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span className="ff-mono">62.4% completo</span>
                  <span>·</span>
                  <span className="ff-mono">18 repetidas</span>
                </div>
              </div>
              <div className="mt-3 flex gap-1">
                {["BRA-10","ARG-07","FRA-19","POR-07","GER-13"].map(c => (
                  <div key={c} className="ff-tile cyan" style={{ width: 28, aspectRatio:"3/4", borderWidth: 1.5 }}></div>
                ))}
              </div>
            </div>
            <div className="bg-white p-3 flex items-center justify-between">
              <span className="ff-mono text-[10px]" style={{ color: "var(--ink-60)" }}>figurinhafacil.com.br/u/lucas-f</span>
              <span className="ff-display text-xs" style={{ color: "var(--lime-700)" }}>abrir →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PageMark, PageColors, PageType, PageVariations, PageHero, PageMobile });
