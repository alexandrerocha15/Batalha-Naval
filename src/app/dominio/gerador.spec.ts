import { chave } from './coordenada';
import { gerarFrota } from './gerador';
import { celulas } from './frota';

const aleatorioSemeado = (semente: number) => () => {
  semente = (semente * 1664525 + 1013904223) >>> 0;
  return semente / 0x100000000;
};

describe('gerador de frota', () => {
  it('gera frota completa, válida e reproduzível', () => {
    const primeira = gerarFrota(aleatorioSemeado(1));
    const segunda = gerarFrota(aleatorioSemeado(1));
    expect(primeira).toEqual(segunda);
    expect(primeira).toHaveLength(5);
    expect(new Set(primeira.flatMap((embarcacao) => celulas(embarcacao).map(chave))).size).toBe(17);
  });
  it('falha com uma fonte degenerada', () => {
    expect(() => gerarFrota(() => 0)).toThrow();
  });
});
