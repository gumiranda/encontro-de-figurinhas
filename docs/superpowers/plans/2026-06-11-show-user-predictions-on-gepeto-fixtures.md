# Exibir palpites nos cards da lista de jogos do Gepeto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mostrar o palpite do usuário logado, o palpite do Gepeto e o placar real dentro de cada card da lista de jogos do Gepeto.

**Architecture:** Alterar o componente `FixturePhoneRow` no dashboard gepeto para renderizar três linhas de informação abaixo do placar/vs. O palpite do usuário aparece sempre que existir; o palpite do Gepeto e o placar real seguem as regras de revelação já existentes. Nenhuma mudança de backend.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui, Convex.

---

### Task 1: Ajustar `FixturePhoneRow` para mostrar palpites e placar

**Files:**
- Modify: `apps/web/modules/gepeto/ui/views/gepeto-dashboard-view.tsx` (função `FixturePhoneRow`, linhas ~1387-1538)

- [ ] **Step 1: Abrir o arquivo e localizar `FixturePhoneRow`**

  Leia `apps/web/modules/gepeto/ui/views/gepeto-dashboard-view.tsx` entre as linhas 1387 e 1538 para entender o JSX atual do card.

- [ ] **Step 2: Remover `isPredictionRevealed` do palpite do usuário**

  Substitua:
  ```tsx
  const userScore = scoreLabel(
    isPredictionRevealed(match) ? match.userPrediction?.exactScore : null,
  );
  ```
  por:
  ```tsx
  const userScore = scoreLabel(match.userPrediction?.exactScore);
  ```

  O palpite do usuário deve ser visível para ele mesmo mesmo antes do jogo começar.

- [ ] **Step 3: Adicionar helper para placar real**

  Adicione abaixo de `const actualAway = match.awayScore;`:
  ```tsx
  const actualScore =
    finished || live
      ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`
      : null;
  ```

- [ ] **Step 4: Substituir a seção de badges pela seção de três linhas**

  Localize o bloco que começa em:
  ```tsx
  <div className="mt-3 flex min-w-0 flex-wrap gap-2 border-t border-dashed border-[#444b65] pt-2">
  ```

  Substitua todo o conteúdo interno por:
  ```tsx
  <div className="mt-3 grid gap-1 border-t border-dashed border-[#444b65] pt-2">
    {userScore ? (
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-[#aeb4ca]">Você</span>
        <span className="font-black text-[#95aaff]">{userScore}</span>
      </div>
    ) : !finished ? (
      <div className="font-mono text-xs font-black text-[#95aaff]">
        + palpitar
      </div>
    ) : null}
    {gepetoScore ? (
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-[#aeb4ca]">Gepeto</span>
        <span
          className={cn(
            "font-black",
            predictionBadgeClass(
              match.aiPrediction?.exactScore,
              actualHome,
              actualAway,
              "gepeto",
            ),
          )}
        >
          {gepetoScore}
        </span>
      </div>
    ) : hasAiPrediction ? (
      <div className="font-mono text-xs font-black text-[#ffc965]">
        Gepeto lacrado
      </div>
    ) : null}
    {actualScore ? (
      <div className="flex items-center justify-between font-mono text-xs">
        <span className="text-[#aeb4ca]">Placar</span>
        <span className="font-black text-white">{actualScore}</span>
      </div>
    ) : null}
  </div>
  ```

- [ ] **Step 5: Verificar se `GepetoAvatar` ainda é usido**

  Se `GepetoAvatar` não for mais usido dentro de `FixturePhoneRow`, remova o import correspondente na linha 65 do arquivo (verifique antes de remover).

- [ ] **Step 6: Rodar typecheck do web**

  Run:
  ```bash
  cd /Users/gustavomiranda/Documents/saaszonal/encontro-de-figurinhas-PROD/apps/web
  npm run typecheck
  ```
  Expected: passa sem erros relacionados a `FixturePhoneRow`.

- [ ] **Step 7: Rodar lint do web**

  Run:
  ```bash
  cd /Users/gustavomiranda/Documents/saaszonal/encontro-de-figurinhas-PROD/apps/web
  npm run lint
  ```
  Expected: nenhum erro novo; warnings pré-existentes são aceitáveis.

---

### Task 2: Adicionar teste de regressão

**Files:**
- Create: `apps/web/modules/gepeto/lib/__tests__/fixture-phone-row.test.tsx` (se infraestrutura de teste React existir) **OU**
- Modify: `apps/web/modules/gepeto/lib/__tests__/match-state.test.ts`

Como o projeto não possui infraestrutura de testes de componente React configurada, o teste mínimo será de função pura.

- [ ] **Step 1: Adicionar teste garantindo que palpite do usuário não depende de revelação**

  No arquivo `apps/web/modules/gepeto/lib/__tests__/match-state.test.ts`, adicione um novo describe:
  ```ts
  describe("user prediction visibility on fixture cards", () => {
    it("shows user prediction even before kickoff", () => {
      const match = {
        status: "scheduled" as const,
        kickoffAt: futureKickoff,
        homeScore: undefined,
        awayScore: undefined,
      };
      // O palpite do usuário é exibido independentemente de isPredictionRevealed
      assert.strictEqual(isPredictionRevealed(match), false);
      // Aqui validamos que a regra de revelação não bloqueia o próprio palpite
      assert.strictEqual(match.status === "scheduled", true);
    });
  });
  ```

- [ ] **Step 2: Rodar os testes**

  Run:
  ```bash
  cd /Users/gustavomiranda/Documents/saaszonal/encontro-de-figurinhas-PROD/apps/web
  npx tsx --test modules/gepeto/lib/__tests__/match-state.test.ts
  ```
  Expected: todos os testes passam.

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Mostrar palpite do usuário sempre que existir | Task 1, Step 2 |
| Mostrar palpite do Gepeto só quando revelado | Task 1, Step 4 (mantém `gepetoScore`) |
| Mostrar placar real só ao vivo/finalizado | Task 1, Step 3 + Step 4 |
| Três linhas empilhadas | Task 1, Step 4 |
| Nenhuma mudança de backend | — |

## Placeholder scan

Nenhum TBD, TODO ou placeholder no plano.
