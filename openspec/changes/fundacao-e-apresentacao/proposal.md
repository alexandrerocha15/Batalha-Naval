# Proposal

## Why

O projeto ainda não possui aplicação: existem apenas o enunciado e as convenções. É preciso estabelecer a base técnica (Angular 22 zoneless, Tailwind CSS, Lucide) e a porta de entrada do jogo para que as fases seguintes possam ser construídas sobre uma fundação verificável, sem retrabalho de stack ou de layout.

## What Changes

- Criar o workspace Angular 22.2 com componentes standalone, zoneless e Vitest.
- Configurar Tailwind CSS v4 e o tema visual naval (cores, tipografia, superfícies).
- Integrar `@lucide/angular` para ícones standalone e compatíveis com zoneless.
- Criar a casca da aplicação com um shell único controlado por uma máquina de estados de fase (sem rotas).
- Construir a tela de apresentação: identidade do jogo, resumo das regras e ação "Iniciar partida".
- Avançar da apresentação para a etapa de preparação (tela de preparação ainda como esqueleto nesta fase).
- Garantir layout utilizável em desktop e em telas de 360 px.

## Plano de fases

Este change é a Fase 1 de cinco. As fases seguintes serão propostas individualmente, na ordem abaixo.

| Fase | Change prevista | Entrega |
| --- | --- | --- |
| 1 | `fundacao-e-apresentacao` | Stack, tema, shell e tela inicial |
| 2 | `nucleo-do-jogo` | Domínio puro: tabuleiro, frota, posicionamento, combate e sorteios |
| 3 | `preparacao-da-frota` | Posicionamento interativo por clique + orientação, com prévia e validação |
| 4 | `batalha-e-turnos` | Dois tabuleiros, ataques, turnos, resposta aleatória e destruição |
| 5 | `fim-de-jogo-e-experiencia` | Vitória/derrota, nova partida, acessibilidade e polimento responsivo |

Decisões transversais já acordadas:

- Navegação por estado de fase (sem rotas), pois a partida não é persistida.
- Posicionamento por clique na origem + seletor de orientação, preservando teclado e leitor de tela.
- Testes com Vitest (padrão do Angular 22).
- Ícones via `@lucide/angular`, já que `lucide-angular` está descontinuado.

## Capabilities

### New Capabilities

- `apresentacao-inicial`: tela de entrada do jogo, conteúdo das regras resumidas e ação que inicia o fluxo da partida.

### Modified Capabilities

Nenhuma. O projeto ainda não possui specs.

## Impact

- **Novo:** workspace Angular na raiz do repositório, com `package.json`, configuração de build e testes.
- **Novo:** `src/app/` com shell, tela de apresentação e estrutura de pastas para domínio, estado e componentes das próximas fases.
- **Novo:** `src/styles.css` com Tailwind v4 e tokens de tema.
- **Dependências:** `@angular/*` 22.2, `tailwindcss` 4, `@lucide/angular`.
- **Sem impacto:** regras de jogo, persistência, backend e rotas. Nenhum comportamento de combate é implementado nesta fase.
