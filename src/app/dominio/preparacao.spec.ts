import { FROTA_PADRAO } from './frota';
import { faltantes, frotaCompleta, posicionar, remover } from './preparacao';

describe('preparação da frota', () => {
  it('recusa borda e sobreposição sem alterar a frota', () => {
    const porta = FROTA_PADRAO[0];
    const inicial = posicionar([], porta, { linha: 0, coluna: 0 }, 'horizontal')!;
    expect(posicionar(inicial, FROTA_PADRAO[1], { linha: 0, coluna: 7 }, 'horizontal')).toBeUndefined();
    expect(posicionar(inicial, FROTA_PADRAO[1], { linha: 0, coluna: 0 }, 'horizontal')).toBeUndefined();
    expect(inicial).toHaveLength(1);
  });
  it('aceita encosto, reposiciona e informa faltantes', () => {
    let frota = posicionar([], FROTA_PADRAO[0], { linha: 0, coluna: 0 }, 'horizontal')!;
    frota = posicionar(frota, FROTA_PADRAO[0], { linha: 1, coluna: 0 }, 'horizontal')!;
    frota = posicionar(frota, FROTA_PADRAO[1], { linha: 2, coluna: 0 }, 'horizontal')!;
    expect(frota).toHaveLength(2);
    expect(frotaCompleta(frota)).toBe(false);
    expect(faltantes(frota).map(({ nome }) => nome)).toEqual(['cruzador', 'submarino', 'destroyer']);
    expect(remover(frota, 'encouracado')).toHaveLength(1);
  });
});
