# Design

## Context

Ver `proposal.md — Why`. A tela `TelaPreparacao` e seu template contêm atualmente apenas o estado de placeholder. O domínio já fornece `Coordenada`, `FROTA_PADRAO`, `avaliarPosicionamento`, `posicionar`, `remover`, `faltantes` e `frotaCompleta`; `PartidaStore` atualmente mantém somente a fase. O contrato de comportamento está em `specs/regras-da-partida/spec.md` e nas regras existentes da capability principal.

Restrições observadas: Angular standalone com Signals, Tailwind CSS, textos de interface em português e sem dependências novas. O domínio é puro e não importa Angular.

## Goals / Non-Goals

**Goals:**
- Manter a frota de preparação como estado imutável e atualizar a tela por Signals.
- Usar o domínio como única fonte para validar e aplicar posições.
- Manter a frota preparada disponível ao iniciar a fase de batalha.
- Tornar seleção, orientação, prévia, remoção e início acessíveis por teclado e utilizáveis em telas menores.

**Non-Goals:**
- Alterar regras de combate ou a geração automática da frota do computador.
- Persistir a preparação ou introduzir backend.
- Implementar animações ou arrastar embarcações como requisito; o posicionamento será por seleção da embarcação e escolha de origem no tabuleiro.

## Decisions

### Estado da preparação no store

Guardar frota, embarcação ativa, orientação e resultado/motivo de prévia no estado da aplicação, expondo leituras readonly e operações que atualizam o estado de forma imutável. A tela delega avaliação e alterações às funções de domínio, sem reproduzir verificações de limite ou colisão.

**Alternativa considerada:** manter todo o estado local no componente. Rejeitada porque a frota precisa sobreviver à transição entre preparação e batalha e deverá ser compartilhada com as próximas fases.

### Interação por selecionar e escolher origem

O jogador seleciona uma embarcação numa lista, escolhe orientação por controle explícito ou atalho acessível e escolhe uma célula de origem no tabuleiro. A prévia é calculada antes de confirmar; uma posição inválida apresenta motivo e não altera a frota.

**Alternativa considerada:** arrastar e soltar como fluxo principal. Adiado para evitar exigir uma interação menos acessível e complexa; seleção e clique cobrem mouse, toque e teclado.

### Reposicionamento explícito

Uma embarcação colocada pode ser selecionada novamente e confirmada em outra origem. A avaliação do domínio deve ignorar suas células antigas ao calcular conflitos; confirmação inválida preserva a posição anterior. Remoção usa a operação do domínio e retorna a embarcação à lista de faltantes.

**Alternativa considerada:** remover automaticamente ao selecionar para reposicionar. Rejeitada porque uma tentativa inválida poderia deixar o jogador sem a posição válida anterior.

### Início como transição única

O controle de iniciar permanece desabilitado enquanto `frotaCompleta` for falso. Ao iniciar, o store gera a frota do computador, constrói a partida pelo domínio e muda a fase somente se o início for aceito.

**Alternativa considerada:** mudar a fase primeiro e criar partida depois. Rejeitada para evitar estado de batalha sem frotas válidas.

## Risks / Trade-offs

- Prévia sensível a foco/ponteiro pode ficar dessincronizada da orientação ativa → calcular a prévia sempre a partir da seleção e orientação atuais e limpá-la ao mudar a embarcação.
- Tabuleiro com 100 células pode ficar apertado em dispositivos estreitos → usar grade responsiva, rótulos legíveis e controles da frota em layout empilhável.
- Integração de preparação pode ampliar responsabilidades do store → manter transições explícitas e delegar regras ao domínio, sem colocar lógica geométrica no store.

## Migration Plan

Sem migração persistente. Inicializar uma frota vazia ao entrar em preparação, atualizar a fase apenas após uma partida válida e permitir reiniciar o estado ao começar uma nova partida. Rollback consiste em restaurar a tela placeholder e a estrutura anterior do store.
