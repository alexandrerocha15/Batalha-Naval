# Spec Delta

## Purpose

Define a etapa final da partida: apresenta o resultado, mantém os tabuleiros e o histórico disponíveis para consulta e oferece o reinício do jogo com uma nova preparação de frotas.

## ADDED Requirements

### Requirement: Resultado da partida

Ao final de uma partida, a tela de encerramento SHALL informar em português se o jogador venceu ou perdeu, identificando qual frota foi destruída, e SHALL deixar claro que nenhum ataque adicional é possível.

#### Scenario: Vitória do jogador

- **WHEN** a frota do computador é destruída
- **THEN** a tela de encerramento anuncia a vitória do jogador em texto acessível e informa que a partida terminou

#### Scenario: Derrota do jogador

- **WHEN** a frota do jogador é destruída
- **THEN** a tela de encerramento anuncia a derrota do jogador em texto acessível e informa que a partida terminou

#### Scenario: Resultado sem ambiguidade

- **WHEN** a tela de encerramento é exibida
- **THEN** o resultado é comunicado em texto, sem depender apenas de cor ou de ícone

### Requirement: Consulta da partida encerrada

A tela de encerramento SHALL manter disponíveis, para consulta, os dois tabuleiros com as marcações da partida e o histórico completo de ataques, sem permitir novas jogadas.

#### Scenario: Tabuleiros preservados

- **WHEN** o jogador observa a tela de encerramento
- **THEN** encontra o próprio tabuleiro com sua frota e os ataques recebidos, e o tabuleiro adversário com os resultados dos ataques realizados

#### Scenario: Histórico preservado

- **WHEN** a tela de encerramento é exibida
- **THEN** o histórico contém todos os ataques da partida encerrada, incluindo água, acerto e embarcações destruídas

#### Scenario: Nenhuma jogada possível

- **WHEN** o jogador interage com as coordenadas na tela de encerramento
- **THEN** nenhum ataque é realizado e o resultado permanece inalterado

### Requirement: Ação de jogar novamente

A tela de encerramento SHALL oferecer uma ação primária chamada "Jogar novamente" que inicia uma nova partida e leva o jogador à etapa de preparação da frota.

#### Scenario: Acionar jogar novamente

- **WHEN** o jogador aciona "Jogar novamente"
- **THEN** a aplicação apresenta a etapa de preparação com a frota do jogador vazia e as cinco embarcações faltantes

#### Scenario: Reinício independente do resultado

- **WHEN** o jogador aciona "Jogar novamente" após vitória ou após derrota
- **THEN** uma nova partida é iniciada nas mesmas condições em ambos os casos

### Requirement: Layout responsivo da tela de encerramento

A tela de encerramento SHALL ser utilizável em telas de 360 px de largura e em desktop, sem rolagem horizontal e sem conteúdo cortado.

#### Scenario: Tela estreita

- **WHEN** a tela de encerramento é exibida em uma viewport de 360 px de largura
- **THEN** o resultado, os tabuleiros, o histórico e a ação de jogar novamente permanecem utilizáveis sem rolagem horizontal

#### Scenario: Tela ampla

- **WHEN** a tela de encerramento é exibida em uma viewport de desktop
- **THEN** o conteúdo é apresentado em largura confortável de leitura, com os tabuleiros organizados sem se esticar pela tela inteira

### Requirement: Acessibilidade da tela de encerramento

A tela de encerramento SHALL ter estrutura semântica navegável por teclado e compreensível por leitor de tela.

#### Scenario: Navegação por teclado

- **WHEN** o jogador navega apenas com a tecla Tab
- **THEN** alcança a ação "Jogar novamente" e a aciona com Enter ou Espaço, com foco visível

#### Scenario: Estrutura compreensível

- **WHEN** um leitor de tela percorre a tela de encerramento
- **THEN** encontra um título principal único, o resultado anunciado, a indicação das seções dos tabuleiros e do histórico e um botão com nome acessível para jogar novamente
