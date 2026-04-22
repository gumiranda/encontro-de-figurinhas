## Plano Final — /matches: Sair do Readonly (Correções Aplicadas)

1. Decisões Arquiteturais
   Decisão Base
   Rota app/(dashboard)/matches/page.tsx. (auth) é onboarding/login; app shell autenticado vive em (dashboard).
   Telemetria Removida do escopo. Sem pipeline aprovado, sem abstração no-op.
   Tailwind puro Proibido. CLAUDE.md, PRD.md, PROMPT-MATCHES.md.
   Kibo UI — adoção documentada (4+ pontos):
   UI Componente Justificativa se fallback
   Badges de estado Kibo Pill —
   Indicador de status de troca Kibo Status —
   Loading em botões Kibo Spinner —
   Banner informativo Kibo Banner —
   Action menu ⋯ shadcn DropdownMenu Kibo não tem menu de contexto
   Bottom sheet mobile shadcn Sheet (side="bottom") Kibo não tem drawer
   AlertDialog de confirmação shadcn Dialog Kibo não tem AlertDialog
   Tabs de filtros shadcn Tabs (instalar) Ausente no repo
   Select distância shadcn Select Kibo não exporta
   Avatar shadcn Avatar Kibo não exporta
   Button shadcn Button Kibo não exporta
   Skeleton shadcn Skeleton Kibo não exporta
   Empty state MatchesEmptyState próprio Kibo não tem; reaproveita existente

---

2. Schema do Backend
   2.1 precomputedMatches (ALTERAÇÕES)
   precomputedMatches: defineTable({
   userId: v.id("users"),
   matchedUserId: v.id("users"),
   tradePointId: v.id("tradePoints"),
   tradePointSlug: v.string(),
   theyHaveINeed: v.array(v.number()),
   iHaveTheyNeed: v.array(v.number()),
   isBidirectional: v.boolean(),
   distanceKm: v.float64(),
   layer: v.union(v.literal(1), v.literal(2)),
   isHidden: v.optional(v.boolean()),
   computedAt: v.number(),
   })
   .index("by_user_layer", ["userId", "layer"])
   .index("by_user_layer_bidirectional", ["userId", "layer", "isBidirectional"])
   .index("by_user_point", ["userId", "tradePointId"])
   .index("by_matchedUser", ["matchedUserId"])
   2.2 trades (NOVA)
   trades: defineTable({
   initiatorId: v.id("users"),
   counterpartyId: v.id("users"),
   tradePointId: v.id("tradePoints"),
   pairKey: v.string(),
   stickersInitiatorGave: v.array(v.number()),
   stickersInitiatorReceived: v.array(v.number()),
   status: v.union(
   v.literal("pending_confirmation"),
   v.literal("confirmed"),
   v.literal("cancelled"),
   v.literal("disputed"),
   v.literal("expired")
   ),
   createdAt: v.number(),
   confirmedAt: v.optional(v.number()),
   disputedAt: v.optional(v.number()),
   disputeReason: v.optional(v.string()),
   expiredAt: v.optional(v.number()),
   })
   .index("by_initiator_status", ["initiatorId", "status", "createdAt"])
   .index("by_counterparty_status", ["counterpartyId", "status", "createdAt"])
   .index("by_tradePoint", ["tradePointId", "createdAt"])
   .index("by_pairKey_created", ["pairKey", "createdAt"])
   .index("by_pairKey_status_created", ["pairKey", "status", "createdAt"])
   2.3 userMatchInteractions (NOVA)
   userMatchInteractions: defineTable({
   userId: v.id("users"),
   matchedUserId: v.id("users"),
   tradePointId: v.id("tradePoints"),
   isHidden: v.boolean(),
   createdAt: v.number(),
   updatedAt: v.number(),
   })
   .index("by_user_matched_point", ["userId", "matchedUserId", "tradePointId"])
   .index("by_user_hidden", ["userId", "isHidden", "updatedAt"])
   2.4 users (ALTERAÇÕES)
   Campos já existentes no schema atual que continuam sendo usados: totalTrades, reliabilityScore, isShadowBanned, isBanned, duplicates, missing, albumProgress (deprecado).
   Campos a adicionar:
   pendingTradesCount: v.optional(v.number()), // default 0
   albumCompletionPct: v.optional(v.number()), // default 0
   albumProgress: v.optional(v.number()), // DEPRECATED — legado, não lido em código novo
   2.5 reports (SUBSTITUIÇÃO)
   reports: defineTable({
   reporterId: v.id("users"),
   targetUserId: v.id("users"),
   tradePointId: v.optional(v.id("tradePoints")),
   category: v.union(
   v.literal("inappropriate_behavior"),
   v.literal("no_show"),
   v.literal("fake_stickers"),
   v.literal("harassment"),
   v.literal("other")
   ),
   description: v.optional(v.string()),
   status: v.union(
   v.literal("open"),
   v.literal("resolved"),
   v.literal("dismissed")
   ),
   createdAt: v.number(),
   })
   .index("by_reporter_target", ["reporterId", "targetUserId", "createdAt"])
   .index("by_reporter_created", ["reporterId", "createdAt"])
   .index("by_target_status", ["targetUserId", "status", "createdAt"])
   .index("by_status_created", ["status", "createdAt"])

