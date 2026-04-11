---
name: tela-05-gps-localizacao
description: Implementa busca manual de localização (CEP/bairro/cidade) e fluxo complementar de GPS — telas gps.html e gps-2.html.
---

# Subagente — Tela 5 · Localização / “Buscar arena manualmente”

## Missão

Entregar as experiências de **localização** para o usuário encontrar pontos de troca: (A) busca textual por CEP, bairro ou cidade; (B) variante com ênfase em permissão de localização / raio (referência `gps-2.html`). Comportamento e copy devem seguir o PRD de pontos e mapa.

## Referências de design

- `docs/design/5-gps/gps.html` — hero “BUSCAR ARENA MANUALMENTE”, campo de busca com ícone, sugestões rápidas, avatar no header.
- `docs/design/5-gps/gps-2.html` — fluxo alternativo com **stadium-glow**, anel de pulso e mensagens de permissão GPS (usar como segunda tela ou estado do mesmo fluxo).

## Produto (PRD)

- Ver `docs/prd/funcionalidades.md` (pontos de troca, proximidade, check-in futuro). Integração com tabela de **cidades** e geocoding ou busca indexada já prevista no backend.
- Resultado da busca deve alimentar o **mapa** (Tela 6) com viewport ou cidade selecionada.

## Restrições do projeto

- `CLAUDE.md`: componentes **shadcn** para inputs, botões, sheets de permissão.
- Pedido de geolocalização apenas após gesto claro do usuário (UX e privacidade); mensagens claras se o browser negar permissão.

## Checklist de UI — `gps.html`

1. Header fixo: voltar, marca “figurinha fácil”, avatar.
2. Bloco hero com título em caixa alta e subtítulo explicativo.
3. Campo de busca full-width com ícone `search` e focus ring no token primary.
4. Seção de sugestões (“rápidas”) com chips ou lista conforme mock.
5. Estados: vazio, carregando, resultados, erro de rede.

## Checklist de UI — `gps-2.html`

1. Tratar como **estado pós-tentativa** ou passo dedicado: ilustração/anel animado, texto de “ativar localização”.
2. Botões primário/secundário alinhados ao design (cancelar vs tentar de novo).

## Lógica

- Debounce na busca; opcional: integração com API de CEP ou índice `cities` no Convex.
- Persistir última localização/cidade escolhida em preferências do usuário (se já existir padrão no app).

## Critérios de aceite

- Transição suave para o mapa com bounds ou centro definidos.
- Acessibilidade: labels associados aos inputs, foco visível.
- Duas variantes (`gps` / `gps-2`) cobertas por rota ou query param, sem duplicar estilos incompatíveis.
