import { Coordenada, validarCoordenada } from './coordenada';
import { Embarcacao } from './frota';
import { faltantes, frotaCompleta, Frota } from './preparacao';

export type Lado = 'jogador' | 'computador';
export type Situacao = 'em-andamento' | 'vitoria' | 'derrota';
export type ResultadoAtaque = 'agua' | 'acerto' | 'destruicao';

export interface Ataque {
  readonly alvo: Lado;
  readonly coordenada: Coordenada;
  readonly resultado: ResultadoAtaque;
  readonly embarcacao?: Embarcacao['nome'];
}

export interface Partida {
  readonly frotaJogador: Frota;
  readonly frotaComputador: Frota;
  readonly ataques: readonly Ataque[];
  readonly turno: Lado;
  readonly situacao: Situacao;
}

export type InicioBatalha =
  | { readonly iniciada: true; readonly partida: Partida }
  | { readonly iniciada: false; readonly faltantes: ReturnType<typeof faltantes> };

export function iniciarBatalha(frotaJogador: Frota, frotaComputador: Frota): InicioBatalha {
  const ausentes = faltantes(frotaJogador);
  if (!frotaCompleta(frotaJogador) || !frotaCompleta(frotaComputador)) return { iniciada: false, faltantes: ausentes };
  return { iniciada: true, partida: { frotaJogador, frotaComputador, ataques: [], turno: 'jogador', situacao: 'em-andamento' } };
}

export function coordenadaValidaParaAtaque(coordenada: Coordenada): boolean { return validarCoordenada(coordenada); }
