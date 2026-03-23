## 4. Funcionalidades

### 4.1 Onboarding (5 telas máximo até primeiro valor)

**F01 — Landing e seleção de cidade.** Hero section com proposta de valor clara ("Encontre quem tem as figurinhas que você precisa. Troque perto de você.") + busca autocomplete de cidades (~300 com 100k+ hab, seed IBGE). Card de cidade: nome, UF, pontos de troca ativos, participantes. Páginas de cidade são públicas e indexáveis (SEO).

**F02 — Cadastro via Clerk.** Botão "Entrar com Google" ou email/senha. Pós-auth, tela de completar perfil: apelido (validação de unicidade em tempo real), data de nascimento, cidade. Se menor de 12 → fluxo de consentimento parental. Se 12-15 → campo obrigatório "nome do responsável" + badge automático. Se 16-17 → badge opcional.

**F03 — Entrada rápida de figurinhas (primeiro valor).** Imediatamente após cadastro, antes de pedir GPS. Tela com: "Modo Rápido" — campo de texto onde digita números separados por vírgula ("12, 45, 78, 102") + botão toggle "Tenho repetidas" / "Preciso". Também aceita faixas: "de 001 até 020". Objetivo: usuário cadastra figurinhas em <2 minutos e já vê contadores.

**F04 — Geolocalização (adiada, após primeiro valor).** Estratégia double opt-in obrigatória: (1) pre-prompt customizado do app explicando "Pra mostrar pontos de troca perto de você" com botão "Ativar localização" e link "Agora não, quero buscar manualmente". (2) Se aceitar no pre-prompt → dispara prompt do SO. Se recusar no pre-prompt → NÃO disparar prompt do SO (preserva chance futura). Se recusar no SO (`denied`) → NUNCA pedir novamente. Fallback completo: campo de busca por CEP/bairro/cidade, seletor de cidade, mapa clicável. Todas as features funcionam com localização manual. Fallback IP-based para localização aproximada (nível cidade) como última opção.

### 4.2 Pontos de Troca

**F05 — Mapa de pontos.** Mapa interativo com **Leaflet + OpenStreetMap** (custo zero) com pins nos pontos aprovados. Cluster de markers para zoom out. Lista abaixo ordenada por distância (se GPS disponível) ou alfabética. Cada card: nome do local, endereço, horários, participantes, matches disponíveis pra mim, Confidence Score (barra visual), indicador de atividade ("3 pessoas aqui agora" / "Última visita há 2h").

**F06 — Página do ponto.** Info completa + mapa estático (Leaflet static tile ou screenshot). Botão verde "Entrar no grupo do WhatsApp" (com `target="_blank"`). Lista de matches naquele ponto. Botão "Participar deste ponto" (inscreve na `userTradePoints`). Botão "Estou aqui agora" (check-in com validação GPS ≤500m). Horários mais movimentados (heatmap semanal baseado em check-ins). Botão de denúncia. Rating do ponto (baseado em avaliações pós-troca). Página pública e compartilhável (deeplink para WhatsApp).

**F07 — Solicitar novo ponto.** Form: nome do local, endereço (com geocoding para lat/lng), "por que é um bom ponto". Rate limit: 2 por usuário com Reliability Score < 5, ilimitado acima. Validação: local deve ser público (orientação textual). Admin aprova/recusa.

**F08 — Ciclo de vida do ponto.** Pendente → aprovado (admin cola link WhatsApp) → ativo. Pode ser suspenso (3+ denúncias em 7 dias, automático) ou inativo (Confidence Score 0 por 7 dias). Reativação manual pelo admin ou automática com novo check-in verificado.

### 4.3 Álbum

**F09 — Grid de figurinhas.** Grid numérico de ~980 figurinhas com **virtualização** (react-window ou tanstack-virtual). Renderizar apenas itens visíveis no viewport. 5-6 colunas no mobile. Três estados visuais por toque: cinza (não tenho / sem status), vermelho (need), verde com badge de quantidade (have_duplicate). Seções colapsáveis por grupo/seleção com headers sticky durante scroll. Seção separada para "Extra Stickers" (figurinhas extras da Panini lançadas após o álbum base) — não afetam a porcentagem principal.

