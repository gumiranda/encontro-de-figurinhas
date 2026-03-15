Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
Plano: Encontro de Figurinhas - Funcionalidades de Mapa

Contexto

O projeto encontro-de-figurinhas e um monorepo ja scaffoldado com Next.js 15.4 + Convex + Clerk + shadcn/ui + Turborepo. Possui autenticacao completa, user management
com roles (superadmin/ceo/user), workflow de aprovacao, e 51+ componentes UI prontos.

As tarefas originais assumiam comecar do zero (create-next-app, auth anonima, componentes raw HTML). A maioria precisa ser reescrita para aproveitar a infraestrutura
existente.

O que ja existe (NAO precisa fazer)

- Scaffold do projeto (Task 1 original) - ELIMINADA
- Autenticacao anonima (Task 7 original) - ELIMINADA (Clerk ja cuida)
- Setup de providers, Convex, Tailwind - tudo pronto
- 51+ componentes shadcn/ui (Dialog, Button, Input, Textarea, Card, Badge, Sheet, etc.)

Decisoes Arquiteturais

1.  Mapa publico: Rota /mapa acessivel sem login (maximiza viralidade). Escrita (add spot, votar) exige login.
2.  Modulo spots: Seguir padrao existente modules/auth/ui/ -> modules/spots/ui/
3.  Clerk auth em mutations: Usar getAuthenticatedUser(ctx) de packages/backend/convex/lib/auth.ts
4.  Componentes shadcn/ui: Dialog, Button, Input, Textarea, etc. de @workspace/ui

---

Checklist de Tarefas

TASK 1: Schema do Convex (spots + votes)

Arquivo: packages/backend/convex/schema.ts

Adicionar tabelas spots e votes ao schema existente (que ja tem users).

spots:

- title (string), description (optional string)
- latitude (float64), longitude (float64)
- createdBy (id "users"), createdByName (string, denormalizado)
- createdAt (number - timestamp)
- expiresAt (number - timestamp, default 24h apos criacao)
- upvotes (number, default 0), downvotes (number, default 0)
- isActive (boolean)
- Indexes: by_active ["isActive"], by_expires ["expiresAt"], by_created_by ["createdBy"]

votes:

- spotId (id "spots"), userId (id "users")
- value (number: +1 ou -1)
- createdAt (number - timestamp)
- Indexes: by_spot ["spotId"], by_user_spot ["userId", "spotId"]

DoD: pnpm backend:dev roda, tabelas aparecem no Convex dashboard.
Deps: Nenhuma
Tempo: 30min

---

TASK 2: Backend - Funcoes de Spots

Arquivo novo: packages/backend/convex/spots.ts

Queries (publicas, sem auth):

- listActive - Retorna spots onde isActive === true E expiresAt > Date.now() (ambos filtros obrigatorios, para cobrir o caso onde upvote estendeu o expiresAt mas o
  cron ainda nao rodou)
- getById - Busca spot por ID (para deep links). Tambem verifica isActive && expiresAt > Date.now() antes de retornar.
- getActiveCount - Conta spots ativos (mesma logica dual de filtro)

Mutations (requerem auth via getAuthenticatedUser):

- create - Cria spot. Valida user aprovado. Rate limit: contar spots do user nas ultimas 24h via index by_created_by, limitar a 10. Se exceder, throw error. Seta
  createdAt = Date.now(), expiresAt = Date.now() + 24h. Denormaliza createdByName.
- remove - Criador ou admin pode desativar spot (isActive = false)

Internal mutation:

- expireStale - Desativa spots com expiresAt < Date.now() (chamada pelo cron)

Padrao a seguir: packages/backend/convex/users.ts (imports, auth checks, validators)

DoD: Funcoes acessiveis via api.spots.\*. Criar e listar spots funciona no dashboard Convex.
Deps: Task 1
Tempo: 1.5h

---

TASK 3: Backend - Funcoes de Votos

Arquivo novo: packages/backend/convex/votes.ts

Mutations (auth required):

- castVote(spotId, value) - Toggle: mesmo voto remove, voto oposto troca. IMPORTANTE: ler contadores denormalizados (upvotes/downvotes) do banco DENTRO da mutation
  via ctx.db.get(spotId) — nunca receber como argumento. Convex serializa mutations, entao race conditions entre users nao sao problema, mas os contadores devem ser
  lidos fresh. Se value === 1 (upvote), atualiza expiresAt = Date.now() + 24h para estender vida do spot. Se downvotes >= 3, desativa spot (isActive = false).
  Validacao: antes de aceitar voto, checar se spot isActive === true && expiresAt > Date.now(). Se spot expirou mas cron ainda nao rodou, rejeitar voto com erro.

Queries (publica com auth opcional):

