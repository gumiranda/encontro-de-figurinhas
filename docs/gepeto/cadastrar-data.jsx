/* global React, ReactDOM, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakSelect */
const { useState, useMemo, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "tileVariant": "tristate",
  "showAlphaIndex": true,
  "groupingMode": "country",
  "celebrate": true
}/*EDITMODE-END*/;

/* ---------- Country roster ---------- */
const COUNTRIES = [
  { code: "BRA", flag: "🇧🇷", name: "Brasil", group: "A", color: "#1ec45a" },
  { code: "ARG", flag: "🇦🇷", name: "Argentina", group: "A", color: "#7ab8e0" },
  { code: "URU", flag: "🇺🇾", name: "Uruguai", group: "A", color: "#5b9bd5" },
  { code: "CHI", flag: "🇨🇱", name: "Chile", group: "A", color: "#e34a3a" },
  { code: "ESP", flag: "🇪🇸", name: "Espanha", group: "B", color: "#e8bb3a" },
  { code: "POR", flag: "🇵🇹", name: "Portugal", group: "B", color: "#d62828" },
  { code: "FRA", flag: "🇫🇷", name: "França", group: "B", color: "#3a5cd6" },
  { code: "ITA", flag: "🇮🇹", name: "Itália", group: "B", color: "#3aaf7a" },
  { code: "GER", flag: "🇩🇪", name: "Alemanha", group: "C", color: "#f0c430" },
  { code: "NED", flag: "🇳🇱", name: "Holanda", group: "C", color: "#ee7c2a" },
  { code: "BEL", flag: "🇧🇪", name: "Bélgica", group: "C", color: "#c01818" },
  { code: "ENG", flag: "🇬🇧", name: "Inglaterra", group: "C", color: "#ffffff" },
  { code: "MEX", flag: "🇲🇽", name: "México", group: "D", color: "#1a8443" },
  { code: "USA", flag: "🇺🇸", name: "EUA", group: "D", color: "#3a5cd6" },
  { code: "CAN", flag: "🇨🇦", name: "Canadá", group: "D", color: "#e34a3a" },
  { code: "JAP", flag: "🇯🇵", name: "Japão", group: "E", color: "#e34a3a" },
  { code: "KOR", flag: "🇰🇷", name: "Coreia", group: "E", color: "#3a5cd6" },
  { code: "AUS", flag: "🇦🇺", name: "Austrália", group: "E", color: "#e8bb3a" },
  { code: "MAR", flag: "🇲🇦", name: "Marrocos", group: "F", color: "#a01818" },
  { code: "SEN", flag: "🇸🇳", name: "Senegal", group: "F", color: "#1ec45a" },
  { code: "GHA", flag: "🇬🇭", name: "Gana", group: "F", color: "#e8bb3a" },
  { code: "CMR", flag: "🇨🇲", name: "Camarões", group: "F", color: "#1ec45a" },
];

