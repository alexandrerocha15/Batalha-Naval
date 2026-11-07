import { deRotulo, rotulo, validarCoordenada } from './coordenada';

describe('coordenadas', () => {
  it('converte rótulos nas bordas', () => {
    expect(deRotulo('A1')).toEqual({ linha: 0, coluna: 0 });
    expect(deRotulo('J10')).toEqual({ linha: 9, coluna: 9 });
    expect(rotulo({ linha: 0, coluna: 0 })).toBe('A1');
    expect(rotulo({ linha: 9, coluna: 9 })).toBe('J10');
  });
  it('recusa coordenadas fora do tabuleiro', () => {
    expect(deRotulo('K1')).toBeUndefined();
    expect(deRotulo('A0')).toBeUndefined();
    expect(deRotulo('A11')).toBeUndefined();
    expect(validarCoordenada({ linha: 10, coluna: 0 })).toBe(false);
  });
});
