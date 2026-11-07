# Spec Delta

## ADDED Requirements

### Requirement: Retorno à apresentação durante a preparação

A tela de preparação SHALL oferecer uma ação secundária chamada "Voltar" que retorna à apresentação sem iniciar a batalha e SHALL descartar a preparação em andamento.

#### Scenario: Acionar voltar

- **WHEN** o jogador aciona "Voltar" durante a etapa de preparação
- **THEN** a aplicação volta a apresentar a tela inicial e a batalha não é iniciada

#### Scenario: Preparação descartada

- **WHEN** o jogador retorna à apresentação e inicia uma partida novamente
- **THEN** a etapa de preparação é apresentada com a frota vazia e as cinco embarcações faltantes

#### Scenario: Acesso pelo teclado

- **WHEN** o jogador navega pela preparação apenas com a tecla Tab
- **THEN** alcança a ação "Voltar" com nome acessível e foco visível, e a aciona com Enter ou Espaço

### Requirement: Histórico reduzido na batalha

A tela de batalha SHALL exibir no histórico no máximo a última jogada de cada lado, mantendo a identificação de quem atacou, a coordenada e o resultado. Quando o resultado for destruição, o histórico SHALL informar o tipo da embarcação destruída.

#### Scenario: Última jogada de cada lado

- **WHEN** o jogador conclui um ataque e o computador responde com outro ataque válido
- **THEN** o histórico exibe apenas o ataque mais recente do jogador e o ataque mais recente do computador, sem as jogadas anteriores

#### Scenario: Resultado sem destruição

- **WHEN** o ataque mais recente de um lado atinge água ou acerta uma embarcação sem destruí-la
- **THEN** o histórico informa quem atacou, a coordenada e o resultado, sem nome de embarcação destruída

#### Scenario: Destruição identificada

- **WHEN** um ataque destrói completamente uma embarcação
- **THEN** o histórico informa a coordenada, o resultado de destruição e o tipo da embarcação destruída, como em "Seu ataque em B4: destruição — Cruzador destruído."

#### Scenario: Jogada recusada não altera o histórico

- **WHEN** uma coordenada já atacada, fora do tabuleiro ou fora do turno é acionada
- **THEN** nenhuma jogada é registrada e o histórico permanece como estava

### Requirement: Indicador da frota do jogador

A tela de batalha SHALL exibir, abaixo do tabuleiro do jogador, a situação da frota própria. Cada tipo de embarcação SHALL ter um símbolo visual distinto, o nome e a quantidade restante, usando exclusivamente os tipos e as quantidades definidos pela frota padrão do jogo.

#### Scenario: Situação inicial da frota

- **WHEN** a batalha começa
- **THEN** o indicador lista porta-aviões, encouraçado, cruzador, submarino e destroyer com seus símbolos, nomes e a quantidade inicial de cada tipo

#### Scenario: Quantidade reduzida após destruição

- **WHEN** uma embarcação do jogador é completamente destruída
- **THEN** a quantidade do tipo correspondente no indicador diminui, mantendo os demais tipos inalterados

#### Scenario: Destruição adversária não altera a frota própria

- **WHEN** o jogador destrói uma embarcação do computador
- **THEN** o indicador da frota do jogador permanece inalterado

#### Scenario: Reinício restaura as quantidades

- **WHEN** uma nova partida chega à batalha
- **THEN** o indicador volta a apresentar a quantidade inicial de cada tipo de embarcação

#### Scenario: Símbolos não dependem de cor

- **WHEN** um leitor de tela ou o jogador observa o indicador
- **THEN** cada item possui nome acessível com o tipo e a quantidade em texto, e o símbolo visual é decorativo

#### Scenario: Layout estreito

- **WHEN** a tela de batalha é usada em uma viewport de 360 px de largura
- **THEN** o indicador da frota permanece visível e utilizável abaixo do tabuleiro do jogador, sem rolagem horizontal

## MODIFIED Requirements

### Requirement: Tabuleiros de batalha visíveis

A tela de batalha SHALL mostrar o tabuleiro do jogador com sua frota e os ataques recebidos, e o tabuleiro adversário com apenas os resultados dos ataques já realizados, sem revelar embarcações ainda não descobertas. Em telas largas, o tabuleiro do jogador SHALL ficar à esquerda e o tabuleiro adversário à direita; em telas estreitas, o tabuleiro do jogador SHALL aparecer primeiro na ordem de leitura.

#### Scenario: Início da batalha

- **WHEN** a preparação termina e a batalha começa
- **THEN** o jogador vê a própria frota, o tabuleiro adversário ainda sem embarcações reveladas e a indicação de que é seu turno

#### Scenario: Ataques marcados nos tabuleiros

- **WHEN** qualquer participante conclui um ataque válido
- **THEN** a coordenada atacada, o resultado e o lado atingido ficam identificáveis no tabuleiro correspondente

#### Scenario: Ordem dos tabuleiros

- **WHEN** a tela de batalha é exibida em largura de desktop
- **THEN** o tabuleiro do jogador aparece à esquerda e o tabuleiro adversário à direita, mantendo as funcionalidades de ataque e consulta
