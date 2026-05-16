// Public shareable profile — the page friends/anyone open via link or QR.
// Read-only, optimized to be skim-able and to drive a WhatsApp DM.

function PublicProfile() {
  const u = window.PUBLIC_USER;
  const dupTotal = DUPLICATES.reduce((s, d) => s + (d.qty - 1), 0);

  return (
    <div className="app-surface min-h-full flex flex-col" style={{ minHeight: 1100 }}>
      <AppHeader
        title="figurinhafacil.com.br"
        back
        action={
          <button className="btn-icon" aria-label="Mais opções">
            <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>more_horiz</span>
          </button>
        }
      />

      <main className="flex-1 px-4 py-6 space-y-5">
        {/* Hero identity — bigger, more inviting */}
        <section className="card-elevated p-6 shadow-ambient-lg relative overflow-hidden text-center">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,201,101,0.12), transparent 70%)"
          }}></div>
          <div className="relative flex flex-col items-center">
            <Avatar initials={u.initials} size={88} public />
            <div className="flex items-center gap-1.5 mt-3">
              <h1 className="font-headline font-bold text-2xl">@{u.displayNickname}</h1>
              {u.isVerified && (
                <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: "1.125rem" }}>verified</span>
              )}
            </div>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>location_on</span>
              {u.city} · desde {u.joinedAt}
            </p>

            {/* Trust row */}
            <div className="grid grid-cols-3 gap-3 mt-5 w-full">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined icon-fill text-tertiary" style={{ fontSize: "1rem" }}>star</span>
                  <span className="font-headline font-bold text-lg">{u.ratingAvg}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-mono mt-0.5">{u.ratingCount} reviews</p>
              </div>
              <div className="text-center border-x border-white/5">
                <p className="font-headline font-bold text-lg text-secondary">{u.totalTrades}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-mono mt-0.5">trocas</p>
              </div>
              <div className="text-center">
                <p className="font-headline font-bold text-lg text-primary">{((u.albumProgress / u.albumTotal) * 100).toFixed(0)}%</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-mono mt-0.5">álbum</p>
              </div>
            </div>
          </div>
        </section>

        {/* Album progress — same component, but read-only framing */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline font-bold text-base">Álbum Copa 2026</h2>
            <span className="eyebrow"><span className="material-symbols-outlined" style={{ fontSize: "0.75rem" }}>auto_stories</span> Em andamento</span>
          </div>
          <ProgressBar progress={u.albumProgress} total={u.albumTotal} />
        </section>

        {/* DUPLICATES — the headline section, what visitors care about most */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-headline font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined icon-fill text-secondary" style={{ fontSize: "1.25rem" }}>content_copy</span>
              Repetidas disponíveis
            </h2>
            <span className="font-mono text-secondary text-sm font-bold">{dupTotal}</span>
          </div>
          <p className="text-xs text-on-surface-variant mb-4">
            Disponíveis para troca · clica para propor
          </p>
          <div className="grid grid-cols-4 gap-2">
            {DUPLICATES.map(d => <Sticker key={d.code} {...d} />)}
          </div>
        </section>

        {/* NEEDS */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-headline font-bold text-lg flex items-center gap-2">
              <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: "1.25rem" }}>search</span>
              Procurando
            </h2>
            <span className="font-mono text-primary text-sm font-bold">{NEEDS.length}</span>
          </div>
          <p className="text-xs text-on-surface-variant mb-4">
            Tem alguma? Mande proposta.
          </p>
          <div className="grid grid-cols-4 gap-2">
            {NEEDS.map(n => <NeedSticker key={n.code} {...n} />)}
          </div>
        </section>

        {/* CTA propose trade */}
        <section className="card-elevated p-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(149,170,255,0.15), transparent 70%)"
          }}></div>
          <div className="relative">
            <h3 className="font-headline font-bold text-lg leading-tight">
              Tem o que <span className="text-gradient">@{u.displayNickname}</span> procura?
            </h3>
            <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs mx-auto">
              Mande uma proposta direta. Encontro em local público — Vila Madalena ou metrô.
            </p>
            <div className="flex flex-col gap-2 mt-5">
              <button className="btn-primary w-full !h-12">
                <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>swap_horiz</span>
                Propor troca
              </button>
              <button className="btn-whatsapp">
                <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>chat</span>
                Conversar no WhatsApp
              </button>
            </div>
          </div>
        </section>

        {/* QR + share row — present to encourage forward-share */}
        <section className="card p-5">
          <div className="flex gap-4 items-center">
            <div style={{ width: 96, flex: "0 0 96px" }}>
              <QRCodeViz />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant mb-1">URL pública</p>
              <p className="font-mono text-sm text-on-surface truncate">figurinhafacil.com.br/u/{u.nickname}</p>
              <div className="flex gap-2 mt-3">
                <button className="btn-secondary !h-9 !text-xs flex-1">
                  <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>content_copy</span>
                  Copiar link
                </button>
                <button className="btn-secondary !h-9 !text-xs !px-3" aria-label="Compartilhar">
                  <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>share</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer / trust */}
        <section className="text-center py-4">
          <p className="text-[11px] text-on-surface-variant">
            Não é o seu perfil?{" "}
            <a href="#" className="text-primary font-semibold">Entrar no FigurinhaFácil →</a>
          </p>
        </section>
      </main>
    </div>
  );
}

window.PublicProfile = PublicProfile;
