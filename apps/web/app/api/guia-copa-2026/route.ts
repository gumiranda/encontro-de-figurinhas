import { NextResponse } from "next/server";

const GUIDE_CONTENT = `
GUIA COMPLETO: ÁLBUM DE FIGURINHAS COPA DO MUNDO 2026
======================================================

Figurinha Fácil - figurinhafacil.com.br
Atualizado em: ${new Date().toLocaleDateString("pt-BR")}

SUMÁRIO
-------
1. Sobre o Álbum da Copa 2026
2. Estatísticas e Números
3. Tipos de Figurinhas
4. Como Completar Gastando Menos
5. Dicas de Troca
6. Perguntas Frequentes

------------------------------------------------------

1. SOBRE O ÁLBUM DA COPA 2026
-----------------------------

O álbum oficial da Panini para a FIFA World Cup 2026 é o maior da
história das coleções de Copa do Mundo. Com 980 figurinhas no total,
supera em mais de 300 unidades o recorde anterior (Copa 2018).

A Copa 2026 será a primeira com 48 seleções, realizada em três países:
- Estados Unidos (11 cidades)
- México (3 cidades)
- Canadá (2 cidades)

------------------------------------------------------

2. ESTATÍSTICAS E NÚMEROS
-------------------------

Total de figurinhas: 980
Figurinhas especiais: 68 (metalizadas)
Figurinhas por seleção: ~20
Seleções participantes: 48
Páginas do álbum: 112

PREÇOS (Brasil - 2026):
- Pacote (7 figurinhas): R$ 7,00
- Álbum brochura: R$ 24,90
- Álbum capa dura: R$ 49,90
- Álbum capa prata: R$ 69,90
- Álbum capa ouro: R$ 79,90

CUSTO PARA COMPLETAR:
- Sem trocas: R$ 7.000 a R$ 8.000
- Com trocas: R$ 1.500 a R$ 2.500
- Economia com trocas: até R$ 5.500

------------------------------------------------------

3. TIPOS DE FIGURINHAS
----------------------

FIGURINHAS BASE
São a maior parte do álbum. Incluem jogadores das 48 seleções,
escudos e uniformes. Mais fáceis de encontrar nos pacotinhos.

FIGURINHAS ESPECIAIS (68 no total)
Acabamento metalizado/brilhante. Incluem:
- Legends: Uma lenda por seleção (ex: Pelé para Brasil)
- Iconic Moments: Momentos históricos das Copas
- Capitães em destaque
- Craques principais

FIGURINHAS DOS ESTÁDIOS
As 16 arenas que receberão os 104 jogos do Mundial.

FIGURINHAS DO TROFÉU E MASCOTE
Elementos oficiais da FIFA World Cup 2026.

------------------------------------------------------

4. COMO COMPLETAR GASTANDO MENOS
--------------------------------

PASSO 1: Compre o álbum e pacotes iniciais
Comece com um box inicial. Evite comprar muitos pacotinhos
de uma vez - a probabilidade de repetidas aumenta.

PASSO 2: Cadastre suas figurinhas no Figurinha Fácil
Acesse figurinhafacil.com.br e informe:
- Figurinhas que você tem repetidas
- Figurinhas que faltam para completar

PASSO 3: Encontre colecionadores compatíveis
O sistema encontra automaticamente pessoas da sua cidade
que têm o que você precisa E precisam do que você tem.

PASSO 4: Combine e troque presencialmente
Marque em um ponto de troca público (shopping, praça, etc).
Trocas presenciais são mais rápidas e seguras.

PASSO 5: Deixe as especiais por último
As Legends e Iconic Moments são as mais raras.
Guarde suas repetidas especiais para trocar no final.

------------------------------------------------------

5. DICAS DE TROCA
-----------------

DO'S (Faça):
✓ Escolha locais públicos e movimentados
✓ Vá acompanhado nas primeiras trocas
✓ Confira as figurinhas antes de finalizar
✓ Organize suas repetidas por número
✓ Mantenha seu cadastro atualizado

DON'TS (Evite):
✗ Trocar em locais isolados
✗ Levar objetos de valor desnecessários
✗ Aceitar figurinhas danificadas
✗ Deixar figurinhas sem conferir

PROPORÇÕES SUGERIDAS:
- Figurinha comum por comum: 1:1
- Figurinha especial por especial: 1:1
- Figurinha especial por comuns: 3-5 comuns
- Legend por Legends: 1:1 (mesmo valor)

------------------------------------------------------

6. PERGUNTAS FREQUENTES
-----------------------

P: Quantas figurinhas tem o álbum da Copa 2026?
R: O álbum tem 980 figurinhas, sendo 68 especiais.

P: Quanto custa o pacotinho?
R: R$ 7,00 com 7 figurinhas cada.

P: Vale a pena trocar figurinhas?
R: Sim! Você pode economizar até R$ 5.000 trocando em vez
de comprar todos os pacotinhos necessários.

P: O Figurinha Fácil é gratuito?
R: Sim, 100% gratuito para colecionadores.

P: Em quais cidades funciona?
R: Mais de 100 cidades brasileiras, incluindo São Paulo,
Rio de Janeiro, Belo Horizonte, Curitiba, Porto Alegre, etc.

------------------------------------------------------

SOBRE O FIGURINHA FÁCIL
-----------------------

O Figurinha Fácil é a maior rede de troca de figurinhas do Brasil.
Conectamos colecionadores de todo o país para facilitar as trocas
e ajudar todos a completarem seus álbuns.

Site: figurinhafacil.com.br
Instagram: @figurinhafacil

------------------------------------------------------

Este guia é atualizado regularmente.
Última atualização: ${new Date().toLocaleDateString("pt-BR")}

© 2026 Figurinha Fácil - Todos os direitos reservados.
`.trim();

export async function GET() {
  return new NextResponse(GUIDE_CONTENT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'attachment; filename="guia-album-copa-2026.txt"',
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
