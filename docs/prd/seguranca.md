## 2. Segurança — "Troca no Ponto, Nunca no Privado"

### 2.1 Princípios

Nenhum usuário vê email, telefone, localização exata ou dado de contato de outro. O match mostra apenas: apelido, % do álbum, figurinhas em comum, reputação e o ponto de troca. Não existe chat, mensagem direta ou canal 1-a-1. Toda comunicação é no grupo de WhatsApp do ponto (público, moderado).

### 2.2 Ponto de Troca

Local físico público: banca de jornal, papelaria, praça movimentada, shopping, biblioteca. Cada ponto tem um grupo de WhatsApp cujo link é cadastrado manualmente pelo admin no painel.

### 2.3 Verificação comunitária (modelo Waze)

Cada ponto de troca tem dois scores:

**Confidence Score (0-10):** mede atividade recente do ponto. Sobe com check-ins ("Estou aqui agora"), confirmações de troca realizadas no ponto, thumbs-up de outros usuários. Decai automaticamente: -1 ponto a cada 24h sem atividade. Pontos com score 0 por 7 dias consecutivos são marcados como "Possivelmente inativo".

**Reliability Score do usuário (0-10):** mede reputação do reportador. Sobe com: trocas confirmadas (+1), check-ins verificados por GPS (+0.5), denúncias confirmadas pelo admin (+1). Desce com: denúncias recebidas confirmadas (-3), reports falsos (-2). Novos usuários começam com score 3 e têm restrições: não podem criar pontos de troca até score 5, não podem denunciar até score 2.

**Check-in geográfico:** usuário deve estar a até 500 metros do ponto (haversine do GPS do browser) para registrar check-in. Check-in ativo expira em 2 horas. Exibir no card do ponto: "3 pessoas aqui agora", "Última visita há 2h", "Horário mais movimentado: 14h-17h" (agregado de check-ins históricos).

**Shadow ban:** usuários com 3+ denúncias confirmadas continuam usando o app normalmente, mas seus check-ins e reports não aparecem para a comunidade. Não são notificados do shadow ban.

### 2.4 Proteção de menores (LGPD Art. 14 + ECA Digital)

Cadastro exige data de nascimento. Menores de 12 anos: fluxo de consentimento parental obrigatório (email do responsável + confirmação por link), funcionalidades de encontro presencial e acesso a grupos WhatsApp desabilitados até consentimento recebido. Menores de 12-15 anos: campo obrigatório "nome do responsável", badge "menor acompanhado" nos matches e na lista de participantes do ponto, termos acessíveis e avisos de segurança reforçados. 16-17 anos: badge opcional "menor", sem restrições adicionais. Regra fixada em todo grupo proíbe mensagem privada entre membros.

### 2.5 Denúncia e moderação

Botão de denúncia na página do ponto e no card de match. Categorias: comportamento suspeito, tentativa de contato privado, adulto se aproximando de menor inadequadamente, conteúdo inapropriado. Denúncia vai pro painel admin com prioridade. 3+ denúncias em 7 dias → ponto suspenso automaticamente. Usuário com 2+ denúncias confirmadas → ban permanente.

### 2.6 Segurança em encontros presenciais

Tela obrigatória de dicas de segurança antes do primeiro encontro (exibida uma vez, com checkbox "Li e entendi"). Botão "Compartilhar minha ida" na página do ponto (abre WhatsApp com mensagem pré-montada: "Vou trocar figurinhas em [Ponto] às [hora]. Link: [deeplink do ponto]"). Sistema de avaliação pós-encontro (1-5 estrelas para o ponto, opcional). Pontos de troca devem ser em locais públicos — validação na moderação.
