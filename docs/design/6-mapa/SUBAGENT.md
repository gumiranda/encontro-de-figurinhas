---
name: tela-06-mapa-pontos
description: Implementa o mapa interativo de pontos de troca (pins, cluster, lista inferior) conforme mapa.html.
---

# Subagente — Tela 6 · Mapa da arena

## Missão

Construir a tela **“MAPA DA ARENA”**: mapa ocupando a área principal, marcadores (incluindo cluster com contagem), pin “VOCÊ”, barra superior com menu/busca/perfil, e **sheet ou lista** com cards de pontos próximos. Integrar com dados reais de pontos no Convex e, se aplicável, Leaflet/maplib conforme PRD de arquitetura.

## Referências de design

- `docs/design/6-mapa/mapa.html` — TopAppBar (menu, título, search, avatar), área de mapa com overlay em gradiente, pins e cluster animado, lista scrollável abaixo do mapa.

## Produto (PRD)

- `docs/prd/funcionalidades.md` — visualização de pontos, navegação para detalhe do ponto (Tela 7/9).
- `docs/prd/arquitetura-tecnica.md` — mapa estático ou tiles; usar a stack já definida no projeto (não introduzir dependência pesada sem necessidade).

## Restrições do projeto

- Preferir biblioteca de mapa já adotada no monorepo; se ainda não houver, propor **uma** opção e encapsular em um componente (`MapView`).
- shadcn para sheets, scroll area, botões; performance em mobile (evitar re-render do mapa a cada tick).

## Checklist de UI

1. **Header** fixo com blur: menu (drawer?), título “MAPA DA ARENA”, busca, avatar.
2. **Mapa** ~400px altura ou flex: imagem/tiles, gradiente inferior, pins posicionados.
3. **Cluster**: badge com número + animação ping (moderar `prefers-reduced-motion`).
4. **Pin do usuário** com label “VOCÊ”.
5. **Lista** abaixo ou bottom sheet: cards com nome do ponto, distância, CTA “ver” / “navegar”.
6. Empty/error states quando não há pontos na região.

## Lógica

- Query geoespacial ou “by city” conforme schema; paginação se muitos pontos.
- Sincronizar seleção pin ↔ card na lista.
- Deep link para **detalhe do ponto** com id estável.

## Critérios de aceite

- Mapa utilizável em touch (pan/zoom) se for mapa real; se for mock estático inicialmente, documentar limitação e TODO.
- Layout não quebra em altura `100dvh` (como nos HTMLs de referência).
- Contraste e foco acessíveis nos controles.
