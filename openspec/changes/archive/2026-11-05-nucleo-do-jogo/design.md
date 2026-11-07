# Design

## Context

Ver `proposal.md — Why` para a motivação. O estado que molda o desenho:

- A Fase 1 está arquivada e a suíte atual tem 3 arquivos e 6 testes verdes.
- `src/app/dominio/` ainda não existe; `PartidaStore` só conhece `fase` e `iniciarPartida()`.
- `tela-apresentacao.ts` mantém uma tabela de frota própria (`FROTA_APRESENTACAO`), duplicando tamanhos que passarão a ser regra de domínio.
- Angular 22.2 zoneless, Tailwind 4 e Vitest já configurados; `AGENTS.md` pede nomes em português e entregas em fases.
- A partida não é persistida e não há backend, então o domínio pode ser 100% síncrono e em memória.

Restrições: nenhuma dependência nova, nenhum import de Angular em `src/app/dominio/`, nenhuma tela nova.

## Goals / Non-Goals

**Goals:**

- Uma única fonte de verdade para as regras, consumível pelas Fases 3, 4 e 5 sem reimplementação.
- Tornar estados inválidos irrepresentáveis (partida sem as duas frotas completas, embarcação fora de reta, célula atacada duas vezes).
- Testes determinísticos apesar de geração e ataque aleatórios.
- Entregar o contrato que a interface precisa: prévia de posicionamento, motivo de recusa, marcações por lado e embarcações destruídas.

**Non-Goals:**

- Qualquer componente, template, estilo ou alteração de `PartidaStore`.
- Atraso/animação da jogada do computador, indicador de turno e anúncio visual.
- Revelação da frota do computador ao fim da partida (Fase 5).
- Persistência, rotas, SSR ou testes ponta a ponta.

## Decisions

### 1. Domínio imutável com funções puras

O estado é um objeto somente leitura; cada operação devolve um novo estado ou um resultado de recusa. O `PartidaStore` da Fase 3 fará `signal.update(p => ...)`.

**Por quê:** combina com Signals/zoneless, testa sem `TestBed`, não guarda estado escondido e deixa o histórico serializável para depuração.

**Alternativas:** classes mutáveis com métodos (`partida.atacar(...)`) — menos tipos, mas esconde transições e dificulta comparar estados antes/depois nos testes.

### 2. Preparação separada da partida

```
FrotaEmPreparacao (0..5 embarcacoes)
        |
        | iniciarBatalha(frotaJogador, frotaComputador)
        | recusa se faltar embarcacao
        v
Partida {
  frotaJogador, frotaComputador,
  ataques: Ataque[],
  turno: 'jogador' | 'computador',
  situacao: 'em-andamento' | 'vitoria' | 'derrota'
}
```

`situacao` não tem `'preparacao'`: antes da batalha não existe `Partida`. Isso transforma "não se pode atacar antes de começar" em garantia de tipo, em vez de uma checagem que a tela pode esquecer.

**Alternativa:** uma `Partida` desde o início, com `situacao: 'preparacao'` e frota do computador opcional. Rejeitada porque espalha estados parciais por todas as funções.

### 3. Coordenada numérica interna, rótulo só na borda

`Coordenada = { linha: 0..9, coluna: 0..9 }`. `rotulo()` produz `"A1"` e `deRotulo()` faz o inverso para teclado, acessibilidade e testes. `TAMANHO_TABULEIRO = 10` fica em `coordenada.ts`.

**Por quê:** extensão de embarcação e limites são aritmética; strings exigiriam parsing em toda regra.

**Alternativa:** usar `"A1"` como chave em todo o domínio — legível nos testes, porém aritmética e validação ficam mais frágeis.

### 4. Aleatoriedade injetada

```ts
type Aleatorio = () => number; // [0, 1)
```

`gerarFrota(aleatorio)` e `escolherCoordenada(partida, alvo, aleatorio)` recebem a fonte. `Math.random` só aparece na borda (store) a partir da Fase 3.

**Por quê:** sem isso, testes de frota e de ataque do computador ficam instáveis. Com um gerador congruente linear semeado (helper de teste, não de produção), uma execução é reproduzível.

**Alternativa:** receber uma lista pré-sorteada de números — mais rígido e difícil de ler.

### 5. Histórico de ataques como fonte da verdade

`Ataque = { alvo, coordenada, resultado, embarcacao? }`, com `resultado` já resolvido (`'agua' | 'acerto' | 'destruicao'`) e `embarcacao` preenchido apenas na destruição.

**Por quê:** atende "os resultados permanecem visíveis" e "informar quando uma embarcação for destruída" sem uma segunda estrutura; o tabuleiro renderizado vira uma consulta a `marcacaoEm`.

**Alternativa:** grade mutável de células — mais direta para renderizar, porém duplica o histórico e permite divergência entre marcação e ataque.

### 6. Recusas como uniões discriminadas, sem exceções

```ts
{ aceito: false; motivo: 'coordenada-invalida' | 'ja-atacada'
                          | 'fora-do-turno' | 'partida-encerrada' }
{ valido: false; motivo: 'fora-do-tabuleiro' | 'sobreposicao'; conflitos: Coordenada[] }
```

**Por quê:** "tentativa inválida não consome o turno" precisa devolver o estado intacto, e a interface precisa explicar o motivo.

