import { Coordenada, validarCoordenada } from './coordenada';

export type NomeEmbarcacao = 'porta-avioes' | 'encouracado' | 'cruzador' | 'submarino' | 'destroyer';
export type Orientacao = 'horizontal' | 'vertical';

export interface Embarcacao {
  readonly nome: NomeEmbarcacao;
  readonly rotulo: string;
  readonly tamanho: number;
  readonly origem: Coordenada;
  readonly orientacao: Orientacao;
}

export const FROTA_PADRAO: readonly Readonly<Pick<Embarcacao, 'nome' | 'rotulo' | 'tamanho'>>[] = [
  { nome: 'porta-avioes', rotulo: 'Porta-aviões', tamanho: 5 },
  { nome: 'encouracado', rotulo: 'Encouraçado', tamanho: 4 },
  { nome: 'cruzador', rotulo: 'Cruzador', tamanho: 3 },
  { nome: 'submarino', rotulo: 'Submarino', tamanho: 3 },
  { nome: 'destroyer', rotulo: 'Destroyer', tamanho: 2 },
];

export function celulas(embarcacao: Pick<Embarcacao, 'origem' | 'tamanho' | 'orientacao'>): Coordenada[] {
  return Array.from({ length: embarcacao.tamanho }, (_, indice) => ({
    linha: embarcacao.origem.linha + (embarcacao.orientacao === 'vertical' ? indice : 0),
    coluna: embarcacao.origem.coluna + (embarcacao.orientacao === 'horizontal' ? indice : 0),
  }));
}

export function embarcacaoValida(embarcacao: Pick<Embarcacao, 'origem' | 'tamanho' | 'orientacao'>): boolean {
  return (embarcacao.orientacao === 'horizontal' || embarcacao.orientacao === 'vertical')
    && celulas(embarcacao).every(validarCoordenada);
}
