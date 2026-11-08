# Design

## Context

Ver `proposal.md` — Why. O `src/index.html` atual referencia `favicon.ico` com um caminho relativo e o `angular.json` define `baseHref: "/Batalha-Naval/"` apenas para o deploy no GitHub Pages. O build de produção reescreve o `<base href>` para esse subdiretório, enquanto o servidor local usa `/`.

`public/navio.png` tem 1312×1199 px, formato ARGB de 32 bits (canal alfa presente) e cerca de 455 KB.

## Goals / Non-Goals

**Goals:**

- Exibir `navio.png` como ícone da aba com o fundo transparente preservado.
- Manter o mesmo `index.html` funcionando em `/` (local) e em `/Batalha-Naval/` (GitHub Pages), sem lógica por ambiente.

**Non-Goals:**

- Otimizar, redimensionar ou converter a imagem para outros formatos/tamanhos.
- Adicionar ícones específicos de iOS, PWA ou `manifest`.
- Alterar a configuração de deploy ou o `baseHref`.

## Decisions

**Caminho relativo (`href="navio.png"`) em vez de absoluto (`/navio.png`).**
Um caminho relativo é resolvido contra o `<base href>` do documento. O Angular CLI ajusta esse `<base>` para `/Batalha-Naval/` no build de deploy e o mantém como `/` localmente, então a mesma tag funciona nos dois ambientes. Um caminho absoluto apontaria para a raiz do domínio e retornaria 404 no GitHub Pages. Alternativa descartada: interpolar o `baseHref` em tempo de execução, o que exigiria lógica desnecessária no `index.html`.

**Referenciar o PNG original diretamente, com `type="image/png"`.**
Preserva exatamente o canal alfa e evita qualquer etapa de conversão. Alternativa descartada: gerar `.ico` ou múltiplos tamanhos, que exigiria ferramentas extras e poderia introduzir fundo opaco ou perda de transparência. O tamanho maior é aceitável para um ícone e pode ser otimizado em uma mudança futura.

**Remover `public/favicon.ico`.**
Como o arquivo deixa de ser referenciado, mantê-lo apenas duplicaria o artefato publicado e deixaria um resquício do favicon padrão. Alternativa descartada: manter como fallback, desnecessário porque o PNG é servido pelo mesmo pipeline de assets.

## Risks / Trade-offs

- **Navegador ou CDN mantém o favicon antigo em cache** → a URL muda para `navio.png`, o que naturalmente invalida o cache do ícone anterior; um recarregamento forçado resolve resíduos locais.
- **Imagem grande para um favicon (455 KB)** → aceito nesta mudança para preservar o original; uma otimização futura pode gerar versões menores sem alterar o comportamento.
- **Dependência implícita do `<base href>`** → o caminho relativo acompanha automaticamente o `baseHref`; se o deploy mudar de subdiretório, nenhum ajuste no `index.html` será necessário.
- **Proporção não quadrada (1312×1199)** → o navegador ajusta o ícone ao espaço da aba; como o fundo é transparente, não aparece moldura ou faixa de cor.

## Migration Plan

1. Atualizar o `<link rel="icon">` e remover `public/favicon.ico`.
2. Validar localmente e, após o merge, validar no site publicado pelo workflow de deploy.
3. Reversão: reverter o commit, restaurando o link e o arquivo removidos.
