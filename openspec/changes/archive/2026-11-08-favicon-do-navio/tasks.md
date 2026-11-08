# Tasks

## 1. Preparar o asset do ícone

- [x] 1.1 Confirmar que `public/navio.png` existe, é um PNG com canal alfa e permanece inalterado; verificar com a inspeção do arquivo (formato `Format32bppArgb`) e com `git status` mostrando que a imagem não foi modificada.
- [x] 1.2 Remover `public/favicon.ico` e confirmar que o arquivo não existe mais e que nenhum outro arquivo do projeto o referencia (busca por `favicon.ico` fora de `node_modules`/`dist` sem resultados).

## 2. Configurar o ícone no documento

- [x] 2.1 Em `src/index.html`, trocar `<link rel="icon" type="image/x-icon" href="favicon.ico" />` por `<link rel="icon" type="image/png" href="navio.png" />`; verificar que o `index.html` contém exatamente uma tag `rel="icon"` apontando para `navio.png` com caminho relativo.
- [x] 2.2 Confirmar que o atributo `href` não começa com `/` e que o `<base href="/">` permanece inalterado; verificar por inspeção do arquivo.

## 3. Verificação integrada

- [x] 3.1 Executar `npm run build` e confirmar que o build de produção conclui sem erros e que `dist/batalha-naval/browser/navio.png` é gerado.
- [x] 3.2 Executar `npx ng build --base-href /Batalha-Naval/` e confirmar no `dist/batalha-naval/browser/index.html` que o `<base href>` é `/Batalha-Naval/` e que o `href` do ícone continua relativo (`navio.png`), sem `/` inicial.
- [x] 3.3 Executar `npm start`, abrir a aplicação no navegador e confirmar que a aba exibe o navio com fundo transparente, sem a requisição de `favicon.ico` retornar erro no console/rede.

## Workflow follow-up

- Arquivar a mudança após a revisão e o merge.
- Após o deploy do workflow do GitHub Pages, abrir o site em `/Batalha-Naval/` e confirmar que o ícone é carregado sem 404.
