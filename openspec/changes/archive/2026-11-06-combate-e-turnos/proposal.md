# Proposal

## Why

Após preparar a frota, a aplicação entra numa tela de batalha ainda provisória: a partida é criada, mas não há como atacar nem acompanhar o turno do computador. Esta mudança torna o combate jogável até a vitória ou derrota, sem antecipar a tela final de uma mudança posterior.

## What Changes

- Substituir o placeholder da batalha por dois tabuleiros responsivos, com ataques acionáveis no tabuleiro adversário, histórico visível, estado do turno e feedback acessível de água, acerto e destruição.
- Integrar ataques do jogador e do computador ao estado da partida, com resposta automática do computador após cada ataque válido do jogador que não encerre o jogo; ataques recusados não consomem turno nem desencadeiam resposta.
- Informar vitória ou derrota na própria tela de batalha quando ocorrer, interromper ataques e preservar o histórico; a tela dedicada de encerramento e o reinício ficam para outra mudança.
- Proteger o estado de preparação contra mutações após o início da batalha.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `regras-da-partida`: acrescentar comportamento observável de tabuleiros, indicação de turno, ataques acessíveis e feedback de combate, detalhando a conclusão da batalha nesta fase sem alterar as regras de ataque já definidas.

## Impact

- `src/app/estado/partida-store.ts` e testes: orquestração dos turnos e proteção da preparação.
- `src/app/telas/batalha/` e testes: interação e apresentação dos dois tabuleiros.
- Reutilização de `src/app/dominio/combate.ts`, `src/app/dominio/partida.ts` e helpers existentes; sem novas dependências e sem implementar a tela `encerramento` neste escopo.
