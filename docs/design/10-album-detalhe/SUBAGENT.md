---
name: tela-10-album-detalhe
description: Implementa o dashboard do álbum (progresso global, grid de figurinhas, estados missing/owned) — album-detalhe.html.
---

# Subagente — Tela 10 · Álbum (detalhe / coleção)

## Missão

Construir a tela **“World Cup 2026 Album”** (ou nome final do produto): header com ícone de ranking, contador **X/Y**, seção de **progresso** (percentual, barra, stats Missing/Duplicates/etc.), e **grade de figurinhas** com estados visuais (possui, falta, especial). Deve consumir dados reais do usuário no Convex.

## Referências de design

- `docs/design/10-album-detalhe/album-detalhe.html` — top bar alta, cartão “Global Collection”, barra de progresso com gradiente, grid de stickers com hover/estados, estilos metallic-gold para raros.

## Produto (PRD)

- `docs/prd/funcionalidades.md` — álbum, repetidas, faltantes, celebração ao completar (pode ser outra rota depois).
- Performance: não renderizar 980 células sem virtualização se necessário.

## Restrições do projeto

- shadcn: `Progress`, `Card`, `ScrollArea`, `Tooltip`.
- Evitar `select-none` global no body se prejudicar acessibilidade; limitar a ícones decorativos.

## Checklist de UI

1. **Header**: ícone leaderboard, título do álbum, chip de progresso **523/980** (valores dinâmicos).
2. **Dashboard**: título, subtítulo com range de códigos, percentual grande, barra animada (respeitar reduced motion).
3. **Métricas**: grid 2–4 colunas (Missing, Duplicates, etc. conforme mock).
4. **Grid de figurinhas**: células com número/código, bordas e brilho para raros, estados vazios.
5. **Scroll** interno suave; largura máxima `max-w-7xl` como no HTML.

## Lógica

- Derivar missing/duplicates dos arrays do usuário ou de tabela de inventário.
- Filtros opcionais (time, raridade) se já previstos no HTML — feature-flag se atrasar.

## Critérios de aceite

- Contadores batem com a fonte de verdade no backend após mutações da Tela 4.
- Layout estável em telas pequenas (grid responsivo).
- Contraste adequado em cards escuros (WCAG razoável).
