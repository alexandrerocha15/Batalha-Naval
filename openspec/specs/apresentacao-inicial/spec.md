# apresentacao-inicial Specification

## Purpose

Define a porta de entrada do jogo: a tela que apresenta a Batalha Naval, resume suas regras essenciais e permite iniciar o fluxo de uma partida.

## Requirements

### Requirement: Apresentação do jogo

A tela inicial SHALL identificar o jogo como "Batalha Naval" e apresentar, em português, o objetivo da partida e a composição da frota de cada participante.

#### Scenario: Conteúdo inicial visível

- **WHEN** a aplicação é aberta
- **THEN** a tela inicial exibe o nome do jogo, o objetivo de destruir a frota adversária e a lista das cinco embarcações com seus tamanhos

#### Scenario: Regra de turnos resumida

- **WHEN** o jogador lê a tela inicial
- **THEN** encontra a informação de que ele ataca primeiro e de que cada ataque é feito em uma coordenada do tabuleiro adversário

### Requirement: Início da partida

A tela inicial SHALL oferecer uma ação primária que inicia o fluxo da partida e leva à etapa de preparação da frota.

#### Scenario: Acionar início

- **WHEN** o jogador aciona "Iniciar partida"
- **THEN** a aplicação passa a apresentar a etapa de preparação da frota

#### Scenario: Início não depende de configuração prévia

- **WHEN** a aplicação é aberta pela primeira vez, sem partida em andamento
- **THEN** a ação "Iniciar partida" está disponível imediatamente

### Requirement: Layout responsivo da tela inicial

A tela inicial SHALL ser utilizável em telas de 360 px de largura e em desktop, sem rolagem horizontal e sem conteúdo cortado.

#### Scenario: Tela estreita

- **WHEN** a tela inicial é exibida em uma viewport de 360 px de largura
- **THEN** todo o conteúdo e a ação de início permanecem visíveis e acionáveis sem rolagem horizontal

#### Scenario: Tela ampla

- **WHEN** a tela inicial é exibida em uma viewport de desktop
- **THEN** o conteúdo é apresentado em uma largura de leitura confortável, sem se esticar por toda a tela

### Requirement: Acessibilidade da tela inicial

A tela inicial SHALL ter estrutura semântica navegável por teclado e compreensível por leitor de tela.

#### Scenario: Navegação por teclado

- **WHEN** o jogador navega apenas com a tecla Tab
- **THEN** consegue alcançar a ação de início e acioná-la com Enter ou Espaço, com foco visível

#### Scenario: Estrutura compreensível

- **WHEN** um leitor de tela percorre a tela inicial
- **THEN** encontra um título principal único, o resumo das regras em ordem de leitura e um botão com nome acessível que indica o início da partida