---

3. Contratos de API
   3.1 api.matches.listMyMatches (Query)
   args: {
   layer: v.union(v.literal(1), v.literal(2), v.null()),
   bidirectionalOnly: v.boolean(),
   maxDistanceKm: v.optional(v.number()),
   paginationOpts: paginationOptsValidator,
   includeHidden: v.optional(v.boolean()), // default false
   }
   returns: {
   page: Array<{
   \_id: Id<"precomputedMatches">;
   matchedUserId: Id<"users">;
   displayNickname: string;
   avatarSeed: string;
   albumCompletionPct: number;
   confirmedTradesCount: number;
   theyHaveINeed: number[];
   iHaveTheyNeed: number[];
   isBidirectional: boolean;
   distanceKm: number;
   layer: 1 | 2;
   tradePointId: Id<"tradePoints">;
   tradePointSlug: string;
   pendingTrade: {
   \_id: Id<"trades">;
   status: "pending_confirmation" | "confirmed" | "cancelled" | "disputed" | "expired";
   role: "initiator" | "counterparty";
   createdAt: number;
   stickersInitiatorGave: number[];
   stickersInitiatorReceived: number[];
   } | null;
   isHidden: boolean;
   }>;
   continueCursor: string | null;
   isDone: boolean;
   }
   Ordenação: isBidirectional DESC → layer ASC → distanceKm ASC.
   Paginação: PAGE_SIZE = 50.
   Implementação sem N+1 e com filtros pré-paginação:
   // 1. Query base com branch de índice por bidirectionalOnly + layer
   let matchesQuery;
   if (args.bidirectionalOnly && args.layer !== null) {
   matchesQuery = ctx.db
   .query("precomputedMatches")
   .withIndex("by_user_layer_bidirectional", q =>
   q.eq("userId", caller.\_id)
   .eq("layer", args.layer)
   .eq("isBidirectional", true)
   );
   } else {
   matchesQuery = ctx.db
   .query("precomputedMatches")
   .withIndex("by_user_layer", q => {
   const base = q.eq("userId", caller.\_id);
   return args.layer !== null ? base.eq("layer", args.layer) : base;
   });
   if (args.bidirectionalOnly) {
   matchesQuery = matchesQuery.filter(q => q.eq(q.field("isBidirectional"), true));
   }
   }
   // 1a. Filtro de distância antes da paginação
   if (args.maxDistanceKm !== undefined) {
   matchesQuery = matchesQuery.filter(q =>
   q.lte(q.field("distanceKm"), args.maxDistanceKm)
   );
   }
   // 1b. Filtrar hidden antes da paginação
   if (!args.includeHidden) {
   matchesQuery = matchesQuery.filter(q => q.neq(q.field("isHidden"), true));
   }
   // 1c. Paginar
   const { page, continueCursor, isDone } = await matchesQuery.paginate(args.paginationOpts);
   // 2. Pre-fetch matched users (paralelo)
   const matchedUserIds = [...new Set(page.map(r => r.matchedUserId))];
   const matchedUsers = await Promise.all(
   matchedUserIds.map(id => ctx.db.get(id))
   );
   const userMap = new Map(
   matchedUsers
   .filter((u): u is Doc<"users"> => u !== null)
   .map(u => [u._id, u])
   );
   // 3. Pre-fetch pending trades (paralelo, 2 queries)
   const [pendingAsInitiator, pendingAsCounterparty] = await Promise.all([
   ctx.db
   .query("trades")
   .withIndex("by_initiator_status", q =>
   q.eq("initiatorId", caller._id).eq("status", "pending_confirmation")
   )
   .collect(),
   ctx.db
   .query("trades")
   .withIndex("by_counterparty_status", q =>
   q.eq("counterpartyId", caller._id).eq("status", "pending_confirmation")
   )
   .collect(),
   ]);
   const pendingMap = new Map<string, Doc<"trades">>();
   for (const t of [...pendingAsInitiator, ...pendingAsCounterparty]) {
   const key = `${t.pairKey}:${t.tradePointId}`;
   pendingMap.set(key, t);
   }
   // 4. Montar rows (zero reads adicionais por row)
   const matches = page.map(r => {
   const other = userMap.get(r.matchedUserId);
   const pairKey = [caller._id, r.matchedUserId].sort().join(":");
   const pendingTrade = pendingMap.get(`${pairKey}:${r.tradePointId}`) ?? null;
   return {
   \_id: r.\_id,
   matchedUserId: r.matchedUserId,
   displayNickname: other?.displayNickname ?? other?.nickname ?? "",
   avatarSeed: r.matchedUserId,
   albumCompletionPct: other?.albumCompletionPct ?? 0,
   confirmedTradesCount: other?.totalTrades ?? 0,
   theyHaveINeed: r.theyHaveINeed,
   iHaveTheyNeed: r.iHaveTheyNeed,
   isBidirectional: r.isBidirectional,
   distanceKm: Math.round(r.distanceKm _ 2) / 2,
   layer: r.layer,
   tradePointId: r.tradePointId,
   tradePointSlug: r.tradePointSlug,
   pendingTrade: pendingTrade ? {
   \_id: pendingTrade.\_id,
   status: pendingTrade.status,
   role: pendingTrade.initiatorId === caller.\_id ? "initiator" : "counterparty",
   createdAt: pendingTrade.createdAt,
   stickersInitiatorGave: pendingTrade.stickersInitiatorGave,
   stickersInitiatorReceived: pendingTrade.stickersInitiatorReceived,
   } : null,
   isHidden: r.isHidden ?? false,
   };
   });
   // 5. Retorno obrigatório
   return { page: matches, continueCursor, isDone };
   3.2 api.trades.initiate (Mutation)
   args: {
   matchedUserId: v.id("users"),
   tradePointId: v.id("tradePoints"),
   stickersIGave: v.array(v.number()),
   stickersIReceived: v.array(v.number()),
   }
   returns: { ok: true, tradeId: Id<"trades"> } | { ok: false, error: "rate-limited" | "stickers_mismatch" | "forbidden" | "already-pending" }
   Rate limiting:
   const pairKey = [caller._id, args.matchedUserId].sort().join(":");
   if (Math.floor(caller.reliabilityScore) < 2) {
   const recent = await ctx.db
   .query("trades")
   .withIndex("by_pairKey_created", q =>
   q.eq("pairKey", pairKey).gt("createdAt", Date.now() - 24 _ 60 _ 60 _ 1000)
   )
   .first();
   if (recent) return { ok: false, error: "rate-limited" };
   }
   if (caller.reliabilityScore < 5) {
   if ((caller.pendingTradesCount ?? 0) >= 3) {
   return { ok: false, error: "rate-limited" };
   }
   }
   Already-pending:
   const existingPending = await ctx.db
   .query("trades")
   .withIndex("by_pairKey_status_created", q =>
   q.eq("pairKey", pairKey).eq("status", "pending_confirmation")
   )
   .first();
   if (existingPending) return { ok: false, error: "already-pending" };
   Autorização: Validar row em precomputedMatches com (userId: caller.\_id, matchedUserId: args.matchedUserId, tradePointId: args.tradePointId). Se não existir → forbidden. O match confirma apenas que o par existe; não é fonte de validação de estado do álbum.
   Validação de figurinhas (contra álbuns ATUAIS, não o match):
   const matchedUser = await ctx.db.get(args.matchedUserId);
   if (!matchedUser) return { ok: false, error: "forbidden" };
   const callerDuplicates = new Set(caller.duplicates ?? []);
   const matchedMissing = new Set(matchedUser.missing ?? []);
   if (!args.stickersIGave.every(s => callerDuplicates.has(s))) {
   return { ok: false, error: "stickers_mismatch" };
   }
   if (!args.stickersIReceived.every(s => matchedMissing.has(s))) {
   return { ok: false, error: "stickers_mismatch" };
   }
   Efeito colateral:

