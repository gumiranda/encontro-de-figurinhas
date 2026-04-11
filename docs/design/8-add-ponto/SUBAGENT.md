---
name: tela-08-sugerir-ponto
description: Implementa o formulário “Sugerir Arena” com avisos de segurança e envio de novo ponto de troca — add-ponto.html.
---

# Subagente — Tela 8 · Sugerir arena (add ponto)

## Missão

Construir o fluxo **“Sugerir Arena”** para o usuário propor um novo ponto de troca: hero “Amplie o Campo de Jogo”, cartão de **segurança/aviso**, campos de formulário (nome, endereço, descrição, link WhatsApp se aplicável), e envio para **moderação** (pendente → aprovado), coerente com o ciclo de vida na Tela 9.

## Referências de design

- `docs/design/8-add-ponto/add-ponto.html` — sticky header “Sugerir Arena”, seção hero, card de warning com ícone, campos e CTA.

## Produto (PRD)

- Novos pontos passam por **curadoria** (vide Tela 9: estados Pendente / Aprovado / Ativo / Suspenso).
- Regras de dados mínimos e validação de endereço/geo no backend.

## Restrições do projeto

- Formulários com **React Hook Form + zod** se for o padrão do app; senão seguir o padrão existente em auth/onboarding.
- shadcn: `Form`, `Input`, `Textarea`, `Alert`, `Button`.

## Checklist de UI

1. **Header**: voltar + título.
2. **Hero**: headline grande em primary, subtítulo explicativo.
3. **Card de segurança**: borda lateral secondary, ícone `warning`, texto orientando boas práticas.
4. **Campos**: nome do local, endereço (autocomplete de cidade/endereço se disponível), observações.
5. **CTA** principal de envio + estado de loading/sucesso/erro.
6. Espaçamento inferior (`pb-32`) para não colidir com navegação global se existir.

## Lógica

- Mutation Convex `suggestSpot` (ou nome equivalente): cria registro com status `pending`, `submittedBy`, timestamps.
- Rate limit ou throttle por usuário para evitar abuso.
- Opcional: upload de foto do local (se PRD permitir; caso contrário, não escopo).

## Critérios de aceite

- Após sucesso, usuário vê confirmação e/ou é redirecionado para “Meus pontos” ou Tela 9 do ponto criado.
- Mensagens de validação claras; nenhum crash se geocoding falhar.