**Alternativa:** lançar erro para uso indevido — transforma fluxo normal do jogador em exceção e perde o motivo tipado.

### 7. Avaliar e aplicar posicionamento em funções separadas

`avaliarPosicionamento` devolve as células que a embarcação ocuparia, se é válido, o motivo e os conflitos, **sem alterar a frota**. `posicionar` aplica a mesma validação e devolve a frota nova.

**Por quê:** a Fase 3 precisa pintar a prévia no hover/foco e recusar com explicação antes do clique. Um `boolean` obrigaria a reimplementar a regra na tela.

### 8. Não oferecer seletor de posições do computador

`combate.ts` expõe `marcacaoEm`, `embarcacoesDestruidas` e `escolherCoordenada`, mas nenhum seletor que devolva as células da frota do computador. A frota continua dentro de `Partida` porque a resolução do ataque precisa dela; o `PartidaStore` não a expõe publicamente.

**Por quê:** reduz a chance de a interface revelar posições escondidas. Não é um limite de segurança — é um limite de API.

**Alternativa:** esconder a frota atrás de um tipo opaco — complexidade desproporcional para um jogo local.

### 9. Geração de frota por tentativas com reinício

Percorrer `FROTA_PADRAO` do maior para o menor. Para cada embarcação, sortear origem e orientação até K tentativas válidas; se esgotar, descartar a frota inteira e recomeçar, até R reinícios. Esgotar R é violação de invariante e lança erro (não deve acontecer: são 17 células em 100).

**Por quê:** simples, sem backtracking, e a taxa de falha é desprezível com K = 200 e R = 100. O teste com 1000 sementes confirma o invariante na prática.

**Alternativa:** backtracking determinístico — garante sucesso, mas adiciona complexidade e código de difícil leitura sem ganho observável.

### 10. `FROTA_PADRAO` com rótulo

A tabela do domínio guarda `{ nome, rotulo, tamanho }`, com `nome` em kebab-case (`'porta-avioes'`) e `rotulo` em português (`'Porta-aviões'`). A apresentação passa a consumir `FROTA_PADRAO` e remove `FROTA_APRESENTACAO`.

**Por quê:** elimina a duplicação de tamanhos e mantém os nomes exibidos em um só lugar.

**Alternativa:** manter rótulos só na interface — obrigaria um mapa paralelo em cada tela.

### 11. Nomenclatura fixada

| Conceito | Nome | Evita |
| --- | --- | --- |
| Fluxo de tela | `FasePartida` (já existe no store) | confundir com regra |
| Regra da partida | `Situacao` | `fase` no domínio |
| Quem ataca / tabuleiro atacado | `Lado` e `alvo` | `jogador` ambíguo |
| Nome exibido da embarcação | `rotulo` | `nome` duplicado |
| Identificador da embarcação | `nome` | `tipo` |

### 12. Estrutura de arquivos

```
src/app/dominio/
  coordenada.ts   Coordenada, TAMANHO_TABULEIRO, validacao, rotulo, deRotulo, chave
  frota.ts        NomeEmbarcacao, Orientacao, Embarcacao, FROTA_PADRAO, celulas()
  preparacao.ts   avaliarPosicionamento, posicionar, remover, frotaCompleta, faltantes
  gerador.ts      Aleatorio, gerarFrota()
  partida.ts      Lado, Situacao, Ataque, Partida, iniciarBatalha()
  combate.ts      atacar, escolherCoordenada, marcacaoEm, embarcacoesDestruidas
```

Cada arquivo tem seu `*.spec.ts` ao lado. Nomes em português, seguindo o guia de estilo do Angular 22.

### 13. Estratégia de testes

- Vitest puro, sem `TestBed` e sem importar Angular.
- Helper `criarAleatorioSemeado(semente)` apenas nos testes.
- Gerador validado com 1000 sementes: 5 embarcações, tamanhos exatos, dentro do tabuleiro, sem sobreposição, e mesma semente produz a mesma frota.
- Ataque do computador testado com `Aleatorio` fixo (0, 0.5, 0.999...) para forçar primeira, meio e última posição livre.
- Cada cenário da spec `regras-da-partida` vira pelo menos um caso de teste.
- Meta aproximada: 45–60 testes, todos de milissegundos.

## Risks / Trade-offs

- **Contrato insuficiente descoberto na Fase 3** → `avaliarPosicionamento` já devolve motivo e conflitos; qualquer necessidade nova entra como função adicional, sem quebrar as existentes.
- **Fase sem mudança visível** → a evidência é `npm test`; o smoke test visual começa na Fase 3.
- **Geração aleatória presa em laço** → tentativas e reinícios limitados; esgotar é invariante violada e falha ruidosamente em vez de travar.
- **Texto de interface dentro do domínio (`rotulo`)** → aceito para manter uma fonte só; se a Fase 5 precisar de outro idioma, o mapa sai para a camada de apresentação.
- **Histórico cresce com a partida** → no máximo 100 ataques; custo irrelevante.
- **Regra duplicada entre `regras-da-partida` e specs de UI** → as fases 3–5 descrevem apenas tela e interação; a regra fica nesta capability.
- **Partida expõe a frota do computador no objeto** → é necessário para resolver ataques; o store não a publica e a interface não recebe seletor de posições inimigas.

## Open Questions

Nenhuma bloqueante. A revelação da frota do computador ao fim da partida fica deliberadamente para a Fase 5, sem alterar este contrato.
