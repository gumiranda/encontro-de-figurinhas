# Browser Harness - Ideias Ousadas

## Capabilities

- **Controle direto do Chrome** via CDP (Chrome DevTools Protocol)
- Screenshots, clicks, scroll, typing, navegação
- Extração de dados DOM, execução de JavaScript
- Suporte a iframes, shadow DOM, cross-origin
- Múltiplas tabs, downloads, uploads
- Browsers remotos paralelos (cloud)

---

## Ideias para Encontro de Figurinhas

### 1. Scraper de Preços de Figurinhas
Monitorar preços em marketplaces (Mercado Livre, OLX, Shopee) para figurinhas raras.
```bash
browser-harness <<'PY'
new_tab("https://lista.mercadolivre.com.br/figurinhas-copa")
wait_for_load()
# extrair preços, criar alertas de oportunidade
PY
```

### 2. Bot de Captura de Novas Coleções
Detectar automaticamente quando Panini lança nova coleção. Scrape do site oficial, notificar usuários.

### 3. Gerador de Screenshots de Álbuns
Capturar screenshots das páginas do álbum do usuário para compartilhar no Instagram/WhatsApp.

### 4. Automação de Testes E2E
Testar fluxos completos da aplicação:
- Registro de figurinhas
- Troca entre usuários
- Chat da comunidade
- Filtros e buscas

### 5. Preenchimento Automático de Álbum Virtual
Usuário aponta câmera para álbum físico, OCR detecta números, browser-harness preenche automaticamente no app.

---

## Ideias Genéricas Ousadas

### 6. Agente de Compras
Claude navega sites, compara preços, adiciona ao carrinho. Usuário só confirma checkout.

### 7. Preenchedor de Formulários Burocráticos
Gov.br, Receita Federal, INSS. Claude preenche com dados do usuário, evita erros.

### 8. Monitor de Vagas de Emprego
Scrape LinkedIn, Gupy, Indeed. Notifica quando vaga match aparece. Auto-candidatura opcional.

### 9. Arquivador de Conversas
Backup automático de WhatsApp Web, Telegram Web, Discord. Exporta para markdown/JSON.

### 10. Trader de Criptomoedas Semi-Automático
Monitora exchanges, executa ordens baseado em regras. Usuário define estratégia, Claude executa.

### 11. Agente de Suporte ao Cliente
Claude responde tickets no Zendesk/Intercom lendo contexto da conversa, buscando docs, redigindo respostas.

### 12. Scraper de Documentos Jurídicos
TJSP, TJRJ, STF. Baixa andamentos processuais, organiza em pasta do cliente.

### 13. Automação de Posts em Redes Sociais
Agenda e posta conteúdo em múltiplas plataformas simultaneamente.

### 14. QA Visual Automatizado
Screenshot antes/depois de deploys. Diff visual para detectar regressões CSS.

### 15. Pesquisa Acadêmica Automatizada
Navega Google Scholar, Sci-Hub, baixa PDFs, extrai citações, monta bibliografia.

---

## Comandos Úteis

```bash
# Ver status
browser-harness --doctor

# Info da página atual
browser-harness <<'PY'
print(page_info())
PY

# Screenshot
browser-harness <<'PY'
capture_screenshot()
PY

# Navegar
browser-harness <<'PY'
new_tab("https://example.com")
wait_for_load()
PY

# Clicar em coordenadas
browser-harness <<'PY'
click_at_xy(500, 300)
PY

# Executar JavaScript
browser-harness <<'PY'
result = js("document.title")
print(result)
PY

# Extrair dados
browser-harness <<'PY'
data = js("Array.from(document.querySelectorAll('.price')).map(e => e.textContent)")
print(data)
PY
```

---

## Próximos Passos

1. Escolher uma ideia
2. Criar domain-skill em `~/Developer/browser-harness/agent-workspace/domain-skills/`
3. Testar iterativamente
4. Integrar com o projeto
