# Proposal

## Why

A Fase 1 entregou apenas a apresentação e uma casca de navegação: as telas de preparação, batalha e encerramento são esqueletos e não existe nenhuma regra do jogo implementada. Antes de construir as telas interativas, é preciso um núcleo de domínio puro, testável e independente de Angular, para que preparação, combate e encerramento sejam apenas camadas de apresentação sobre regras já verificadas.

## What Changes

- Criar `src/app/dominio/` com a modelagem do jogo: coordenadas, frota padronizada, posicionamento, geração aleatória, partida, ataques e encerramento.
- Representar a preparação como uma frota em montagem e a batalha como uma `Partida` que só existe com as duas frotas completas, eliminando estados inválidos por construção.
- Injetar a fonte de aleatoriedade (`Aleatorio`) em geração de frota e escolha de ataque do computador, permitindo testes determinísticos.
- Registrar o histórico de ataques como fonte da verdade, com resultado já resolvido (`água`, `acerto`, `destruição`), para alimentar os tabuleiros e o anúncio de embarcação destruída nas fases seguintes.
- Expor avalição de posicionamento com motivo (`fora-do-tabuleiro`, `sobreposicao`) e células conflitantes, prévia necessária para a interação da Fase 3.
- Passar a usar `FROTA_PADRAO` do domínio na tela de apresentação, removendo a tabela de frota duplicada em `tela-apresentacao.ts`.
- Cobrir as regras com testes unitários em Vitest, sem adicionar dependências.

## Capabilities

### New Capabilities

- `regras-da-partida`: modelo do tabuleiro 10 × 10, frota padronizada, validação de posicionamento, geração automática da frota do computador, turnos, resolução de ataques, destruição de embarcações e encerramento da partida.

### Modified Capabilities

Nenhuma. `apresentacao-inicial` continua com os mesmos requisitos; a troca da tabela de frota pela fonte do domínio é refatoração sem mudança de comportamento.

## Impact

- **Novo:** `src/app/dominio/` com `coordenada.ts`, `frota.ts`, `preparacao.ts`, `gerador.ts`, `partida.ts` e `combate.ts`, acompanhados de testes.
- **Alterado:** `src/app/telas/apresentacao/tela-apresentacao.ts` passa a consumir `FROTA_PADRAO`.
- **Inalterado:** `PartidaStore` continua expondo apenas `fase()` e `iniciarPartida()`; a ligação com o domínio acontece na Fase 3.
- **Sem impacto:** nenhuma tela nova, nenhuma persistência, nenhum backend, nenhuma dependência adicional e nenhuma rota.
- **Risco:** a fase não produz mudança visível no jogo; a evidência é a suíte de testes.
