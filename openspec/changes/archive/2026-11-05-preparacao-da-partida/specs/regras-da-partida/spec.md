# Spec Delta

## ADDED Requirements

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
