# Spec Delta

## ADDED Requirements

### Requirement: Etapa de encerramento após a conclusão

Quando a última embarcação de qualquer participante for destruída, a partida SHALL ser apresentada em uma etapa de encerramento distinta da batalha, preservando o resultado e o histórico e recusando qualquer novo ataque.

#### Scenario: Transição imediata ao concluir

- **WHEN** um ataque destrói a última embarcação de uma das frotas
- **THEN** a partida passa a ser apresentada na etapa de encerramento, sem conceder outro ataque naquele turno

#### Scenario: Estado terminal preservado

- **WHEN** a etapa de encerramento está sendo apresentada
- **THEN** o resultado, as frotas e o histórico permanecem exatamente como estavam no último ataque aceito

#### Scenario: Tentativa de ataque após a conclusão

- **WHEN** um ataque é solicitado depois da conclusão, por qualquer meio de interação
- **THEN** ele é recusado e o resultado final permanece inalterado

### Requirement: Reinício com novas frotas

Iniciar uma nova partida SHALL descartar integralmente o estado anterior: a frota do jogador volta a estar vazia, o computador recebe uma nova frota válida, o histórico de ataques fica vazio e o primeiro ataque pertence ao jogador.

#### Scenario: Nova partida após o encerramento

- **WHEN** uma nova partida é iniciada a partir da etapa de encerramento
- **THEN** nenhuma embarcação do jogador está posicionada, o histórico está vazio e a etapa de preparação é apresentada

#### Scenario: Nova frota do computador

- **WHEN** a nova partida chega à batalha
- **THEN** a frota do computador contém as cinco embarcações, com os tamanhos corretos, dentro do tabuleiro e sem sobreposição

#### Scenario: Turno inicial do jogador

- **WHEN** a nova partida chega à batalha
- **THEN** o primeiro ataque pertence ao jogador, como em qualquer partida iniciada pela primeira vez

## MODIFIED Requirements

### Requirement: Feedback e conclusão na tela de batalha

A tela de batalha SHALL indicar de quem é o turno e informar água, acerto ou destruição, incluindo o nome da embarcação destruída; ao terminar, SHALL encaminhar o jogador para a etapa de encerramento, sem aceitar novos ataques.

#### Scenario: Resultado e turno compreensíveis

- **WHEN** um ataque válido é concluído sem encerrar a partida
- **THEN** seu resultado e o turno atual são comunicados em texto acessível, além das marcações visuais

#### Scenario: Vitória ou derrota

- **WHEN** a última embarcação de qualquer participante é destruída
- **THEN** a etapa de encerramento é apresentada, onde o resultado é informado, o histórico permanece visível e nenhum ataque adicional é aceito

#### Scenario: Layout estreito e teclado

- **WHEN** a tela de batalha é usada em largura de 360 px ou somente com teclado
- **THEN** ambos os tabuleiros permanecem utilizáveis sem rolagem horizontal e cada coordenada acionável possui foco visível e nome acessível
