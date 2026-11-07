import { FROTA_PADRAO } from './frota';
import { iniciarBatalha } from './partida';
import { posicionar } from './preparacao';

function frotaCompletaDeTeste() {
  let frota = [] as ReturnType<typeof posicionar>;
  for (let indice = 0; indice < FROTA_PADRAO.length; indice++) frota = posicionar(frota ?? [], FROTA_PADRAO[indice], { linha: indice * 2, coluna: 0 }, 'horizontal');
  return frota!;
}

describe('partida', () => {
  it('começa no turno do jogador e recusa frota incompleta', () => {
    const incompleta = iniciarBatalha([], frotaCompletaDeTeste());
    expect(incompleta.iniciada).toBe(false);
    if (!incompleta.iniciada) expect(incompleta.faltantes).toHaveLength(5);
    const iniciada = iniciarBatalha(frotaCompletaDeTeste(), frotaCompletaDeTeste());
    expect(iniciada.iniciada).toBe(true);
    if (iniciada.iniciada) expect(iniciada.partida.turno).toBe('jogador');
  });
});
