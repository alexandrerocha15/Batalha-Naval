import { FROTA_PADRAO } from './frota';
import { atacar, escolherCoordenada, embarcacoesDestruidas, marcacaoEm } from './combate';
import { iniciarBatalha } from './partida';
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
});