- Cria trade com pairKey.
- Incrementa pendingTradesCount de ambos.
- Agenda expiração:
  await ctx.scheduler.runAfter(72 _ 60 _ 60 _ 1000, internal.trades.expireTrade, { tradeId });
  3.3 api.trades.confirm (Mutation)
  args: { tradeId: v.id("trades") }
  returns: { ok: true } | { ok: false, error: "not-found" | "state_changed" | "forbidden" }
  Validação state_changed (antes de confirmar):
  const trade = await ctx.db.get(tradeId);
  if (!trade) return { ok: false, error: "not-found" };
  if (trade.status !== "pending_confirmation") return { ok: false, error: "wrong-state" };
  if (trade.counterpartyId !== caller.\_id) return { ok: false, error: "forbidden" };
  const initiator = await ctx.db.get(trade.initiatorId);
  const counterparty = await ctx.db.get(trade.counterpartyId);
  if (!initiator || !counterparty) return { ok: false, error: "not-found" };
  // Validar que os álbuns ainda permitem a troca
  const initiatorDuplicates = new Set(initiator.duplicates ?? []);
  const counterpartyMissing = new Set(counterparty.missing ?? []);
  if (!trade.stickersInitiatorGave.every(s => initiatorDuplicates.has(s))) {
  return { ok: false, error: "state_changed" };
  }
  if (!trade.stickersInitiatorReceived.every(s => counterpartyMissing.has(s))) {
  return { ok: false, error: "state_changed" };
  }
  Efeito colateral (atualização de álbuns):
  // Remover das duplicatas do initiator o que ele deu
  await ctx.db.patch(trade.initiatorId, {
  duplicates: initiator.duplicates.filter(s => !trade.stickersInitiatorGave.includes(s)),
  missing: initiator.missing.filter(s => !trade.stickersInitiatorReceived.includes(s)),
  });
  // Remover das duplicatas do counterparty o que ele deu (= o que initiator recebeu)
  await ctx.db.patch(trade.counterpartyId, {
  duplicates: counterparty.duplicates.filter(s => !trade.stickersInitiatorReceived.includes(s)),
  missing: counterparty.missing.filter(s => !trade.stickersInitiatorGave.includes(s)),
  });
  Incrementos pós-confirmação:
  // Incrementar totalTrades de ambos
  await ctx.db.patch(trade.initiatorId, {
  totalTrades: (initiator.totalTrades ?? 0) + 1,
  reliabilityScore: Math.min((initiator.reliabilityScore ?? 3) + 1, 10),
  pendingTradesCount: Math.max(0, (initiator.pendingTradesCount ?? 0) - 1),
  });
  await ctx.db.patch(trade.counterpartyId, {
  totalTrades: (counterparty.totalTrades ?? 0) + 1,
  reliabilityScore: Math.min((counterparty.reliabilityScore ?? 3) + 1, 10),
  pendingTradesCount: Math.max(0, (counterparty.pendingTradesCount ?? 0) - 1),
  });
  // Marcar trade como confirmado
  await ctx.db.patch(tradeId, {
  status: "confirmed",
  confirmedAt: Date.now(),
  });
  3.4 api.trades.cancel (Mutation)
  args: { tradeId: v.id("trades") }
  returns: { ok: true } | { ok: false, error: "not-found" | "forbidden" | "wrong-state" }
  Restrição: Apenas initiatorId. Status "pending_confirmation". Decrementa pendingTradesCount de ambos.
  3.5 api.trades.dispute (Mutation)
  args: {
  tradeId: v.id("trades"),
  reason: v.string(), // min 10, max 500
  }
  returns: { ok: true } | { ok: false, error: "not-found" | "forbidden" }
  Efeito colateral: Decrementa pendingTradesCount de ambos.
  3.6 api.userMatchInteractions.toggleHidden (Mutation)
  args: {
  matchedUserId: v.id("users"),
  tradePointId: v.id("tradePoints"),
  }
  returns: { ok: true, isHidden: boolean }
  Efeito colateral: Além do upsert em userMatchInteractions, faz patch em precomputedMatches:
  const match = await ctx.db
  .query("precomputedMatches")
  .withIndex("by_user_point", q =>
  q.eq("userId", caller.\_id).eq("tradePointId", args.tradePointId)
  )
  .filter(q => q.eq(q.field("matchedUserId"), args.matchedUserId))
  .first();
  if (match) {
  await ctx.db.patch(match.\_id, { isHidden: newIsHidden });
  }
  3.7 api.reports.create (Mutation)
  args: {
  targetUserId: v.id("users"),
  tradePointId: v.optional(v.id("tradePoints")),
  category: v.union(/_ as definido no schema \*/),
  description: v.optional(v.string()),
  }
  returns: { ok: true, reportId: Id<"reports"> } | { ok: false, error: "rate-limited" | "reliability-too-low" }
  Rate limit:
