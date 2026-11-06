# Design

## Context

Ver `proposal.md — Why` e as deltas em `specs/`. O estado já tem a fase `encerrada`, nunca alcançada: `PartidaStore.atacarJogador` grava `situacao` terminal mas mantém `fase === 'batalha'`, e `TelaEncerramento` é um componente vazio. A decisão de manter o resultado na batalha foi deliberada na change `combate-e-turnos` porque não havia tela final; esta change substitui aquela decisão.

`TelaBatalha` concentra hoje a renderização dos dois tabuleiros, o histórico e os rótulos acessíveis. A tela final precisa das mesmas duas visões em modo somente leitura.

## Goals / Non-Goals

**Goals:**
- Uma única transição de estado para a conclusão, disparada no store, sem a interface decidir quando o jogo acabou.
- Reaproveitar a apresentação dos tabuleiros e do histórico entre batalha e encerramento, sem duplicar rótulos, classes e regras de acessibilidade.
- Reinício como operação de estado que devolve a aplicação ao início da preparação, sem resíduos da partida anterior.

**Non-Goals:**
- Persistir partidas, manter placar entre sessões ou animar a transição para o encerramento.
- Alterar regras de ataque, geração de frota ou o domínio puro.
- Virtualizar ou paginar o histórico; apenas evitar que ele empurre a página inteira.

## Decisions

### Transição terminal no store

`atacarJogador` passa a gravar a partida e, quando `situacao !== 'em-andamento'`, definir `_fase` como `'encerrada'` na mesma atualização. `app.html` já troca de componente por fase, então o encaminhamento deixa de ser responsabilidade da interface.

**Alternativa:** manter `batalha` e renderizar a tela final por condição dentro dela. Rejeitada porque a fase `encerrada` continuaria morta, a batalha acumularia dois modos e o teste de "nenhum ataque após o fim" dependeria de flag de interface.

Consequência: os testes de `combate-e-turnos` que fixam `fase === 'batalha'` após vitória/derrota passam a esperar `'encerrada'`; a regra de recusa de ataques continua garantida por `atacar` no domínio.

### Reinício reutilizando `iniciarPartida`

Adicionar `novaPartida()` ao store como alias explícito de `iniciarPartida()`, que já zera `frotaPreparacao`, `embarcacaoAtiva`, `orientacao`, `partida` e volta a `fase = 'preparacao'`. O nome comunica a intenção na tela final; a implementação permanece uma só, evitando listas de reset divergentes.

**Alternativa:** um `reiniciar()` próprio que limpa apenas a partida e mantém a frota preparada. Rejeitada: a spec exige frota do jogador vazia e o enunciado fala em nova preparação de frotas.

### Tabuleiros compartilhados como componentes de apresentação

Extrair de `TelaBatalha` um componente standalone `TabuleiroPartida` que recebe a `Partida`, o `Lado` exibido e um modo somente leitura, e emite a coordenada acionada; a lógica de classe, rótulo acessível e texto de resultado migra para ele. Extrair também `HistoricoAtaques`, que recebe a lista de ataques. `TelaBatalha` usa os dois com interação; `TelaEncerramento` usa os mesmos com `somenteLeitura`.

**Alternativa:** duplicar o markup na tela final. Rejeitada porque as duas cópias teriam de evoluir juntas em responsividade, nomes acessíveis e marcação de destruição — justamente os pontos frágeis identificados na revisão anterior.

**Alternativa:** reutilizar `TelaBatalha` com um input de modo. Rejeitada por acoplar duas etapas do fluxo e misturar responsabilidades de estado.

### Histórico em região rolável

O histórico completo continua disponível, mas dentro de uma região com altura máxima e rolagem própria, rotulada e alcançável por teclado. Isso evita que uma partida longa (175 ataques observados) empurre o resultado e a ação "Jogar novamente" para muito longe.

### Resultado anunciado sem depender de live region

O resultado é texto no título e no corpo da tela final, exibido já na montagem. Não se usa `aria-live` como único canal, porque conteúdo presente no carregamento não é anunciado de forma confiável.

## Risks / Trade-offs

- A extração dos tabuleiros pode regredir a batalha → extrair primeiro, mantendo `tela-batalha.spec.ts` verde antes de criar a tela final.
- A mudança de fase quebra testes existentes que esperam `batalha` no fim → atualizar explicitamente esses testes junto da mudança de comportamento, sem afrouxar as asserções de recusa de ataque.
- Dois componentes de tabuleiro reutilizados podem acumular condicionais demais → manter no componente apenas apresentação e um evento; toda decisão de turno/fase permanece no store.
- A tela final depende da prévia `combate-e-turnos` estar sincronizada → registrar como pré-requisito de implementação, não como tarefa de código desta change.

## Migration Plan

Sem migração de dados ou dependências. A tela final passa a consumir a partida já encerrada e o reinício reutiliza o caminho de início existente. Rollback: restaurar `fase = 'batalha'` na conclusão, devolver o placeholder ao encerramento e manter os componentes extraídos apenas na batalha.

## Open Questions

Nenhuma pendente.
