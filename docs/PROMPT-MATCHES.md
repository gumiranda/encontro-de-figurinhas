# Missão — /matches frontend: sair do readonly

Cards de match hoje são decoração. Entrega ciclo completo de interação sem vazamento de estado, sem Tailwind puro, sem placeholder. Kibo UI primeiro. Backend/schema assumidos prontos (mutations `trades.initiate`, `trades.confirm`, `trades.dispute`, `userMatchInteractions.toggleHidden`, `reports.create` já existentes — se faltar, levanta como blocker antes de começar).

Escopo: apps/web/app/(auth)/matches/**, apps/web/modules/matches/ui/**, apps/web/modules/matches/lib/\*\* (se existir hook compartilhado). Nada de mexer em /points/[tradePointId] nesse PR além de reusar componentes extraídos.

---

# Fase 0 — Auditoria Kibo UI (BLOQUEANTE)

Lista explicitamente em packages/ui/src/components/kibo-ui/\*\* o que existe e mapeia uso antes de escrever JSX:

- Action menu do card (⋯) → Kibo ContextMenu/Dropdown; fallback shadcn DropdownMenu
- Bottom sheet mobile de "Confirmar troca" → Kibo Drawer; fallback shadcn Drawer
- Confirmação destrutiva (disputar, esconder) → Kibo AlertDialog; fallback shadcn AlertDialog
- Badges de estado (Bidirecional / Pendente / Confirmada / Escondida) → Kibo Badge
- Avatar → Kibo Avatar (Dicebear v9 já integrado)
- Botão com loading → Kibo Button `loading` prop
- Filtros → Kibo Tabs + Kibo Select/Combobox (distância, ponto)
- Skeleton → Kibo Skeleton
- Empty state → Kibo EmptyState se existir; senão componente próprio em @workspace/ui

Reporta no PR quais Kibo foram adotados. Qualquer custom mantido exige justificativa escrita.

---

# Fase 1 — Arquitetura dos componentes

Estrutura:

- app/(auth)/matches/page.tsx → server component; renderiza shell + <MatchesClient />
- modules/matches/ui/matches-client.tsx → "use client"; hook useQuery(api.matches.listMyMatches)
- modules/matches/ui/matches-filters.tsx → tabs (Todos / Bidirecionais / Mesmo ponto / ≤50km) + select distância
- modules/matches/ui/match-card.tsx → card individual, memo'd
- modules/matches/ui/match-card-actions.tsx → action menu + CTAs
- modules/matches/ui/match-trade-drawer.tsx → drawer de confirmação de troca (seleção de figurinhas)
- modules/matches/ui/match-report-dialog.tsx → form de denúncia (react-hook-form + zod)
- modules/matches/ui/match-empty-state.tsx
- modules/matches/ui/match-skeleton.tsx

Regra: nenhum componente maior que ~150 linhas. Se passar, decompõe.

---

# Fase 2 — Card: o que aparece, o que faz

Anatomia obrigatória, ordem vertical:

1. Header linha: Avatar + displayNickname (link pra /perfil/[nickname]) + distância ("Mesmo ponto" se layer 1; "Xkm" se layer 2) + badge "Bidirecional" se aplicável
2. Ponto de troca (link pra /ponto/[slug], não pra /points/[id] — não vaza rota autenticada internamente via anchor visível)
3. Duas colunas simétricas: "Eles têm que você precisa" | "Você tem que eles precisam". Lista as primeiras N figurinhas como chips numéricos; se > N, mostra "+X mais" (N = 6 mobile, 12 desktop).
4. Rodapé de ações: [Trocar no WhatsApp] (primário) · [Confirmar troca] (secundário, só aparece se `pendingTrade.role === "counterparty"`) · [⋯] menu

Estado do card reflete `pendingTrade`:

- null → CTA primário "Combinar troca" (abre WhatsApp + registra `whatsappOpenedAt` + abre drawer de "Já trocou? Marca aqui" com delay de 30s)
- role=initiator → mostra "Aguardando confirmação de {nickname}" com countdown até 72h + botão "Cancelar"
- role=counterparty → botão verde "Confirmar troca" + botão fantasma "Disputar"

Badge "Confirmada" aparece se houver trade confirmed nesse par+ponto nos últimos 7 dias (mostra histórico leve, não spam).

---

# Fase 3 — Ações do menu ⋯

Conteúdo do menu, nessa ordem:

- Ver perfil → /perfil/[nickname]
- Esconder este match → mutation `toggleHidden`; optimistic update (remove da lista); toast "Match escondido" com ação "Desfazer" (5s)
- Denunciar usuário → abre MatchReportDialog
- Copiar link do ponto

Destructive items com ícone vermelho (lucide `AlertTriangle` / `EyeOff`).

---

# Fase 4 — Fluxo "Combinar troca"

Clique em "Combinar no WhatsApp":

1. Chama mutation leve `matches.logWhatsappOpen({ matchedUserId, tradePointId })` (fire-and-forget, não bloqueia).
2. Abre WhatsApp via link do ponto (wa.me/...) em nova aba — usa `window.open` com `noopener,noreferrer`.
3. Depois de 30s, se usuário voltou à aba (visibility API), mostra toast persistente "Conseguiu trocar com {nickname}? [Marcar como trocada]" — clique abre o Trade Drawer.

Trade Drawer (MatchTradeDrawer):

- Título: "Confirmar troca com {nickname}"
- Duas seções com checkboxes: "Figurinhas que eu dei" (lista de duplicates que estão em `iHaveTheyNeed`) e "Figurinhas que recebi" (lista de missing em `theyHaveINeed`).
- Validação Zod: pelo menos 1 em cada lado.
- Submit → `trades.initiate` → toast sucesso "Aguardando confirmação de {nickname}". Card transiciona pra estado "aguardando" sem refetch manual (Convex reativo).
- Erro `stickers_mismatch` → toast "Seu álbum mudou. Atualiza e tenta de novo." + refetch forçado.
- Erro `forbidden` → toast genérico "Não foi possível iniciar a troca" (não explica shadow-ban).

---

# Fase 5 — Fluxo "Confirmar troca" (contraparte)

Card com `pendingTrade.role === "counterparty"`:

- CTA verde "Confirmar troca" → AlertDialog "Confirmar que trocou {N} figurinhas com {nickname}? Essa ação atualiza seu álbum." → `trades.confirm`
- Sucesso: confete leve (reaproveita componente de F23 se já existir; senão skip) + toast "Troca confirmada!" + card desaparece da lista (contraparte sumiu porque figurinhas trocaram).
- Erro `state_changed` → toast "Suas figurinhas mudaram desde a iniciação. Peça pra {nickname} reiniciar."
- Botão fantasma "Disputar" → dialog com textarea (Zod: 10-500 chars) → `trades.dispute`. Toast "Disputa registrada. Nossa equipe vai revisar."

---

# Fase 6 — Filtros e lista

MatchesFilters com estado em `useState` (não URL por enquanto — YAGNI; se pedir depois, migra pra searchParams):

- Tab "Todos" | "Bidirecionais" | "Mesmo ponto" | "≤50km"
- Select distância (somente ativo na tab "≤50km"): 5km / 10km / 25km / 50km
- Toggle "Mostrar escondidos" no canto → passa `includeHidden: true` na query

Filtros aplicados client-side sobre o resultado de `listMyMatches` (já limitado pelo backend, não há paginação no MVP — assume < 200 matches; se estourar, aí vira problema e entra paginação com `paginationOptsValidator`).

Ordenação default: bidirecionais primeiro → layer 1 → layer 2 por distância asc → `matchScore` desc. Memoiza com `useMemo` deps [data, filters].

---

# Fase 7 — Estados de UI

- Loading inicial (data === undefined): grid de 6 MatchSkeleton
- Vazio (data.length === 0): MatchEmptyState com ilustração + texto "Sem matches ainda. Faz check-in em mais pontos pra expandir sua rede." + CTA "Abrir o mapa" → /map
- Vazio filtrado: "Nenhum match com esses filtros." + botão "Limpar filtros"
- Erro de query: toast + fallback com botão "Tentar de novo" (força `router.refresh()`)

Nada de spinner genérico solto. Nada de "Carregando..." em texto cru.

---

# Fase 8 — Performance e re-renders

Obrigatório:

- MatchCard envolto em `React.memo` com comparador raso (card recebe objeto plano, já estabilizado upstream).
- MatchesClient passa callbacks via `useCallback` com deps corretas; `onHide`, `onReport`, `onInitiateTrade` estabilizados.
- Lista renderiza com `key={match._id}` (ID do `precomputedMatches`, não composto).
- Optimistic updates usam Convex `optimisticUpdate` no mutation hook — não sombras manuais de state.
- Filtros debounced só se virarem input de texto; select/tab não precisa.
- Imagens de avatar com `loading="lazy"` e `decoding="async"`.

Proibido: `useEffect` pra sincronizar state de query com state local. Convex é source of truth.

---

# Fase 9 — A11y e mobile

- Todos os botões com `aria-label` quando só ícone.
- AlertDialog com foco inicial no botão destrutivo secundário (não no confirmar).
- Drawer fecha com Esc e com swipe down (padrão Kibo/Vaul).
- Áreas tocáveis mínimas 44×44.
- Cores de badge/estado passam em contraste 4.5:1 (não confia só em cor; badge tem ícone + texto).
- `prefers-reduced-motion` desliga confete e transições de card.
- Testa em 360px (Android baixo) e 390px (iPhone padrão).

---

# Fase 10 — Telemetria (mínima, não bloqueante)

Emite nos eventos:

- `match_whatsapp_clicked` { tradePointId, layer, bidirectional }
- `trade_initiated` { tradePointId, stickersCount }
- `trade_confirmed` { tradePointId, asRole }
- `trade_disputed`
- `match_hidden`
- `user_reported` { category }

Se telemetria ainda não tem pipeline, cria wrapper `lib/telemetry.ts` com no-op que loga no console em dev. Não trava o PR por causa disso — deixa documentado como débito.

---

# Entropia — regras inegociáveis

- Zero placeholder. Se não vai implementar, não renderiza.
- Zero botão sem handler.
- Zero `console.log` residual.
- Zero `any`. Tipos derivados de `Doc<"trades">` e do retorno de `api.matches.listMyMatches._returnType`.
- Zero useState que só espelha prop.
- Zero componente criado "pra reusar depois" sem segundo consumidor real.
- Nenhum arquivo novo fora das pastas listadas.

---

# Critérios de aceitação

1. Dois users de teste no mesmo ponto veem o match um do outro; A inicia trade; B confirma; ambos os álbuns atualizam; card some da lista de ambos.
2. A inicia trade; B dispara "Disputar"; trade fica `disputed`; álbuns NÃO mudam; card de A mostra estado disputado.
3. Esconder um match remove ele otimisticamente; recarregar página mantém escondido; toggle "Mostrar escondidos" traz de volta com badge "Escondido".
4. Denunciar abre dialog, Zod valida, submit cria `report` com status `open`.
5. Shadow-banned user tenta iniciar trade → UI mostra toast genérico de falha, sem revelar o banimento.
6. Lighthouse mobile performance ≥ 85 na rota /matches (assumindo 50 matches).
7. Kibo UI usado em pelo menos 4 pontos da UI, documentados no PR.
8. Sem warnings de re-render no React DevTools Profiler ao trocar filtro.

---

# Decisões abertas (me responde antes de começar)

1. Auto-expire de trade pendente: 72h está bom ou prefere 48h? (default: 72h)
2. Confete ao confirmar troca: reusa componente de F23 se existir, ou skip no MVP? (default: skip se F23 ainda não mergeou)
3. Histórico de "trocas confirmadas com essa pessoa" no card: mostra badge "{N} trocas anteriores" ou só na página de perfil? (default: só no perfil — menos ruído no card)

Me responde as 3 com "sim/skip/alt" e eu libero Claude Code.
