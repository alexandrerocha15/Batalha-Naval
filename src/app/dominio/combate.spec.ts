import { FROTA_PADRAO } from './frota';
import { atacar, escolherCoordenada, embarcacoesDestruidas, marcacaoEm, situacaoFrota } from './combate';
import { iniciarBatalha, Partida } from './partida';
import { posicionar } from './preparacao';

function frotaDeTeste() {
  let frota = [] as ReturnType<typeof posicionar>;
  for (let indice = 0; indice < FROTA_PADRAO.length; indice++) frota = posicionar(frota ?? [], FROTA_PADRAO[indice], { linha: indice * 2, coluna: 0 }, 'horizontal');
  return frota!;
}

describe('combate', () => {
  it('marca água, troca turno e não aceita repetição', () => {
    const inicio = iniciarBatalha(frotaDeTeste(), frotaDeTeste());
    if (!inicio.iniciada) throw new Error('partida não iniciada');
    const primeiro = atacar(inicio.partida, 'jogador', { linha: 9, coluna: 9 });
    expect(primeiro.aceito).toBe(true);
    if (primeiro.aceito) {
      expect(primeiro.ataque.resultado).toBe('agua');
      expect(primeiro.partida.turno).toBe('computador');
      expect(atacar(primeiro.partida, 'jogador', { linha: 9, coluna: 9 }).aceito).toBe(false);
      const escolha = escolherCoordenada(primeiro.partida, 'jogador', () => 0);
      expect(escolha).toEqual({ linha: 0, coluna: 0 });
      expect(marcacaoEm(primeiro.partida, 'jogador')).toHaveLength(0);
      expect(embarcacoesDestruidas(primeiro.partida, 'computador')).toHaveLength(0);
    }
  });

  it('apresenta a situação inicial da frota com total e restantes por tipo', () => {
    const inicio = iniciarBatalha(frotaDeTeste(), frotaDeTeste());
    if (!inicio.iniciada) throw new Error('partida não iniciada');
    const situacao = situacaoFrota(inicio.partida, 'jogador');
    expect(situacao).toHaveLength(FROTA_PADRAO.length);
    expect(situacao.map((item) => item.nome)).toEqual(FROTA_PADRAO.map((modelo) => modelo.nome));
    expect(situacao.map((item) => item.rotulo)).toEqual(FROTA_PADRAO.map((modelo) => modelo.rotulo));
    expect(situacao.every((item) => item.total === 1 && item.restantes === 1)).toBe(true);
  });

  it('reduz a quantidade restante após destruição completa e mantém os lados independentes', () => {
    const inicio = iniciarBatalha(frotaDeTeste(), frotaDeTeste());
    if (!inicio.iniciada) throw new Error('partida não iniciada');
    let partida: Partida = inicio.partida;

    expect(situacaoFrota(partida, 'jogador').every((item) => item.restantes === 1)).toBe(true);
    expect(situacaoFrota(partida, 'computador').every((item) => item.restantes === 1)).toBe(true);

    const portaAvioes = partida.frotaJogador.find((embarcacao) => embarcacao.nome === 'porta-avioes')!;
    for (let indice = 0; indice < portaAvioes.tamanho; indice++) {
      const respostaJogador = atacar(partida, 'jogador', { linha: 9, coluna: indice });
      expect(respostaJogador.aceito).toBe(true);
      partida = respostaJogador.partida;
      const ataqueComputador = atacar(partida, 'computador', { linha: portaAvioes.origem.linha, coluna: portaAvioes.origem.coluna + indice });
      expect(ataqueComputador.aceito).toBe(true);
      partida = ataqueComputador.partida;
    }

    const jogador = situacaoFrota(partida, 'jogador');
    expect(jogador.find((item) => item.nome === 'porta-avioes')).toMatchObject({ total: 1, restantes: 0 });
    expect(jogador.filter((item) => item.nome !== 'porta-avioes').every((item) => item.restantes === 1)).toBe(true);
    expect(embarcacoesDestruidas(partida, 'jogador')).toEqual(['porta-avioes']);

    const computador = situacaoFrota(partida, 'computador');
    expect(computador.every((item) => item.total === 1 && item.restantes === 1)).toBe(true);
    expect(embarcacoesDestruidas(partida, 'computador')).toHaveLength(0);
  });
});
