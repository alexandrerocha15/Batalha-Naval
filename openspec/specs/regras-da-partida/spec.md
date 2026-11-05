# regras-da-partida Specification

## Purpose

Define as regras que governam uma partida de Batalha Naval contra o computador: o tabuleiro, a frota, o posicionamento, os turnos, a resolução dos ataques, a destruição das embarcações e o encerramento da partida.

## Requirements

### Requirement: Tabuleiro e coordenadas

O jogo SHALL usar um tabuleiro de 10 linhas, identificadas de A a J, e 10 colunas, identificadas de 1 a 10. Cada posição SHALL ser referenciada por uma coordenada como `A1`, `C7` ou `J10`. Uma coordenada fora desses limites SHALL ser inválida.

#### Scenario: Coordenada dentro do tabuleiro

- **WHEN** uma coordenada como `A1`, `C7` ou `J10` é informada
- **THEN** ela é aceita e identifica uma única posição do tabuleiro

#### Scenario: Coordenada fora do tabuleiro

- **WHEN** uma coordenada como `K1`, `A0` ou `A11` é informada
- **THEN** ela é recusada como inválida e nenhum estado do jogo é alterado

### Requirement: Frota padronizada

Cada participante SHALL ter uma frota composta por um porta-aviões de 5 posições, um encouraçado de 4, um cruzador de 3, um submarino de 3 e um destroyer de 2. Cada embarcação SHALL ocupar posições consecutivas, em linha reta, na orientação horizontal ou vertical.

#### Scenario: Composição da frota

- **WHEN** uma frota é preparada para qualquer participante
- **THEN** ela contém exatamente as cinco embarcações com os tamanhos definidos

#### Scenario: Embarcação em linha reta

- **WHEN** uma embarcação é posicionada na horizontal ou na vertical
- **THEN** todas as suas posições são consecutivas na orientação escolhida

#### Scenario: Orientação diferente de reta

- **WHEN** um posicionamento em diagonal ou em formato irregular é solicitado
- **THEN** ele é recusado, pois apenas horizontal e vertical são orientações válidas

### Requirement: Posicionamento válido

Um posicionamento SHALL ser aceito somente se todas as posições da embarcação estiverem dentro do tabuleiro e nenhuma delas estiver ocupada por outra embarcação. Embarcações PODE ficar encostadas, inclusive nas diagonais. Um posicionamento recusado SHALL preservar o posicionamento válido anterior.

#### Scenario: Posicionamento ultrapassa a borda

- **WHEN** um porta-aviões horizontal é posicionado a partir de `A8`
- **THEN** o posicionamento é recusado e a frota permanece como estava

#### Scenario: Posicionamento sobre posição ocupada

- **WHEN** uma embarcação é posicionada sobre uma posição já ocupada por outra
- **THEN** o posicionamento é recusado e o posicionamento válido existente não é alterado

#### Scenario: Embarcações encostadas

- **WHEN** duas embarcações são posicionadas lado a lado ou encostadas na diagonal, sem sobreposição
- **THEN** ambos os posicionamentos são aceitos

#### Scenario: Reposicionar a mesma embarcação

- **WHEN** uma embarcação já posicionada recebe uma nova origem ou orientação válida
- **THEN** a posição anterior é substituída e a embarcação não conflita consigo mesma

### Requirement: Frota pronta para a batalha

A batalha SHALL NOT começar enquanto a frota do jogador não tiver as cinco embarcações posicionadas. O jogador SHALL poder alterar o posicionamento das próprias embarcações enquanto a batalha não tiver começado.

#### Scenario: Início com frota incompleta

- **WHEN** o início da batalha é solicitado com uma ou mais embarcações ainda não posicionadas
- **THEN** o início é recusado e as embarcações faltantes são identificadas

#### Scenario: Início com frota completa

- **WHEN** as cinco embarcações do jogador estão posicionadas e válidas
- **THEN** a batalha pode começar

#### Scenario: Alteração antes do início

- **WHEN** o jogador remove ou reposiciona uma embarcação antes do início da batalha
- **THEN** a alteração é aceita, desde que o posicionamento resultante seja válido

### Requirement: Frota automática do computador

O computador SHALL receber automaticamente uma frota completa. Essa frota MUST respeitar as mesmas regras de tamanho, orientação, limites e não sobreposição exigidas do jogador.

#### Scenario: Geração automática válida

- **WHEN** a frota do computador é gerada
- **THEN** ela contém as cinco embarcações, com os tamanhos corretos, dentro do tabuleiro e sem sobreposição

#### Scenario: Frota do computador independente da do jogador

