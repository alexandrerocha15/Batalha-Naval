# Proposal

## Why

A etapa de preparação não oferece saída para a apresentação, o que prende o jogador no fluxo depois de iniciar a partida. Na batalha, a ordem atual dos tabuleiros e o histórico cumulativo dificultam a leitura da situação, e não há um resumo visual da frota própria nem destaque claro de qual embarcação foi destruída.

## What Changes

- Adicionar um botão secundário "Voltar" na etapa de preparação que retorna à apresentação sem iniciar a batalha, descartando a preparação em andamento.
- Inverter a ordem de exibição dos tabuleiros na batalha e no encerramento: o tabuleiro do jogador à esquerda e o do adversário à direita, mantendo a ordem de leitura e empilhamento em telas estreitas.
- Reduzir o histórico exibido na tela de batalha para a última jogada de cada lado (último ataque do jogador e último ataque do computador), mantendo quem atacou, a coordenada e o resultado.
- Exibir no histórico a embarcação destruída quando houver destruição, no formato "Seu ataque em B4: destruição — Cruzador destruído.".
- Adicionar, abaixo do tabuleiro do jogador na batalha, um indicador da frota própria com um símbolo visual distinto por tipo, nome e quantidade restante; a quantidade diminui conforme embarcações são destruídas.
- Manter o histórico completo na tela de encerramento, onde a consulta da partida encerrada continua exigindo todos os ataques.
- Não alterar regras de combate, frota, turnos, geração da frota do computador ou critérios de vitória.

## Capabilities

### New Capabilities

Nenhuma capability nova. As mudanças são de comportamento de telas já cobertas pelas especificações existentes.

### Modified Capabilities

- `regras-da-partida`: adiciona o retorno à apresentação a partir da preparação, define a ordem dos tabuleiros, o histórico reduzido da batalha, a identificação da embarcação destruída no histórico e o indicador da frota própria com quantidades restantes.
- `encerramento-da-partida`: ajusta a ordem dos tabuleiros na consulta da partida encerrada, mantendo o histórico completo.

## Impact

- `src/app/telas/preparacao/tela-preparacao.html` e `src/app/telas/preparacao/tela-preparacao.ts`: botão "Voltar" e ação correspondente.
- `src/app/estado/partida-store.ts`: ação para retornar à apresentação descartando a preparação.
- `src/app/telas/batalha/tela-batalha.html` e `src/app/telas/encerramento/tela-encerramento.html`: ordem dos tabuleiros (jogador à esquerda).
- `src/app/componentes/historico-ataques.ts` e `historico-ataques.html`: modo de exibição reduzida para a batalha, preservando o modo completo usado no encerramento.
- Novo componente de indicador de frota (ou seção equivalente na tela de batalha): símbolos Lucide, nomes e quantidades restantes.
- `src/app/dominio/combate.ts` ou utilitário de domínio para calcular embarcações destruídas por lado, reutilizando as regras existentes.
- Testes de unidade das telas de preparação, batalha e encerramento, do store e do domínio de combate.
- Sem novas dependências: a biblioteca de ícones Lucide já está instalada.
