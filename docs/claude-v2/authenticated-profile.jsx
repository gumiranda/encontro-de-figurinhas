// Authenticated profile (the user's own profile, with edit affordances).

function AuthenticatedProfile() {
  const [tab, setTab] = React.useState("duplicates");
  const me = window.ME;

  return (
    <div className="app-surface min-h-full flex flex-col" style={{ minHeight: 1100 }}>
      <AppHeader
        title="Meu perfil"
        action={
          <div className="flex items-center gap-2">
            <button className="btn-icon" aria-label="Configurações">
              <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>settings</span>
            </button>
            <button className="btn-icon" aria-label="Sair">
              <span className="material-symbols-outlined" style={{ fontSize: "1.125rem" }}>logout</span>
            </button>
          </div>
        }
      />

      <main className="flex-1 px-4 py-6 space-y-5">
        {/* Identity card */}
        <section className="card-elevated p-5 shadow-ambient-lg relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative flex items-start gap-4">
            <Avatar initials={me.initials} size={80} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="font-headline font-bold text-xl truncate">@{me.displayNickname}</h1>
                {me.isVerified && (
                  <span className="material-symbols-outlined icon-fill text-primary" style={{ fontSize: "1rem" }}>verified</span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>location_on</span>
                {me.city}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <StarRating value={me.ratingAvg} count={me.ratingCount} />
              </div>
            </div>
            <button className="btn-icon" aria-label="Editar perfil">
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>edit</span>
            </button>
          </div>
          <p className="text-sm text-on-surface-variant mt-4 leading-relaxed">{me.bio}</p>

          {/* CTA: share own profile */}
          <div className="mt-5 flex gap-2">
            <button className="btn-primary flex-1">
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>share</span>
              Compartilhar meu perfil
            </button>
            <button className="btn-secondary !px-3" aria-label="Copiar link">
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>link</span>
            </button>
            <button className="btn-secondary !px-3" aria-label="QR code">
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>qr_code_2</span>
            </button>
          </div>
        </section>

        {/* Album progress */}
        <section className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-headline font-bold text-base">Progresso do álbum</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Copa do Mundo 2026</p>
            </div>
            <span className="eyebrow eyebrow-green">
              <span className="pulse-dot"></span> Sincronizado
            </span>
          </div>
          <ProgressBar progress={me.albumProgress} total={me.albumTotal} />
          <div className="grid grid-cols-3 gap-2 mt-4">
            <StatPill icon="auto_stories" label="Coladas" value={me.albumProgress} color="primary" />
            <StatPill icon="content_copy" label="Repetidas" value={DUPLICATES.reduce((s, d) => s + (d.qty - 1), 0)} color="secondary" />
            <StatPill icon="search" label="Faltando" value={NEEDS.length + 320} color="tertiary" />
          </div>
        </section>

        {/* Tabs: minhas repetidas / faltam / trocas */}
        <section>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <button
              className={`tab ${tab === "duplicates" ? "active" : ""}`}
              onClick={() => setTab("duplicates")}>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>content_copy</span>
              Repetidas <span className="font-mono text-[10px] opacity-70">{DUPLICATES.length}</span>
            </button>
            <button
              className={`tab ${tab === "needs" ? "active" : ""}`}
              onClick={() => setTab("needs")}>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>search</span>
              Faltam <span className="font-mono text-[10px] opacity-70">{NEEDS.length}</span>
            </button>
            <button
              className={`tab ${tab === "trades" ? "active" : ""}`}
              onClick={() => setTab("trades")}>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>history</span>
              Trocas <span className="font-mono text-[10px] opacity-70">{me.totalTrades}</span>
            </button>
          </div>

          {tab === "duplicates" && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-on-surface-variant">
                  Disponíveis para troca · <span className="text-secondary font-mono">{DUPLICATES.reduce((s, d) => s + (d.qty - 1), 0)} unidades</span>
                </p>
                <button className="text-[11px] font-headline font-semibold text-primary uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>add</span>
                  Adicionar
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {DUPLICATES.map(d => <Sticker key={d.code} {...d} />)}
              </div>
            </div>
          )}

          {tab === "needs" && (
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-on-surface-variant">
                  Você precisa de <span className="text-primary font-mono">{NEEDS.length} figurinhas</span>
                </p>
                <button className="text-[11px] font-headline font-semibold text-primary uppercase tracking-widest flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>filter_list</span>
                  Filtrar
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {NEEDS.map(n => <NeedSticker key={n.code} {...n} />)}
              </div>
            </div>
          )}

          {tab === "trades" && (
            <div className="card p-4 space-y-2">
              {RECENT_TRADES.map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-high border border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 grid place-items-center text-xs font-headline font-bold text-primary">
                    {t.with.slice(1, 3).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-semibold text-sm">{t.with}</p>
                    <p className="text-xs text-on-surface-variant font-mono">
                      <span className="text-secondary">+{t.got}</span>
                      {" · "}
                      <span className="text-on-surface-variant">−{t.gave}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <StarRating value={t.rating} />
                    <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{t.when}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}

window.AuthenticatedProfile = AuthenticatedProfile;
