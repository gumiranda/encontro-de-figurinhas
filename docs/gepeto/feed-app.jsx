/* global React, Avatar, Icon, Section */
const { useState: useFState, useMemo: useFMemo } = React;

const FEED_CITIES = [
  { id: "all", label: "Todas as cidades", count: 1284 },
  { id: "sp", label: "São Paulo, SP", count: 312 },
  { id: "rj", label: "Rio de Janeiro, RJ", count: 187 },
  { id: "bh", label: "Belo Horizonte, MG", count: 94 },
  { id: "poa", label: "Porto Alegre, RS", count: 71 },
  { id: "cwb", label: "Curitiba, PR", count: 58 },
  { id: "rec", label: "Recife, PE", count: 42 },
];

const FEED_POSTS = [
  {
    id: "p1",
    author: { nick: "rafa_dias", name: "Rafael Dias", rating: 4.8 },
    city: "sp", cityLabel: "São Paulo, SP",
    when: "há 4 min",
    type: "needs",
    text: "Faltam essas 6 pra fechar o grupo C. Tenho várias raras pra trocar — chama!",
    stickers: [
      { code: "ESP-04", flag: "🇪🇸", num: "152" },
      { code: "URU-09", flag: "🇺🇾", num: "401" },
      { code: "FRA-07", flag: "🇫🇷", num: "088" },
      { code: "POR-08", flag: "🇵🇹", num: "134" },
      { code: "GER-21", flag: "🇩🇪", num: "276" },
      { code: "JAP-22", flag: "🇯🇵", num: "489" },
    ],
    have: 4, want: 12, comments: 7, likes: 23,
    canTrade: true,
  },
  {
    id: "p2",
    author: { nick: "ana.s", name: "Ana Souza", rating: 4.9 },
    city: "sp", cityLabel: "Pinheiros, SP",
    when: "há 22 min",
    type: "offers",
    text: "Tenho repetidas das raras douradas! Aceito troca por brilhantes ou figurinhas do Brasil. Posto sempre no Shopping Eldorado nos sábados.",
    stickers: [
      { code: "BRA-10", flag: "🇧🇷", num: "042", rare: true },
      { code: "ARG-09", flag: "🇦🇷", num: "118", rare: true },
      { code: "MEX-12", flag: "🇲🇽", num: "207", rare: true },
      { code: "ITA-15", flag: "🇮🇹", num: "311" },
    ],
    have: 8, want: 3, comments: 14, likes: 56,
    canTrade: true,
    pinned: true,
  },
  {
    id: "p3",
    author: { nick: "miltonfigueira", name: "Milton F.", rating: 4.9, isMe: true },
    city: "sp", cityLabel: "São Paulo, SP",
    when: "há 1 h",
    type: "needs",
    text: "Quem tem essa do Vinicius Jr. número 042? Procurando há 3 semanas 😅",
    stickers: [
      { code: "BRA-10", flag: "🇧🇷", num: "042", rare: true },
    ],
    have: 0, want: 18, comments: 11, likes: 9,
    canTrade: false,
  },
  {
    id: "p4",
    author: { nick: "luca_p", name: "Luca P.", rating: 4.7 },
    city: "rj", cityLabel: "Rio de Janeiro, RJ",
    when: "há 2 h",
    type: "swap",
    text: "Encontro de troca neste sábado às 15h no Largo do Machado. Quem topa? Levo minhas 50 repetidas.",
    stickers: [],
    have: 50, want: 0, comments: 23, likes: 41,
    isEvent: true,
  },
  {
    id: "p5",
    author: { nick: "pedrov", name: "Pedro V.", rating: 4.6 },
    city: "bh", cityLabel: "Belo Horizonte, MG",
    when: "há 3 h",
    type: "needs",
    text: "Faltam 12 pra completar o álbum! Acabei a Argentina e a França. Estes aqui são meus últimos chefes:",
    stickers: [
      { code: "GHA-03", flag: "🇬🇭", num: "672" },
      { code: "MAR-11", flag: "🇲🇦", num: "593" },
      { code: "SEN-07", flag: "🇸🇳", num: "611" },
    ],
    have: 2, want: 9, comments: 5, likes: 18,
    canTrade: true,
  },
  {
    id: "p6",
    author: { nick: "carol_m", name: "Carol M.", rating: 4.85 },
    city: "sp", cityLabel: "São Paulo, SP",
    when: "ontem",
    type: "offers",
    text: "Tenho repetidas dos times sul-americanos. Faço troca por correio se necessário.",
    stickers: [
      { code: "ARG-09", flag: "🇦🇷", num: "118" },
      { code: "URU-09", flag: "🇺🇾", num: "401" },
      { code: "COL-14", flag: "🇨🇴", num: "344" },
      { code: "ECU-06", flag: "🇪🇨", num: "421" },
    ],
    have: 11, want: 4, comments: 3, likes: 27,
    canTrade: true,
    acceptsMail: true,
  },
];

