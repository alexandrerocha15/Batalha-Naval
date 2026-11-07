# Tasks

## 1. Coordenadas e frota padronizada

- [x] 1.1 Criar `src/app/dominio/coordenada.ts` com `Coordenada`, `TAMANHO_TABULEIRO`, validação de limites, `rotulo`, `deRotulo` e `chave`, e verificar com testes que `A1` ↔ `{0,0}`, `J10` ↔ `{9,9}`, que a conversão de ida e volta preserva a coordenada e que `K1`, `A0` e `A11` são recusadas
- [x] 1.2 Criar `src/app/dominio/frota.ts` com `NomeEmbarcacao`, `Orientacao`, `Embarcacao`, `FROTA_PADRAO` (5, 4, 3, 3, 2) e `celulas()`, e verificar com testes os tamanhos de cada embarcação, a sequência de células na horizontal e na vertical e a presença dos rótulos em português
- [x] 1.3 Escrever testes de `coordenada.ts` e `frota.ts` cobrindo as bordas do tabuleiro e as duas orientações, e verificar que `npm test` executa os novos casos com sucesso

## 2. Validação de posicionamento

- [x] 2.1 Implementar `avaliarPosicionamento` em `src/app/dominio/preparacao.ts`, devolvendo células, validade, motivo (`fora-do-tabuleiro` ou `sobreposicao`) e conflitos, e verificar com testes o porta-aviões horizontal em `A8`, a sobreposição e a prévia de uma posição válida sem alterar a frota
- [x] 2.2 Implementar `posicionar`, `remover`, `frotaCompleta` e `faltantes`, e verificar com testes que uma recusa preserva a frota anterior, que reposicionar a mesma embarcação não conflita consigo mesma, que embarcações encostadas lado a lado e na diagonal são aceitas e que a frota incompleta lista as embarcações faltantes
- [x] 2.3 Cobrir cada cenário de posicionamento da spec `regras-da-partida` com um teste e verificar que `npm test` passa sem `TestBed`

## 3. Geração automática da frota

- [x] 3.1 Implementar `gerarFrota(aleatorio)` em `src/app/dominio/gerador.ts` com tentativas e reinícios limitados, e verificar com 1000 sementes que toda frota gerada tem as cinco embarcações, os tamanhos corretos, fica dentro do tabuleiro e não tem sobreposição
- [x] 3.2 Adicionar o helper de gerador semeado aos testes e verificar que a mesma semente produz a mesma frota e que fontes diferentes produzem frotas diferentes em pelo menos um caso
- [x] 3.3 Verificar com teste que uma fonte degenerada esgota os reinícios e falha explicitamente, em vez de entrar em laço infinito

## 4. Partida, ataques e encerramento

- [x] 4.1 Criar `src/app/dominio/partida.ts` com `Lado`, `Situacao`, `Ataque`, `Partida` e `iniciarBatalha`, e verificar com testes que a partida começa em `em-andamento`, com turno do jogador, e que frota incompleta impede o início indicando as faltantes
- [x] 4.2 Implementar `atacar` para água, acerto e recusas, e verificar com testes a marcação no histórico, a recusa de coordenada repetida sem consumir o turno, a recusa fora do turno, a recusa de coordenada inválida e a recusa após o encerramento
- [x] 4.3 Implementar a detecção de destruição na última posição intacta e verificar com testes que só a última posição intacta gera `destruicao` com o nome da embarcação, que acertos parciais não a anunciam e que nenhuma posição vizinha é marcada
- [x] 4.4 Implementar o encerramento imediato e verificar com testes que destruir a última embarcação do computador encerra em `vitoria` sem conceder ataque ao computador e que destruir a última do jogador encerra em `derrota`
- [x] 4.5 Implementar `escolherCoordenada` e verificar com testes que a escolha nunca repete uma posição atacada, que com apenas uma posição livre ela é a escolhida e que valores fixos de `Aleatorio` (0, 0.5 e próximo de 1) selecionam primeira, meio e última posição da lista
- [x] 4.6 Implementar `marcacaoEm` e `embarcacoesDestruidas` e verificar com testes que as marcações de cada lado vêm apenas dos ataques daquele alvo e que a lista de destruídas corresponde às embarcações totalmente atingidas

## 5. Integração e verificação da fase

- [x] 5.1 Substituir `FROTA_APRESENTACAO` por `FROTA_PADRAO` em `src/app/telas/apresentacao/tela-apresentacao.ts`, e verificar que o teste existente da apresentação continua passando e que os cinco nomes e tamanhos aparecem na tela
- [x] 5.2 Executar `npm test` e `npm run build` e verificar que ambos terminam sem erros
- [x] 5.3 Percorrer os cenários da spec `regras-da-partida` e registrar a cobertura de cada um nos testes do domínio, corrigindo qualquer lacuna encontrada

## Workflow follow-up

- Arquivar a change após a revisão da fase.
- Iniciar a Fase 3 (`preparacao-da-frota`) somente depois do arquivamento desta.