**F10 — Entrada rápida (Modo Rápido).** Campo de texto: "12, 45, 78, 102" → marca como repetidas (ou faltantes, via toggle). Input de faixa: "de X a Y" com dois campos numéricos. "Marcar todas" por seção. Teclado numérico nativo no mobile (`inputMode="numeric"`).

**F11 — Contadores.** Barra de progresso geral no topo: "Coladas: 523/980 | Faltam: 457 | Repetidas: 134". Atualiza ao vivo. Contadores por seção no header colapsável. Porcentagem visual com barra colorida.

**F12 — Figurinhas especiais.** Badge dourado para metalizadas, Legends e versões paralelas. Destaque visual nos matches ("Figurinha rara!"). Flag `isSpecial` e `category` (base, metalizada, legend, paralela) no modelo de dados.

**F13 — Filtros do grid.** Tabs rápidos: Todas | Faltantes | Repetidas | Especiais. Busca por número. Filtro por seção/seleção. Filtro por categoria especial.

### 4.4 Motor de Matching — Pré-computado em Três Camadas

**Arquitetura:** o matching NÃO é calculado em tempo real. É pré-computado via scheduled functions do Convex e armazenado em tabela `precomputedMatches`.

**Trigger de recomputação:** quando usuário atualiza lista de figurinhas → mutation `updateStickerList` → `ctx.scheduler.runAfter(0, "internal:recomputeMatches", {userId})`. A action `recomputeMatches` (timeout de 10 min como Convex action): busca pontos do user, para cada ponto busca membros com paginação (batch de 100), carrega arrays de stickers via `db.get`, calcula intersecções em memória, salva resultados em `precomputedMatches` via mutations em batch. Recomputação também é agendada via cron a cada 6 horas para todos os usuários ativos (lastActiveAt < 6h).

**Estrutura de dados otimizada:** figurinhas armazenadas como arrays numéricos no documento do user (`duplicates: number[]`, `missing: number[]`), NÃO como documentos separados. Com 980 stickers × 8 bytes = ~8 KB por user, bem dentro do limite de 1 MiB do Convex. A comparação set intersection é feita em memória (Set em JS) sem queries adicionais.

**Camada 1 — Mesmo ponto (0km).** Cruza figurinhas com outros participantes dos meus pontos de troca. Match mais fácil de concretizar — mesmo grupo, combina e vai. Sempre visível pra todos.

**Camada 2 — Perto (até 15km entre pontos).** Busca participantes de outros pontos cuja distância ao meu ponto mais próximo seja ≤15km (haversine). Card mostra: nome do ponto do outro + distância entre pontos ("Banca do Centro — 3.2km do seu ponto Praça Tubal Vilela"). Usuário pode se inscrever no ponto do outro. Visível pra todos.

**Camada 3 — Média distância (15-50km entre pontos).** Pra figurinhas raras. Busca pontos em bairros distantes e cidades vizinhas. Card: "Essa figurinha rara — o ponto mais perto com ela é [nome], a 32km." Exclusivo Premium.

**Fallback:** Sempre mostra Camada 1. Se menos de 3 matches, expande pra Camada 2 automaticamente. Camada 3 como seção "Expandir busca" ou automática pra figurinhas sem match nas camadas anteriores.

**F14 — Tela de matches.** Query simples: `useQuery("getPrecomputedMatches", {userId, tradePointId})` — leitura O(1). Agrupada por ponto. Filtros: ponto específico, distância máxima (5/15/30/50km), apenas bidirecionais, figurinha específica por número, apenas especiais. Card: apelido, % álbum, trocas confirmadas, figurinhas em comum (lista numérica expansível), ponto de troca, distância entre pontos, badge "Troca perfeita" se bidirecional, Reliability Score do outro usuário.

