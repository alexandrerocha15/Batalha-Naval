import { Injectable, signal } from '@angular/core';
import { Coordenada } from '../dominio/coordenada';
import { Embarcacao, FROTA_PADRAO, NomeEmbarcacao, Orientacao } from '../dominio/frota';
import { avaliarPosicionamento, Frota, posicionar, remover } from '../dominio/preparacao';
import { gerarFrota } from '../dominio/gerador';
import { iniciarBatalha, Partida } from '../dominio/partida';
import { atacar, escolherCoordenada, ResultadoAtacar } from '../dominio/combate';

export type FasePartida = 'apresentacao' | 'preparacao' | 'batalha' | 'encerrada';

@Injectable({ providedIn: 'root' })
export class PartidaStore {
  private readonly _fase = signal<FasePartida>('apresentacao');
  private readonly _frotaPreparacao = signal<Frota>([]);
  private readonly _embarcacaoAtiva = signal<NomeEmbarcacao | undefined>(undefined);
  private readonly _orientacao = signal<Orientacao>('horizontal');
  private readonly _partida = signal<Partida | undefined>(undefined);

  readonly fase = this._fase.asReadonly();
  readonly frotaPreparacao = this._frotaPreparacao.asReadonly();
  readonly embarcacaoAtiva = this._embarcacaoAtiva.asReadonly();
  readonly orientacao = this._orientacao.asReadonly();
  readonly partida = this._partida.asReadonly();
  readonly modelos = FROTA_PADRAO;

  faltantes() { return FROTA_PADRAO.filter((modelo) => !this._frotaPreparacao().some((item) => item.nome === modelo.nome)); }
  completa(): boolean { return this.faltantes().length === 0; }

  selecionarEmbarcacao(nome: NomeEmbarcacao): void {
    if (this._fase() !== 'preparacao') return;
    this._embarcacaoAtiva.set(nome);
  }

  alternarOrientacao(): void {
    if (this._fase() !== 'preparacao') return;
    this._orientacao.update((atual) => atual === 'horizontal' ? 'vertical' : 'horizontal');
  }

  avaliar(origem: Coordenada) {
    if (this._fase() !== 'preparacao') return undefined;
    const modelo = FROTA_PADRAO.find((item) => item.nome === this._embarcacaoAtiva());
    if (!modelo) return undefined;
    return avaliarPosicionamento(this._frotaPreparacao(), modelo, origem, this._orientacao());
  }

  posicionarAtiva(origem: Coordenada): boolean {
    if (this._fase() !== 'preparacao') return false;
    const modelo = FROTA_PADRAO.find((item) => item.nome === this._embarcacaoAtiva());
    if (!modelo) return false;
    const atualizada = posicionar(this._frotaPreparacao(), modelo, origem, this._orientacao());
    if (!atualizada) return false;
    this._frotaPreparacao.set(atualizada);
    return true;
  }

  removerEmbarcacao(nome: NomeEmbarcacao): void {
    if (this._fase() !== 'preparacao') return;
    this._frotaPreparacao.set(remover(this._frotaPreparacao(), nome));
  }

  iniciarBatalha(aleatorio: () => number = Math.random): boolean {
    if (this._fase() !== 'preparacao' || !this.completa()) return false;
    const resultado = iniciarBatalha(this._frotaPreparacao(), gerarFrota(aleatorio));
    if (!resultado.iniciada) return false;
    this._partida.set(resultado.partida);
    this._fase.set('batalha');
    return true;
  }

  atacarJogador(coordenada: Coordenada, aleatorio: () => number = Math.random): ResultadoAtacar | undefined {
    const partida = this._partida();
    if (this._fase() !== 'batalha' || !partida) return undefined;
    const resultado = atacar(partida, 'jogador', coordenada);
    if (!resultado.aceito) return resultado;
    if (resultado.partida.situacao !== 'em-andamento') {
      this._partida.set(resultado.partida);
      return resultado;
    }
    const coordenadaComputador = escolherCoordenada(resultado.partida, 'jogador', aleatorio);
    const resposta = atacar(resultado.partida, 'computador', coordenadaComputador);
    this._partida.set(resposta.aceito ? resposta.partida : resultado.partida);
    return resultado;
  }

  iniciarPartida(): void {
    this._frotaPreparacao.set([]);
    this._embarcacaoAtiva.set(undefined);
    this._orientacao.set('horizontal');
    this._partida.set(undefined);
    this._fase.set('preparacao');
  }
}
