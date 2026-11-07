# Tasks

## 1. Retorno à apresentação na preparação

- [x] 1.1 Adicionar `voltarApresentacao()` ao `PartidaStore`, restrito à fase `preparacao`, limpando frota, embarcação ativa, orientação e partida antes de mudar para `apresentacao`; extrair a limpeza compartilhada com `iniciarPartida()`. Verificar com novos casos em `src/app/estado/partida-store.spec.ts` que a fase muda, a frota fica vazia e a ação não tem efeito fora da preparação.
- [x] 1.2 Adicionar o botão secundário "Voltar" com ícone Lucide `ArrowLeft` no cabeçalho de `tela-preparacao.html`, ligado a `voltarApresentacao()`, com foco visível e nome acessível. Verificar em `src/app/telas/preparacao/tela-preparacao.spec.ts` que o botão existe, retorna à apresentação, descarta a frota e é alcançável por teclado.

## 2. Ordem dos tabuleiros

- [x] 2.1 Reordenar `tela-batalha.html` para renderizar o tabuleiro do jogador primeiro e o adversário depois, agrupando o tabuleiro do jogador com o futuro indicador de frota na mesma coluna. Verificar em `src/app/telas/batalha/tela-batalha.spec.ts` que o primeiro grupo é o tabuleiro do jogador, o segundo é o adversário e os 100 botões de ataque continuam no tabuleiro adversário.
- [x] 2.2 Reordenar `tela-encerramento.html` para renderizar o tabuleiro do jogador primeiro e o adversário depois, mantendo ambos somente leitura. Verificar em `src/app/telas/encerramento/tela-encerramento.spec.ts` que o primeiro grupo é o do jogador, o segundo é o do adversário e nenhuma coordenada é acionável.

## 3. Histórico reduzido e embarcação destruída

- [x] 3.1 Adicionar ao `HistoricoAtaques` o input opcional `reduzido`, um `computed` que mantém o último ataque de cada lado preservando a ordem cronológica e o texto no formato "Seu ataque em B4: destruição — Cruzador destruído." / "Ataque do computador em B4: ...". Criar `src/app/componentes/historico-ataques.spec.ts` verificando o modo completo, o modo reduzido com no máximo dois itens, a manutenção do último ataque de cada lado e a identificação da embarcação destruída.
- [x] 3.2 Passar `[reduzido]="true"` ao histórico em `tela-batalha.html` e atualizar as asserções antigas de texto e de quantidade de itens. Verificar em `src/app/telas/batalha/tela-batalha.spec.ts` que, após uma troca de ataques, o histórico mostra somente a última jogada de cada lado, sem as anteriores, e que a jogada recusada não altera a lista.
- [x] 3.3 Garantir que `tela-encerramento.html` continue usando o histórico completo (sem `reduzido`) e atualizar as asserções de texto. Verificar em `src/app/telas/encerramento/tela-encerramento.spec.ts` que a lista contém todos os ataques da partida, inclusive as destruições.

## 4. Indicador da frota do jogador

- [x] 4.1 Criar `situacaoFrota(partida, alvo)` em `src/app/dominio/combate.ts`, derivando da `FROTA_PADRAO` e dos ataques o total e a quantidade restante por tipo, sem alterar as regras de combate. Verificar em `src/app/dominio/combate.spec.ts` a situação inicial, a redução após destruição completa e a independência entre os lados.
- [x] 4.2 Criar o componente standalone `IndicadorFrota` em `src/app/componentes/indicador-frota.ts` e `.html`, com os ícones Lucide `Plane`, `Shield`, `Ship`, `Fish` e `Zap`, nome, quantidade restante, símbolo decorativo e layout responsivo. Criar `src/app/componentes/indicador-frota.spec.ts` verificando os cinco tipos, os nomes e quantidades acessíveis, a redução após destruição e a estabilidade diante de destruições adversárias.
- [x] 4.3 Integrar `IndicadorFrota` abaixo do tabuleiro do jogador em `tela-batalha.html` e garantir que ele reflita o signal da partida. Verificar em `src/app/telas/batalha/tela-batalha.spec.ts` que o indicador aparece depois do tabuleiro do jogador, que a quantidade exibida diminui quando uma embarcação própria é destruída e que volta às quantidades iniciais ao começar uma nova partida.

## 5. Verificação integrada

- [x] 5.1 Executar a suíte completa com `npm test -- --watch=false` e corrigir regressões; a verificação é a suíte passar sem falhas.
- [x] 5.2 Executar `npm run build` e confirmar que a aplicação compila sem erros de template ou tipos.
- [x] 5.3 Abrir a aplicação em viewport de 360 px e em desktop, percorrer a preparação e a batalha por teclado e confirmar: "Voltar" retorna à apresentação, tabuleiro do jogador fica à esquerda (e primeiro no mobile), histórico mostra no máximo duas jogadas, indicador de frota fica abaixo do tabuleiro do jogador e não há rolagem horizontal.
- [x] 5.4 Revisar o diff para confirmar que nenhuma regra de combate, composição de frota, turno ou critério de vitória foi alterado, além da função derivada `situacaoFrota`.

## Workflow follow-up

- Validar a change com `openspec validate "melhorias-de-interface-da-partida" --strict`.
- Arquivar a change após a revisão e a implementação aprovadas.
- Verificar o resultado arquivado e as specs principais atualizadas.