**F15 — Notificação de match (Premium).** Push via Web Push API quando: figurinha que preciso aparece num ponto perto (Camada 1 ou 2), figurinha rara aparece na Camada 2/3, match bidirecional novo no meu ponto. Detectar durante recomputação de matches: comparar matches novos vs. anteriores, se há novos → push. iOS: funciona apenas com PWA instalado na Home Screen (iOS 16.4+).

### 4.5 Fluxo de Troca

**F16 — Combinar no grupo.** Usuário vê match → vê ponto de troca → entra no grupo → combina dia/horário publicamente no grupo. Zero contato privado.

**F17 — Confirmação de troca.** Ambos confirmam no app quais figurinhas trocaram (tela com checklist numérico das figurinhas do match). Quando um confirma, o outro recebe notificação. Quando ambos confirmam: sistema atualiza álbum de ambos automaticamente (remove das repetidas do cedente, remove das faltantes do recebente, recalcula contadores), incrementa `totalTrades` de ambos, incrementa Reliability Score (+1 cada), incrementa `confirmedTradesCount` do ponto.

**F18 — Tela de segurança pré-encontro.** Exibida uma vez antes do primeiro encontro presencial. Checklist: "Vá a locais públicos", "Avise alguém onde vai", "Menores devem ir acompanhados". Checkbox "Li e entendi" obrigatório. Botão "Compartilhar minha ida" (abre WhatsApp com mensagem: "Vou trocar figurinhas em [Ponto] às [hora]. Endereço: [endereço]. Link: [url]").

### 4.6 Social e Gamificação

**F19 — Ranking por ponto.** Top completadores (% álbum) e top trocadores (total de trocas confirmadas). Badge "Mestre do Ponto" pro top 3.

**F20 — Ranking da cidade.** Agregado. Badge "Colecionador da Cidade".

**F21 — Perfil público seguro.** Apelido, % álbum, trocas confirmadas, pontos que participa, membro desde, Reliability Score, badges conquistados. Zero dados pessoais.

**F22 — Progresso coletivo.** Barra por ponto e por cidade: "Praça Tubal Vilela tem 94.7% das figurinhas entre seus membros." Incentiva comunidade a completar coletivamente.

**F23 — Álbum completado.** Celebração full-screen (confetes, animação), badge permanente "Álbum Completo" no perfil, card compartilhável para WhatsApp/Instagram (imagem gerada via canvas ou OG image), posição no ranking dos completadores, nova missão: "Ajude outros colecionadores — você tem X figurinhas que outros precisam."

### 4.7 Admin

**F24 — Fila de aprovação de pontos.** Solicitações pendentes com info do local e do solicitante (Reliability Score do solicitante). Ações: aprovar (campo para colar link WhatsApp obrigatório), recusar (com motivo obrigatório).

**F25 — Dashboard.** Cadastros (total, hoje, semana), pontos ativos, matches gerados, trocas confirmadas, denúncias abertas, receita premium, DAU/MAU. Gráficos de tendência.

**F26 — Gestão de pontos.** CRUD: editar horários, trocar link WhatsApp, suspender/reativar, métricas por ponto (check-ins, trocas, denúncias, Confidence Score). Health check de links WhatsApp com status.

**F27 — Gestão de usuários.** Busca por apelido. Perfil completo: histórico de trocas, denúncias feitas e recebidas, Reliability Score, status (ativo/shadow-ban/banido). Ações: advertência, suspensão, ban, shadow ban.

**F28 — Config do álbum.** Total de figurinhas base, seções (nome, startNumber, endNumber), lista de especiais com categorias, lista de "Extra Stickers" (adicionáveis sem resetar progresso). Campo `albumVersion` incrementável. Atualizável quando a Panini publicar a lista oficial ou lançar extras.

**F29 — Seed de cidades.** Script IBGE (100k+ hab) com nome, UF, slug, lat/lng. ~300 cidades. Idempotente (verifica existência antes de inserir).
