import { Component, computed, input, output } from '@angular/core';
import { chave, Coordenada } from '../dominio/coordenada';
import { celulas, FROTA_PADRAO } from '../dominio/frota';
import { Ataque, Lado, Partida } from '../dominio/partida';

@Component({
  selector: 'app-tabuleiro-partida',
  templateUrl: './tabuleiro-partida.html',
})
export class TabuleiroPartida {
  readonly partida = input.required<Partida>();
  readonly lado = input.required<Lado>();
  readonly somenteLeitura = input(false);
  readonly coordenadaAcionada = output<Coordenada>();

  protected readonly coordenadas = Array.from({ length: 100 }, (_, indice) => ({ linha: Math.floor(indice / 10), coluna: indice % 10 }));
  protected readonly linhas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  readonly titulo = computed(() => this.lado() === 'computador' ? 'Frota adversária' : 'Sua frota');
  readonly idTitulo = computed(() => `tabuleiro-${this.lado()}`);
  readonly rotuloGrupo = computed(() => this.lado() === 'computador'
    ? 'Tabuleiro adversário, linhas A a J e colunas 1 a 10'
    : 'Seu tabuleiro, linhas A a J e colunas 1 a 10');

  classe(c: Coordenada): string {
    const ataque = this.ataque(c);
    if (ataque?.resultado === 'agua') return 'bg-sky-900/70 text-sky-100';
    if (ataque) return 'bg-rose-700 text-white';
    return this.protegido(c) ? 'bg-amber-500/70 text-white' : 'bg-oceano-800 text-espuma-100/70';
  }

  rotulo(c: Coordenada): string {
    const posicao = `${this.linhas[c.linha]}${c.coluna + 1}`;
    const ataque = this.ataque(c);
    const navio = this.protegido(c) ? ', embarcação própria' : '';
    const resultado = ataque ? `, ${this.resultadoTexto(ataque)}${ataque.embarcacao ? `: ${this.nomeEmbarcacao(ataque.embarcacao)}` : ''}` : ', sem ataque';
    return `${posicao}${navio}${resultado}`;
  }

  marcador(c: Coordenada): string {
    const ataque = this.ataque(c);
    if (ataque) return ataque.resultado === 'agua' ? '·' : '×';
    return this.protegido(c) ? '■' : '';
  }

  desabilitada(c: Coordenada): boolean {
    if (this.somenteLeitura() || this.ataque(c)) return true;
    if (this.lado() !== 'computador') return false;
    const partida = this.partida();
    return partida.turno !== 'jogador' || partida.situacao !== 'em-andamento';
  }

  acionar(c: Coordenada): void {
    if (!this.somenteLeitura()) this.coordenadaAcionada.emit(c);
  }

  private ataque(c: Coordenada): Ataque | undefined {
    return this.partida().ataques.find((item) => item.alvo === this.lado() && chave(item.coordenada) === chave(c));
  }

  private protegido(c: Coordenada): boolean {
    if (this.lado() !== 'jogador') return false;
    return this.partida().frotaJogador.some((embarcacao) => celulas(embarcacao).some((celula) => chave(celula) === chave(c)));
  }

  private resultadoTexto(ataque: Ataque): string {
    return ataque.resultado === 'agua' ? 'água' : ataque.resultado === 'acerto' ? 'acerto' : 'destruição';
  }

  private nomeEmbarcacao(nome: NonNullable<Ataque['embarcacao']>): string {
    return FROTA_PADRAO.find((embarcacao) => embarcacao.nome === nome)?.rotulo ?? nome;
  }
}