- reliabilityScore >= 2 (hard gate). Se abaixo → reliability-too-low.
- Dedup 24h por par (reporterId, targetUserId):
  const cutoff = Date.now() - 24 _ 60 _ 60 \* 1000;
  const existingReport = await ctx.db
  .query("reports")
  .withIndex("by_reporter_target", q =>
  q.eq("reporterId", caller.\_id)
  .eq("targetUserId", args.targetUserId)
  .gt("createdAt", cutoff)
  )
  .first();
  if (existingReport) return { ok: false, error: "rate-limited" };
- Cap de 5 reports por dia:
  const dailyReports = await ctx.db
  .query("reports")
  .withIndex("by_reporter_created", q =>
  q.eq("reporterId", caller.\_id).gt("createdAt", cutoff)
  )
  .collect();
  if (dailyReports.length >= 5) {
  return { ok: false, error: "rate-limited" };
  }
  3.8 internal.trades.expireTrade (Internal Mutation)
  args: { tradeId: v.id("trades") }
  Se status === "pending_confirmation", atualiza para "expired" e decrementa pendingTradesCount de ambos.

---

4. Estrutura de Arquivos Frontend
   apps/web/
   ├── app/(dashboard)/matches/
   │ └── page.tsx # Server Component; metadata + <MatchesClient />
   ├── modules/matches/
   │ ├── ui/
   │ │ ├── matches-client.tsx # usePaginatedQuery + shell + callbacks
   │ │ ├── matches-filters.tsx # Tabs + Select distância + toggle hidden
   │ │ ├── match-card.tsx # React.memo; card individual (≤150 linhas)
   │ │ ├── match-card-actions.tsx # DropdownMenu ⋯ + CTAs + WhatsApp handler
   │ │ ├── match-trade-drawer.tsx # Sheet bottom; checkboxes figurinhas
   │ │ ├── match-report-dialog.tsx # Dialog; react-hook-form + zod
   │ │ ├── match-empty-state.tsx # Refatora existente
   │ │ └── match-skeleton.tsx # Grid de 6 skeletons
   │ ├── lib/
   │ │ └── format-match-distance.ts # Existe
   │ └── hooks/
   │ └── use-matches-filters.ts # Extender para tabs + includeHidden + maxDistanceKm

