import { chave, Coordenada } from './coordenada';
import { celulas, Embarcacao, FROTA_PADRAO, NomeEmbarcacao, Orientacao } from './frota';

export type Frota = readonly Embarcacao[];
export type MotivoPosicionamento = 'fora-do-tabuleiro' | 'sobreposicao';
export type AvaliacaoPosicionamento =
  | { readonly valido: true; readonly celulas: Coordenada[]; readonly conflitos: readonly Coordenada[] }
  | { readonly valido: false; readonly celulas: Coordenada[]; readonly motivo: MotivoPosicionamento; readonly conflitos: Coordenada[] };

export function avaliarPosicionamento(frota: Frota, modelo: Pick<Embarcacao, 'nome' | 'rotulo' | 'tamanho'>, origem: Coordenada, orientacao: Orientacao): AvaliacaoPosicionamento {
  const proposta = { ...modelo, origem, orientacao };
  const ocupadas = new Map(frota.filter((item) => item.nome !== modelo.nome).flatMap((item) => celulas(item).map((posicao) => [chave(posicao), posicao] as const)));
  const novasCelulas = celulas(proposta);
  const conflitos = novasCelulas.filter((posicao) => ocupadas.has(chave(posicao)));
  if (!novasCelulas.every((posicao) => posicao.linha >= 0 && posicao.linha < 10 && posicao.coluna >= 0 && posicao.coluna < 10)) {
    return { valido: false, celulas: novasCelulas, motivo: 'fora-do-tabuleiro', conflitos };
  }
  if (conflitos.length) return { valido: false, celulas: novasCelulas, motivo: 'sobreposicao', conflitos };
  return { valido: true, celulas: novasCelulas, conflitos: [] };
}

export function posicionar(frota: Frota, modelo: Pick<Embarcacao, 'nome' | 'rotulo' | 'tamanho'>, origem: Coordenada, orientacao: Orientacao): Frota | undefined {
  const avaliacao = avaliarPosicionamento(frota, modelo, origem, orientacao);
  if (!avaliacao.valido) return undefined;
  return [...frota.filter((item) => item.nome !== modelo.nome), { ...modelo, origem, orientacao }];
}

export function remover(frota: Frota, nome: NomeEmbarcacao): Frota { return frota.filter((item) => item.nome !== nome); }
export function frotaCompleta(frota: Frota): boolean { return FROTA_PADRAO.every((modelo) => frota.some((item) => item.nome === modelo.nome)); }
export function faltantes(frota: Frota): readonly Readonly<Pick<Embarcacao, 'nome' | 'rotulo' | 'tamanho'>>[] { return FROTA_PADRAO.filter((modelo) => !frota.some((item) => item.nome === modelo.nome)); }