- **WHEN** a frota do jogador é posicionada de qualquer forma válida
- **THEN** a frota do computador é gerada respeitando apenas as regras do jogo

### Requirement: Início e alternância de turnos

O jogador humano SHALL realizar o primeiro ataque. Cada participante SHALL realizar no máximo um ataque por turno, mesmo quando acertar uma embarcação. Após um ataque válido, o turno SHALL passar ao oponente, salvo quando a partida terminar.

#### Scenario: Primeiro ataque do jogador

- **WHEN** a batalha começa
- **THEN** o turno pertence ao jogador

#### Scenario: Acerto não concede ataque extra

- **WHEN** o jogador acerta uma embarcação sem destruí-la
- **THEN** o turno passa ao computador

#### Scenario: Retorno do turno

- **WHEN** o computador conclui um ataque válido
- **THEN** o turno volta ao jogador

### Requirement: Ataque válido

Um ataque SHALL consistir em selecionar uma coordenada ainda não atacada no tabuleiro adversário. Uma coordenada já atacada SHALL ser recusada sem consumir o turno. Um ataque fora do turno ou com coordenada inválida SHALL ser recusado sem alterar o estado da partida.

#### Scenario: Coordenada já atacada

- **WHEN** o jogador tenta atacar uma coordenada que ele já atacou
- **THEN** o ataque é recusado, o turno é mantido e o histórico não muda

#### Scenario: Ataque fora do turno

- **WHEN** um ataque é tentado por um participante que não é o dono do turno
- **THEN** o ataque é recusado e o estado da partida não muda

#### Scenario: Coordenada inválida durante a batalha

- **WHEN** um ataque é tentado em uma coordenada fora do tabuleiro
- **THEN** o ataque é recusado sem consumir o turno

### Requirement: Resultado do ataque

Todo ataque válido SHALL produzir exatamente um resultado: água, quando a posição não pertence a nenhuma embarcação; acerto, quando atinge uma embarcação que ainda possui posições intactas; ou embarcação destruída, quando atinge a última posição intacta de uma embarcação.

#### Scenario: Água

- **WHEN** o ataque atinge uma posição sem embarcação
- **THEN** o resultado é água e a posição fica marcada no histórico

#### Scenario: Acerto sem destruição

- **WHEN** o ataque atinge uma embarcação que ainda possui outras posições intactas
- **THEN** o resultado é acerto, apenas a posição atacada fica marcada e as demais posições da embarcação não são reveladas

#### Scenario: Acerto na última posição intacta

- **WHEN** o ataque atinge a última posição intacta de uma embarcação
- **THEN** o resultado é embarcação destruída

### Requirement: Ataque do computador

O computador SHALL escolher aleatoriamente uma posição entre as que ainda não atacou no tabuleiro do jogador. O computador SHALL NOT atacar uma posição já atacada.

#### Scenario: Escolha entre posições não atacadas

- **WHEN** o computador realiza um ataque
- **THEN** a posição escolhida não pertence ao histórico de ataques do computador

#### Scenario: Última posição livre

- **WHEN** resta apenas uma posição não atacada no tabuleiro do jogador
- **THEN** o computador ataca essa posição

### Requirement: Destruição de embarcação

Uma embarcação SHALL ser considerada destruída somente quando todas as suas posições tiverem sido atingidas. O jogo SHALL informar qual embarcação foi destruída. Cada posição ocupada por uma embarcação SHALL ser atingida no máximo uma vez.

#### Scenario: Embarcação ainda não destruída

- **WHEN** apenas parte das posições de uma embarcação foi atingida
- **THEN** ela não é informada como destruída

#### Scenario: Embarcação destruída

- **WHEN** a última posição intacta de uma embarcação é atingida
- **THEN** o jogo informa qual embarcação foi destruída

### Requirement: Encerramento da partida

A partida SHALL terminar imediatamente quando todas as embarcações de um participante forem destruídas. O jogador vence se a frota do computador for destruída primeiro e perde se a própria frota for destruída primeiro. Após o encerramento, nenhum ataque SHALL ser aceito.

#### Scenario: Vitória do jogador

- **WHEN** o ataque do jogador destrói a última embarcação do computador
- **THEN** a partida termina imediatamente com vitória do jogador e o computador não realiza outro ataque

#### Scenario: Derrota do jogador

- **WHEN** o ataque do computador destrói a última embarcação do jogador
- **THEN** a partida termina imediatamente com derrota do jogador

#### Scenario: Ataque após o encerramento

- **WHEN** qualquer ataque é tentado depois que a partida terminou
- **THEN** o ataque é recusado e o resultado final permanece inalterado