---

5. Especificação de Componentes
   5.1 matches-client.tsx

- usePaginatedQuery(api.matches.listMyMatches, { ...queryArgs, paginationOpts: { numItems: 50 } })
- Callbacks estáveis (useCallback): onHide, onReport, onInitiateTrade, onConfirmTrade, onCancelTrade, onDisputeTrade
- Sem useEffect para sincronizar query com estado local
  Optimistic update de toggleHidden:
  const [optimisticallyHiddenIds, setOptimisticallyHiddenIds] =
  useState<Set<Id<"precomputedMatches">>>(new Set());
  const handleHide = useCallback(async (
  matchId: Id<"precomputedMatches">,
  matchedUserId: Id<"users">,
  tradePointId: Id<"tradePoints">
  ) => {
  setOptimisticallyHiddenIds(prev => new Set(prev).add(matchId));
  try {
  await toggleHidden({ matchedUserId, tradePointId });
  } catch {
  setOptimisticallyHiddenIds(prev => {
  const next = new Set(prev);
  next.delete(matchId);
  return next;
  });
  toast.error("Erro ao esconder match. Tente novamente.");
  }
  }, [toggleHidden]);
  Reset do Set quando toggle "Mostrar escondidos" é ativado:
  useEffect(() => {
  if (includeHidden) setOptimisticallyHiddenIds(new Set());
  }, [includeHidden]);
  Renderização: matches.filter(m => !optimisticallyHiddenIds.has(m.\_id))
  5.2 match-card.tsx (React.memo)
  Anatomia:

