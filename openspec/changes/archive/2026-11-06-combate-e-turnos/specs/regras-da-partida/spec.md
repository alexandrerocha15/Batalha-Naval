# Spec Delta

## ADDED Requirements

### Requirement: Tabuleiros de batalha visíveis

A tela de batalha SHALL mostrar o tabuleiro do jogador com sua frota e os ataques recebidos, e o tabuleiro adversário com apenas os resultados dos ataques já realizados, sem revelar embarcações ainda não descobertas.

#### Scenario: Início da batalha

- **WHEN** a preparação termina e a batalha começa
- **THEN** o jogador vê a própria frota, o tabuleiro adversário ainda sem embarcações reveladas e a indicação de que é seu turno

#### Scenario: Ataques marcados nos tabuleiros

- **WHEN** qualquer participante conclui um ataque válido
- **THEN** a coordenada atacada, o resultado e o lado atingido ficam identificáveis no tabuleiro correspondente

### Requirement: Ataque interativo do jogador

Durante seu turno, o jogador SHALL poder escolher por mouse, toque ou teclado uma coordenada ainda não atacada no tabuleiro adversário; coordenadas indisponíveis SHALL ser identificadas e não SHALL consumir o turno.

#### Scenario: Ataque válido por coordenada

- **WHEN** o jogador aciona uma coordenada livre durante seu turno
- **THEN** o resultado do ataque é exibido na coordenada e informado em texto acessível

#### Scenario: Coordenada já atacada

- **WHEN** o jogador tenta novamente uma coordenada já atacada
- **THEN** nenhuma nova jogada ocorre e o histórico e o turno permanecem inalterados

#### Scenario: Entrada fora do turno

- **WHEN** o jogador tenta atacar enquanto é o turno do computador
- **THEN** o ataque não é aceito e nenhum turno adicional é criado

### Requirement: Resposta automática do computador na batalha

Após um ataque válido do jogador que não encerre a partida, o computador SHALL atacar automaticamente uma coordenada livre do tabuleiro do jogador; o jogador SHALL conhecer o resultado antes de realizar um novo ataque.

#### Scenario: Resposta após jogada válida

- **WHEN** o jogador conclui um ataque válido sem vencer a partida
- **THEN** o computador ataca uma coordenada ainda não atacada e o turno retorna ao jogador se a partida continuar

#### Scenario: Jogada recusada não dispara resposta

- **WHEN** o ataque do jogador é recusado
- **THEN** o computador não realiza ataque e o histórico permanece inalterado

#### Scenario: Vitória do jogador interrompe resposta

- **WHEN** o ataque válido do jogador encerra a partida com vitória
- **THEN** o computador não realiza novo ataque

### Requirement: Feedback e conclusão na tela de batalha

A tela de batalha SHALL indicar de quem é o turno e informar água, acerto ou destruição, incluindo o nome da embarcação destruída; ao terminar, SHALL informar vitória ou derrota e impedir novos ataques, preservando os tabuleiros para consulta.

#### Scenario: Resultado e turno compreensíveis

- **WHEN** um ataque válido é concluído sem encerrar a partida
- **THEN** seu resultado e o turno atual são comunicados em texto acessível, além das marcações visuais

#### Scenario: Vitória ou derrota

- **WHEN** a última embarcação de qualquer participante é destruída
- **THEN** a tela informa vitória ou derrota, mantém o histórico visível e nenhum ataque adicional é aceito

#### Scenario: Layout estreito e teclado

- **WHEN** a tela de batalha é usada em largura de 360 px ou somente com teclado
- **THEN** ambos os tabuleiros permanecem utilizáveis sem rolagem horizontal e cada coordenada acionável possui foco visível e nome acessível
