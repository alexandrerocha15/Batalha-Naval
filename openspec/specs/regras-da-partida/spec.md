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

### Requirement: Seleção e orientação da embarcação

A tela de preparação SHALL permitir selecionar uma embarcação ainda não posicionada e escolher orientação horizontal ou vertical antes de posicioná-la.

#### Scenario: Selecionar embarcação para posicionar

- **WHEN** o jogador seleciona uma embarcação ainda não posicionada
- **THEN** ela passa a ser a embarcação ativa para posicionamento

#### Scenario: Alternar orientação

- **WHEN** o jogador alterna a orientação da embarcação ativa
- **THEN** a prévia usa a nova orientação antes da confirmação do posicionamento

### Requirement: Prévia e confirmação de posicionamento

A tela SHALL apresentar a prévia das células que a embarcação ativa ocupará e SHALL usar a avaliação do domínio para indicar se a posição é válida antes de confirmá-la.

#### Scenario: Prévia válida

- **WHEN** o jogador aponta para uma origem onde a embarcação cabe sem sobreposição
- **THEN** as células da prévia são indicadas como válidas e podem ser confirmadas

#### Scenario: Prévia inválida

- **WHEN** a embarcação ultrapassa o tabuleiro ou sobrepõe outra embarcação
- **THEN** a prévia é indicada como inválida, a razão é informada e a confirmação não altera a frota

#### Scenario: Posicionamento confirmado

- **WHEN** o jogador confirma uma prévia válida
- **THEN** a embarcação aparece no tabuleiro e deixa de constar entre as embarcações faltantes

### Requirement: Remoção e reposicionamento durante a preparação

Antes do início da batalha, o jogador SHALL poder remover uma embarcação posicionada e reposicioná-la, preservando sua seleção até que outra embarcação seja escolhida.

#### Scenario: Remover embarcação posicionada

- **WHEN** o jogador solicita a remoção de uma embarcação posicionada
- **THEN** suas células ficam livres e ela volta a constar entre as embarcações faltantes

#### Scenario: Reposicionar embarcação

- **WHEN** o jogador confirma uma nova posição válida para uma embarcação já posicionada
- **THEN** a posição anterior é substituída pela nova posição

### Requirement: Iniciar batalha com frota completa

A tela SHALL manter o início da batalha indisponível enquanto houver embarcações faltantes e SHALL iniciar a batalha somente quando a frota estiver completa e válida.

#### Scenario: Frota incompleta

- **WHEN** ainda há embarcações sem posição válida
- **THEN** o início da batalha permanece indisponível e as embarcações faltantes são identificadas

#### Scenario: Frota completa

- **WHEN** todas as embarcações estão posicionadas validamente e o jogador inicia a batalha
- **THEN** a fase muda para batalha e a preparação não pode mais ser alterada

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
