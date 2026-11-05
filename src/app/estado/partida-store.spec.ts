import { TestBed } from '@angular/core/testing';
import { PartidaStore } from './partida-store';

describe('PartidaStore', () => {
  let store: PartidaStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(PartidaStore);
  });

  it('comeca na apresentacao', () => {
    expect(store.fase()).toBe('apresentacao');
  });

  it('avanca para a preparacao ao iniciar a partida', () => {
    store.iniciarPartida();

    expect(store.fase()).toBe('preparacao');
  });

  it('inicializa a preparacao vazia e permite posicionar e remover pelo dominio', () => {
    store.iniciarPartida();
    expect(store.frotaPreparacao()).toEqual([]);
    store.selecionarEmbarcacao('destroyer');
    expect(store.posicionarAtiva({ linha: 0, coluna: 0 })).toBe(true);
    expect(store.frotaPreparacao()).toHaveLength(1);
    store.removerEmbarcacao('destroyer');
    expect(store.frotaPreparacao()).toEqual([]);
    expect(store.faltantes().map((item) => item.nome)).toContain('destroyer');
  });

  it('preserva frota e orientação readonly com selecao ativa', () => {
    store.iniciarPartida();
    store.selecionarEmbarcacao('destroyer');
    store.alternarOrientacao();
    expect(store.embarcacaoAtiva()).toBe('destroyer');
    expect(store.orientacao()).toBe('vertical');
  });

  it('recusa iniciar batalha com frota incompleta sem mudar de fase', () => {
    store.iniciarPartida();
    expect(store.iniciarBatalha()).toBe(false);
    expect(store.fase()).toBe('preparacao');
    expect(store.partida()).toBeUndefined();
  });

  it('cria a partida e muda de fase somente com frota completa', () => {
    store.iniciarPartida();
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      expect(store.posicionarAtiva({ linha: indice * 2, coluna: 0 })).toBe(true);
    });
    expect(store.iniciarBatalha()).toBe(true);
    expect(store.fase()).toBe('batalha');
    expect(store.partida()?.frotaJogador).toHaveLength(5);
    expect(store.partida()?.frotaComputador).toHaveLength(5);
  });

  it('recusa prévias fora do tabuleiro ou sobrepostas sem alterar posicionamentos', () => {
    store.iniciarPartida();
    store.selecionarEmbarcacao('destroyer');
    expect(store.posicionarAtiva({ linha: 0, coluna: 0 })).toBe(true);
    store.selecionarEmbarcacao('cruzador');
    expect(store.avaliar({ linha: 9, coluna: 8 })?.valido).toBe(false);
    expect(store.posicionarAtiva({ linha: 9, coluna: 8 })).toBe(false);
    expect(store.avaliar({ linha: 0, coluna: 1 })?.valido).toBe(false);
    expect(store.posicionarAtiva({ linha: 0, coluna: 1 })).toBe(false);
    expect(store.frotaPreparacao()).toHaveLength(1);
    expect(store.frotaPreparacao()[0].nome).toBe('destroyer');
  });

  it('mantem a posicao valida antiga quando o reposicionamento falha e libera celulas ao remover', () => {
    store.iniciarPartida();
    store.selecionarEmbarcacao('destroyer');
    store.posicionarAtiva({ linha: 0, coluna: 0 });
    store.alternarOrientacao();
    expect(store.posicionarAtiva({ linha: 9, coluna: 0 })).toBe(false);
    expect(store.frotaPreparacao()[0].origem).toEqual({ linha: 0, coluna: 0 });
    store.removerEmbarcacao('destroyer');
    expect(store.frotaPreparacao()).toEqual([]);
    expect(store.faltantes().some((item) => item.nome === 'destroyer')).toBe(true);
  });

  it('reposiciona explicitamente a embarcação e libera suas células ao removê-la', () => {
    store.iniciarPartida();
    store.selecionarEmbarcacao('destroyer');
    store.posicionarAtiva({ linha: 0, coluna: 0 });
    expect(store.posicionarAtiva({ linha: 2, coluna: 2 })).toBe(true);
    expect(store.frotaPreparacao()[0].origem).toEqual({ linha: 2, coluna: 2 });
    store.removerEmbarcacao('destroyer');
    store.selecionarEmbarcacao('cruzador');
    expect(store.avaliar({ linha: 0, coluna: 0 })?.valido).toBe(true);
  });
});
