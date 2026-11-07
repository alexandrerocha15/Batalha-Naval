# Proposal

## Why

A tela de preparação existente é um placeholder, embora o domínio já ofereça regras para posicionar e validar a frota. Esta mudança permitirá que o jogador organize suas embarcações antes da batalha e avance somente quando a frota estiver completa.

## What Changes

- Substituir o placeholder da preparação por uma interface responsiva de posicionamento da frota.
- Permitir selecionar embarcações, alternar orientação, visualizar prévias e posicionar ou remover embarcações.
- Exibir erros de posicionamento e embarcações ainda faltantes sem duplicar as regras do domínio.
- Habilitar o início da batalha quando a frota estiver completa e válida.
- Conectar o estado de preparação e a transição para batalha ao estado existente da aplicação.

## Capabilities

### New Capabilities

### Modified Capabilities
- `regras-da-partida`: especificar os comportamentos observáveis da interação de preparação e da transição para batalha, complementando as regras de domínio existentes.

## Impact

- **Alterados:** `src/app/telas/preparacao/`, `src/app/estado/partida-store.ts` e testes associados.
- **Integração:** consumo das funções de domínio existentes em `src/app/dominio/`.
- **Sem novas dependências:** mantém Angular standalone, Signals e a suíte Vitest existente.
