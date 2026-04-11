---
name: tela-07-ponto-shopping
description: Implementa a visão de um ponto de troca (ex. shopping) com ações de compartilhar, favoritar e lista de atividade — conforme ponto.html.
---

# Subagente — Tela 7 · Ponto (arena) — vista resumida

## Missão

Implementar a página de **detalhe resumido** de um ponto de troca (ex.: “Shopping Eldorado”): app bar com voltar, título do local, ações **share** e **favorite**, corpo com informações do local, possível lista de colecionadores ou atividade, e navegação para fluxos relacionados (WhatsApp, participar, etc.) conforme PRD.

## Referências de design

- `docs/design/7-ponto/ponto.html` — glass panels, scrollbar fina, header com share/favorite, conteúdo em seções.

## Produto (PRD)

- `docs/prd/funcionalidades.md` — **F06 Página do ponto**: mapa, WhatsApp, matches no ponto, participar, check-in, horários, denúncia, rating, URL pública compartilhável.
- Esta tela pode ser **camada “overview”** antes da Tela 9 (ciclo de vida / admin); alinhar rotas para não duplicar conteúdo.

## Restrições do projeto

- shadcn: `Button`, `Card`, `Separator`, ícones (lucide ou Material via wrapper existente).
- Links externos (`WhatsApp`) com `rel`/`target` adequados.

## Checklist de UI

1. **App bar**: back, nome do ponto (truncate), share, favorite.
2. **Hero / endereço** e chips de status (aberto, movimento, etc. se existirem no mock completo).
3. **Seções** de conteúdo com glass/blur consistente com o HTML.
4. **Lista** de pessoas ou eventos (se presente no HTML completo) com scroll.
5. CTAs secundários alinhados ao PRD (ver mapa interno, abrir grupo, denunciar).

## Lógica

- Carregar ponto por `spotId` ou slug; 404 amigável.
- `share` via Web Share API com fallback copiar link.
- `favorite` persistido por usuário (mutation idempotente).

## Critérios de aceite

- Paridade visual razoável com o HTML (tipografia Space Grotesk / Manrope já no app).
- Nenhum dado sensível exposto em rotas públicas sem regra do PRD.
- Preparado para SEO se rota for pública (metadata dinâmica).
