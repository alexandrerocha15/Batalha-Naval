# Tasks

## 1. Scaffold e dependências

- [x] 1.1 Gerar o workspace em `.scaffold` com `ng new batalha-naval --directory .scaffold --skip-git --style tailwind --zoneless --test-runner vitest --routing=false --ssr=false` e verificar que `package.json`, `angular.json` e `src/` foram criados
- [x] 1.2 Mover todo o conteúdo de `.scaffold` (incluindo arquivos ocultos) para a raiz, preservando `README.md`, `AGENTS.md`, `openspec/` e `.opencode/`, e verificar que esses arquivos permanecem inalterados e `.scaffold` foi removido.
- [x] 1.3 Conciliar o `.gitignore` gerado com o existente, sem remover entradas já presentes, e verificar que `node_modules`, `dist` e `.angular/cache` continuam ignorados
- [x] 1.4 Instalar `@lucide/angular` e verificar com `npm ls @lucide/angular` que a dependência está resolvida
- [x] 1.5 Confirmar a configuração zoneless e o Vitest nos arquivos gerados (`app.config.ts` e configuração de testes) e verificar que `npm test` executa a suíte inicial

## 2. Tema e base visual

- [x] 2.1 Confirmar que o Tailwind 4 está ativo (`src/styles.css` com `@import "tailwindcss"` e plugin PostCSS configurado) e verificar aplicando uma classe utilitária visível na aplicação
- [x] 2.2 Declarar os tokens de cor do tema naval com `@theme` em `src/styles.css` e verificar que classes como `bg-oceano-950` e `text-espuma-100` produzem o estilo esperado
- [x] 2.3 Configurar `provideLucideConfig` em `app.config.ts` e importar um ícone estático em um componente, verificando que o SVG é renderizado
- [x] 2.4 Substituir o template padrão do `App` pelo layout base (fundo do tema, `min-h-dvh`, tipografia e container de largura máxima) e verificar a renderização em desktop e em 360 px

## 3. Shell e estado da partida

- [x] 3.1 Criar o tipo `FasePartida` e o `PartidaStore` com os signals `fase` e a ação `iniciarPartida`, e verificar com teste unitário que a fase inicial é `apresentacao` e passa a `preparacao` após a ação
- [x] 3.2 Criar os esqueletos das telas de preparação, batalha e encerramento e conectar o `App` a um `@switch` sobre `fase()`, verificando que cada fase renderiza a tela correspondente
- [x] 3.3 Verificar com teste de componente que o `App` exibe a tela de apresentação na fase inicial e a de preparação após `iniciarPartida()`

## 4. Tela de apresentação

- [x] 4.1 Construir a `TelaApresentacao` com título principal, objetivo, resumo de turnos e a tabela das cinco embarcações, verificando que todo o conteúdo exigido pela spec aparece na tela
- [x] 4.2 Adicionar a ação "Iniciar partida" conectada ao `PartidaStore` e verificar que o clique transita da apresentação para a preparação
- [x] 4.3 Escrever teste de componente cobrindo a renderização do título, do resumo e do botão, e verificar que o clique chama `iniciarPartida()`
- [x] 4.4 Ajustar o layout responsivo da apresentação (duas colunas no desktop, coluna única no mobile) e verificar em 360 px e em desktop que não há rolagem horizontal nem conteúdo cortado
- [x] 4.5 Aplicar acessibilidade da tela (um único `h1`, botão nativo com nome acessível, `:focus-visible` e ícones decorativos com `aria-hidden`) e verificar navegando apenas com Tab e Enter

## 5. Verificação integrada

- [x] 5.1 Executar `npm test` e `npm run build` e verificar que ambos terminam sem erros
- [x] 5.2 Fazer o smoke test manual do fluxo completo da fase (abrir a aplicação, ler a apresentação, acionar "Iniciar partida" e chegar ao esqueleto da preparação) em desktop e em 360 px
- [x] 5.3 Conferir os itens da spec `apresentacao-inicial` um a um e registrar qualquer desvio antes de encerrar a fase

## Workflow follow-up

- Arquivar a change após a revisão da fase.
- Iniciar a Fase 2 (`nucleo-do-jogo`) somente depois do arquivamento desta.