/* ---------- Interaction data ---------- */
const COMMENTS_BY_POST = {
  p1: [
    { id: "c1", nick: "ana.s", text: "Tenho a ESP-04 e a URU-09! Tu tem alguma do Brasil?", when: "3 min", rating: 4.9, online: true, hasMatch: true },
    { id: "c2", nick: "thiago_t", text: "Vou no shopping sábado, posso te encontrar lá", when: "8 min", rating: 4.6 },
    { id: "c3", nick: "carol_m", text: "Olha minha lista, tenho a URU-09 dupla \ud83d\udc47", when: "15 min", rating: 4.85, hasMatch: true },
  ],
  p2: [
    { id: "c4", nick: "miltonfigueira", text: "Quero a BRA-10!! Te chamo no privado", when: "5 min", rating: 4.9, isMe: true },
    { id: "c5", nick: "fer_n", text: "As douradas estão em condição de impressão?", when: "19 min", rating: 4.7 },
  ],
  p3: [
    { id: "c6", nick: "luca_p", text: "Tenho 3 da BRA-10, te mando foto", when: "40 min", rating: 4.7, hasMatch: true, online: true },
  ],
  p4: [
    { id: "c7", nick: "ana.s", text: "Confirmado! Levo umas 30 \ud83d\ude80", when: "1 h", rating: 4.9 },
    { id: "c8", nick: "rafa_dias", text: "Eu também vou. Alguém do Largo do Machado quer carona da Tijuca?", when: "1 h", rating: 4.8 },
  ],
  p5: [],
  p6: [
    { id: "c9", nick: "miltonfigueira", text: "Tenho repetidas do Brasil pra trocar pelas suas sul-americanas", when: "2 h", rating: 4.9, isMe: true, hasMatch: true },
  ],
};

const REACTIONS_BY_POST = {
  p1: { love: 18, fire: 5, hand: 12 },
  p2: { love: 41, fire: 23, hand: 31 },
  p3: { love: 7, fire: 2, hand: 0 },
  p4: { love: 28, fire: 13, hand: 0 },
  p5: { love: 11, fire: 7, hand: 4 },
  p6: { love: 19, fire: 4, hand: 8 },
};

/* Stickers I have that match this user's needs (mock matching engine) */
const MY_DUPES_FOR_POST = {
  p1: [
    { code: "ESP-04", flag: "\ud83c\uddea\ud83c\uddf8", num: "152" },
    { code: "URU-09", flag: "\ud83c\uddfa\ud83c\uddfe", num: "401" },
    { code: "FRA-07", flag: "\ud83c\uddeb\ud83c\uddf7", num: "088" },
  ],
  p2: [{ code: "ITA-15", flag: "\ud83c\uddee\ud83c\uddf9", num: "311" }],
  p5: [{ code: "GHA-03", flag: "\ud83c\uddec\ud83c\udded", num: "672" }],
  p6: [{ code: "COL-14", flag: "\ud83c\udde8\ud83c\uddf4", num: "344" }],
};