- getMyVotes(spotIds[]) - Query publica que verifica auth internamente: se usuario autenticado, retorna votos dele para a lista de spotIds. Se nao autenticado,
  retorna array vazio. Isso permite chamar a query incondicionalmente no componente do mapa (que e publico) sem quebrar quando nao ha login.

DoD: Votar funciona. Contadores atualizam (lidos do DB, nao passados). Toggle funciona. Spot desativa com 3 downvotes. getMyVotes retorna [] para usuarios anonimos
sem erro.
Deps: Task 1
Tempo: 1h

---

TASK 4: Cron de Auto-Expiracao

Arquivo novo: packages/backend/convex/crons.ts

Cron a cada 15 minutos chamando internal.spots.expireStale.

DoD: Cron aparece no Convex dashboard. Spots expirados sao desativados automaticamente.
Deps: Task 2
Tempo: 20min

---

TASK 5: Instalar Mapbox + Configurar Env

Comando: pnpm --filter web add react-map-gl mapbox-gl

Arquivos a modificar:

- apps/web/.env.local - Adicionar NEXT_PUBLIC_MAPBOX_TOKEN
- apps/web/.env-example - Documentar a variavel

DoD: import Map from 'react-map-gl' compila sem erro.
Deps: Nenhuma
Tempo: 15min

---

TASK 6: Pagina do Mapa (rota publica /mapa)

Arquivos novos:

- apps/web/app/(public)/mapa/page.tsx - Pagina do mapa
- apps/web/app/(public)/layout.tsx - Layout minimo (sem sidebar, com header flutuante)
- apps/web/modules/spots/ui/components/spots-map.tsx - Componente do mapa
- apps/web/modules/spots/ui/components/spot-marker.tsx - Marker customizado
- apps/web/modules/spots/ui/components/spot-popup.tsx - Popup ao clicar marker

Arquivos a modificar:

- apps/web/middleware.ts - Adicionar rotas publicas ao isPublicRoute: /mapa(._) e /spot/(._) (com barra antes do wildcard para nao capturar rotas como /spotlight
  etc.)

Decisao arquitetural: sem bounding box no MVP. listActive retorna TODOS os spots ativos sem filtro geografico. Com poucos spots na fase inicial (dezenas a centenas),
isso e performante e simples. Se escalar para milhares, adicionar filtro por viewport + debounce no onMoveEnd (300ms). Documentar essa decisao no codigo.

Implementacao:

- Layout publico: header flutuante com logo "Encontro de Figurinhas", badge de spots ativos, botao Clerk (UserButton ou "Entrar")
- IMPORTANTE: Importar CSS do Mapbox GL (mapbox-gl/dist/mapbox-gl.css) no layout (public)/layout.tsx, NAO no componente do mapa. Isso evita problemas de SSR com
  Next.js App Router onde o CSS nao carrega corretamente se importado em componentes client-side.
- Mapa fullscreen com react-map-gl, centralizado na localizacao do usuario (fallback: Sao Paulo)
- useQuery(api.spots.listActive) para carregar spots (funciona sem auth)
- Markers coloridos: verde (muitos upvotes), amarelo (poucos), laranja (novo)
- Popup com titulo, descricao, contadores de votos, indicador de "frescor"

DoD: /mapa funciona sem login. Markers aparecem. Popup mostra info do spot.
Deps: Tasks 2, 5
Tempo: 4h

---

TASK 7: Fluxo "Adicionar Ponto" (Dialog)

Arquivos novos:

- apps/web/modules/spots/ui/components/add-spot-dialog.tsx - Dialog com form
- apps/web/modules/spots/ui/components/add-spot-fab.tsx - FAB (botao flutuante)

Implementacao:

- FAB no canto inferior direito do mapa. Comportamento por estado do usuario:
  - Nao logado: FAB mostra icone de MapPin. Ao clicar, redireciona para /sign-in?redirect_url=/mapa
  - Logado mas pendente/rejeitado: FAB visivel mas ao clicar mostra toast "Sua conta esta aguardando aprovacao" (nao redireciona, nao esconde — evita limbo
    silencioso)
  - Logado e aprovado: FAB abre o Dialog normalmente
- Dialog usa componentes shadcn/ui: <Dialog>, <Input>, <Textarea>, <Button>
- Form com react-hook-form + zod validation
- "Usar minha localizacao" captura GPS do usuario
- Opcao de tocar no mapa para escolher local
- Ao salvar: chama useMutation(api.spots.create), toast de sucesso via sonner
- Spot aparece em real-time no mapa (reatividade Convex)

DoD: Usuario logado cria spot via dialog. Spot aparece instantaneamente no mapa.
Deps: Tasks 2, 6
Tempo: 2h

---

TASK 8: Botoes de Voto no Popup

Arquivos novos:

- apps/web/modules/spots/ui/components/vote-buttons.tsx

Modificar:

- apps/web/modules/spots/ui/components/spot-popup.tsx - Integrar botoes

