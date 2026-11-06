# Design

## Context

Ver `proposal.md — Why` e `specs/regras-da-partida/spec.md`. `PartidaStore` já guarda a `Partida` criada na preparação, mas não executa ataques. `combate.ts` já implementa `atacar`, `escolherCoordenada` e consulta do histórico; a tela de batalha é um placeholder. A fase `encerrada` aponta para outra tela placeholder. As operações atuais de preparação ainda não verificam a fase.

## Goals / Non-Goals

**Goals:**
- Manter uma única fonte de verdade para histórico, turno e situação na `Partida` armazenada por Signal; não duplicar regras de combate na interface.
- Garantir que uma ação válida do jogador produza no máximo uma resposta automática do computador e que estados terminais não recebam novos ataques.
- Exibir o fim do jogo sem encaminhar o jogador para uma tela final ainda não implementada.

**Non-Goals:**
- Tela dedicada de encerramento, reinício, persistência, dificuldade de IA ou animações obrigatórias.
- Alterar a regra de um ataque por turno, mesmo em caso de acerto, ou expor posições ocultas da frota adversária.

## Decisions

### Orquestrar ataques no store e manter o domínio puro

Adicionar ao `PartidaStore` uma operação de ataque do jogador que verifica a fase e a partida em andamento, chama `atacar`, grava o novo estado apenas quando aceito e, se a situação continuar em andamento, escolhe uma coordenada livre com `escolherCoordenada` e resolve o ataque do computador. O computador ataca imediatamente após a jogada válida: seu resultado fica disponível antes da próxima ação do jogador, sem timer ou estado de espera. Testes usam fonte de aleatoriedade controlada para verificar turnos, recusas, último ataque e fim da partida.

**Alternativa:** um timer para criar pausa visual. Rejeitada nesta etapa por acrescentar concorrência, cancelamento e testes de tempo; uma pausa visual pode ser discutida numa mudança posterior sem alterar as regras de combate.

### Finalizar na própria tela de batalha

Se `Partida.situacao` mudar para `vitoria` ou `derrota`, preservar `fase === 'batalha'` por enquanto e apresentar o resultado e histórico nessa tela. A operação de ataque recusa novas ações em situação terminal. Não transicionar para `encerrada` até que exista uma tela final funcional.

**Alternativa:** avançar para `encerrada` imediatamente. Rejeitada porque hoje ela contém apenas um placeholder, ocultando os tabuleiros e o resultado detalhado.

### Tabuleiros com vistas distintas do mesmo histórico

Renderizar a própria frota e ataques cujo alvo é `jogador` num tabuleiro informativo; no tabuleiro adversário, apresentar somente ataques cujo alvo é `computador`. Usar a chave/rotulagem de coordenadas do domínio, estados distintos para água, acerto e destruição e nomes acessíveis que comuniquem coordenada, resultado e indisponibilidade. Botões do adversário ficam desabilitados quando atacados, quando não é o turno humano ou quando há resultado final. Layout empilhado em largura reduzida, lado a lado apenas quando houver espaço.

**Alternativa:** manter marcações em estado local do componente. Rejeitada porque o histórico já está na `Partida` e deve permanecer consistente com o domínio.

### Proteger a preparação no limite de estado

Impedir seleção, alternância, posicionamento, remoção e novo início de batalha quando a fase não for `preparacao`, sem apagar a frota usada na partida em andamento. Isso cumpre a restrição já existente na spec, mesmo que a tela de preparação deixe de estar visível.

**Alternativa:** confiar somente na remoção visual dos controles. Rejeitada porque chamadas diretas ao store ainda permitiriam mutações após o início.

## Risks / Trade-offs

- Ataques consecutivos ou repetidos podem disparar mais de uma resposta → a operação controla a transição completa e verifica fase/turno antes de avançar.
- A resposta imediata pode dificultar perceber a alternância → comunicar resultado de ambos os ataques e turno atual em texto acessível e histórico visível.
- Cem células em cada tabuleiro podem ficar apertadas em 360 px → grades fluidas sem largura mínima fixa, rótulos acessíveis completos e testes de viewport.
- Sem tela final dedicada, o resultado continua na fase de batalha → explicitar isso na interface e deixar navegação/reinício para a próxima change.

## Migration Plan

Sem migração de dados ou dependências. A tela de batalha passa a consumir a partida já produzida pela preparação. Em caso de rollback, restaurar o placeholder e a orquestração anterior do store; as regras puras de domínio permanecem inalteradas.