1. Header: Avatar shadcn + displayNickname (link /perfil/[nickname]) + distância (Pill Kibo) + Pill Kibo "Bidirecional"
2. Ponto de troca: link /ponto/[tradePointSlug]
3. Duas colunas: chips numéricos (Badge shadcn), N=6 mobile/12 desktop, "+X mais"
4. Rodapé: [Combinar no WhatsApp] · [Confirmar troca] · DropdownMenu ⋯
   Estados:
   pendingTrade UI
   null CTA "Combinar no WhatsApp"
   role=initiator "Aguardando confirmação..." + countdown 72h + botão "Cancelar" (trades.cancel)
   role=counterparty Botão verde "Confirmar troca" + botão fantasma "Disputar"
   status=disputed Status Kibo "Disputa em análise" + desabilita ações
   5.3 match-card-actions.tsx (DropdownMenu + WhatsApp handler)
   Ordem no menu:
5. Ver perfil → /perfil/[nickname]
6. Copiar link do ponto
7. Esconder este match → toggleHidden
8. Denunciar usuário → MatchReportDialog
   Itens destrutivos com ícone vermelho.
   Handler WhatsApp (sem vazamento de timer, listener duplicado, ou toast duplicado):
   const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const handlerRef = useRef<(() => void) | null>(null);
   useEffect(() => {
   return () => {
   if (timeoutRef.current) clearTimeout(timeoutRef.current);
   if (handlerRef.current)
   document.removeEventListener("visibilitychange", handlerRef.current);
   };
   }, []);
   const handleWhatsAppClick = useCallback(() => {
   // Limpa listener/timeout anterior antes de registrar novo
   if (handlerRef.current) {
   document.removeEventListener("visibilitychange", handlerRef.current);
   handlerRef.current = null;
   }
   if (timeoutRef.current) {
   clearTimeout(timeoutRef.current);
   timeoutRef.current = null;
   }
   window.open(waLink, "\_blank", "noopener,noreferrer");
   handlerRef.current = () => {
   if (document.visibilityState === "visible") {
   // Auto-remove na primeira vez — evita toast duplicado
   document.removeEventListener("visibilitychange", handlerRef.current!);
   handlerRef.current = null;
   toast("Conseguiu trocar? Marcar como trocada", {
   duration: Infinity,
   action: {
   label: "Marcar",
   onClick: () => onInitiateTrade(matchedUserId, tradePointId),
   },
   });
   }
   };
   document.addEventListener("visibilitychange", handlerRef.current);
   timeoutRef.current = setTimeout(() => {
   if (handlerRef.current)
   document.removeEventListener("visibilitychange", handlerRef.current);
   handlerRef.current = null;
   }, 35000);
   }, [waLink, onInitiateTrade, matchedUserId, tradePointId]);
   5.4 match-trade-drawer.tsx

