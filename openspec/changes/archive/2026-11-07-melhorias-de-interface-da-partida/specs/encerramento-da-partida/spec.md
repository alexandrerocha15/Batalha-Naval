# Spec Delta

## MODIFIED Requirements

### Requirement: Consulta da partida encerrada

A tela de encerramento SHALL manter disponíveis, para consulta, os dois tabuleiros com as marcações da partida e o histórico completo de ataques, sem permitir novas jogadas. Em telas largas, o tabuleiro do jogador SHALL ficar à esquerda e o tabuleiro adversário à direita; em telas estreitas, o tabuleiro do jogador SHALL aparecer primeiro na ordem de leitura.

#### Scenario: Tabuleiros preservados

- **WHEN** o jogador observa a tela de encerramento
- **THEN** encontra o próprio tabuleiro com sua frota e os ataques recebidos, e o tabuleiro adversário com os resultados dos ataques realizados

#### Scenario: Histórico preservado

- **WHEN** a tela de encerramento é exibida
- **THEN** o histórico contém todos os ataques da partida encerrada, incluindo água, acerto e embarcações destruídas

#### Scenario: Nenhuma jogada possível

- **WHEN** o jogador interage com as coordenadas na tela de encerramento
- **THEN** nenhum ataque é realizado e o resultado permanece inalterado

#### Scenario: Ordem dos tabuleiros

- **WHEN** a tela de encerramento é exibida em largura de desktop
- **THEN** o tabuleiro do jogador aparece à esquerda e o tabuleiro adversário à direita, sem alterar as marcações da partida
