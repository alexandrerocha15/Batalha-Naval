import { Coordenada } from './coordenada';
import { Embarcacao, FROTA_PADRAO, Orientacao } from './frota';
import { Frota, posicionar } from './preparacao';

export type Aleatorio = () => number;

export function gerarFrota(aleatorio: Aleatorio): Frota {
  for (let reinicio = 0; reinicio < 100; reinicio++) {
    let frota: Frota = [];
    let falhou = false;
    for (const modelo of FROTA_PADRAO) {
      let colocado: Frota | undefined;
      for (let tentativa = 0; tentativa < 200 && !colocado; tentativa++) {
        const origem: Coordenada = { linha: Math.floor(aleatorio() * 10), coluna: Math.floor(aleatorio() * 10) };
        const orientacao: Orientacao = aleatorio() < 0.5 ? 'horizontal' : 'vertical';
        colocado = posicionar(frota, modelo, origem, orientacao);
      }
      if (!colocado) { falhou = true; break; }
      frota = colocado;
    }
    if (!falhou) return frota;
  }
  throw new Error('Não foi possível gerar uma frota válida');
}
