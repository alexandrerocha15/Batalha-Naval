# Proposal

## Why

Ao destruir a última embarcação, a partida termina sem oferecer saída: o jogador fica preso na tela de batalha, com os controles desabilitados, e precisa recarregar a aplicação para jogar de novo. O enunciado exige explicitamente que ele possa iniciar uma nova partida com tabuleiros reiniciados e novas frotas, e a fase `encerrada` já existe no estado apenas como placeholder inalcançável.

## What Changes

- Levar a partida concluída (vitória ou derrota) a uma etapa de encerramento própria, em vez de manter o jogador na tela de batalha.
- Substituir o placeholder de `src/app/telas/encerramento/` por uma tela final que anuncia o resultado, mantém os dois tabuleiros e o histórico disponíveis para consulta e concentra a próxima ação.
- Oferecer a ação "Jogar novamente", que reinicia a partida com a frota do jogador vazia, uma nova frota para o computador e o turno de volta ao jogador, levando à preparação.
- Garantir que o encerramento não aceite ataques nem altere o resultado, e que o reinício descarte integralmente o estado anterior (frotas, histórico, turno e seleção de preparação).
- Manter a tela final utilizável em 360 px e por teclado, com o resultado e o motivo do fim anunciados em texto acessível.

## Capabilities

### New Capabilities

- `encerramento-da-partida`: etapa final do jogo — anúncio de vitória ou derrota, consulta dos tabuleiros e do histórico, acessibilidade, responsividade e ação de jogar novamente.

### Modified Capabilities

- `regras-da-partida`: a conclusão da partida passa a levar a uma etapa de encerramento distinta, e o reinício passa a gerar uma nova preparação com frotas novas, sem herdar estado da partida anterior.

## Impact

- `src/app/estado/partida-store.ts` e testes: transição para `encerrada` ao concluir e operação de reinício que recria a preparação do zero.
- `src/app/telas/encerramento/` e testes: substituição do placeholder pela tela final com resultado, resumo dos tabuleiros, histórico e "Jogar novamente".
- `src/app/telas/batalha/` e testes: o resultado final deixa de ser renderizado nessa tela e passa a encaminhar para o encerramento.
- `src/app/app.html`: a fase `encerrada` deixa de ser um destino morto.
- Reutilização de `src/app/dominio/combate.ts`, `partida.ts` e helpers existentes; sem novas dependências, sem rotas e sem persistência.
- Pré-requisito de processo: a delta de `combate-e-turnos` (tabuleiros, ataque interativo, resposta automática e feedback na batalha) precisa estar sincronizada na spec principal antes desta implementação, porque a tela de encerramento reutiliza os tabuleiros e o histórico descritos lá.
