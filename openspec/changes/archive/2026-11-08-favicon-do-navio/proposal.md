# Proposal

## Why

A aplicação ainda exibe o favicon padrão do Angular, o que não representa a identidade visual da Batalha Naval. Além disso, o ícone precisa continuar funcionando quando o site é publicado no GitHub Pages, onde a aplicação é servida em um subdiretório (`/Batalha-Naval/`).

## What Changes

- Substituir a referência ao `favicon.ico` padrão do Angular no `src/index.html` pela imagem `public/navio.png`.
- Declarar o ícone como PNG e manter o fundo transparente da imagem original, sem recortes, redimensionamentos ou conversões.
- Usar um caminho relativo para o ícone, de modo que ele resolva corretamente tanto no servidor local (`/`) quanto no GitHub Pages (`/Batalha-Naval/`), acompanhando o `<base href>` gerado no build de deploy.
- Remover o `public/favicon.ico` padrão, que deixa de ser referenciado.

## Capabilities

### New Capabilities

- `identidade-visual`: define o ícone exibido na aba do navegador e sua disponibilidade nos ambientes local e de publicação.

### Modified Capabilities

<!-- Nenhuma capacidade existente tem requisitos alterados. -->

## Impact

- `src/index.html`: tag `<link rel="icon">`.
- `public/navio.png`: passa a ser o ícone oficial; o arquivo permanece inalterado.
- `public/favicon.ico`: removido por não ser mais referenciado.
- Build local e deploy via `ng deploy` (GitHub Pages): nenhuma mudança de configuração é necessária, pois o caminho relativo acompanha o `baseHref` já definido em `angular.json`.
