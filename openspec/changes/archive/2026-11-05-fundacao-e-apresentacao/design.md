# Design

## Context

O repositório contém apenas documentação (`README.md`, `AGENTS.md`) e a estrutura do OpenSpec. Não há `package.json`, código-fonte nem Git inicializado. As versões disponíveis no ambiente são Angular 22.2.x, Tailwind CSS 4.3.x e `@lucide/angular` 1.68.

Restrições que moldam o design:

- `AGENTS.md` exige Angular 22.2, zoneless, standalone, Signals, Tailwind e Lucide.
- A partida não é persistida, então URLs e deep links não agregam valor.
- O diretório raiz não está vazio; o scaffold precisa preservar `README.md`, `AGENTS.md`, `openspec/` e `.opencode/`.
- As fases seguintes (domínio, preparação, batalha, fim) vão plugar nesta base.

## Goals / Non-Goals

**Goals:**

- Deixar o projeto executável, testável e com build de produção funcionando.
- Estabelecer tema, tipografia e layout responsivo reutilizáveis pelas próximas fases.
- Criar o shell com transição explícita entre fases da partida.
- Entregar a tela de apresentação com a ação de início.
- Provar a convivência Angular 22 + Tailwind 4 + Lucide antes das telas complexas.

**Non-Goals:**

- Regras de jogo, tabuleiro, frota e combate (Fase 2).
- Posicionamento interativo (Fase 3).
- Rotas, SSR, PWA, persistência e backend.
- Testes end-to-end e identidade visual definitiva.

## Decisions

### 1. Scaffold em diretório temporário, depois mover para a raiz

`ng new --directory .` tende a recusar um diretório não vazio. Para não arriscar sobrescrever documentação:

1. Gerar em uma subpasta temporária: `ng new batalha-naval --directory .scaffold --skip-git --style tailwind --zoneless --test-runner vitest --routing=false --ssr=false`.
2. Mover o conteúdo de `.scaffold` para a raiz, incluindo arquivos ocultos.
3. Preservar `README.md`, `AGENTS.md`, `openspec/` e `.opencode/`.
4. Manter o `.gitignore` da raiz e acrescentar entradas do gerado que faltarem.
5. Remover `.scaffold`.

**Alternativas:** `--directory .` direto (menos passos, porém arriscado); scaffold manual (controle total, mais chance de erro de configuração).

### 2. Configuração do Angular

- `--style tailwind` para obter a integração oficial do CLI.
- `--zoneless` explícito, alinhado ao `AGENTS.md`.
- `--test-runner vitest` (padrão da versão, mas explícito no comando).
- `--routing=false` e `--ssr=false`, coerentes com a ausência de persistência e backend.
- Modo `strict` mantido.

Se o `--style tailwind` gerar configuração incompleta, o fallback é instalar `tailwindcss`, `@tailwindcss/postcss` e `postcss`, criar `.postcssrc.json` com o plugin e usar `@import "tailwindcss";` em `src/styles.css`. Tailwind 4 não usa `tailwind.config.js` por padrão; o tema é declarado em CSS com `@theme`.

### 3. Ícones com `@lucide/angular`

O pacote `lucide-angular` está descontinuado. O `@lucide/angular` oferece componentes standalone por ícone, compatíveis com zoneless:

```ts
import { LucideAnchor } from '@lucide/angular';

@Component({
  imports: [LucideAnchor],
  template: '<svg lucideAnchor></svg>',
})
```

Ícones estáticos são importados individualmente, o que preserva tree-shaking. `provideLucideConfig({ strokeWidth: 1.75 })` define o traço global. Não é necessário `provideLucideIcons` enquanto os ícones forem estáticos.

### 4. Shell com máquina de estados, sem rotas

Um único `App` renderiza a tela correspondente à fase atual:

```ts
type FasePartida = 'apresentacao' | 'preparacao' | 'batalha' | 'encerrada';
```

```
App
 +-- @switch (fase())
       'apresentacao' -> TelaApresentacao
       'preparacao'   -> esqueleto (Fase 3)
       'batalha'      -> esqueleto (Fase 4)
       'encerrada'    -> esqueleto (Fase 5)
```

A fase vive em um `PartidaStore` (`providedIn: 'root'`) baseado em Signals. Nesta fase ele expõe apenas `fase()` e `iniciarPartida()`. As fases seguintes adicionam estado de tabuleiro, turno e registro sem mudar o ponto de entrada.

**Por que não Router:** não há URL compartilhável, recarregar a página sempre reinicia a partida e o fluxo é linear. Rotas exigiriam guards para impedir acesso direto a `/batalha` sem frota, adicionando complexidade sem benefício observável.

