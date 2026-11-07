# Design

## Context

Ver `proposal.md` para a motivação. A aplicação é Angular zoneless com componentes standalone, signals e Tailwind. O estado da partida fica em `PartidaStore`, as telas são trocadas por `fase` em `app.html`, e os componentes de tabuleiro e histórico são compartilhados entre batalha e encerramento.

Restrições relevantes:

- A frota padrão em `src/app/dominio/frota.ts` tem cinco tipos, um de cada: porta-aviões (5), encouraçado (4), cruzador (3), submarino (3) e destroyer (2). O exemplo com dois submarinos no pedido é ilustrativo; as quantidades reais seguem a frota existente.
- `Ataque` já registra `alvo`, `coordenada`, `resultado` e, em destruições, `embarcacao`.
- `embarcacoesDestruidas` já deriva destruições dos ataques sem alterar as regras de combate.
- O histórico completo é requisito da tela de encerramento; apenas a batalha passa a exibir a versão reduzida.
- Lucide já é dependência (`@lucide/angular`); não há novos pacotes.

## Goals / Non-Goals

**Goals:**

- Oferecer saída da preparação para a apresentação sem iniciar a batalha.
- Deixar o tabuleiro do jogador à esquerda e o adversário à direita, preservando a ordem de leitura no mobile.
- Reduzir o histórico da batalha à última jogada de cada lado, com identificação da embarcação destruída.
- Mostrar a situação da frota própria abaixo do tabuleiro do jogador, com símbolo, nome e quantidade restante.
- Manter o histórico completo no encerramento e as regras de combate intactas.

**Non-Goals:**

- Alterar composição da frota, tamanhos, turnos, geração automática, resolução de ataques ou critérios de vitória.
- Criar persistência entre recarregamentos ou navegação por rotas.
- Adicionar indicador da frota adversária.
- Alterar o comportamento da tela de encerramento além da ordem dos tabuleiros.

## Decisions

### 1. Ação de voltar no store

Adicionar `voltarApresentacao()` ao `PartidaStore`. A ação só age na fase `preparacao`, limpa frota, embarcação ativa e orientação, descarta `partida` e muda a fase para `apresentacao`. Extrair a limpeza para um método privado compartilhado com `iniciarPartida()` para evitar divergência entre os dois fluxos.

O botão "Voltar" fica no cabeçalho da preparação como ação secundária (borda/ghost, ícone Lucide `ArrowLeft`), separado visualmente de "Iniciar batalha", que continua primário. Usar `<button type="button">` com nome acessível e foco visível.

Alternativas consideradas:

- Reutilizar `novaPartida()`: leva à preparação, não à apresentação.
- Limpar o estado só na tela: duplicaria regra e deixaria o store inconsistente.

### 2. Ordem dos tabuleiros no template

Trocar a ordem dos componentes nos templates de batalha e encerramento para `lado="jogador"` primeiro e `lado="computador"` depois. O grid `lg:grid-cols-2` coloca o primeiro à esquerda no desktop e empilha na ordem do DOM no mobile, o que mantém o tabuleiro do jogador primeiro na leitura e no teclado.

Na batalha, agrupar o tabuleiro do jogador e o novo indicador de frota em uma coluna (`div` com `space-y-4`), mantendo o tabuleiro adversário como a outra coluna. O tabuleiro adversário continua sendo o único acionável.

Alternativas consideradas:

- Usar `order-*` do Tailwind: funcionaria visualmente, mas deixaria a ordem do DOM diferente da leitura, prejudicando teclado e leitor de tela.
- Reordenar via CSS grid: mesma desvantagem.

### 3. Histórico com dois modos

Adicionar ao `HistoricoAtaques` um input opcional `reduzido = input(false)`. Um `computed` devolve:

- modo completo: todos os ataques, como hoje;
- modo reduzido: percorre os ataques e mantém o último de cada `alvo`, preservando a ordem cronológica entre eles.

O template itera a lista computada. A tela de batalha passa `[reduzido]="true"`; a de encerramento não passa nada e continua com o histórico completo. O título "Histórico de ataques" é mantido nos dois modos.