/* Their dupes I want */
const THEIR_DUPES_I_WANT = {
  p1: [
    { code: "BEL-02", flag: "\ud83c\udde7\ud83c\uddea", num: "025", rare: true },
    { code: "NLD-05", flag: "\ud83c\uddf3\ud83c\uddf1", num: "093" },
  ],
  p2: [
    { code: "BRA-10", flag: "\ud83c\udde7\ud83c\uddf7", num: "042", rare: true },
    { code: "ARG-09", flag: "\ud83c\udde6\ud83c\uddf7", num: "118", rare: true },
  ],
  p5: [{ code: "NGA-08", flag: "\ud83c\uddf3\ud83c\uddec", num: "701" }],
  p6: [{ code: "URU-09", flag: "\ud83c\uddfa\ud83c\uddfe", num: "401" }],
};

/* ---------- Reactions row ---------- */
function ReactionRow({ counts, mine, onReact }) {
  const items = [
    { id: "love", emoji: "\u2764\ufe0f", label: "curtir" },
    { id: "fire", emoji: "\ud83d\udd25", label: "fogo" },
    { id: "hand", emoji: "\ud83e\udd1d", label: "tenho!" },
  ];
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {items.map((r) => {
        const on = mine === r.id;
        const c = (counts?.[r.id] || 0) + (on ? 1 : 0);
        return (
          <button key={r.id} onClick={() => onReact(r.id)} title={r.label}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              height: 28, paddingInline: 9,
              border: `1px solid ${on ? "var(--primary)" : "var(--outline-variant)"}`,
              background: on ? "rgba(149,170,255,0.15)" : "transparent",
              color: on ? "var(--primary)" : "var(--muted)",
              borderRadius: 99,
              fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}>
            <span style={{ fontSize: 13, lineHeight: 1, filter: on ? "none" : "grayscale(0.2)" }}>{r.emoji}</span>
            {c > 0 && <span>{c}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Comments thread ---------- */
function CommentItem({ c }) {
  return (
    <div style={{ display: "flex", gap: 8, paddingTop: 10 }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <Avatar seed={c.nick} size={26} ring={false} />
        {c.online && (
          <span style={{
            position: "absolute", right: -1, bottom: -1,
            width: 8, height: 8, borderRadius: 99,
            background: "var(--secondary)",
            border: "2px solid var(--container)",
          }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>@{c.nick}</span>
          {c.isMe && (
            <span style={{
              padding: "0px 4px", borderRadius: 3,
              background: "rgba(149,170,255,0.15)", color: "var(--primary)",
              fontFamily: "var(--headline)", fontSize: 7, fontWeight: 700, letterSpacing: "0.1em",
            }}>VOCÊ</span>
          )}
          <span style={{ fontSize: 10, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 2 }}>
            <Icon name="star" size={9} color="var(--tertiary)" />{c.rating}
          </span>
          {c.hasMatch && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: "1px 6px", borderRadius: 99,
              background: "rgba(79,243,37,0.12)", color: "var(--secondary)",
              fontFamily: "var(--headline)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
            }}>
              <Icon name="check" size={8} /> MATCH
            </span>
          )}
          <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>{c.when}</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--fg)", marginTop: 2, lineHeight: 1.4 }}>{c.text}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
          <button style={{
            background: "transparent", border: 0, padding: 0, cursor: "pointer",
            color: "var(--muted)", fontSize: 10, fontWeight: 600,
          }}>Responder</button>
          {!c.isMe && (
            <button style={{
              background: "transparent", border: 0, padding: 0, cursor: "pointer",
              color: "var(--primary)", fontSize: 10, fontWeight: 600,
            }}>Mensagem privada</button>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentsThread({ post, expanded, setExpanded, user }) {
  const all = COMMENTS_BY_POST[post.id] || [];
  const visible = expanded ? all : all.slice(0, 2);
  const [reply, setReply] = useFState("");
  if (all.length === 0 && !expanded) return null;
  return (
    <div style={{
      marginTop: 10, paddingTop: 4,
      borderTop: "1px dashed var(--outline-variant)",
    }}>
      {visible.map((c) => <CommentItem key={c.id} c={c} />)}
      {!expanded && all.length > 2 && (
        <button onClick={() => setExpanded(true)}
          style={{
            background: "transparent", border: 0, padding: "8px 0 0 34px", cursor: "pointer",
            color: "var(--primary)", fontSize: 11, fontWeight: 600, textAlign: "left",
          }}>
          Ver mais {all.length - 2} comentário{all.length - 2 > 1 ? "s" : ""} →
        </button>
      )}
      {expanded && (
        <div style={{ display: "flex", gap: 8, marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--outline-variant)" }}>
          <Avatar seed={user.nickname} size={26} ring={false} />
          <div style={{ flex: 1, display: "flex", gap: 6 }}>
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Comente ou ofereça uma troca..."
              style={{
                flex: 1,
                background: "var(--container-high)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 99,
                padding: "6px 12px",
                color: "var(--fg)",
                fontFamily: "var(--body)", fontSize: 12,
                outline: "none",
              }}
            />
            <button disabled={!reply.trim()}
              onClick={() => setReply("")}
              className="btn btn-primary"
              style={{ height: 28, paddingInline: 12, fontSize: 11, opacity: reply.trim() ? 1 : 0.4 }}>
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Trade proposal modal ---------- */
function MiniSticker({ s, picked, onClick }) {
  return (
    <button onClick={onClick}
      className={`mini-fig ${s.rare ? "rare" : ""}`}
      style={{
        padding: 6, cursor: "pointer",
        outline: picked ? "2px solid var(--primary)" : "none",
        outlineOffset: 1,
        opacity: picked ? 1 : 0.85,
        position: "relative",
      }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 14 }}>{s.flag}</span>
        {s.rare && <Icon name="sparkles" size={9} color="var(--tertiary)" />}
      </div>
      <div style={{ marginTop: 4 }}>
        <div className="num" style={{ fontSize: 14 }}>{s.num}</div>
        <div className="code" style={{ fontSize: 9 }}>{s.code}</div>
      </div>
      {picked && (
        <div style={{
          position: "absolute", top: 4, right: 4,
          width: 14, height: 14, borderRadius: 99,
          background: "var(--primary)", color: "var(--on-primary)",
          display: "grid", placeItems: "center",
        }}>
          <Icon name="check" size={9} />
        </div>
      )}
    </button>
  );
}

function TradeModal({ post, user, onClose, onSend }) {
  const mine = MY_DUPES_FOR_POST[post.id] || [];
  const theirs = THEIR_DUPES_I_WANT[post.id] || [];
  const [pickedMine, setPickedMine] = useFState(mine.map(s => s.code + s.num));
  const [pickedTheirs, setPickedTheirs] = useFState(theirs.slice(0, 1).map(s => s.code + s.num));
  const [note, setNote] = useFState("");

  const toggle = (set, setter, key) => {
    setter(set.includes(key) ? set.filter(x => x !== key) : [...set, key]);
  };

  const fair = pickedMine.length > 0 && pickedTheirs.length > 0;
  const balanceLabel = pickedMine.length === pickedTheirs.length
    ? "Troca equilibrada"
    : `${pickedMine.length}\u00d7${pickedTheirs.length} · desbalanceada`;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 300, display: "grid", placeItems: "end center",
      padding: 12,
    }}>
      <div onClick={(e) => e.stopPropagation()} className="raised" style={{
        width: "100%", maxWidth: 400,
        background: "var(--container)",
        borderRadius: 18, overflow: "hidden",
        border: "1px solid var(--outline-variant)",
        animation: "fade-up 0.25s ease",
      }}>
        {/* header */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--outline-variant)", display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar seed={post.author.nick} size={36} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="h-display" style={{ fontSize: 14 }}>Propor troca</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>com @{post.author.nick} · {post.cityLabel}</div>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: 0, color: "var(--muted)", cursor: "pointer", padding: 4,
          }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={{ padding: "14px 16px", maxHeight: "55vh", overflowY: "auto" }}>
          {/* Their dupes (you want) */}
          <div className="label-mono" style={{ marginBottom: 6, color: "var(--secondary)" }}>
            → VOCÊ RECEBE ({pickedTheirs.length})
          </div>
          {theirs.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--muted)", padding: "8px 0" }}>
              Sem repetidas confirmadas — envie sua proposta e aguarde resposta.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {theirs.map((s) => {
                const k = s.code + s.num;
                return <MiniSticker key={k} s={s} picked={pickedTheirs.includes(k)}
                  onClick={() => toggle(pickedTheirs, setPickedTheirs, k)} />;
              })}
            </div>
          )}

          {/* Swap divider */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            margin: "14px 0",
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--outline-variant)" }} />
            <div style={{
              width: 28, height: 28, borderRadius: 99,
              background: "var(--primary)", color: "var(--on-primary)",
              display: "grid", placeItems: "center",
            }}>
              <Icon name="swap" size={14} />
            </div>
            <div style={{ flex: 1, height: 1, background: "var(--outline-variant)" }} />
          </div>

          {/* My dupes (you give) */}
          <div className="label-mono" style={{ marginBottom: 6, color: "var(--primary)" }}>
            ← VOCÊ OFERECE ({pickedMine.length})
          </div>
          {mine.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--muted)", padding: "8px 0" }}>
              Você ainda não tem repetidas que correspondam — envie uma mensagem.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
              {mine.map((s) => {
                const k = s.code + s.num;
                return <MiniSticker key={k} s={s} picked={pickedMine.includes(k)}
                  onClick={() => toggle(pickedMine, setPickedMine, k)} />;
              })}
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <div className="label-mono" style={{ marginBottom: 6 }}>MENSAGEM</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Combine ponto de encontro, horário ou correio..."
              style={{
                width: "100%",
                background: "var(--container-high)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 10,
                padding: "8px 10px",
                color: "var(--fg)",
                fontFamily: "var(--body)", fontSize: 12,
                minHeight: 50, resize: "vertical", outline: "none",
              }}
            />
          </div>

          {/* meet suggestions */}
          <div className="label-mono" style={{ marginTop: 14, marginBottom: 6 }}>SUGESTÕES DE ENCONTRO</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["Shopping Eldorado · sab 15h", "Metrô Faria Lima", "Correio (PAC)"].map((s) => (
              <button key={s} style={{
                padding: "6px 10px", borderRadius: 99,
                background: "var(--container-high)",
                border: "1px solid var(--outline-variant)",
                color: "var(--fg)", fontSize: 11, fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 4,
              }}>
                <Icon name="mapPin" size={10} /> {s}
              </button>
            ))}
          </div>
        </div>

        {/* footer */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--outline-variant)",
          background: "var(--container-high)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ flex: 1, fontSize: 11 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              color: fair ? "var(--secondary)" : "var(--muted)",
              fontWeight: 700,
            }}>
              <Icon name={fair ? "check" : "swap"} size={11} /> {balanceLabel}
            </span>
          </div>
          <button onClick={onClose} className="btn btn-ghost" style={{ height: 34, paddingInline: 12, fontSize: 12 }}>
            Cancelar
          </button>
          <button onClick={() => onSend?.({ pickedMine, pickedTheirs, note })}
            disabled={!fair && mine.length > 0}
            className="btn btn-primary"
            style={{ height: 34, paddingInline: 14, fontSize: 12 }}>
            Enviar proposta
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedFilters({ selected, onChange }) {
  return (
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px",
      borderBottom: "1px solid var(--outline-variant)",
      scrollbarWidth: "none",
    }}>
      {FEED_CITIES.map((c) => {
        const on = c.id === selected;
        return (
          <button key={c.id} onClick={() => onChange(c.id)}
            style={{
              flexShrink: 0,
              display: "inline-flex", alignItems: "center", gap: 6,
              height: 32, paddingInline: 12,
              background: on ? "var(--primary)" : "var(--container-high)",
              color: on ? "var(--on-primary)" : "var(--fg)",
              border: `1px solid ${on ? "var(--primary)" : "var(--outline-variant)"}`,
              borderRadius: 99,
              fontFamily: "var(--body)",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}>
            {c.id === "all" ? <Icon name="globe" size={12} /> : <Icon name="mapPin" size={12} />}
            {c.label}
            <span style={{
              fontFamily: "var(--mono)", fontSize: 10,
              opacity: 0.7,
              padding: "1px 5px",
              background: on ? "rgba(0,36,126,0.2)" : "rgba(149,170,255,0.1)",
              borderRadius: 4,
            }}>{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}

function PostTypeBadge({ type, isEvent }) {
  if (isEvent) return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 6,
      background: "rgba(255,201,101,0.12)", color: "var(--tertiary)",
      fontFamily: "var(--headline)", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
    }}>
      <Icon name="calendar" size={10} /> ENCONTRO
    </span>
  );
  const map = {
    needs: { label: "PRECISO", color: "var(--primary)", bg: "rgba(149,170,255,0.12)", icon: "search" },
    offers: { label: "TENHO", color: "var(--secondary)", bg: "rgba(79,243,37,0.12)", icon: "swap" },
    swap: { label: "TROCA", color: "var(--tertiary)", bg: "rgba(255,201,101,0.12)", icon: "swords" },
  };
  const m = map[type] || map.needs;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 6,
      background: m.bg, color: m.color,
      fontFamily: "var(--headline)", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
    }}>
      <Icon name={type === "needs" ? "starOutline" : "check"} size={10} /> {m.label}
    </span>
  );
}

function PostStickers({ stickers, type }) {
  if (!stickers.length) return null;
  const visible = stickers.slice(0, 6);
  const more = stickers.length - visible.length;
  const isOffers = type === "offers";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 6, marginTop: 12 }}>
      {visible.map((s) => (
        <div key={s.code + s.num} className={`mini-fig ${s.rare ? "rare" : isOffers ? "dupe" : ""}`}
             style={{ padding: "6px 4px 4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14 }}>{s.flag}</span>
            {s.rare && <Icon name="sparkles" size={9} color="var(--tertiary)" />}
          </div>
          <div>
            <div className="num" style={{ fontSize: 14 }}>{s.num}</div>
            <div className="code" style={{ fontSize: 9 }}>{s.code}</div>
          </div>
        </div>
      ))}
      {more > 0 && (
        <div className="mini-fig" style={{
          display: "grid", placeItems: "center",
          background: "transparent", borderStyle: "dashed", padding: 4,
        }}>
          <div className="num-mono" style={{ fontSize: 13 }}>+{more}</div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, user, onTrade, onSendTrade, onOpenTrade }) {
  const [reaction, setReaction] = useFState(null);
  const [commentsOpen, setCommentsOpen] = useFState(false);
  const baseCounts = REACTIONS_BY_POST[post.id] || { love: 0, fire: 0, hand: 0 };
  const totalComments = (COMMENTS_BY_POST[post.id] || []).length;
  return (
    <div className="raised fade-up" style={{ padding: 14, marginBottom: 12, position: "relative" }}>
      {post.pinned && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "3px 8px",
          background: "var(--tertiary)", color: "var(--on-tertiary)",
          fontFamily: "var(--headline)", fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
          borderRadius: 6,
          marginBottom: 10,
        }}>★ EM DESTAQUE</div>
      )}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Avatar seed={post.author.nick} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>@{post.author.nick}</span>
            {post.author.isMe && (
              <span style={{
                padding: "1px 5px", borderRadius: 4,
                background: "rgba(149,170,255,0.15)", color: "var(--primary)",
                fontFamily: "var(--headline)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em",
              }}>VOCÊ</span>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: 2, fontSize: 11, color: "var(--muted)" }}>
              <Icon name="star" size={10} color="var(--tertiary)" />{post.author.rating}
            </span>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1, display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
              <Icon name="mapPin" size={10} /> {post.cityLabel}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: 99, background: "var(--outline-variant)" }} />
            <span>{post.when}</span>
            {post.acceptsMail && (
              <>
                <span style={{ width: 2, height: 2, borderRadius: 99, background: "var(--outline-variant)" }} />
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                  <Icon name="mail" size={10} /> correio
                </span>
              </>
            )}
          </div>
        </div>
        <PostTypeBadge type={post.type} isEvent={post.isEvent} />
      </div>

      <div style={{ fontSize: 13, color: "var(--fg)", marginTop: 12, lineHeight: 1.45 }}>
        {post.text}
      </div>

      <PostStickers stickers={post.stickers} type={post.type} />

      {post.isEvent && (
        <div style={{
          marginTop: 12, padding: 10,
          background: "rgba(255,201,101,0.08)",
          border: "1px dashed rgba(255,201,101,0.4)",
          borderRadius: 10,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "rgba(255,201,101,0.18)", color: "var(--tertiary)",
            display: "grid", placeItems: "center",
          }}>
            <Icon name="calendar" size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>Sábado · 15h00</div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>Largo do Machado · {post.have} repetidas</div>
          </div>
          <button className="btn btn-outline" style={{ height: 32, paddingInline: 10, fontSize: 11 }}>
            Confirmar
          </button>
        </div>
      )}

      {/* footer actions */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 12, paddingTop: 10,
        borderTop: "1px solid var(--outline-variant)",
        gap: 8, flexWrap: "wrap",
      }}>
        <ReactionRow counts={baseCounts} mine={reaction} onReact={(r) => setReaction(reaction === r ? null : r)} />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setCommentsOpen(!commentsOpen)}
            style={{
              background: "transparent", border: 0, padding: "4px 6px", cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 11, color: "var(--muted)", fontWeight: 600,
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {totalComments}
          </button>
          <button style={{
            background: "transparent", border: 0, padding: 4, cursor: "pointer",
            color: "var(--muted)",
          }}>
            <Icon name="share" size={13} />
          </button>
          {post.canTrade && !post.author.isMe && (
            <button className="btn btn-secondary"
              style={{ height: 30, paddingInline: 10, fontSize: 11 }}
              onClick={() => onOpenTrade?.(post)}>
              <Icon name="swords" size={12} /> Eu tenho!
            </button>
          )}
          {post.author.isMe && (
            <button className="btn btn-outline" style={{ height: 30, paddingInline: 10, fontSize: 11 }}>
              Editar
            </button>
          )}
        </div>
      </div>

      <CommentsThread post={post} expanded={commentsOpen} setExpanded={setCommentsOpen} user={user} />
    </div>
  );
}

function ComposerCard({ user, onPublish }) {
  const [open, setOpen] = useFState(false);
  const [text, setText] = useFState("");
  const [type, setType] = useFState("needs");
  return (
    <div className="raised" style={{ padding: 12, marginBottom: 12 }}>
      {!open ? (
        <button onClick={() => setOpen(true)}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            background: "transparent", border: 0, padding: 4, cursor: "pointer",
            textAlign: "left",
          }}>
          <Avatar seed={user.nickname} size={36} ring={false} />
          <div style={{
            flex: 1,
            background: "var(--container-high)",
            border: "1px solid var(--outline-variant)",
            borderRadius: 99,
            padding: "9px 14px",
            color: "var(--muted)",
            fontSize: 13,
          }}>
            Quais figurinhas você precisa, @{user.nickname}?
          </div>
        </button>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 10 }}>
            <Avatar seed={user.nickname} size={36} ring={false} />
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Conte o que você precisa ou tem para trocar..."
              style={{
                flex: 1,
                background: "var(--container-high)",
                border: "1px solid var(--outline-variant)",
                borderRadius: 12,
                padding: "10px 12px",
                color: "var(--fg)",
                fontFamily: "var(--body)",
                fontSize: 13,
                minHeight: 70,
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {[
              { id: "needs", label: "Preciso", icon: "search" },
              { id: "offers", label: "Tenho", icon: "check" },
              { id: "swap", label: "Encontro", icon: "calendar" },
            ].map((t) => (
              <button key={t.id} onClick={() => setType(t.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  height: 30, paddingInline: 10,
                  borderRadius: 8,
                  background: type === t.id ? "var(--primary)" : "transparent",
                  color: type === t.id ? "var(--on-primary)" : "var(--muted)",
                  border: `1px solid ${type === t.id ? "var(--primary)" : "var(--outline-variant)"}`,
                  fontFamily: "var(--body)", fontSize: 11, fontWeight: 600,
                  cursor: "pointer",
                }}>
                <Icon name={t.icon} size={12} /> {t.label}
              </button>
            ))}
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              height: 30, paddingInline: 10,
              borderRadius: 8,
              background: "transparent", color: "var(--muted)",
              border: "1px dashed var(--outline-variant)",
              fontFamily: "var(--body)", fontSize: 11, fontWeight: 600,
              cursor: "pointer", marginLeft: "auto",
            }}>
              + Anexar figurinhas
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
            <button onClick={() => { setOpen(false); setText(""); }}
              className="btn btn-ghost" style={{ height: 32, paddingInline: 12, fontSize: 12 }}>
              Cancelar
            </button>
            <button onClick={() => { onPublish?.({ text, type }); setOpen(false); setText(""); }}
              disabled={!text.trim()}
              className="btn btn-primary"
              style={{ height: 32, paddingInline: 14, fontSize: 12, opacity: text.trim() ? 1 : 0.4 }}>
              Publicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedScreen({ user, onTrade }) {
  const [city, setCity] = useFState("sp");
  const [sort, setSort] = useFState("recent");
  const [tradePost, setTradePost] = useFState(null);

  const filtered = useFMemo(() => {
    let list = city === "all" ? FEED_POSTS : FEED_POSTS.filter(p => p.city === city);
    if (sort === "needs") list = list.filter(p => p.type === "needs");
    if (sort === "offers") list = list.filter(p => p.type === "offers");
    // pinned first
    return [...list].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [city, sort]);

  return (
    <div>
      <FeedFilters selected={city} onChange={setCity} />

      <div style={{ padding: "10px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span className="label-mono">{filtered.length} POSTS · {FEED_CITIES.find(c => c.id === city)?.label || ""}</span>
          <div className="seg" style={{ padding: 2, borderRadius: 8 }}>
            {[
              { id: "recent", label: "Recente" },
              { id: "needs", label: "Preciso" },
              { id: "offers", label: "Tenho" },
            ].map((s) => (
              <button key={s.id} onClick={() => setSort(s.id)} className={sort === s.id ? "active" : ""}
                style={{ fontSize: 10, padding: "4px 8px" }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <ComposerCard user={user} onPublish={() => {}} />

        {filtered.length === 0 ? (
          <div className="raised" style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <div className="h-display" style={{ fontSize: 14 }}>Nenhum post nesse filtro</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Seja o primeiro a publicar!</div>
          </div>
        ) : (
          filtered.map((p) => (
            <PostCard key={p.id} post={p} user={user}
              onOpenTrade={(post) => setTradePost(post)}
            />
          ))
        )}
      </div>

      {tradePost && (
        <TradeModal post={tradePost} user={user}
          onClose={() => setTradePost(null)}
          onSend={() => { setTradePost(null); onTrade?.(); }}
        />
      )}
    </div>
  );
}

window.FeedScreen = FeedScreen;
