pesquise em @packages/backend/ se eu nao escrevi nenhum ataque de custo ao convex. algo que eleve a conta exponencialmente. search for patterns like:

- Loops that could run indefinitely or many times
- Recursive calls
- Multiple database operations in loops
- Unbounded queries
- Missing pagination
- N+1 query patterns
- etc.(usar serena mcp)

@packages/backend/ @apps/web/ Thoroughly investigate the current feature for complexity problems. any code with complexity 0(n+1) or O(n)2 will be refactored.(usar serena mcp)

@packages/backend/ @apps/web/ remover codigo desnecessario usando /reducing-entropy (usar serena mcp)

remover useeffects desnecessarios em @apps/web/ usando /react-useeffect (usar serena mcp)

@packages/backend/ @apps/web/ Readability: Is the logic clear? Anything that should be extracted or simplified? use /modern-javascript-patterns and /typescript-advanced-types (usar serena mcp)

@packages/backend/ @apps/web/ Thoroughly investigate the current feature for security problems, permission gaps. Act like a red-team pen-tester. Suggest fixes. use /security-review (usar serena mcp)

review my code in @apps/web/ @packages/backend/. Dead code: Any dead or unused code that should be removed after the new changes? (usar serena mcp)

review usage of typescript in @packages/backend/ @apps/web/ using /typescript-advanced-types to validate. (usar serena mcp)

@apps/web/ Performance: Suspense usage, lazy loading, bundle size, unnecessary computations/deps? (usar serena mcp)

review my code in @apps/web/ using /vercel-composition-patterns (usar serena mcp)

review my code in @apps/web/ using /tailwind-patterns (usar serena mcp)

review my code in @apps/web/ using /next-best-practices (usar serena mcp)

review my code in @packages/backend/ using /convex-actions-general /convex-queries /convex-mutations (usar serena mcp) no Convex, joins não existem nativamente, então desnormalizar referências em tabelas filhas permite buscar todos os dados permite buscar todos os dados mensais de uma tabela com uma única query indexada em vez de fazer N queries por tabela relacionada. O limite de 8.192 elementos por array no Convex torna inviável armazenar os registros como array dentro da tabela relacionada para dados com muitos arrays

review my code in @packages/backend/ using /convex-actions-general /convex-queries /convex-mutations (usar serena mcp)

review my code in @packages/backend/ @apps/web/ using /convex-actions-general /convex-queries /convex-mutations (usar serena mcp)

review my code in @apps/web/ . Styling: Consistent with the design system? Any duplicated or unused styles? (usar serena mcp)

review my code in @apps/web/ @packages/backend/ . Code repetition: Any duplicated logic that should be refactored? (usar serena mcp)

review my code in @apps/web/ . Function extraction: Any blocks that should be moved to helpers/hooks? (usar serena mcp)

review my code in @apps/web/ . Prop drilling: Are props being passed too deeply? Could context, hooks, or restructuring help? (usar serena mcp)

review my code in @apps/web/ @packages/backend/. Maintainability: Is this creating something hard to maintain or extend? (usar serena mcp)

review my code in @apps/web/ . Re-renders: Does this implementation cause unnecessary re-renders? Should memoization or stabilizing references be considered? (usar serena mcp)

review my code in @apps/web/ . Abstractions: Are the abstractions and functions created truly necessary, or adding complexity without benefit? (usar serena mcp)

review my code in @apps/web/ using /vercel-react-best-practices (usar serena mcp)

review my UI using /web-design-guidelines in @apps/web/ . audit design for mobile devices. review ux. check accessibility (usar serena mcp)

review my UI using /ui-ux-pro-max in @apps/web/ . audit design for mobile devices. review ux. check accessibility (usar serena mcp)

skills:
/reducing-entropy
/react-useeffect
/convex-actions-general
/convex-queries
/convex-mutations
/vercel-react-best-practices
/web-design-guidelines
/vercel-composition-patterns
/ui-ux-pro-max
/typescript-advanced-types
/modern-javascript-patterns
/security-review
/tailwind-patterns
/next-best-practices