O texto de cada linha passa a ser "Seu ataque em B4: destruição — Cruzador destruído." ou "Ataque do computador em B4: ...". A identificação do atacante já está no início da frase, então o antigo trecho "em adversário/jogador" é removido para ficar conciso e alinhado ao exemplo do pedido.

Alternativas consideradas:

- Cortar a lista no store: quebraria o histórico completo do encerramento e as marcações dos tabuleiros.
- Um componente separado só para a batalha: duplicaria a formatação de texto e a acessibilidade.

### 4. Situação da frota derivada dos ataques

Criar uma função pura em `src/app/dominio/combate.ts`, por exemplo `situacaoFrota(partida, alvo)`, que retorna por tipo da `FROTA_PADRAO`: nome, rótulo, total na frota e quantidade restante. Uma embarcação é considerada restante enquanto nem todas as suas células aparecerem nos ataques daquele alvo. Isso reutiliza a mesma noção de destruição já usada no combate e funciona mesmo se a frota padrão tiver mais de uma unidade do mesmo tipo no futuro.

O componente `IndicadorFrota` (novo, standalone, em `src/app/componentes/indicador-frota.ts` e `.html`) recebe a `Partida` e usa a função para renderizar a lista abaixo do tabuleiro do jogador.

Símbolos Lucide distintos:

| Tipo | Ícone |
| --- | --- |
| Porta-aviões | `LucidePlane` |
| Encouraçado | `LucideShield` |
| Cruzador | `LucideShip` |
| Submarino | `LucideFish` |
| Destroyer | `LucideZap` |

Cada símbolo é decorativo (`aria-hidden="true"`) e cada item expõe o texto "Tipo: quantidade" com nome acessível completo, sem depender de cor. Layout em grade de duas colunas no mobile e três em telas maiores, sem rolagem horizontal e sem quebra de palavras no meio dos nomes.

Alternativas consideradas:

- Guardar contadores no store: criaria estado derivado duplicado e risco de divergência.
- Emojis: o usuário optou por ícones Lucide para manter a identidade visual.

### 5. Testes

Cobrir as mudanças em testes existentes e novos:

- store: `voltarApresentacao` limpa a preparação e só funciona na preparação;
- preparação: botão "Voltar" acessível e retorno à apresentação com frota vazia;
- batalha: ordem dos tabuleiros, histórico com no máximo duas linhas, texto de destruição e indicador de frota;
- encerramento: tabuleiro do jogador à esquerda e histórico completo preservado;
- domínio: `situacaoFrota` antes e depois de destruições.

Atualizar asserções antigas que esperam "Seu ataque em adversário" e a contagem total de itens do histórico na batalha.

## Risks / Trade-offs

- [A última jogada de cada lado pode omitir o ataque do jogador se apenas a jogada mais recente fosse exibida] → Manter o último ataque de cada `alvo`, não apenas o último da lista.
- [Compartilhar o histórico entre batalha e encerramento pode reduzir o encerramento por engano] → Modo completo como padrão e teste do encerramento verificando todos os ataques.
- [Reordenar apenas com CSS quebraria a ordem de teclado e leitor de tela] → Reordenar no DOM e testar a ordem dos grupos.
- [Contadores derivados podem divergir se a regra de destruição mudar] → Reutilizar a mesma verificação de células atacadas usada pelo combate em uma função de domínio testada.
- [Ícones Lucide não representam literalmente todos os tipos de embarcação] → Símbolos distintos acompanhados sempre de nome e quantidade em texto; ajustar o mapa se um ícone mais adequado estiver disponível.
- [O botão "Voltar" pode ser acionado por engano descartando a frota] → Ação secundária com estilo discreto e comportamento restrito à preparação; a confirmação não é necessária porque a batalha ainda não começou.

## Migration Plan

Não há migração de dados. A mudança é apenas de interface e de estado em memória. Rollback por reversão do commit; nenhuma estrutura persistida é alterada.

## Open Questions

Nenhuma pendente.
