import { celulas, FROTA_PADRAO } from './frota';

describe('frota', () => {
  it('tem a composição padronizada e rótulos', () => {
    expect(FROTA_PADRAO.map(({ tamanho }) => tamanho)).toEqual([5, 4, 3, 3, 2]);
    expect(FROTA_PADRAO.map(({ rotulo }) => rotulo)).toContain('Porta-aviões');
  });
  it('gera células consecutivas nas duas orientações', () => {
    expect(celulas({ origem: { linha: 0, coluna: 1 }, tamanho: 3, orientacao: 'horizontal' })).toEqual([{ linha: 0, coluna: 1 }, { linha: 0, coluna: 2 }, { linha: 0, coluna: 3 }]);
    expect(celulas({ origem: { linha: 1, coluna: 0 }, tamanho: 3, orientacao: 'vertical' })).toEqual([{ linha: 1, coluna: 0 }, { linha: 2, coluna: 0 }, { linha: 3, coluna: 0 }]);
  });
});
