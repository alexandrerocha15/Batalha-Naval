# Tasks

## 1. Estado de preparação e integração com o domínio

- [x] 1.1 Expandir o estado da partida para conter a frota em preparação e a seleção/orientação atual, delegando as atualizações a `src/app/dominio/preparacao.ts`; adicionar testes unitários para inicialização, posicionamento e remoção no store.
- [x] 1.2 Implementar a criação da partida ao iniciar com frota completa, incluindo geração da frota do computador e transição de fase apenas após sucesso; testar a recusa da frota incompleta e o início válido.

## 2. Interação de posicionamento

- [x] 2.1 Implementar seleção de embarcação e alternância de orientação na tela de preparação; verificar seleção, estado ativo e atualização da orientação em testes do componente.
- [x] 2.2 Implementar tabuleiro responsivo com prévia de células válida/inválida calculada pelo domínio e confirmação de origem; testar bordas, sobreposição, confirmação e preservação da frota após recusa.
- [x] 2.3 Implementar remoção e reposicionamento explícitos de embarcações; testar que as células liberam, a embarcação volta a faltantes e tentativa inválida mantém o posicionamento anterior.
- [x] 2.4 Exibir rótulos acessíveis, razão de posicionamento inválido, composição e faltantes; testar texto/estado acessível para frota incompleta e instruções de orientação.

## 3. Fluxo e validação integrada

- [x] 3.1 Implementar controle de início desabilitado enquanto a frota for incompleta e transição para batalha após frota completa; testar habilitação e mudança de fase.
- [x] 3.2 Verificar comportamento por mouse, teclado e layout móvel, corrigindo falhas de acessibilidade ou responsividade; executar `npm test` e `npm run build` sem erros.
- [x] 3.3 Validar a delta `regras-da-partida` e confirmar que os cenários de interação adicionados têm cobertura automatizada; executar `openspec validate` sem erros.

## Workflow follow-up

- Arquivar a mudança após revisão e sincronizar a delta `regras-da-partida` com a spec principal.