/* ---------- Player names per country ---------- */
const NAMES = {
  BRA: ["Alisson","Ederson","Bento","Marquinhos","T. Silva","Militão","Beraldo","Vanderson","Wendell","Caio H.","D. Luiz","Bruno G.","Casemiro","André","João Gomes","Lucas P.","Raphinha","Vinicius","Rodrygo","Endrick","Richarlison","Pedro","Antony","Estêvão","Savinho","Ítalo","Selo Logo","Capa Time"],
  ARG: ["E. Martínez","Rulli","Armani","Otamendi","Romero","M. Acuña","Molina","Tagliafico","Pezzella","Lo Celso","De Paul","E. Fernández","Mac Allister","Paredes","Almada","Messi","Di María","Martinez","Álvarez","González","Correa","Garnacho","Capa Time","Selo"],
  URU: ["Rochet","Sosa","Olivera","Cáceres","Coates","Giménez","Araújo","Bentancur","Valverde","De Arrascaeta","Pellistri","Núñez","Cavani","Suárez","Capa Time","Selo"],
  CHI: ["Bravo","Maripán","Medel","Vidal","Aránguiz","Pulgar","Sánchez","Vargas","Brereton","Capa Time","Selo"],
  ESP: ["Unai S.","Simón","Le Normand","Laporte","Carvajal","Cucurella","Rodri","Pedri","Gavi","Olmo","Yamal","Williams","Morata","Oyarzabal","Joselu","Capa Time","Selo"],
  POR: ["Diogo C.","Rui Patr.","Pepe","Rúben Dias","Cancelo","Mendes","B. Fernandes","B. Silva","Vitinha","Otávio","Ronaldo","Felix","Leão","Ramos","Capa Time","Selo"],
  FRA: ["M. Maignan","Areola","Koundé","Saliba","Upamec.","Hernandez","Theo","Tchouaméni","Camavinga","Rabiot","Griezmann","Mbappé","Dembélé","Giroud","Coman","Thuram","Capa Time","Selo"],
  ITA: ["Donnarumma","Vicario","Bastoni","Calafiori","Di Lorenzo","Dimarco","Jorginho","Barella","Frattesi","Pellegrini","Chiesa","Scamacca","Retegui","Raspadori","Capa Time","Selo"],
  GER: ["Neuer","Ter Stegen","Rüdiger","Tah","Kimmich","Raum","Mittelstädt","Andrich","Kroos","Wirtz","Musiala","Sané","Havertz","Füllkrug","Capa Time","Selo"],
  NED: ["Verbruggen","Bijlow","Van Dijk","De Ligt","Aké","Dumfries","Blind","Gakpo","Veerman","Reijnders","Depay","Bergwijn","Weghorst","Capa Time","Selo"],
  BEL: ["Courtois","Casteels","Vertonghen","Faes","Theate","Castagne","De Bruyne","Tielemans","Onana","Doku","Lukaku","Trossard","Capa Time","Selo"],
  ENG: ["Pickford","Henderson","Stones","Maguire","Walker","Trippier","Shaw","Rice","Bellingham","Foden","Saka","Kane","Rashford","Watkins","Capa Time","Selo"],
  MEX: ["Ochoa","Talavera","Moreno","Vásquez","Salcedo","Álvarez","Romo","Pizarro","Jiménez","Lozano","H. Lozano","Capa Time","Selo"],
  USA: ["Turner","Steffen","Robinson","Ream","Dest","Adams","McKennie","Pulisic","Reyna","Weah","Sargent","Capa Time","Selo"],
  CAN: ["Borjan","St. Clair","Vitória","Miller","Davies","Hutchinson","Buchanan","Larin","David","Capa Time","Selo"],
  JAP: ["Schmidt","Suzuki","Itakura","Yoshida","Tomiyasu","Endo","Mitoma","Kubo","Minamino","Maeda","Capa Time","Selo"],
  KOR: ["Kim Seung","Cho Hyun","Kim Min-jae","Kim Young-gwon","Lee Jae","Hwang In","Son","Hwang Hee","Cho Gue","Capa Time","Selo"],
  AUS: ["Ryan","Atkinson","Souttar","Rowles","Behich","Mooy","Irvine","McGree","Goodwin","Capa Time","Selo"],
  MAR: ["Bono","Munir","Saiss","Aguerd","Hakimi","Mazraoui","Amrabat","Ounahi","Ziyech","Boufal","En-Nesyri","Capa Time","Selo"],
  SEN: ["Mendy","Gomis","Koulibaly","Diallo","Sarr","Cissé","Gueye","Mané","Sarr","Capa Time","Selo"],
  GHA: ["Ati Zigi","Lamptey","Salisu","Amartey","Mensah","Partey","Iddrisu","Kudus","Williams","Capa Time","Selo"],
  CMR: ["Onana","Ngapandouet","Castelletto","Wooh","Mbeumo","Anguissa","Onana","Aboubakar","Capa Time","Selo"],
};

/* ---------- Build sticker dataset ---------- */
function buildStickers() {
  const out = {};
  let global = 1;
  COUNTRIES.forEach((c) => {
    const names = NAMES[c.code] || [];
    out[c.code] = names.map((name, i) => ({
      num: String(global++).padStart(3, "0"),
      code: c.code,
      countryCode: c.code,
      flag: c.flag,
      name,
      idx: i + 1,
      total: names.length,
      isLogo: name.startsWith("Capa") || name.startsWith("Selo"),
    }));
  });
  return out;
}
const STICKERS = buildStickers();

/* ---------- Initial mock counts (the user already has some) ---------- */
function buildInitialCounts() {
  const seed = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
  };
  const counts = {};
  Object.keys(STICKERS).forEach((cc) => {
    STICKERS[cc].forEach((s) => {
      const r = (seed(s.code + s.num) % 100) / 100;
      let c = 0;
      if (r < 0.55) c = 1;
      else if (r < 0.7) c = 2;
      else if (r < 0.78) c = 3;
      counts[s.code + s.num] = c;
    });
  });
  // BRA mostly complete except a few
  ["042","043","044","045"].forEach((n) => counts["BRA" + n] = 0);
  return counts;
}

/* ---------- Icon ---------- */
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const c = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "search": return <svg {...c}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "plus": return <svg {...c}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "minus": return <svg {...c}><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "check": return <svg {...c}><polyline points="20 6 9 17 4 12"/></svg>;
    case "x": return <svg {...c}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
    case "back": return <svg {...c}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case "scan": return <svg {...c}><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>;
    case "sparkles": return <svg {...c}><path d="M12 3l1.9 5.5L19 10l-5.1 1.5L12 17l-1.9-5.5L5 10l5.1-1.5L12 3z"/></svg>;
    case "filter": return <svg {...c}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
    case "swap": return <svg {...c}><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
    case "list": return <svg {...c}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
    case "grid": return <svg {...c}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case "trophy": return <svg {...c}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
    case "undo": return <svg {...c}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-15-6.7L3 13"/></svg>;
    default: return null;
  }
};

/* ---------- Progress ring ---------- */
function Ring({ size = 30, stroke = 3, value = 0, color = "var(--secondary)", bg = "rgba(149,170,255,0.15)" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value * c);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} stroke={bg} strokeWidth={stroke} fill="none" />
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.4s" }} />
    </svg>
  );
}

window.CADASTRAR_DATA = { COUNTRIES, STICKERS, NAMES, buildInitialCounts };
window.CadIcon = Icon;
window.CadRing = Ring;
