import { TestBed } from '@angular/core/testing';
import { PartidaStore } from './partida-store';
import { Coordenada } from '../dominio/coordenada';

function aleatorioControlado() {
  let semente = 12345;
  return () => {
    semente = (semente * 1664525 + 1013904223) % 4294967296;
    return semente / 4294967296;
  };
}

function prepararStore(store: PartidaStore, posicoes: (indice: number) => Coordenada): void {
  store.iniciarPartida();
  store.modelos.forEach((modelo, indice) => {
    store.selecionarEmbarcacao(modelo.nome);
    store.posicionarAtiva(posicoes(indice));
  });
  expect(store.iniciarBatalha(aleatorioControlado())).toBe(true);
}

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

  it('protege a preparacao depois do inicio da batalha', () => {
    store.iniciarPartida();
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      store.posicionarAtiva({ linha: indice * 2, coluna: 0 });
    });
    expect(store.iniciarBatalha()).toBe(true);
    const frota = store.frotaPreparacao();
    const partida = store.partida();
    store.selecionarEmbarcacao('destroyer');
    store.alternarOrientacao();
    expect(store.avaliar({ linha: 9, coluna: 9 })).toBeUndefined();
    expect(store.posicionarAtiva({ linha: 9, coluna: 9 })).toBe(false);
    store.removerEmbarcacao('destroyer');
    expect(store.iniciarBatalha()).toBe(false);
    expect(store.frotaPreparacao()).toBe(frota);
    expect(store.partida()).toBe(partida);
    expect(store.fase()).toBe('batalha');
  });

  it('aceita ataque na batalha, responde com computador e recusa coordenada repetida', () => {
    store.iniciarPartida();
    store.modelos.forEach((modelo, indice) => {
      store.selecionarEmbarcacao(modelo.nome);
      store.posicionarAtiva({ linha: indice * 2, coluna: 0 });
    });
    expect(store.atacarJogador({ linha: 0, coluna: 0 })).toBeUndefined();
    expect(store.iniciarBatalha()).toBe(true);
    const resultado = store.atacarJogador({ linha: 9, coluna: 9 }, () => 0);
    expect(resultado?.aceito).toBe(true);
    expect(store.partida()?.ataques).toHaveLength(2);
    expect(store.partida()?.turno).toBe('jogador');
    const partida = store.partida();
    expect(store.atacarJogador({ linha: -1, coluna: 0 })).toMatchObject({ aceito: false, motivo: 'coordenada-invalida' });
    expect(store.partida()).toBe(partida);
    expect(store.atacarJogador({ linha: 9, coluna: 9 })).toMatchObject({ aceito: false, motivo: 'ja-atacada' });
    expect(store.partida()).toBe(partida);
  });

  it('usa uma coordenada nova para a resposta e volta o turno ao jogador', () => {
    prepararStore(store, (indice) => ({ linha: indice + 5, coluna: 0 }));
    const sorteio = vi.fn(() => 0);
    const resultado = store.atacarJogador({ linha: 9, coluna: 9 }, sorteio);
    expect(resultado?.aceito).toBe(true);
    expect(sorteio).toHaveBeenCalledTimes(1);
    expect(store.partida()?.ataques).toEqual([
      expect.objectContaining({ alvo: 'computador', coordenada: { linha: 9, coluna: 9 } }),
      expect.objectContaining({ alvo: 'jogador', coordenada: { linha: 0, coluna: 0 } }),
    ]);
    expect(store.partida()?.turno).toBe('jogador');
  });

  it('preserva vitória e histórico, mantém batalha e recusa ataques terminais', () => {
    prepararStore(store, (indice) => ({ linha: indice + 5, coluna: 0 }));
    const celulasAdversarias = store.partida()!.frotaComputador.flatMap((embarcacao) =>
      Array.from({ length: embarcacao.tamanho }, (_, deslocamento) => ({
        linha: embarcacao.origem.linha + (embarcacao.orientacao === 'vertical' ? deslocamento : 0),
        coluna: embarcacao.origem.coluna + (embarcacao.orientacao === 'horizontal' ? deslocamento : 0),
      })),
    );
    celulasAdversarias.forEach((coordenada) => store.atacarJogador(coordenada, () => 0));
    expect(store.partida()?.situacao).toBe('vitoria');
    expect(store.fase()).toBe('batalha');
    const partidaFinal = store.partida();
    expect(store.atacarJogador({ linha: 9, coluna: 9 })).toMatchObject({ aceito: false, motivo: 'partida-encerrada' });
    expect(store.partida()).toBe(partidaFinal);
  });

  it('preserva derrota e não permite respostas adicionais após o fim', () => {
    prepararStore(store, (indice) => {
      const posicoes = [
        { linha: 0, coluna: 0 }, { linha: 0, coluna: 6 },
        { linha: 1, coluna: 0 }, { linha: 1, coluna: 3 }, { linha: 1, coluna: 6 },
      ];
      return posicoes[indice];
    });
    const celulasAdversarias = new Set(store.partida()!.frotaComputador.flatMap((embarcacao) =>
      Array.from({ length: embarcacao.tamanho }, (_, deslocamento) =>
        `${embarcacao.origem.linha + (embarcacao.orientacao === 'vertical' ? deslocamento : 0)},${embarcacao.origem.coluna + (embarcacao.orientacao === 'horizontal' ? deslocamento : 0)}`),
    ));
    let tentativa = 0;
    while (store.partida()?.situacao === 'em-andamento') {
      let coordenada: Coordenada;
      do {
        coordenada = { linha: Math.floor(tentativa / 10), coluna: tentativa++ % 10 };
      } while (celulasAdversarias.has(`${coordenada.linha},${coordenada.coluna}`)
        || store.partida()!.ataques.some((ataque) => ataque.alvo === 'computador'
          && ataque.coordenada.linha === coordenada.linha && ataque.coordenada.coluna === coordenada.coluna));
      expect(store.atacarJogador(coordenada, () => 0)?.aceito).toBe(true);
    }
    expect(store.partida()?.situacao).toBe('derrota');
    expect(store.fase()).toBe('batalha');
    const partidaFinal = store.partida();
    expect(store.atacarJogador({ linha: 8, coluna: 9 })).toMatchObject({ aceito: false, motivo: 'partida-encerrada' });
    expect(store.partida()).toBe(partidaFinal);
  });
});
