---
name: tela-04-cadastrar-figurinhas-rapido
description: Implementa o fluxo de cadastro rápido de figurinhas (repetidas vs preciso), parsing de códigos e persistência no Convex — espelhando o HTML de referência.
---

# Subagente — Tela 4 · Cadastrar figurinhas (rápido)

## Missão

Implementar a tela **“Cadastrar Figurinhas”** onde o usuário informa **figurinhas que tem (repetidas)** e **figurinhas que precisa**, com entrada em texto livre, chips removíveis, lista agrupada por país e CTA para o mapa. Deve refletir fidelidade visual ao design e integrar com o modelo de dados do álbum no backend.

## Referências de design

- `docs/design/4-cadastrar-figurinhas-rapido/cadastrar-figurinhas-rapido.html` — fluxo principal (toggle TENHO REPETIDAS / PRECISO, textarea “Entrada Rápida”, chips, grupos por bandeira, FAB inferior).
- `docs/design/4-cadastrar-figurinhas-rapido/aba-preciso.html` — variante da aba **PRECISO** (mesmo padrão visual; reutilizar componentes).

## Produto (PRD)

- Alinhar com `docs/prd/funcionalidades.md` — inventário de figurinhas (duplicadas / faltantes), base para matching e mapa.
- Após salvar, navegação coerente com o CTA do mock: **continuar para o mapa** (rota a definir no app, ex.: `/map` ou equivalente).

## Restrições do projeto

- Ler `CLAUDE.md` na raiz: **usar shadcn/ui** (`@workspace/ui`), não Tailwind “cru” solto onde já existir componente.
- Next.js App Router, módulos em `apps/web/modules/` quando fizer sentido.
- Convex: atualizar `users` (ou tabela dedicada) para `duplicates` / `missing` conforme schema existente; validar argumentos nas mutations.

## Checklist de UI (paridade com o HTML)

1. **Top bar**: voltar, título “CADASTRAR FIGURINHAS”, ação secundária (settings) se mantida no produto.
2. **Segmented control**: **TENHO REPETIDAS** | **PRECISO** com ícones Material.
3. **Entrada rápida**: label, textarea com placeholder de exemplos, chips derivados com dismiss.
4. **Resumo**: contador total de figurinhas listadas.
5. **Lista agrupada**: seções por país (header com “bandeira” decorativa + título), grid de cards com código e delete no hover.
6. **Destaque visual** para itens especiais (mock usa borda tertiary em alguns códigos).
7. **CTA fixo inferior**: “CONTINUAR PARA O MAPA” em barra glass/blur; **sem bottom nav** neste fluxo (como no HTML).

## Lógica

- Parser tolerante: aceitar formatos tipo `BRA 12`, `FRA 14`, vírgulas ou linhas; normalizar para IDs numéricos internos se o app usar números.
- Alternar abas sincroniza estado distinto (repetidas vs faltantes) sem perder o outro conjunto até o usuário salvar.
- Feedback de erro inline para códigos inválidos ou fora do álbum suportado.

## Critérios de aceite

- Toggle e listas funcionam sem regressão de layout mobile-first.
- Dados persistidos no Convex e refletidos em queries usadas pelo mapa/matches.
- Nenhuma divergência grave com tokens/cores do design system já usado nas telas 1–3.