- Título: "Confirmar troca com {nickname}"
- Checkboxes: "Figurinhas que eu dei" (iHaveTheyNeed) | "Figurinhas que recebi" (theyHaveINeed)
- Zod: stickersIGave: z.array(z.number()).min(1), stickersIReceived: z.array(z.number()).min(1)
- Submit: trades.initiate
- Erros: stickers_mismatch → toast + refetch; forbidden → toast genérico
  5.5 Fluxo Contraparte
- "Confirmar troca" → Dialog: "Confirmar que trocou {N} figurinhas..." → trades.confirm
- Sucesso: toast + card some (Convex reativo)
- Erro state_changed → toast "Suas figurinhas mudaram..."
- "Disputar" → Dialog textarea (Zod: 10-500 chars) → trades.dispute
  5.6 matches-filters.tsx
- Tabs: "Todos" | "Bidirecionais" | "Mesmo ponto" | "≤50km"
- Select distância: 5/10/25/50km (só ativo na tab ≤50km; passado como maxDistanceKm na query)
- Toggle "Mostrar escondidos"
  5.7 use-matches-filters.ts — Mapeamento de Tabs para Args
  type MatchTab = "Todos" | "Bidirecionais" | "Mesmo ponto" | "≤50km";
  const TAB_TO_ARGS: Record<MatchTab, { layer: 1 | 2 | null; bidirectionalOnly: boolean }> = {
  "Todos": { layer: null, bidirectionalOnly: false },
  "Bidirecionais": { layer: null, bidirectionalOnly: true },
  "Mesmo ponto": { layer: 1, bidirectionalOnly: false },
  "≤50km": { layer: 2, bidirectionalOnly: false },
  };
  // Uso:
  const { layer, bidirectionalOnly } = TAB_TO_ARGS[activeTab];
  const maxDistanceKm = activeTab === "≤50km" ? selectedDistanceKm : undefined;
  5.8 Estados de UI
- Loading: MatchSkeleton grid de 6
- Vazio absoluto: MatchEmptyState + CTA "/map"
- Vazio filtrado: "Nenhum match com esses filtros." + "Limpar filtros"
- Erro: toast + "Tentar de novo" (router.refresh())
  5.9 Performance
- MatchCard em React.memo (props planas)
- Callbacks estabilizados no MatchesClient
- key={match.\_id}
- useMemo para filtros
- Avatar: loading="lazy", decoding="async"
  5.10 A11y e Mobile
- Botões ícone: aria-label
- Dialog destrutivo: foco inicial no botão "Cancelar"
- Sheet: fecha com Esc/swipe
- Touch targets ≥ 44×44
- Badges: ícone + texto
- prefers-reduced-motion: motion-reduce:transition-none

---

