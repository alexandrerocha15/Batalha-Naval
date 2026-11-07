# Tasks

## 1. Componentes compartilhados de apresentação

- [x] 1.1 Extrair de `TelaBatalha` um componente standalone `TabuleiroPartida` que recebe a partida, o lado exibido e o modo somente leitura, emite a coordenada acionada e concentra classe, rótulo acessível e texto de resultado; verificar que `tela-batalha.spec.ts` continua passando sem alterar asserções.
- [x] 1.2 Extrair `HistoricoAtaques` para renderizar a lista completa em uma região rolável, rotulada e alcançável por teclado, e usá-lo na batalha; verificar `npm test` verde e conferir manualmente rolagem e foco do histórico.

## 2. Estado de encerramento e reinício

- [x] 2.1 Fazer `atacarJogador` transicionar para a fase `encerrada` junto com a gravação da partida terminal, e atualizar os testes de `partida-store` e `tela-batalha` que hoje esperam `batalha` no fim; verificar com testes de vitória e de derrota que a fase é `encerrada`, que o resultado e o histórico são preservados e que novos ataques retornam `partida-encerrada`.
- [x] 2.2 Adicionar `novaPartida()` ao store reutilizando `iniciarPartida()`; testar que ela zera frota do jogador, seleção e orientação, remove a partida anterior, volta a `preparacao` e que a batalha seguinte tem frota nova do computador e primeiro ataque do jogador.

## 3. Tela de encerramento

- [x] 3.1 Substituir o placeholder de `src/app/telas/encerramento/` por uma tela com título único, resultado em texto, os dois tabuleiros em modo somente leitura, histórico completo e ação "Jogar novamente"; testar vitória, derrota, ausência de ataques acionáveis e histórico preservado.
- [x] 3.2 Garantir acessibilidade e responsividade da tela final: seções rotuladas, foco visível, hierarquia de títulos e layout sem rolagem horizontal em 360 px; verificar com teste de componente dos rótulos e conferência manual em 360 px, desktop, Tab/Enter e ação de reinício.

## 4. Verificação integrada

- [x] 4.1 Executar `npm test`, `npm run build` e `openspec validate "encerramento-e-nova-partida" --type change --strict` sem erros e percorrer manualmente o fluxo completo: apresentação, preparação, batalha até a vitória, encerramento com tabuleiros e histórico, "Jogar novamente" levando à preparação vazia e nova batalha jogável.

## Workflow follow-up

- Antes de implementar, sincronizar a delta de `combate-e-turnos` com `regras-da-partida` e arquivar aquela change: a tela final reutiliza os tabuleiros e o histórico que ela descreve.
- Após revisão, sincronizar as deltas `regras-da-partida` e `encerramento-da-partida` e arquivar esta change.