Implementacao:

- <Button variant="ghost" size="sm"> com icones ThumbsUp/ThumbsDown do lucide-react
- Mostra contadores ao lado de cada botao
- Se usuario ja votou, botao fica highlighted (usa api.votes.getMyVotes)
- Click chama useMutation(api.votes.castVote)
- Se nao logado, redireciona para login
- Atualizacao em real-time via reatividade Convex

DoD: Votos funcionam. Toggle funciona. Contadores atualizam em real-time.
Deps: Tasks 3, 6
Tempo: 1.5h

---

TASK 9: Botao de Compartilhar (WhatsApp)

Arquivo novo:

- apps/web/modules/spots/ui/components/share-button.tsx

Modificar:

- apps/web/modules/spots/ui/components/spot-popup.tsx - Adicionar botao

Implementacao:

- Botao "Compartilhar" no popup do spot
- Mobile: usa navigator.share (Web Share API) -> abre sheet nativo
- Desktop fallback: link https://wa.me/?text=... com mensagem pre-formatada
- Mensagem: nome do spot + contagem de confirmacoes + link para /spot/{id}

DoD: Compartilhar abre WhatsApp (ou share sheet) com mensagem formatada e link.
Deps: Task 6
Tempo: 30min

---

TASK 10: Deep Link /spot/[id] com OG Meta Tags

Arquivos novos:

- apps/web/lib/convex-server.ts - ConvexHttpClient reutilizavel para server components
- apps/web/app/(public)/spot/[id]/page.tsx - Server component com generateMetadata + client component do spot

ConvexHttpClient (reutilizavel, somente queries publicas):
// apps/web/lib/convex-server.ts
import { ConvexHttpClient } from "convex/browser";
// IMPORTANTE: Este client NAO tem auth. Usar apenas para queries publicas (sem getAuthenticatedUser).
// Para queries autenticadas no server, usar Convex HTTP Actions com token.
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export default client;
Usado em generateMetadata para queries server-side: await client.query(api.spots.getById, { id }).

Implementacao:

- Rota publica (ja adicionada no middleware na Task 6)
- Validacao de ID: O params.id chega como string da URL. A query getById deve aceitar v.string() (nao v.id("spots")) e usar ctx.db.normalizeId("spots", id)
  internamente — retorna null se formato invalido, sem lancar erro. Se null ou spot nao encontrado, retornar metadata generica e renderizar pagina de "Spot nao
  encontrado".
- useQuery(api.spots.getById, { id }) no client component para dados reativos
- Mapa centralizado no spot com marker unico
- Abaixo: detalhes, botoes de voto, compartilhar
- Se spot nao existe ou expirou: mensagem amigavel + link para /mapa

OG Meta Tags (critico para WhatsApp preview):

- generateMetadata usa ConvexHttpClient server-side (useQuery NAO funciona em server components)
- og:title = titulo do spot
- og:description = descricao ou "Ponto de troca de figurinhas ativo!"
- og:image = Mapbox Static Images API:
  https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+22c55e(${lng},${lat})/${lng},${lat},14,0/600x315@2x?access_token=${token}
- Isso gera o card bonito no WhatsApp com preview de mapa e pin verde.

Nota sobre providers: O root layout (apps/web/app/layout.tsx) ja inclui <Providers> (Clerk+Convex+Themes), que envolve todos os route groups incluindo (public). Nao
precisa replicar providers no (public)/layout.tsx.

DoD: Link /spot/{id} abre mapa focado no spot. WhatsApp mostra card com titulo, descricao e thumbnail do mapa. IDs invalidos mostram pagina amigavel. Spot expirado
mostra fallback.
Deps: Tasks 2, 6, 8, 9
Tempo: 1.5h

---

TASK 11: Integracao com Dashboard + Analytics Basico

Modificar:

- apps/web/app/(dashboard)/layout.tsx - Adicionar "Mapa" ao navItems (para todos users, com icone MapPin)
- apps/web/app/(dashboard)/page.tsx - Trocar cards placeholder por cards de stats + link para /mapa

Adicionar ao backend:

- packages/backend/convex/spots.ts - Nova query getStats (auth required, admin only): retorna { activeSpots, totalSpots, totalVotes, spotsCreatedToday }. Conta spots
  ativos (isActive && expiresAt > now), total de spots (todos), total de votes, e spots com createdAt nas ultimas 24h.

Cards no dashboard:

- Card "Pontos Ativos" com contagem + botao "Ver no Mapa" (todos users)
- Card "Estatisticas" (admin only) com: total de spots criados, total de votos, spots criados hoje

DoD: Sidebar mostra "Mapa". Dashboard mostra cards com metricas. Admin ve stats extras.
Deps: Tasks 2, 6
Tempo: 1h

---

TASK 12: Seed de Dados