**Alternativa considerada:** rotas `/`, `/preparar`, `/batalha` com `CanActivate`. Rejeitada por escopo.

### 5. Estrutura de pastas preparada para as próximas fases

```
src/app/
  app.ts / app.html / app.css
  app.config.ts
  estado/
    partida-store.ts
  telas/
    apresentacao/
      tela-apresentacao.ts / .html
    preparacao/        (esqueleto)
    batalha/           (esqueleto)
  dominio/             (criado na Fase 2)
  componentes/         (criado na Fase 3)
```

Nomes em português, seguindo o guia de estilo 2025 do Angular (`app.ts`, `tela-apresentacao.ts`). Classes em PascalCase (`PartidaStore`, `TelaApresentacao`).

### 6. Tema visual

Tema escuro naval, de alto contraste:

| Token | Uso |
| --- | --- |
| `--color-oceano-950` | fundo principal |
| `--color-oceano-900` | superfícies e cartões |
| `--color-oceano-700` | bordas e separadores |
| `--color-agua-400` | destaques e ações |
| `--color-espuma-100` | texto principal |
| `--color-alerta-400` | avisos e erros |

A paleta é declarada com `@theme` no `styles.css`, permitindo classes como `bg-oceano-950` e `text-espuma-100`. Um tema claro não é necessário nesta fase; a troca futura fica restrita aos tokens.

### 7. Layout da apresentação

Desktop: duas colunas — identidade e chamada para ação à esquerda; regras resumidas e frota à direita. Mobile: coluna única, com a ação após o resumo. Um mini tabuleiro decorativo comunica o tema sem competir com o conteúdo.

```
+---------------------------------------------------+
|  BATALHA NAVAL                                    |
|  [icone]  Afunde a frota inimiga.                 |
|                                                   |
|  [ Iniciar partida ]                              |
|                                                   |
|  Como funciona            Sua frota               |
|  - Voce ataca primeiro    Porta-avioes  5         |
|  - Um ataque por turno    Encouracado   4         |
|  - Agua, acerto, afundou  Cruzador      3         |
|                           Submarino     3         |
|                           Destroyer     2         |
+---------------------------------------------------+
```

Sem imagens externas e sem fontes remotas, para evitar dependência de rede e layout instável.

### 8. Responsividade

- Abordagem mobile-first com classes Tailwind.
- Largura máxima de conteúdo (~72 rem no desktop) e `min-h-dvh`.
- Nenhuma grade fixa que force rolagem horizontal em 360 px.
- Áreas de toque com no mínimo ~40 px de altura para a ação principal.

### 9. Acessibilidade

- Um único `<h1>`.
- Ação de início como `<button>` nativo, com texto explícito.
- `:focus-visible` com anel de contraste.
- Contraste mínimo AA para texto e ação.
- Ícones decorativos com `aria-hidden="true"`; informação nunca só por cor.

### 10. Testes

- Vitest, já configurado pelo CLI.
- Teste de unidade do `PartidaStore`: fase inicial é `apresentacao`; `iniciarPartida()` muda para `preparacao`.
- Teste de componente da tela de apresentação: renderiza título, resumo e botão; clique dispara a transição.
- Sem E2E nesta fase. A verificação visual é manual em 360 px e desktop.

## Risks / Trade-offs

- **CLI recusa o scaffold mesmo em subpasta** → usar `--skip-install` e mover manualmente; se necessário, gerar em um diretório fora do projeto e copiar.
- **`--style tailwind` não configurar Tailwind 4 como esperado** → fallback com `@tailwindcss/postcss` documentado acima.
- **Mover arquivos ocultos pode esquecer `.vscode` ou `.editorconfig`** → listar com `Get-ChildItem -Force` e conferir item a item; remover `.scaffold` só no final.
- **Sobrescrever `.gitignore` da raiz** → manter o existente e apenas acrescentar linhas ausentes.
- **`@lucide/angular` mudar de API** → versão fixada no `package.json`; ícones isolados em componentes, fácil de trocar.
- **Tela inicial virar vitrine e atrasar o jogo** → limitar a apresentação a uma seção e duas ações; o foco é a fundação.
- **Sem Git inicializado** → não há rollback automático; antes de mover arquivos, confirmar que a documentação existente está intacta.

## Migration Plan

Não há dados nem usuários. A "migração" é a criação do workspace:

1. Scaffold e movimentação.
2. `npm install` e `npm run build` verdes.
3. Tema e shell.
4. Tela de apresentação.
5. `npm test` verde.

Rollback: remover os arquivos gerados e restaurar a raiz ao estado atual (apenas documentação e OpenSpec), que permanece intocado durante o processo.
