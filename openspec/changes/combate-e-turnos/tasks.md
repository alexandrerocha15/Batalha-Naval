# Tasks

## 1. Estado e orquestração dos turnos

- [x] 1.1 Restringir no `PartidaStore` seleção, orientação, avaliação/posicionamento, remoção e início de batalha à fase `preparacao`; testar que chamadas após o início não alteram frota, partida ou fase e que a preparação ainda funciona normalmente.
- [x] 1.2 Adicionar ao store operação de ataque do jogador que usa `atacar` e aceita apenas jogadas válidas na fase `batalha`; testar recusa antes da batalha, fora do turno e de coordenada inválida/repetida sem mudar histórico nem disparar resposta.
- [x] 1.3 Após ataque humano aceito sem vitória, usar `escolherCoordenada` e `atacar` para responder imediatamente com o computador; testar com aleatoriedade controlada a escolha não repetida, um ataque por lado, retorno do turno, acerto sem ataque extra e ausência de resposta após vitória.
- [x] 1.4 Preservar `Partida.situacao` e histórico no store quando houver vitória ou derrota, bloquear novos ataques sem migrar para o placeholder de encerramento; testar ambos os resultados finais, ausência de resposta após vitória e imutabilidade terminal.

## 2. Interface da batalha

- [x] 2.1 Substituir o placeholder de `src/app/telas/batalha/` por dois tabuleiros de 10x10 alimentados pela partida; testar que a frota do jogador aparece, que a frota adversária permanece oculta e que cada ataque é marcado somente no tabuleiro do alvo.
- [x] 2.2 Tornar coordenadas livres do adversário acionáveis com mouse, toque e teclado e indisponibilizar coordenadas já atacadas, turno do computador e partida terminada; testar disparo do ataque e recusa sem jogadas extras.
- [x] 2.3 Mostrar estado do turno, resultados dos ataques de ambos os lados, destruição com nome da embarcação e vitória/derrota em texto acessível; testar rótulos de coordenadas, mensagens e histórico visível após encerramento.
- [ ] 2.4 Adaptar os tabuleiros para 360 px e desktop com foco visível e sem rolagem horizontal; verificar manualmente mouse, toque em viewport móvel, Tab/Enter/Espaço e leitor de tela ou inspeção dos nomes acessíveis.

## 3. Verificação integrada

- [x] 3.1 Executar `npm test`, `npm run build` e `openspec validate "combate-e-turnos" --type change`; confirmar cobertura dos cenários da delta e ausência de erros.

## Workflow follow-up

- Após revisão, sincronizar a delta `regras-da-partida` e arquivar a mudança; a tela final e a opção de jogar novamente ficam para uma mudança separada.