6. Notas de Implementação Backend
   6.1 albumCompletionPct
   Campo denormalizado no doc users. Computado em stickers.ts (updateStickerList):
   const albumCompletionPct = Math.round(
   ((totalStickers - missing.length) / totalStickers) \* 100
   );
   await ctx.db.patch(userId, { albumCompletionPct });
   albumProgress permanece no schema como legado deprecado. Sem migration.
   6.2 tradePointSlug
   Denormalizado no doc precomputedMatches. Persistido no recompute (matches.recomputeForUser).
   6.3 totalTrades
   Campo existente no schema de users. Incrementado em trades.confirm. A query listMyMatches lê other.totalTrades ?? 0.
   6.4 isHidden em precomputedMatches
   Denormalizado para filtro pré-paginação. O recompute consulta userMatchInteractions ao criar rows. A mutation toggleHidden faz patch atômico em ambas as tabelas.
   6.5 pendingTradesCount — Modelo Consistente
   Mutation Ação
   trades.initiate Incrementa ambos
   trades.confirm Decrementa ambos
   trades.cancel Decrementa ambos
   trades.dispute Decrementa ambos
   internal.trades.expireTrade Decrementa ambos
   6.6 reliabilityScore — Teto
   Teto definido: Math.min((user.reliabilityScore ?? 3) + 1, 10).
   Aplicado em trades.confirm para ambos os lados.
   6.7 pairKey — Índices

- by_pairKey_created pairKey, createdAt: Rate limit 24h (range query).
- by_pairKey_status_created pairKey, status, createdAt: Verificação already-pending.
  6.8 bidirectionalOnly — Branch de Índice
- bidirectionalOnly && layer !== null: by_user_layer_bidirectional.
- bidirectionalOnly && layer === null: by_user_layer + .filter().
- !bidirectionalOnly: by_user_layer.
  6.9 maxDistanceKm — Filtro Pré-Paginação
  Aplicado via .filter(q => q.lte(q.field("distanceKm"), args.maxDistanceKm)) antes do .paginate(), garantindo que o cursor avance corretamente sobre o conjunto já filtrado.
  6.10 reports.create — Dedup + Cap
- Dedup 24h por par (reporterId, targetUserId) via by_reporter_target.
- Cap de 5 reports por dia via by_reporter_created.
  6.11 trades.initiate — Validação de Figurinhas
  O match (precomputedMatches) é usado apenas para autorização (confirmar que o par existe). A validação de figurinhas é feita contra os álbuns atuais:
- stickersIGave ⊆ caller.duplicates (atual)
- stickersIReceived ⊆ matchedUser.missing (atual)
  6.12 trades.confirm — Atualização de Álbuns
  Lógica exata:
- initiator.duplicates = initiator.duplicates sem stickersInitiatorGave
- initiator.missing = initiator.missing sem stickersInitiatorReceived
- counterparty.duplicates = counterparty.duplicates sem stickersInitiatorReceived
- counterparty.missing = counterparty.missing sem stickersInitiatorGave
  Validação state_changed: verificar antes que stickersInitiatorGave ainda estão em initiator.duplicates e stickersInitiatorReceived ainda estão em counterparty.missing.

---

7. Cronograma de Blockers

# Blocker Severidade

1 Schema trades + userMatchInteractions + pendingTradesCount/albumCompletionPct em users + remoção matchScore + adição tradePointSlug/isHidden em precomputedMatches Crítico
2 Denormalização tradePointSlug/isHidden no recompute + albumCompletionPct em stickers.ts Crítico
3 Mutation trades.initiate com rate limit, autorização, validação contra álbuns atuais, scheduler Crítico
4 Mutation trades.confirm com validação state_changed, atualização exata de álbuns, incremento totalTrades/reliabilityScore Crítico
5 Mutation trades.cancel Crítico
6 Mutation trades.dispute Crítico
7 Mutation userMatchInteractions.toggleHidden (patch em ambas as tabelas) Crítico
8 Mutation reports.create com dedup 24h + rate limit (index by_reporter_created) Crítico
9 Query listMyMatches com layer dinâmico + bidirectionalOnly + maxDistanceKm + filtro hidden pré-paginação + zero N+1 + retorno correto Crítico
10 Internal mutation trades.expireTrade + scheduler Alto
11 Substituição schema reports (breaking change) Alto

---