Arquivo novo: packages/backend/convex/seed.ts

- internalMutation seedSpots - Cria 8-10 spots em Sao Paulo (locais reais de 2022). Para o createdBy: primeiro busca system user via
  ctx.db.query("users").withIndex("by_clerk_id", q => q.eq("clerkId", "system")).first(). Se nao existe, cria (clerkId: "system", name: "Sistema", status: "approved").
  Isso torna o seed idempotente — rodar multiplas vezes nao duplica o system user. Como e internalMutation, pula validacao de auth. O index by_clerk_id ja existe no
  schema atual.
- internalMutation clearSpots - Remove todos os spots e votes (dev only)
- Rodar via npx convex run seed:seedSpots

DoD: Mapa de SP mostra spots de exemplo apos rodar seed. Nenhum erro de foreign key.
Deps: Tasks 1, 2
Tempo: 30min

---

TASK 13: PWA Manifest

Arquivos novos:

- apps/web/public/manifest.json - Web app manifest
- apps/web/public/icons/ - Icones 192x192 e 512x512

Modificar:

- apps/web/app/layout.tsx - Adicionar <link rel="manifest">, <meta name="theme-color">, apple-mobile-web-app tags

Manifest:

- start_url: "/mapa", display: "standalone", theme_color: "#22c55e"

DoD: Chrome mobile mostra "Adicionar a tela inicial". App abre fullscreen no /mapa.
Deps: Task 6
Tempo: 45min

---

TASK 14: Polish e Edge Cases

Modificar: Varios arquivos das Tasks 6-10

- Loading states com <Skeleton> do shadcn/ui enquanto spots carregam
- Empty state quando nao ha spots ativos
- Fallback quando geolocalizacao e negada (centralizar em SP + toast)
- Tratamento de erro do Mapbox (token invalido, rede offline)
- UX mobile: FAB nao sobrepoe controles do mapa, popups scrollaveis
- Verificar reatividade real-time (User A cria spot, User B ve aparecer)

DoD: Todos os caminhos felizes e de erro funcionam. Nenhuma tela em branco.
Deps: Tasks 6-10
Tempo: 2h

---

Ordem de Execucao (Caminho Critico)

Paralelo 1: Task 1 (Schema) + Task 5 (Mapbox/Env)
|
Paralelo 2: Task 2 (Spots) + Task 3 (Votes)
| |
Task 4 (Cron) |
Task 12 (Seed) |
| |
Task 6 (Mapa) <--------+
|
Paralelo 3: Task 7 (Add Spot) + Task 8 (Votos) + Task 9 (Share)
|
Task 10 (Deep Link)
Task 11 (Dashboard)
Task 13 (PWA)
|
Task 14 (Polish)

Tempo total estimado: ~15h de desenvolvimento focado

Verificacao End-to-End

1.  pnpm dev roda sem erros
2.  Acessar /mapa sem login -> mapa carrega com spots
3.  Logar -> FAB aparece -> criar spot -> aparece no mapa em real-time
4.  Clicar spot -> popup com votos e share
5.  Votar -> contador atualiza em real-time
6.  Compartilhar -> abre WhatsApp com link
7.  Abrir link compartilhado -> /spot/{id} mostra spot focado
8.  Esperar expiracao (ou forcar via dashboard) -> spot some do mapa
9.  Dashboard mostra link "Mapa" e card com contagem
10. Mobile: PWA instalavel, mapa responsivo, touch-friendly

Arquivos Criticos (Referencia)

┌─────────────────────────────────────┬─────────────────────────────────────────────────┐
│ Arquivo │ Papel │
├─────────────────────────────────────┼─────────────────────────────────────────────────┤
│ packages/backend/convex/schema.ts │ Schema existente - estender com spots/votes │
├─────────────────────────────────────┼─────────────────────────────────────────────────┤
│ packages/backend/convex/users.ts │ Padrao para novas funcoes Convex │
├─────────────────────────────────────┼─────────────────────────────────────────────────┤
│ packages/backend/convex/lib/auth.ts │ Helper getAuthenticatedUser para mutations │
├─────────────────────────────────────┼─────────────────────────────────────────────────┤
│ apps/web/middleware.ts │ Adicionar rotas publicas /mapa, /spot │
├─────────────────────────────────────┼─────────────────────────────────────────────────┤
│ apps/web/app/(dashboard)/layout.tsx │ Integrar nav link e badge │
├─────────────────────────────────────┼─────────────────────────────────────────────────┤
│ apps/web/components/providers.tsx │ Providers ja configurados (Clerk+Convex+Themes) │
├─────────────────────────────────────┼─────────────────────────────────────────────────┤
│ apps/web/modules/auth/ui/ │ Padrao de modulo a seguir para modules/spots/ │
└─────────────────────────────────────┴─────────────────────────────────────────────────┘
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
